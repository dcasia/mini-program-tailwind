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
        external: [ './universal-handler' ],
        plugins: [
            commonjs(),
            typescript({
                exclude: [ 'examples/**' ],
            }),
        ],
    }, {
        input: 'src/universal-handler.ts',
        output: {
            file: 'dist/universal-handler.js',
            format: 'cjs',
        },
        plugins: [
            commonjs(),
            typescript({
                exclude: [ 'examples/**' ],
            }),
        ],
    },
])
