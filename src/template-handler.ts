import * as wxml from '@vivaxy/wxml'
import micromatch from 'micromatch'
import { handleCharacters } from './utilities'
import { FileType } from './enum'
import { replaceStringLiteralPlugin } from './babel'
import * as babel from '@babel/core'
import type { Options } from './interfaces'

const matchScriptsInsideClassNames = /({{)(.+?)(}})/g
const replaceMarker = '__MP_TW_PLUGIN_REPLACE__'

export function handleTemplate(rawSource: string, options?: Options) {
    const parsed = wxml.parse(rawSource)

    wxml.traverse(parsed, node => {

        if (node.type === wxml.NODE_TYPES.ELEMENT) {

            if (node.attributes.class) {
                node.attributes.class = handleClassNameInTemplate(node.attributes.class)
            }

            if (options?.utilitiesSettings?.customAttributes) {

                for (const [match, attrs] of Object.entries(options.utilitiesSettings.customAttributes)) {

                    if (/^[\w-]+$/.test(match) ? match === node.tagName : micromatch.isMatch(node.tagName, match)) {
                        const _attrs = Array.isArray(attrs) ? attrs : [attrs]
    
                        for (const attrKey of _attrs) {

                            // skip class because it has already been converted
                            if (attrKey === 'class') continue

                            if (node.attributes[attrKey]) {
                                node.attributes[attrKey] = handleClassNameInTemplate(node.attributes[attrKey])
                            }

                        }
                    }

                }

            }
        }

    })

    return wxml.serialize(parsed)

}

export function handleClassNameInTemplate(raw) {

    const scriptsMatchResults = Array.from(raw.matchAll(matchScriptsInsideClassNames))

    if (scriptsMatchResults.length) {
        raw = raw.replace(matchScriptsInsideClassNames, `{{${ replaceMarker }}}`)
    }

    raw = handleCharacters(raw, FileType.Template)

    if (scriptsMatchResults.length) {

        for (const script of scriptsMatchResults) {

            const scriptContent = script[ 0 ].replace(matchScriptsInsideClassNames, '$2')

            const output = babel.transformSync(scriptContent, {
                generatorOpts: {
                    compact: true,
                    retainLines: true,
                },
                configFile: false,
                plugins: [ replaceStringLiteralPlugin ],
            })

            raw = raw.replace(replaceMarker, output.code.replace(/;$/, ''))

        }

    }

    return raw

}
