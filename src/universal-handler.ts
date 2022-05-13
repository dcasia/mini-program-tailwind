import { FileType } from './enum'
import { Options } from './interfaces'
import { handleStyle } from './style-handler'
import { handleTemplate } from './template-handler'

export function handleSource(fileType: FileType, source: string, options?: Options) {

    if (fileType === FileType.Style) {
        return handleStyle(source, options)
    }

    if (fileType === FileType.Template) {
        return handleTemplate(source)
    }

}

export default {
    handleStyle,
    handleTemplate,
}
