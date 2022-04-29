module.exports = {
    outDir: 'dist',
    style: {
        src: [
            'src/**/*.wxss'
        ]
    },
    template: {
        src: 'src/**/*.wxml',
    },
    other: {
        src: [
            'miniprogram_npm{,/**}',
            'src/**',
            '!src/**/*.wxml',
            '!src/**/*.wxss',
        ]
    }
}
