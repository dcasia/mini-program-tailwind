import { FileType } from '../enum'
import { handleCharacters } from '../utilities'

export function transformSelector() {

    return {
        postcssPlugin: 'transformSelectorName',
        Rule(node) {

            if (node.type === 'rule') {
                node.selector = handleCharacters(node.selector, FileType.Style)
            }

        },
    }

}

transformSelector.postcss = true as const
