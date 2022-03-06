import { Compiler, WebpackPluginInstance } from 'webpack'
import { handleStyle } from './style-handler'
import { handleTemplate } from './template-handler'
import { isStyleFile, isTemplateFile } from './utilities'

interface Options {
    convertToRpx: boolean,
}

export default class MiniProgramTailwindWebpackPlugin implements WebpackPluginInstance {

    static pluginName = 'mini-program-tailwind-webpack-plugin'
    private defaultOptions: Options = {
        convertToRpx: true,
    }

    private options: Options

    constructor(options: Options) {
        this.options = Object.assign({}, options, this.defaultOptions)
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
                                handledSource = handleStyle(rawSource)
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
