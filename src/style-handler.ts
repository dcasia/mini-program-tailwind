import postcss from 'postcss'
import { FileType } from './enum'
import { handleCharacters } from './utilities'

export function handleStyle(rawSource: string) {

    const root = postcss.parse(rawSource)

    root.walk(node => {

        if (node.type === 'rule') {
            node.selector = handleCharacters(node.selector, FileType.Style)
        }

    })

    return root.toString()

}
