import { FileType } from '../enum'
import { handleCharacters } from '../utilities'

export function replaceStringLiteralPlugin({ types: t }) {

    return {
        visitor: {
            StringLiteral(path) {

                const newContent = handleCharacters(path.node.value, FileType.Template)

                path.replaceWith(t.stringLiteral(newContent))
                path.skip()

            },
        },
    }

}
