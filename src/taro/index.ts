import { TaroPluginOptions } from './../interfaces'
import WindiCSSWebpackPlugin from 'windicss-webpack-plugin'
import MiniProgramTailwindWebpackPlugin from '../index'
import { IPluginContext } from '@tarojs/service'
import TaroVNodeTailwindWebpackPlugin from './wepack-plugin'
import { FrameworkUsedInTaro } from '../enum'

export default (ctx: IPluginContext, options: TaroPluginOptions) => {

    /**
     * User configuration from Taro
     */
    const taroConfig = ctx.initialConfig
    const framework = taroConfig.framework
    const srcPath = taroConfig.sourceRoot
    const designWidth = taroConfig.designWidth

    // Default configuration
    const defaultOptions: TaroPluginOptions = {
        enableRpx: true,
        enableWindiCSS: true,
        enableDebugLog: false,
        designWidth: 350,
        framework: FrameworkUsedInTaro.React,
    }

    // Final configuration
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

            chain.merge({
                plugin: {
                    'windicss-webpack-plugin': {
                        plugin: WindiCSSWebpackPlugin,
                        args: [
                            {
                                config: finalOptions.windiCSSConfigFile,
                                preflight: false,
                                scan: {
                                    dirs: [ `./${ srcPath }` ],
                                    fileExtensions: [ 'vue', 'jsx', 'tsx', 'wxml', 'axml', 'jxml', 'ksml', 'ttml', 'qml' ],
                                },
                                onGenerated(ctx) {

                                    if (finalOptions.enableDebugLog) {
                                        console.log('Windi CSS:', 'Detected classes', ctx.classes)
                                    }

                                },
                            },
                        ],
                    },
                },
            })

        }

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

    })

}
