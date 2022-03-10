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

export function transformValue() {

    return {
        postcssPlugin: 'transformValue',
        Declaration(node) {
            console.log(node.value)
        },
    }

}

transformSelector.postcss = true as const
transformValue.postcss = true as const
