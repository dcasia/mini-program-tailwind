import { Compiler, WebpackPluginInstance } from 'webpack'
import { Options } from './interfaces'
import { handleStyle } from './style-handler'
import { handleTemplate } from './template-handler'
import { isStyleFile, isTemplateFile } from './utilities'

export default class MiniProgramTailwindWebpackPlugin implements WebpackPluginInstance {

    static pluginName = 'mini-program-tailwind-webpack-plugin'
    private defaultOptions: Options = {
        enableRpx: true,
        designWidth: 375,
    }

    private options: Options

    constructor(options: Options) {
        this.options = { ...this.defaultOptions, ...options }
    }

    apply(compiler: Compiler) {

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
                                handledSource = handleStyle(rawSource, this.options)
                            } else if (isTemplateFile(pathname)) {
                                handledSource = handleTemplate(rawSource)
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

    }

}
