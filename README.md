# WeChat Mini program Tailwind/Windi CSS Webpack plugin

Build WeChat mini programs using Tailwind & Windi CSS frameworks with this webpack plugin.

需要配合 Webpack 5 一起使用

## 介绍

由于小程序本身不支持由 Tailwind/Windi CSS 产生的选择器名称中包含的一些特殊字符（`\[` `\!` `\.` 等），这使得你无法在开发小程序时使用一些本该在开发 Web 应用时就可以使用的很实用且灵活的语法，如 `w-[30px]`, `translate-x-1/2`, `!bg-[#ff0000]`。

为了突破这一限制，我们开发了这一款插件来帮助你在开发小程序时依然保持着与使用 Tailwind/Windi 开发 Web 应用时高度一致的开发体验，你不再需要关注哪些字符串不被支持而不得不换一种写法，而是继续按照 Tailwind/Windi 的官方语法继续编写你的小程序样式，其他工作则由这款插件静默处理。

此外，该插件还集成了 rpx 值自动转换的功能。该功能可以将 Tailwind/Windi 配置文件中以及源码中我们书写的 rem 与 px 单位的值在生成结果中自动转换为 rpx 单位的值。这既可以让开发者重复使用在 Web 项目中同一份团队制定的主题配置文件又可以让小程序享受到 responsive pixel 特性带来的便利。


## 快速开始

### 基于原生小程序

待更新...

### 基于 MPX 框架

[MPX](https://mpxjs.cn/), 一款具有优秀开发体验和深度性能优化的增强型跨端小程序框架。

#### 安装 Windi CSS 与 windicss-webpack-plugin

依照 Windi CSS [官方文档](https://windicss.org/integrations/webpack.html) 中陈述的步骤进行

#### 更新 Windi CSS 配置文件

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

#### 安装 @dcasia/mini-program-tailwind-webpack-plugin

```sh
npm i @dcasia/mini-program-tailwind-webpack-plugin --save-dev
```

#### 更新 MPX 项目中的 webpack 配置文件

```javascript
//webpack.base.conf.js
const WindiCSSWebpackPlugin = require("windicss-webpack-plugin");
const MiniProgramTailwindWebpackPlugin = require("@dcasia/mini-program-tailwind-webpack-plugin")

module.exports = {
  //...
  plugins: [
    new WindiCSSWebpackPlugin(),
    new MiniProgramTailwindWebpackPlugin({
      enableRpx: true,
      designWidth: 350
    })
  ]
}
```

#### 在 app.mpx 中引入 Windi CSS 的产物

```html
<style src="windi-utilities.css"></style>
```

#### 完成
开始享受在小程序项目中由 Windi CSS 带来的高效开发体验 🎉

[示例项目](./examples/mpx)


## 可配置参数

| Name        | Type    | Default | Description                                               |
| ----------- | ------- | ------- | --------------------------------------------------------- |
| enableRpx   | Boolean | true    | 是否开启自动转换至 rpx 单位值的功能                       |
| designWidth | Number  | 350     | 设计稿的像素宽度值，该尺寸会影响 rpx 转换过程中的计算比率 |


## FAQ

1. Can't tailwind/windi be compatible with WeChat mini programs? What are the restrictions there?

   Naturally it can only be compatible in certain degree, for instance it can still analyze all class names you used in template and style files and pick up what has been used and pack them into a singe style file, which is nice as always. However, the restrictions are that you can't use much flexible and advanced feature, such as value auto-infer `mt-[5px]` , fractions value `translate-x-1/2`, `h-1.5` and color value `bg-[#ffffff]` etc, so your productivity would be drastically decreased.

2. Why are WeChat mini programs so special when it comes to tailwind/windi?

   Well in terms of the business, there is no doubt that WeChat mini programs creates incredible influence in the China market but technically speaking the way it provides for developers to build is conservative and restrictive and out of sync with international technical community. For instance the CSS selector in mini program couldn't support `*` `:hover` etc and also any escaped selecor names `\[` `\]` `\!` `\.` etc which are the critical elements that tailwind/windi uses to generate class names.

3. How does this plugin make tailwind/windi compatible with mini program?

   Behind the scene it silently replace all unsupported selector names in mini program when you are developing or building your project by leveraging the ability of Webpack, Postcss, WXML parser and Babel etc.



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
| Responsive pixel auto conversion from rem and px unit |     ❌     |        ✅        |



