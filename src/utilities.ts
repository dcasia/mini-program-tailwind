import { FileType } from './enum'

export function isStyleFile(filename) {
    return /.+\.(?:wx|ac|jx|tt|q|c)ss$/.test(filename)
}

export function isTemplateFile(filename) {
    return /.+\.(wx|ax|jx|ks|tt|q)ml$/.test(filename)
}

export const specialCharactersMap = {
    [ '[' ]: '_l_',
    [ ']' ]: '_r_',
    [ '(' ]: '_p_',
    [ ')' ]: '_q_',
    [ '#' ]: '_h_',
    [ '!' ]: '_i_',
    [ '/' ]: '_s_',
    [ '.' ]: '_d_',
    // eslint-disable-next-line no-useless-escape
    [ '\w:\\w' ]: '_c_',
}

export const backslasheMap = {
    [ FileType.Style ]: '\\\\\\',
    [ FileType.Template ]: '\\',
}

export function handleCharacters(content, type: FileType) {

    for (const from in specialCharactersMap) {

        const to = specialCharactersMap[ from ]
        const regExp = new RegExp(backslasheMap[ type ] + from, 'g')

        /**
         * Todo
         * To enhance the precision for hanlding different cases we need to do some special detections
         * E.g. We need to only match the ':' character in the case 'mobile:h-12' instead of the case '{{a ? b : c}}'
         * To do this we need to make sure the replacement will only happen inside quotes rather than curly braces
         */

        content = content.replace(regExp, to)

    }

    return content

}
