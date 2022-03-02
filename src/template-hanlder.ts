import * as wxml from '@vivaxy/wxml'
import { handleCharacters } from './utilities'
import { parseExpression } from '@babel/parser'
import traverse from '@babel/traverse'
import generate from '@babel/generator'
import { FileType } from './enum'

export function hanldeTemplate(rawSource: string) {

    const parsed = wxml.parse(rawSource)

    wxml.traverse(parsed, node => {

        if (node.type === wxml.NODE_TYPES.ELEMENT) {

            /**
             * Todo:
             * To make the replacement support the content not only in class names declarations
             * but also in some curly braces when writing javascript in template.
             * We will need to parse javascript expressions using babel and do some replacement as well
             */

            if (node.attributes.class) {
                node.attributes.class = handleCharacters(node.attributes.class, FileType.Template)
            }

        }

    })

    return wxml.serialize(parsed)

}
