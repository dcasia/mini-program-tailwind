import WindiCSSWebpackPlugin from 'windicss-webpack-plugin'
import MiniProgramTailwindWebpackPlugin from '../index'
import { IPluginContext } from '@tarojs/service'
import TaroTemplateTailwindWebpackPlugin from './specific-plugin'

export default (ctx: IPluginContext, options) => {

    ctx.modifyWebpackChain(({ chain }) => {

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
                            scan: {
                                dirs: [ './src' ],
                                fileExtensions: [ 'vue', 'jsx', 'tsx' ],
                            },
                            // onGenerated(ctx) {
                            //     console.log(ctx.classes, ctx.tags)
                            // },
                        },
                    ],
                },
                'dc-mini-program-tailwind-webpack-plugin': {
                    plugin: MiniProgramTailwindWebpackPlugin,
                },
                'dc-taro-template-tailwind-webpack-plugin': {
                    plugin: TaroTemplateTailwindWebpackPlugin,
                },
            },
        })

    })

}
