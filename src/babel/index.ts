import { FileType, TaroFramework } from '../enum'
import { handleCharacters } from '../utilities'
import { PluginItem } from '@babel/core'
import * as babel from '@babel/core'
import { handleClassNameWithCurlyBraces } from '../template-handler'

let classFieldsChanges: [string, string][] = []

const classFieldName = {
    [ TaroFramework.React ]: [ 'className' ],
    [ TaroFramework.Vue2 ]: [ 'class', 'staticClass' ],
    [ TaroFramework.Vue3 ]: [ 'class', 'staticClass' ],
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

                const targetClassFieldName = classFieldName[ state.opts.framework ] || []

                const keyNode = path.key === 'value' && path.parentPath.isObjectProperty() && path.parentPath.get('key') // universal class: 'test'
                    || (path.parentPath.isArrayExpression() && path.parentPath.parentPath.isObjectProperty() && path.parentPath.parentPath.get('key')) // vue class: ['test', 'test']
                    || (path.parentPath.isMemberExpression() && path.parentPath.parentPath.isCallExpression() && path.parentPath.parentPath.parentPath.isObjectProperty() && path.parentPath.parentPath.parentPath.get('key')) // react className: 'test'.concat('test-1', 'test-2')
                    || (path.parentPath.isCallExpression() && path.parentPath.parentPath.isObjectProperty() && path.parentPath.parentPath.get('key')) // react className: 'test'.concat('test-1', 'test-2')
                    || (path.parentPath.isConditionalExpression() && path.parentPath.parentPath.isCallExpression() && path.parentPath.parentPath.parentPath.isObjectProperty() && path.parentPath.parentPath.parentPath.get('key')) // react className: 'test'.concat(true ? 'test-1' : '')
                    || (path.key === 'key' && path.parentPath.findParent(path => path.isObjectProperty())?.get('key')) // vue class: ['test', {'test': true}] or class: {'test': true}
                    || (path.parentPath.isArrayExpression() && path.parentPath.findParent(path => path.isObjectProperty())?.get('key')) // vue class: Object(['test'])

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

export function collectRawAndModified(rawContent: string, framework: TaroFramework) {

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
