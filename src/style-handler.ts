import postcss from 'postcss'
import { transformSelector, transformValue } from './postcss'

export function handleStyle(rawSource: string) {

    return postcss()
        .use(transformSelector)
        .use(transformValue)
        .process(rawSource)
        .css

}
