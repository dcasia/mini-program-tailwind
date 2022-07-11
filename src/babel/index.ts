import { FileType, TaroFramework } from '../enum'
import { handleCharacters } from '../utilities'
import { PluginItem } from '@babel/core'
import * as babel from '@babel/core'
import { handleClassNameInTemplate } from '../template-handler'

let classFieldsChanges: [string, string][] = []

const classFieldName = {
    [ TaroFramework.React ]: [ 'className' ],
    [ TaroFramework.Vue2 ]: [ 'class', 'staticClass' ],
    [ TaroFramework.Vue3 ]: [ 'class' ],
    [ TaroFramework.Preact ]: [ 'className' ],
}

function isIdentifierTheClassField(path: babel.NodePath<babel.types.ObjectProperty>, framework: TaroFramework) {

    const targetClassFieldName = classFieldName[ framework ] || []
    const key = path.get('key')
    const keyName = key.isIdentifier() && key.node.name

    return targetClassFieldName.includes(keyName)

}

function recordClassNameChanges(rawContent: string, newContent: string) {
    classFieldsChanges.push([ rawContent, newContent ])
}

function cleanClassNameChanges() {
    classFieldsChanges = []
}

export function replaceStringLiteralPlugin({ types: t }): PluginItem {

    return {
        visitor: {
            StringLiteral(path) {

                const rawContent = path.node.value
                const newContent = handleCharacters(rawContent, FileType.Template)

                if (newContent !== rawContent) {

                    path.replaceWith(t.stringLiteral(newContent))
                    path.skip()

                }

            },
        },
    }

}

export function replaceClassFieldsValuePlugin({ types: t }): PluginItem {

    let isVisitingClassNameField = false

    return {
        visitor: {

            /**
             * Assuming there shouldn't have nested class fields in any cases
             */
            ObjectProperty: {
                enter(path, state) {

                    if (isIdentifierTheClassField(path, state.opts.framework)) {
                        isVisitingClassNameField = true
                    }

                },
                exit(path, state) {

                    if (isIdentifierTheClassField(path, state.opts.framework)) {
                        isVisitingClassNameField = false
                    }

                },
            },
            StringLiteral(path) {

                if (isVisitingClassNameField) {

                    const rawContent = path.node.value
                    const newContent = handleClassNameInTemplate(rawContent)

                    if (newContent !== rawContent) {

                        recordClassNameChanges(rawContent, newContent)
                        path.replaceWith(t.stringLiteral(newContent))
                        path.skip()

                    }

                }

            },
        },
    }

}

export function replaceStringifiedVNodeValuePlugin({ types: t }): PluginItem {

    let isVisitingClassNameField = false

    const replaceMarker = '__MP_TW_PLUGIN_STRINGIFIED_VNODE__'
    const matchRule = /(class=\\?")(.+?)(\\?")/g

    return {
        visitor: {

            /**
             * Assuming there shouldn't have nested class fields in any cases
             */
            ObjectProperty: {
                enter(path, state) {

                    if (isIdentifierTheClassField(path, state.opts.framework)) {
                        isVisitingClassNameField = true
                    }

                },
                exit(path, state) {

                    if (isIdentifierTheClassField(path, state.opts.framework)) {
                        isVisitingClassNameField = false
                    }

                },
            },
            StringLiteral(path) {

                if (!isVisitingClassNameField) {

                    let raw = path.node.value

                    const classAttrs = Array.from(raw.matchAll(matchRule))
                    const classNames = classAttrs.map(item => item[ 2 ]) // item[2] is the $2 group of the match rule

                    if (classNames.length) {

                        raw = raw.replace(matchRule, `class=\\"${ replaceMarker }\\"`)

                        for (const className of classNames) {

                            const newClassName = handleClassNameInTemplate(className)

                            if (newClassName !== className) {
                                recordClassNameChanges(className, newClassName)
                            }

                            raw = raw.replace(replaceMarker, newClassName)

                        }

                        path.replaceWith(t.stringLiteral(raw))
                        path.skip()

                    }

                }

            },
        },
    }

}

export function collectRawAndModified(rawContent: string, framework: TaroFramework) {

    cleanClassNameChanges()

    const plugins: PluginItem[] = [
        [
            replaceClassFieldsValuePlugin, {
                framework,
            },
        ],
    ]

    if (framework === TaroFramework.Vue3) {
        plugins.push(replaceStringifiedVNodeValuePlugin)
    }

    babel.transformSync(rawContent, {
        plugins,
        configFile: false,
    })

    return classFieldsChanges

}
