import { TaroWebpackPluginOptions } from './../interfaces'
import { Compiler, WebpackPluginInstance } from 'webpack'
import { collectRawAndModified } from '../babel'
import { ConcatSource } from 'webpack-sources'
import { FrameworkUsedInTaro } from '../enum'

export default class TaroVNodeTailwindWebpackPlugin implements WebpackPluginInstance {

    static pluginName = 'taro-v-node-tailwind-webpack-plugin'

    private defaultOptions: TaroWebpackPluginOptions = {
        framework: FrameworkUsedInTaro.React,
    }

    private options: TaroWebpackPluginOptions

    constructor(options: TaroWebpackPluginOptions) {
        this.options = { ...this.defaultOptions, ...options }
    }

    apply(compiler: Compiler) {

        // Using Webpack v4 API here as Taro sticks with v4
        compiler.hooks.thisCompilation.tap(
            TaroVNodeTailwindWebpackPlugin.pluginName,
            function(compilation) {

                const rawVsModifiedPairs = []

                compilation.hooks.afterOptimizeModules.tap(
                    TaroVNodeTailwindWebpackPlugin.pluginName,
                    function(modules) {

                        for (const module of Array.from(modules)) {

                            // @ts-ignore
                            if (module?.resource?.includes('type=template')) {

                                // @ts-ignore
                                if (module?._source?._value) {

                                    // @ts-ignore
                                    rawVsModifiedPairs.push(...collectRawAndModified(module._source._value))

                                }

                            }

                        }

                    },
                )

                compilation.hooks.afterOptimizeAssets.tap(
                    TaroVNodeTailwindWebpackPlugin.pluginName,
                    assets => {

                        console.log(rawVsModifiedPairs)

                        for (const pathname in assets) {

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
                                    console.log('replace', pair)

                                }

                            }

                            for (const pairToBeRemoved of removedPair) {

                                const indexToBeRemoved = rawVsModifiedPairs.findIndex(pair => pair === pairToBeRemoved)

                                rawVsModifiedPairs.splice(indexToBeRemoved, 1)
                                console.log('removed', pairToBeRemoved)
                                console.log('remain', rawVsModifiedPairs)

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
