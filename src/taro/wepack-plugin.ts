import { TaroWebpackPluginOptions } from './../interfaces'
import { Compiler, WebpackPluginInstance } from 'webpack'
import { collectRawAndModified } from '../babel'
import { ConcatSource } from 'webpack-sources'
import { FrameworkUsedInTaro } from '../enum'

const frameworkModuleCharacteristic = {
    [ FrameworkUsedInTaro.React ]: [ '.jsx', '.tsx' ],
    [ FrameworkUsedInTaro.Vue2 ]: [ 'type=template' ],
    [ FrameworkUsedInTaro.Vue3 ]: [ 'type=template' ],
}

export default class TaroVNodeTailwindWebpackPlugin implements WebpackPluginInstance {

    static pluginName = 'taro-v-node-tailwind-webpack-plugin'

    private defaultOptions: TaroWebpackPluginOptions = {
        framework: FrameworkUsedInTaro.React,
        enableDebugLog: false,
    }

    private options: TaroWebpackPluginOptions
    private moduleCharcs: string[]

    constructor(options: TaroWebpackPluginOptions) {

        this.options = { ...this.defaultOptions, ...options }
        this.moduleCharcs = frameworkModuleCharacteristic[ this.options.framework ]

    }

    apply(compiler: Compiler) {

        // Using Webpack v4 API here as Taro sticks with v4
        compiler.hooks.thisCompilation.tap(
            TaroVNodeTailwindWebpackPlugin.pluginName,
            compilation => {

                const rawVsModifiedPairs = []

                compilation.hooks.afterOptimizeModules.tap(
                    TaroVNodeTailwindWebpackPlugin.pluginName,
                    modules => {

                        for (const module of Array.from(modules)) {

                            for (const charc of this.moduleCharcs) {

                                // @ts-ignore
                                if (module?.resource?.includes(charc) && module?._source?._value) {

                                    // @ts-ignore
                                    rawVsModifiedPairs.push(...collectRawAndModified(module._source._value, this.options.framework))

                                }

                            }

                        }

                    },
                )

                compilation.hooks.afterOptimizeAssets.tap(
                    TaroVNodeTailwindWebpackPlugin.pluginName,
                    assets => {

                        if (this.options.enableDebugLog) {
                            console.log('[mini-program-tailwind-plugin]: Collected', rawVsModifiedPairs)
                        }

                        for (const pathname in assets) {

                            /**
                             *  Todo: restrict filename with the end of '.js'
                             * */

                            const originalSource = assets[ pathname ]
                            const removedPair = []

                            let rawSource = originalSource.source().toString()
                            let hasTheAssetChanged = false

                            for (const pairIndex in rawVsModifiedPairs) {

                                const pair = rawVsModifiedPairs[ pairIndex ]
                                const rawContent = pair[ 0 ]
                                const newContent = pair[ 1 ]

                                /**
                                 *  Todo: implement more strict match here
                                 *  E.g. Combining with 'class:' prefix
                                 * */

                                if (rawSource.includes(rawContent)) {

                                    rawSource = rawSource.replace(rawContent, newContent)
                                    removedPair.push(pair)
                                    hasTheAssetChanged = true

                                    if (this.options.enableDebugLog) {
                                        console.log('[mini-program-tailwind-plugin]: Replaced', pair)
                                    }

                                }

                            }

                            for (const pairToBeRemoved of removedPair) {

                                const indexToBeRemoved = rawVsModifiedPairs.findIndex(pair => pair === pairToBeRemoved)

                                rawVsModifiedPairs.splice(indexToBeRemoved, 1)

                                if (this.options.enableDebugLog) {

                                    console.log('[mini-program-tailwind-plugin]: Removed', pairToBeRemoved)
                                    console.log('[mini-program-tailwind-plugin]: Remain', rawVsModifiedPairs)

                                }

                            }

                            if (hasTheAssetChanged) {

                                const source = new ConcatSource(rawSource)

                                // @ts-ignore
                                compilation.updateAsset(pathname, source)

                            }

                        }

                    },

                )

            })

    }

}
