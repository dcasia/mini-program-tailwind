import { FileType } from '../enum'
import { handleCharacters } from '../utilities'
import { PluginItem } from '@babel/core'
import * as babel from '@babel/core'

let classFieldsChanges: [string, string][] = []

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
            StringLiteral(path) {

                if (path.parentPath.isObjectProperty() && path.parentPath.get('key').isIdentifier({ name: 'class' })) {

                    const rawContent = path.node.value
                    const newContent = handleCharacters(rawContent, FileType.Template)

                    if (newContent !== rawContent) {

                        logClassFieldsChange(rawContent, newContent)
                        path.replaceWith(t.stringLiteral(newContent))
                        path.skip()

                    }

                }

            },
        },
    }

}

export function collectRawAndModified(rawContent) {

    cleanClassFieldsChanges()

    babel.transformSync(rawContent, {
        plugins: [ replaceClassFieldsValuePlugin ],
        configFile: false,
    })

    return classFieldsChanges

}
