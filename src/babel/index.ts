import { FileType, FrameworkUsedInTaro } from '../enum'
import { handleCharacters } from '../utilities'
import { PluginItem } from '@babel/core'
import * as babel from '@babel/core'
import { handleClassNameWithCurlyBraces } from '../template-handler'

let classFieldsChanges: [string, string][] = []

const classFieldName = {
    [ FrameworkUsedInTaro.React ]: [ 'className' ],
    [ FrameworkUsedInTaro.Vue2 ]: [ 'class', 'staticClass' ],
    [ FrameworkUsedInTaro.Vue3 ]: [ 'class', 'staticClass' ],
}

function logClassFieldsChange(rawContent: string, newContent: string) {
    classFieldsChanges.push([ rawContent, newContent ])
}

function cleanClassFieldsChanges() {
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

    return {
        visitor: {
            StringLiteral(path, state) {

                const targetClassFieldName = classFieldName[ state.opts.framework ]

                const keyNode = path.key === 'value' && path.parentPath.isObjectProperty() && path.parentPath.get('key') // class: 'test'
                    || (path.parentPath.isArrayExpression() && path.parentPath.parentPath.isObjectProperty() && path.parentPath.parentPath.get('key')) // class: ['test', 'test']
                    || (path.key === 'key' && path.parentPath.findParent(path => path.isObjectProperty())?.get('key'))// class: ['test', {'test': true}] or {'test': true}

                if (keyNode && !Array.isArray(keyNode)) {

                    const foundClassName = targetClassFieldName.find(name => keyNode.isIdentifier?.({ name }))

                    if (foundClassName) {

                        const rawContent = path.node.value
                        const newContent = handleClassNameWithCurlyBraces(rawContent)

                        if (newContent !== rawContent) {

                            logClassFieldsChange(rawContent, newContent)
                            path.replaceWith(t.stringLiteral(newContent))
                            path.skip()

                        }

                    }

                }

            },
        },
    }

}

export function collectRawAndModified(rawContent: string, framework: FrameworkUsedInTaro) {

    cleanClassFieldsChanges()

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
