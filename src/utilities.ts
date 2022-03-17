import { FileType } from './enum'

export function isStyleFile(filename) {
    return /.+\.(?:wx|ac|jx|tt|q|c)ss$/.test(filename)
}

export function isTemplateFile(filename) {
    return /.+\.(wx|ax|jx|ks|tt|q)ml$/.test(filename)
}

const charactersMap = {
    '[': '-',
    ']': '-',
    '(': '-',
    ')': '-',
    '#': '-h-',
    '!': '-i-',
    '/': '-s-',
    '.': '-d-',
    ':': '-c-',
    ',': '-2c-',
}

const specialCharactersMap = {
    '\\\\2c\\s': '-2c-',
}

const backslashMap = {
    [ FileType.Style ]: '\\\\\\',
    [ FileType.Template ]: '\\',
}

export function handleCharacters(content, type: FileType) {

    for (const from in charactersMap) {

        const to = charactersMap[ from ]
        const regExp = new RegExp(`${ backslashMap[ type ] }${ from }`, 'g')

        content = content.replace(regExp, to)

    }

    for (const from in specialCharactersMap) {

        const to = specialCharactersMap[ from ]
        const regExp = new RegExp(`${ from }`, 'g')

        content = content.replace(regExp, to)

    }

    return content

}
