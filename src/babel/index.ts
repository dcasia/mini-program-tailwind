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

                        console.log('enter')
                        isVisitingClassNameField = true

                    }

                },
                exit(path, state) {

                    if (isIdentifierTheClassField(path, state.opts.framework)) {

                        console.log('exit')
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

export function collectRawAndModified(rawContent: string, framework: TaroFramework) {

    cleanClassNameChanges()

    babel.transformSync(rawContent, {
        plugins: [
            [
                replaceClassFieldsValuePlugin, {
                    framework,
                },
            ],
        ],
        configFile: false,
    })

    return classFieldsChanges

}
