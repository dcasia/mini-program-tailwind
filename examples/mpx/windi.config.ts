// defineConfig 是带有类型提示的帮助函数，如果不需要可以忽略
import { defineConfig } from 'windicss/helpers'
import plugin from 'windicss/plugin'

export default defineConfig({
    prefixer: false, // 是否需要自动兼容平台浏览器（不需要）
    extract: {
        // 扫描文件范围
        include: ['src/**/*.{css,html,mpx}'],
        // 忽略扫描文件夹
        exclude: ['node_modules', '.git', 'dist']
    }
})
