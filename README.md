# Mini program Tailwind/Windi CSS Webpack plugin



A webpack plugin that can make tailwind css and windi css framework compatiable with WeChat mini program.

## FAQ

1. Can't tailwind/windi be compatible with mini program? What are the restrictions there?

   Naturally it can only be compatible in certain degree, for instance it can still analyze all class names you used in template and style files and pick up what has been used and pack them into a singe style file, which is nice as always. However, the restrictions are that you can't use much flexible and advanced feature, such as value auto-infer `mt-[5px]` , fractions value `translate-x-1/2`, `h-1.5` and color value `bg-[#ffffff]` etc, so your productivity would be drastically decreased.

2. Why mini program is so special when it comes to tailwind/windi?

   Well in terms of the business, there is no doubt mini program creates incredible influence in China market but technically speaking the way it provides for developers to build is conservative and restrictive and out of sync with international technical community. For instance the css selector in mini program couldn't support `*` `:hover` etc and also any escaped selecor names `\[` `\]` `\!` `\.` etc which are the critical elements that tailwind/windi uses to generate class names.

3. How does this plugin make tailwind/windi compatible with mini program?

   Behind the scene it silently replace all unsupported selector names in mini program when you are developing or building your project by lerverging the ability of Webpack, Postcss, WXML parser and Babel etc.



## Comparison

| Features                                              | Naturally | With the plugin |
| ----------------------------------------------------- | :-------: | :-------------: |
| Regular: h-10, text-white                             |     ✅     |        ✅        |
| Responsive: md:p-2                                    |     ❌     |        ✅        |
| Important: !p-1                                       |     ❌     |        ✅        |
| Variants: dark:bg-gray-800                            |     ❌     |        ✅        |
| Variants groups: hover:(bg-gray-400 font-medium)      |     ❌     |        ✅        |
| Fraction: translate-x-1/2, w-8.5                      |     ❌     |        ✅        |
| Value infer: t-[25px], bg[#ffffff]                    |     ❌     |        ✅        |
| Responsive pixel auto conversion from rem and px unit |     ❌     |   Coming up🚀    |



