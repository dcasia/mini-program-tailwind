import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'

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
            'windicss-webpack-plugin',
        ],
        plugins: [
            typescript(
                { tsconfig: './tsconfig.json' },
            ),
        ],
    }, {
        input: 'src/rollup/index.ts',
        output: {
            file: 'dist/rollup.js',
            format: 'cjs',
            exports: 'default',
        },
        external: [
            'postcss',
            '@babel/core',
            '@vivaxy/wxml',
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
    // {
    //     input: './dist/dts/index.d.ts',
    //     output: {
    //         file: 'dist/index.d.ts',
    //         format: 'es',
    //     },
    //     plugins: [ dts() ],
    // },

])
