import { WindiCssOptions } from '@windicss/config'
import { FrameworkUsedInTaro } from './enum'

export interface Options {
    enableRpx: boolean,
    designWidth: number,
}

export interface TaroWebpackPluginOptions {
    framework: FrameworkUsedInTaro,
}

export interface TaroPluginOptions extends Options, TaroWebpackPluginOptions {
    enableDebugLog: boolean,
    enableWindiCSS: boolean,
    windiCSSConfigFile?: WindiCssOptions | string,
}
