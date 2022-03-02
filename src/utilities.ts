export function isStyleFile(filename) {
    return filename => /.+\.(?:wx|ac|jx|tt|q|c)ss$/.test(filename)
}

export function isTemplateFile(filename) {
    return filename => /.+\.(wx|ax|jx|ks|tt|q)ml$/.test(filename)
}

export const specialCharactersMap = {
    [ '[' ]: '_l_',
    [ '\\' ]: '_b_',
    [ '(' ]: '_p_',
    [ ')' ]: '_q_',
    [ '#' ]: '_h_',
    [ '!' ]: '_i_',
    [ '/' ]: '_s_',
    [ '.' ]: '_d_',
    [ '\\w:\\w' ]: '_c_',
}

export function handleCharacters(content) {

    for (const from in specialCharactersMap) {

        const to = specialCharactersMap[ from ]
        const regExp = new RegExp(`\\${ from }`, 'g')

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
