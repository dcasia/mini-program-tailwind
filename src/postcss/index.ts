import { FileType } from '../enum'
import { handleCharacters } from '../utilities'
import { Options } from '../interfaces'

export function transformSelector() {

    const processed = Symbol('processed')

    return {
        postcssPlugin: 'transformSelectorName',
        Rule(node) {

            if (!node[ processed ]) {

                node.selector = handleCharacters(node.selector, FileType.Style)
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
