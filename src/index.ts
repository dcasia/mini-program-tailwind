import { Compiler, WebpackPluginInstance } from 'webpack'
import { Options } from './interfaces'
import { handleSource } from './universal-handler'
import { isStyleFile, isTemplateFile } from './utilities'
import { FileType } from './enum'
import { ConcatSource } from 'webpack-sources'

export default class MiniProgramTailwindWebpackPlugin implements WebpackPluginInstance {

    static pluginName = 'mini-program-tailwind-webpack-plugin'
    private defaultOptions: Options = {
        enableRpx: true,
        designWidth: 375,
    }

    private options: Options

    constructor(options?: Options) {
        this.options = { ...this.defaultOptions, ...options }
    }

    apply(compiler: Compiler) {

        const isWebpackV5 = compiler.webpack && compiler.webpack.version >= '5'

        if (isWebpackV5) {

            const { webpack } = compiler
            const { sources, Compilation } = webpack
            const { ConcatSource } = sources

            compiler.hooks.thisCompilation.tap(
                MiniProgramTailwindWebpackPlugin.pluginName,
                compilation => {

                    compilation.hooks.processAssets.tap(
                        {
                            name: MiniProgramTailwindWebpackPlugin.pluginName,
                            stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
                        },
                        assets => {

                            for (const pathname in assets) {

                                const originalSource = assets[ pathname ]
                                const rawSource = originalSource.source().toString()

                                let handledSource = ''

                                if (isStyleFile(pathname)) {
                                    handledSource = handleSource(FileType.Style, rawSource, this.options)
                                } else if (isTemplateFile(pathname)) {
                                    handledSource = handleSource(FileType.Template, rawSource, this.options)
                                }

                                if (handledSource) {

                                    const source = new ConcatSource(handledSource)

                                    compilation.updateAsset(pathname, source)

                                }

                            }

                        },

                    )

                },
            )

        } else {

            compiler.hooks.thisCompilation.tap(
                MiniProgramTailwindWebpackPlugin.pluginName,
                compilation => {

                    compilation.hooks.afterOptimizeAssets.tap(
                        MiniProgramTailwindWebpackPlugin.pluginName,
                        assets => {

                            for (const pathname in assets) {

                                const originalSource = assets[ pathname ]
                                const rawSource = originalSource.source().toString()

                                let handledSource = ''

                                if (isStyleFile(pathname)) {
                                    handledSource = handleSource(FileType.Style, rawSource, this.options)
                                } else if (isTemplateFile(pathname)) {
                                    handledSource = handleSource(FileType.Template, rawSource, this.options)
                                }

                                if (handledSource) {

                                    const source = new ConcatSource(handledSource)

                                    // @ts-ignore
                                    compilation.updateAsset(pathname, source)

                                }

                            }

                        },

                    )

                },
            )

        }

    }

}
