import * as wxml from '@vivaxy/wxml'
import { handleCharacters } from './utilities'
import { FileType } from './enum'
import { replaceStringLiteralPlugin } from './babel'
import * as babel from '@babel/core'

const matchScriptsInsideClassNames = /{{.+?}}/g
const replaceMarker = '__MP_TW_PLUGIN_REPLACE__'

export function handleTemplate(rawSource: string) {

    const parsed = wxml.parse(rawSource)

    wxml.traverse(parsed, node => {

        if (node.type === wxml.NODE_TYPES.ELEMENT) {

            if (node.attributes.class) {

                let buffer = node.attributes.class

                const scriptsMatchResults = Array.from(node.attributes.class.matchAll(matchScriptsInsideClassNames))

                if (scriptsMatchResults.length) {
                    buffer = buffer.replace(matchScriptsInsideClassNames, replaceMarker)
                }

                buffer = handleCharacters(buffer, FileType.Template)

                if (scriptsMatchResults.length) {

                    for (const script of scriptsMatchResults) {

                        const output = babel.transformSync(script[ 0 ], {
                            generatorOpts: {
                                minified: true,
                            },
                            configFile: false,
                            plugins: [ replaceStringLiteralPlugin ],
                        })

                        buffer = buffer.replace(replaceMarker, output.code)

                    }

                }

                node.attributes.class = buffer

            }

        }

    })

    return wxml.serialize(parsed)

}
