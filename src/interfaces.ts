import { WindiCssOptions } from '@windicss/config'
import { TaroFramework } from './enum'

export interface Options {
    enableRpx?: boolean,
    designWidth?: number,
    utilitiesSettings?: {
        spaceBetweenItems?: string[],
        divideItems?: string[],
        customComponents?: string[],
    },
}

export interface TaroWebpackPluginOptions {
    framework: TaroFramework,
    enableDebugLog: boolean,
}

export interface TaroPluginOptions extends Options, TaroWebpackPluginOptions {
    enableWindiCSS: boolean,
    windiCSSConfigFile?: WindiCssOptions | string,
}
