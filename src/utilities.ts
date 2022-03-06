import { FileType } from './enum'

export function isStyleFile(filename) {
    return /.+\.(?:wx|ac|jx|tt|q|c)ss$/.test(filename)
}

export function isTemplateFile(filename) {
    return /.+\.(wx|ax|jx|ks|tt|q)ml$/.test(filename)
}

export const specialCharactersMap = {
    [ '[' ]: '-',
    [ ']' ]: '-',
    [ '(' ]: '-',
    [ ')' ]: '-',
    [ '#' ]: '-h-',
    [ '!' ]: '-i-',
    [ '/' ]: '-s-',
    [ '.' ]: '-d-',
    [ ':' ]: '-c-',
}

export const backslasheMap = {
    [ FileType.Style ]: '\\\\\\',
    [ FileType.Template ]: '\\',
}

export function handleCharacters(content, type: FileType) {

    for (const from in specialCharactersMap) {

        const to = specialCharactersMap[ from ]
        const regExp = new RegExp(`${ backslasheMap[ type ] }${ from }`, 'g')

        content = content.replace(regExp, to)

    }

    return content

}
