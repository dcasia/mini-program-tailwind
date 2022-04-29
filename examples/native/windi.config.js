
module.exports = {
    prefixer: false, // 是否需要自动兼容平台浏览器（不需要）
    shortcuts: {
        'flex-center': 'flex items-center justify-center',
        'absolute-center': 'absolute transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
    },
    theme: {
        extend: {
            fontSize: {
                'xxxs': [ '0.5rem', '0.5rem' ],
                'xxs': [ '0.625rem', '1rem' ],
                'xs': [ '0.75rem', '1rem' ],
                'sm': [ '0.875rem', '1.25rem' ],
                'base': [ '1rem', '1.5rem' ],
                'lg': [ '1.125rem', '1.75rem' ],
                'xl': [ '1.25rem', '1.75rem' ],
                '2xl': [ '1.75rem', '2.25rem' ]
            },
            colors: {
                red: {
                    DEFAULT: '#ED1B26',
                    dark: '#94171D'
                },
                blue: '#276EF1',
                brown: '#99644C',
                green: {
                    DEFAULT: '#219653',
                    dark: '#21531C',
                },
                orange: '#FB6939',
                purple: '#7356BF',
                yellow: '#EEAB27',
                black: {
                    DEFAULT: '#161616',
                    light: '#363636',
                    pure: '#000000'
                },
                gray: {
                    DEFAULT: '#222222',
                    pressed: '#2b2b2b',
                    subtitle: '#757575',
                    description: '#AFAFAF',
                    skeleton: '#2c2c2c',
                    indicator: '#353535',
                    light: '#f2f2f2'
                },
                white: '#FFFFFF',
                background: '#282828',
                border: 'rgba(117, 117, 117, 0.1)'
            },
            spacing: {
                half: '50%',
                '7.5': '1.875rem',
                '22': '5.375rem',
            }
        }
    },
    corePlugins: {
        container: false
    }
}