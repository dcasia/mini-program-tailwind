import { TaroWebpackPluginOptions } from '../interfaces'
import { Compiler, WebpackPluginInstance } from 'webpack'
import { collectRawAndModified } from '../babel'
import { ConcatSource } from 'webpack-sources'
import { TaroFramework } from '../enum'
import { escapeRegExp, regExpJS } from '../utilities'

const frameworkModuleCharacteristics = {
    [ TaroFramework.React ]: [ '.jsx', '.tsx' ],
    [ TaroFramework.Vue2 ]: [ 'type=template' ],
    [ TaroFramework.Vue3 ]: [ 'type=template', 'setup=true' ],
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

        const isWebpackV5 = compiler.webpack && compiler.webpack.version >= '5'

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

                            // Test if current module path has potential characteristic
                            // so that it can recognize which module needs to be further processed
                            for (const charc of this.moduleCharcs) {

                                // @ts-ignore
                                const moduleRawContent = isWebpackV5 ? module?._source?._valueAsString : module?._source?._value

                                // @ts-ignore
                                if (module?.resource?.includes(charc) && moduleRawContent) {

                                    const pairs = collectRawAndModified(moduleRawContent, this.options.framework)

                                    // Search and gather class names to be replaced in target module
                                    rawVsModifiedPairs.push(...pairs)

                                }

                            }

                        }

                        if (this.options.enableDebugLog) {
                            console.log('[mini-program-tailwind-plugin]: Class names collection benchmark', `${ Date.now() - startTime }ms`)
                        }

                    },
                )

                if (isWebpackV5) {

                    const { webpack } = compiler
                    const { sources, Compilation } = webpack
                    const { ConcatSource } = sources

                    compilation.hooks.processAssets.tap(
                        {
                            name: TaroVNodeTailwindWebpackPlugin.pluginName,
                            stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
                        },
                        assets => {
                            this.handleAssets({ ConcatSource, assets, rawVsModifiedPairs, compilation })
                        },

                    )

                } else {

                    compilation.hooks.afterOptimizeAssets.tap(
                        TaroVNodeTailwindWebpackPlugin.pluginName,
                        assets => {
                            this.handleAssets({ ConcatSource, assets, rawVsModifiedPairs, compilation })
                        },

                    )

                }

            })

    }

    handleAssets({ ConcatSource, assets, rawVsModifiedPairs, compilation }) {

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
                const rawToken = pair[ 0 ]
                const newToken = pair[ 1 ]
                const escapeRawToken = escapeRegExp(rawToken)
                const regExp = new RegExp(`(['"])${ escapeRawToken }(['"])`)

                rawSource = rawSource.replace(regExp, (_quotedToken, quote1, quote2) => {

                    removedPair.push(pair)
                    hasTheAssetChanged = true

                    if (this.options.enableDebugLog) {
                        console.log('[mini-program-tailwind-plugin]: Replaced', pair)
                    }

                    return quote1 + newToken + quote2

                })

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

    }

}
