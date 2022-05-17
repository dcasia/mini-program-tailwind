import { defineConfig } from 'windicss/helpers'

export default defineConfig({
    prefixer: false,
    extract: {
        exclude: ['node_modules', '.git', 'dist']
    },
    theme: {
        extend: {
            fontSize: {
                'xxxs': [ '0.5rem', '0.5rem' ], // 8px
                'xxs': [ '0.625rem', '1rem' ], // 10px 
                'xs': [ '0.75rem', '1rem' ], // 12px
                'sm': [ '0.875rem', '1.25rem' ], // 14px
                'base': [ '1rem', '1.5rem' ], // 16px
                'lg': [ '1.125rem', '1.75rem' ], // 18px
                'xl': [ '50px', '1.75rem' ], // 20px
                '2xl': [ '1.75rem', '2.25rem' ] // 28px
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
                    indicator: '#353535'
                },
                white: '#FFFFFF',
                background: '#282828',
                border: 'rgba(117, 117, 117, 0.1)'
            },
            spacing: {
                half: '50%',
                '7.5': '1.875rem',
                '22': '5.375rem',
            },
            borderRadius: {
                'none': '0',
                'sm': '0.125rem',
                DEFAULT: '0.25rem',
                'md': '0.375rem',
                'lg': '0.5rem',
                'full': '9999px',
                'large': '12px',
            }
        }
    },
    corePlugins: {
        container: false
    }
})
