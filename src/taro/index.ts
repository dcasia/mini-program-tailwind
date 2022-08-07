import { TaroPluginOptions } from './../interfaces'
import WindiCSSWebpackPlugin, { WindiCSSWebpackPluginOptions } from 'windicss-webpack-plugin'
import MiniProgramTailwindWebpackPlugin from '../index'
import { IPluginContext } from '@tarojs/service'
import TaroVNodeTailwindWebpackPlugin from './webpack-plugin'
import { TaroFramework, TaroPlatform } from '../enum'

export default (ctx: IPluginContext, options: TaroPluginOptions) => {

    /**
     * Command option from Taro
     */
    const platform = ctx.runOpts.options.platform as TaroPlatform

    /**
     * User configuration from Taro
     */
    // eslint-disable-next-line @typescript-eslint/padding-line-between-statements
    const taroConfig = ctx.initialConfig
    const framework = taroConfig.framework
    const srcPath = taroConfig.sourceRoot
    const designWidth = taroConfig.designWidth

    /**
     * Default configuration
     */
    const defaultOptions: TaroPluginOptions = {
        enableRpx: false,
        enableWindiCSS: true,
        enableDebugLog: false,
        designWidth: 375,
        framework: TaroFramework.React,
    }

    /**
     * Final configuration
     */
    const finalOptions = {
        ...defaultOptions,
        ...{
            designWidth,
            framework,
        },
        ...options,
    }

    ctx.modifyWebpackChain(({ chain }) => {

        if (finalOptions.enableWindiCSS) {

            /**
             * Windi CSS Webpack Plugin available options
             * https://github.com/windicss/vite-plugin-windicss/blob/main/packages/plugin-utils/src/options.ts
             */

            const options: Partial<WindiCSSWebpackPluginOptions> = {
                config: finalOptions.windiCSSConfigFile,
                scan: {
                    dirs: [ `./${ srcPath }` ],
                    fileExtensions: [ 'vue', 'jsx', 'tsx', 'wxml', 'axml', 'jxml', 'ksml', 'ttml', 'qml' ],
                },
                onGenerated(ctx) {

                    if (finalOptions.enableDebugLog) {
                        console.log('\n[Windi CSS]:', 'Detected classes', ctx.classes)
                    }

                },
            }

            /**
             * Disable preflight when the target compilation platform isn't h5
             */
            if (platform !== TaroPlatform.H5) {
                options.preflight = false
            }

            chain.merge({
                plugin: {
                    'windicss-webpack-plugin': {
                        plugin: WindiCSSWebpackPlugin,
                        args: [ options ],
                    },
                },
            })

        }

        /**
         * Do not install plugins when the target compilation platform is h5
         */
        if (platform !== TaroPlatform.H5) {

            chain.merge({
                plugin: {
                    'dc-mini-program-tailwind-webpack-plugin': {
                        plugin: MiniProgramTailwindWebpackPlugin,
                        args: [ finalOptions ],
                    },
                    'dc-taro-v-node-tailwind-webpack-plugin': {
                        plugin: TaroVNodeTailwindWebpackPlugin,
                        args: [ finalOptions ],
                    },
                },
            })

        }

    })

}
