import { Options } from './interfaces'
import postcss from 'postcss'
import { transformSelector, transformValue } from './postcss'

export function handleStyle(rawSource: string, option?: Options) {

    const processor = postcss()
        .use(transformSelector)

    if (option?.enableRpx) {
        processor.use(transformValue(option))
    }

    return processor.process(rawSource)
        .css

}
