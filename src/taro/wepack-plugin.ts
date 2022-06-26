import { TaroWebpackPluginOptions } from './../interfaces'
import { Compiler, WebpackPluginInstance } from 'webpack'
import { collectRawAndModified } from '../babel'
import { ConcatSource } from 'webpack-sources'
import { TaroFramework } from '../enum'
import { regExpJS } from '../utilities'

const frameworkModuleCharacteristics = {
    [ TaroFramework.React ]: [ '.jsx', '.tsx' ],
    [ TaroFramework.Vue2 ]: [ 'type=template' ],
    [ TaroFramework.Vue3 ]: [ 'type=template' ],
    [ TaroFramework.Preact ]: [ '.jsx', '.tsx' ],
}

export default class TaroVNodeTailwindWebpackPlugin implements WebpackPluginInstance {

    static pluginName = 'taro-v-node-tailwind-webpack-plugin'

    private defaultOptions: TaroWebpackPluginOptions = {
        framework: TaroFramework.React,
        enableDebugLog: false,
    }

    private options: TaroWebpackPluginOptions
    private moduleCharcs: string[]

    constructor(options: TaroWebpackPluginOptions) {

        this.options = { ...this.defaultOptions, ...options }
        this.moduleCharcs = frameworkModuleCharacteristics[ this.options.framework ] || []

    }

    apply(compiler: Compiler) {

        if (!(this.moduleCharcs.length > 0)) {
            return console.warn('[mini-program-tailwind-plugin]: Unsupported framework type, submit issues here: https://github.com/dcasia/mini-program-tailwind/issues')
        }

        // Using Webpack v4 API here as Taro sticks with v4
        compiler.hooks.thisCompilation.tap(
            TaroVNodeTailwindWebpackPlugin.pluginName,
            compilation => {

                const rawVsModifiedPairs = []

                compilation.hooks.afterOptimizeModules.tap(
                    TaroVNodeTailwindWebpackPlugin.pluginName,
                    modules => {

                        let startTime = 0

                        if (this.options.enableDebugLog) {
                            startTime = Date.now()
                        }

                        for (const module of Array.from(modules)) {

                            for (const charc of this.moduleCharcs) {

                                // @ts-ignore
                                if (module?.resource?.includes(charc) && module?._source?._value) {

                                    // @ts-ignore
                                    rawVsModifiedPairs.push(...collectRawAndModified(module._source._value, this.options.framework))

                                }

                            }

                        }

                        if (this.options.enableDebugLog) {
                            console.log('[mini-program-tailwind-plugin]: Class names collection benchmark', `${ Date.now() - startTime }ms`)
                        }

                    },
                )

                compilation.hooks.afterOptimizeAssets.tap(
                    TaroVNodeTailwindWebpackPlugin.pluginName,
                    assets => {

                        let startTime = 0

                        if (this.options.enableDebugLog) {

                            startTime = Date.now()
                            console.log('[mini-program-tailwind-plugin]: Collected', rawVsModifiedPairs)

                        }

                        for (const pathname in assets) {

                            if (!regExpJS.test(pathname)) { continue }

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
                                 *  E.g. Combining with 'class:' prefix or finding the target by temporarily placing a mark
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

                        if (this.options.enableDebugLog) {
                            console.log('[mini-program-tailwind-plugin]: Class names replacement benchmark', `${ Date.now() - startTime }ms`)
                        }

                    },

                )

            })

    }

}
