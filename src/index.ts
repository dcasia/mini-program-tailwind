import { Compiler } from 'webpack'

const pluginName = 'tailwind-for-mini-program'

export class TailwindForMiniProgram {

    apply(compiler: Compiler) {

        const { ConcatSource } = compiler.webpack.sources

        compiler.hooks.emit.tapPromise(pluginName, async compilation => {

            const entries = Object.entries(compilation.assets)

            for (let index = 0; index < entries.length; index++) {

                const [ file, originalSource ] = entries[ index ]

                // if (cssMatcher(file)) {

                //     const rawSource = originalSource.source().toString()

                //     const css = styleHandler(rawSource, {
                //         isMainChunk: mainCssChunkMatcher(file, 'mpx'),
                //     })

                //     const source = new ConcatSource(css)

                //     compilation.updateAsset(file, source)

                // } else if (htmlMatcher(file)) {

                //     const rawSource = originalSource.source().toString()
                //     const wxml = templeteHandler(rawSource)
                //     const source = new ConcatSource(wxml)

                //     compilation.updateAsset(file, source)

                // }

            }

        })

    }

}
