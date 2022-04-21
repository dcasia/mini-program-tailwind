// defineConfig 是带有类型提示的帮助函数，如果不需要可以忽略
import { defineConfig } from 'windicss/helpers'
import plugin from 'windicss/plugin'

export default defineConfig({
    prefixer: false,
    extract: {
        include: ['src/**/*.{css,html,mpx}'],
        exclude: ['node_modules', '.git', 'dist']
    },
    corePlugins: {
        container: false
    }
})
