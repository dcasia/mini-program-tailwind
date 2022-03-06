# Mini program Tailwind/Windi CSS Webpack plugin



A webpack plugin that can make tailwind css and windi css framework compatiable with WeChat mini program.

目前仅支持微信小程序

# 快速开始

## 基于原生小程序

待更新...

## 基于 MPX 框架

[MPX](https://mpxjs.cn/), 一款具有优秀开发体验和深度性能优化的增强型跨端小程序框架。

### 安装 Windi CSS 与 windicss-webpack-plugin

依照 Windi CSS [官方文档](https://windicss.org/integrations/webpack.html) 中陈述步骤的进行

### 更新 Windi CSS 配置文件

```javascript
//windi.config.js
export default {
  //...
  extract: {
    // 将 .mpx 文件纳入范围
    include: ['src/**/*.{css,html,mpx}'],
    // 忽略部分文件夹
    exclude: ['node_modules', '.git', 'dist']
  }
  //...
}
```

### 安装 @dcasia/mini-program-tailwind-webpack-plugin

```sh
npm i @dcasia/mini-program-tailwind-webpack-plugin --save-dev
```

### 更新 MPX 项目中的 webpack 配置文件

```javascript
//webpack.base.conf.js
const WindiCSSWebpackPlugin = require("windicss-webpack-plugin");
const MiniProgramTailwindWebpackPlugin = require("@dcasia/mini-program-tailwind-webpack-plugin")

module.exports = {
  //...
  plugins: [
    new WindiCSSWebpackPlugin(),
    new MiniProgramTailwindWebpackPlugin()
  ]
}
```

### 在 app.mpx 中引入 Windi CSS 的产物

```html
<style src="windi-utilities.css"></style>
```

### 完成
开始享受在小程序项目中由 Windi CSS 带来的高效开发体验 🎉

[以上过程完整示范](./examples/mpx)



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



