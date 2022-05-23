import { FileType } from '../enum'
import { handleSource } from '../universal-handler'
import { isStyleFile, isTemplateFile } from '../utilities'
import { Options } from '../interfaces'
import { Plugin } from 'vite'

const RollupPluginName = 'rollup-plugin-mini-program-tailwind'

export default function(options?: Options): Plugin {

    const defaultOptions: Options = {
        enableRpx: true,
        designWidth: 375,
    }

    const finalOptions = {
        ...defaultOptions,
        ...options,
    }

    return {
        name: RollupPluginName,
        generateBundle(_outputOptions, bundle) {

            for (const filename in bundle) {

                const asset = bundle[ filename ]

                if (asset.type === 'asset') {

                    const source = asset.source

                    if (source && typeof source === 'string') {

                        let handledSource = ''

                        if (isStyleFile(filename)) {
                            handledSource = handleSource(FileType.Style, source, finalOptions)
                        } else if (isTemplateFile(filename)) {
                            handledSource = handleSource(FileType.Template, source, finalOptions)
                        }

                        if (handledSource) {
                            asset.source = handledSource
                        }

                    }

                }

            }

        },
        enforce: 'post',
    }

}
