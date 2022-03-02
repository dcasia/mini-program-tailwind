import postcss from 'postcss'
import { handleCharacters } from './utilities'

export function handleStyle(rawSource: string) {

    const root = postcss.parse(rawSource)

    root.walk(node => {

        if (node.type === 'rule') {
            node.selector = handleCharacters(node.selector)
        }

    })

    return root.toString()

}
