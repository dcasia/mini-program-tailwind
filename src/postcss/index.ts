import { FileType } from '../enum'
import { customReplace, handleCharacters } from '../utilities'
import { Options } from '../interfaces'

export function transformSelector(options: Options) {

    const processed = Symbol('processed')
    const defaultSpaceBetweenItems = [ 'view', 'button', 'text', 'image' ]
    const usersSpaceBetweenItems = options?.utilitiesSettings?.spaceBetweenItems || []
    const spaceBetweenItems = [ ...defaultSpaceBetweenItems, ...usersSpaceBetweenItems ]
    const customReplacement = new Map()

    /**
     * A polyfill that is compatible 'space-[x,y]-\d' syntax
     * Note that in mini program environment ':not()' selector can only be used when it's combined with other selectors
     * e.g. view:not() works but the standalone :not() selector couldn't work
     */
    customReplacement.set(/^(\.-?space-\w)(-.+?)\s.*/, spaceBetweenItems.map(item => `$1$2:not($1-reverse) > ${ item }:not([hidden]):not(:first-child), $1$2$1-reverse > ${ item }:not([hidden]):not(:last-child)`).join(', '))
    customReplacement.set(/^(\.-?space-\w-reverse).*/, spaceBetweenItems.map(item => `$1 > ${ item }:not([hidden])`).join(', '))

    return {
        postcssPlugin: 'transformSelectorName',
        Rule(node) {

            if (!node[ processed ]) {

                node.selector = handleCharacters(node.selector, FileType.Style)
                node.selector = customReplace(node.selector, customReplacement)
                node[ processed ] = true

            }

        },
    }

}

enum SourceUnit {
    REM = 'rem',
    PX = 'px',
}

enum TargerUnit {
    RPX = 'rpx',
}

export function transformValue(options: Options) {

    const processed = Symbol('processed')

    return {
        postcssPlugin: 'transformValue',
        Declaration(node) {

            if (!node[ processed ]) {

                // Don't transform anything inside url() values
                if (node.value.includes('url')) { return }

                const remValues = findValues(node.value, SourceUnit.REM)
                const pxValues = findValues(node.value, SourceUnit.PX)

                if (remValues?.length) {
                    node.value = transformAllValue(node.value, remValues, SourceUnit.REM, options)
                }

                if (pxValues?.length) {
                    node.value = transformAllValue(node.value, pxValues, SourceUnit.PX, options)
                }

                node[ processed ] = true

            }

        },
    }

}

const valueConvertor = {
    rem: remToRpx,
    px: pxToRpx,
}

function transformAllValue(raw: string, targets: number[], unit: SourceUnit, options: Options) {

    for (const value of targets) {
        raw = raw.replace(value + unit, valueConvertor[ unit ](value, options.designWidth) + TargerUnit.RPX)
    }

    return raw

}

function findValues(raw, unit: SourceUnit): null | number[] {

    const regExp = new RegExp(`[\\d./]+(?=${ unit })`, 'g')

    return raw.match(regExp)?.map(value => Number(value))

}

function remToRpx(rem: number, base = 375) {
    return pxToRpx(rem * 16, base)
}

function pxToRpx(px: number, base = 375) {

    const rpx = (px / (base / 375)) * 2

    return Number(rpx.toFixed(3))

}

transformSelector.postcss = true as const
transformValue.postcss = true as const
