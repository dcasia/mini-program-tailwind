import postcss from 'postcss'
import { transformSelector } from './postcss'

export function handleStyle(rawSource: string) {

    return postcss()
        .use(transformSelector)
        .process(rawSource)
        .css

}
