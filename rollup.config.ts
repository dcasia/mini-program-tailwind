import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'

export default defineConfig([
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.js',
            format: 'cjs',
            exports: 'default',
        },
        external: [
            './universal-handler',
            '@babel/core',
            '@vivaxy/wxml',
            'webpack-sources',
        ],
        plugins: [
            typescript(
                { tsconfig: './tsconfig.json' },
            ),
        ],
    }, {
        input: 'src/taro/index.ts',
        output: {
            file: 'dist/taro.js',
            format: 'cjs',
            exports: 'default',
        },
        external: [
            'postcss',
            '@tarojs/service',
            '@babel/core',
            '@vivaxy/wxml',
            'webpack-sources',
            'windicss-webpack-plugin',
        ],
        plugins: [
            typescript(
                { tsconfig: './tsconfig.json' },
            ),
        ],
    },
    {
        input: 'src/universal-handler.ts',
        output: {
            file: 'dist/universal-handler.js',
            format: 'cjs',
        },
        external: [
            '@babel/core',
            '@vivaxy/wxml',
            'postcss',
        ],
        plugins: [
            typescript(
                { tsconfig: './tsconfig.json' },
            ),
        ],
    },
    {
        // path to your declaration files root
        input: './dist/dts/index.d.ts',
        output: {
            file: 'dist/index.d.ts',
            format: 'es',
        },
        plugins: [ dts() ],
    },

])
