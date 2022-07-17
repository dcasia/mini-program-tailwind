import { FileType } from './enum'

export const regExpJS = /.+\.js$/

export const regExpVue = /.+\.vue$/

export const regExpReact = /.+\.(?:j|t)sx$/

export const regExpStyle = /.+\.(?:wx|ac|jx|tt|q|c)ss$/

export const regExpTemplate = /.+\.(wx|ax|jx|ks|tt|q)ml$/

export function isStyleFile(filename) {
    return regExpStyle.test(filename)
}

export function isTemplateFile(filename) {
    return regExpTemplate.test(filename)
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
    '%': '-p-',
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

export function customReplace(raw: string, rules: Map<RegExp, string>) {

    rules.forEach((target, exp) => {
        raw = raw.replace(exp, target)
    })

    return raw

}
