import { Compiler, WebpackPluginInstance } from 'webpack'

interface Options {
    convertToRpx: boolean,
}

export class MiniProgramTailwindWebpackPlugin implements WebpackPluginInstance {

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

                        /*
                         * Using one of the later asset processing stages to ensure
                         * that all assets were already added to the compilation by other plugins.
                         */
                        stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
                    },
                    assets => {

                        const entries = Object.entries(assets)

                        console.log(entries)

                        // For (let index = 0; index < entries.length; index++) {

                        //     Const [ file, originalSource ] = entries[ index ]

                        //     If (cssMatcher(file)) {

                        //         Const rawSource = originalSource.source().toString()

                        /*
                         *         Const css = styleHandler(rawSource, {
                         *             isMainChunk: mainCssChunkMatcher(file, 'mpx'),
                         *         })
                         */

                        //         Const source = new ConcatSource(css)

                        //         Compilation.updateAsset(file, source)

                        //     } else if (htmlMatcher(file)) {

                        /*
                         *         Const rawSource = originalSource.source().toString()
                         *         const wxml = templeteHandler(rawSource)
                         *         const source = new ConcatSource(wxml)
                         */

                        //         Compilation.updateAsset(file, source)

                        //     }

                        // }

                    },

                )

            },
        )

    }

}
