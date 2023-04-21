import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'

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
            'micromatch',
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
            'micromatch',
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
            'micromatch',
        ],
        plugins: [
            typescript(
                { tsconfig: './tsconfig.json' },
            ),
            commonjs(),
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
