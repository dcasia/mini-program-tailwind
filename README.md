![wechat-mp-plugin](https://user-images.githubusercontent.com/3030587/158826917-30c79222-b79d-4857-88f9-7e4184d1e771.jpg)

# WeChat Mini program Tailwind/Windi CSS Webpack plugin

> 来自 [Digital Creative](https://digitalcreative.cn/), 一家位于上海的数字产品调研、设计与开发公司。
> - [What we do](https://en.digitalcreative.cn/what-we-do/)
> - [About us](https://en.digitalcreative.cn/about)
> - [Contact us](https://en.digitalcreative.cn/contact)

## 介绍

由于小程序本身不支持由 Tailwind/Windi CSS 产生的选择器名称中包含的一些特殊字符（`\[` `\!` `\.` 等），这使得你无法在开发小程序时使用一些本该在开发 Web 应用时就可以使用的很实用且灵活的语法，如 `w-[30px]`, `translate-x-1/2`, `!bg-[#ff0000]`。

为了突破这一限制，我们开发了这一款插件来帮助你在开发小程序时依然保持着与使用 Tailwind/Windi 开发 Web 应用时高度一致的开发体验，你不再需要关注哪些字符串不被支持而不得不换一种写法，而是继续按照 Tailwind/Windi 的官方语法继续编写你的小程序样式，其他工作则由这款插件静默处理。

此外，该插件还集成了 rpx 值自动转换的功能。该功能可以将 Tailwind/Windi 配置文件中以及源码中我们书写的 rem 与 px 单位的值在生成结果中自动转换为 rpx 单位的值。这既可以让开发者重复使用在 Web 项目中同一份团队制定的主题配置文件又可以让小程序享受到 responsive pixel 特性带来的便利。

相关文章：[让你的小程序用上原汁原味的 Tailwind/Windi CSS](https://juejin.cn/post/7093809282272985119/)

- - -
## 快速开始

*以下示范操作步骤均以集成 Windi CSS 为例（Windi CSS 的体验更佳）*

<details>

<summary>⚙️ 针对以 Webpack 为构建工具的小程序</summary>

### 基于 MPX 框架（典型的 Webpack 类小程序示范）

[MPX](https://mpxjs.cn/), 一款具有优秀开发体验和深度性能优化的增强型跨端小程序框架。

#### 安装 windicss-webpack-plugin

```sh
npm i windicss-webpack-plugin -D
```

> 可参考 Windi CSS [官方文档](https://windicss.org/integrations/webpack.html)了解更多细节

#### 安装 @dcasia/mini-program-tailwind-webpack-plugin

```sh
npm i @dcasia/mini-program-tailwind-webpack-plugin -D
```

#### 新建 Windi CSS 配置文件

在项目根目录新建 Windi CSS 配置文件

```javascript
//windi.config.js
export default {
  //...
  prefixer: false,
  extract: {
    // 将 .mpx 文件纳入范围（其余 Webpack 类小程序根据项目本身的文件后缀酌情设置）
    include: ['src/**/*.{css,html,mpx}'],
    // 忽略部分文件夹
    exclude: ['node_modules', '.git', 'dist']
  },
  corePlugins: {
    // 禁用掉在小程序环境中不可能用到的 plugins
    container: false
  }
  //...
}
```

#### 更新 webpack 配置文件

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
  
*对于其余 Webpack 类小程序，可参考类似的方式在入口的样式文件中引入 `windi-utilities.wxss` 即可*

#### 完成
开始享受在小程序项目中由 Windi CSS 带来的高效开发体验 🎉

#### 案例
[MPX 集成案例](./examples/mpx)
  
</details>

<details>

<summary>👽 针对 Taro 小程序</summary>

### 基于 Taro 小程序

[Taro](https://taro.jd.com/), 多端统一开发解决方案

#### 安装 @dcasia/mini-program-tailwind-webpack-plugin

```other
npm i @dcasia/mini-program-tailwind-webpack-plugin -D
```

#### 使用 Taro 插件

```javascript
// config/index.js
const config = {
  plugins: [
    ['@dcasia/mini-program-tailwind-webpack-plugin/dist/taro', {
      // ...options
    }]
  ]
}
```

#### 新建 Windi CSS 配置文件

在项目根目录新建 Windi CSS 配置文件

```javascript
// windi.config.js
export default {
  prefixer: false,
  extract: {
    // 忽略部分文件夹
    exclude: ['node_modules', '.git', 'dist']
  },
  corePlugins: {
    // 禁用掉在小程序环境中不可能用到的 plugins
    container: false
  }
}
```

> Tailwind CSS 配置文件同样适用，详情可参考：[Windi CSS 配置说明](https://windicss.org/guide/configuration.html)

#### 在 app.js/app.ts 中引入 Windi CSS 的产物

```javascript
// app.js/app.ts
import 'windi.css';
```

#### 完成

开始享受在 Taro 中由 Windi CSS 带来的高效开发体验 🎉

#### Taro 插件可配置参数

| 名称                 | 类型      | 默认值   | 描述                                       |
| ------------------ | ------- | ----- | ---------------------------------------- |
| enableWindiCSS     | Boolean | true  | 是否开启插件自带的 Windi CSS                      |
| windiCSSConfigFile | String  | null  | 必要时手动设置 Windi CSS 的路径                    |
| enableRpx          | Boolean | false | 是否开启自动转换至 rpx 单位值的功能（由于 Taro 自带该功能，默认关闭） |
| designWidth        | Number  | 375   | 设计稿的像素宽度值，该尺寸会影响 rpx 转换过程中的计算比率          |
| enableDebugLog     | Boolean | false | 是否开启打印本插件的内部运行日志                         |

*所有参数均为非必填*

</details>

<details>

<summary>🛠 针对原生开发或自定义构建的小程序</summary>

### 基于原生开发或自定义构建工具的小程序
  
无论你的项目基于什么 bundler 或 task runner 工具进行开发，只要有一个可编程的文件监听与处理服务便可以进行自定义实现。但这里需要明确的一点是，若要想在以原生开发模式的基础之上去集成本插件的功能，我们需要去额外的启动一套可编程的文件监听处理服务，这个服务通常由配置好的 Webpack, Gulp 等第三方工具完成。但如果你是通过 Tailwind/Windi CSS 官方的 CLI 进行小程序 UI 开发，那遗憾的是由于该 CLI 不支持插件机制而且不可能支持对于模板文件的修改，所以无法进行实现自定义。

我们将核心功能解耦并打包进了 `dist/universal-handler.js` 文件中，若你想在自定义的构建工具中集成本插件的核心功能，可以在工作流逻辑中引入 `universal-handler`：

```javascript
const { handleSource } = require('@dcasia/mini-program-tailwind-webpack-plugin/universal-handler')
```

随后处理 template:
```javascript
const rawContent = '<view class="w-10 h-[0.5px] text-[#ffffff]"></view>'
const handledTemplate = handleSource('template', rawContent, options) // 'template' 为常量，设置文件类型为模板文件
```

处理 style:
```javascript
const rawContent = '.h-\\[0\\.5px\\] {height: 0.5px;}'
const handledStyle = handleSource('style', rawContent, options) // 'style' 为常量，设置文件类型为样式文件
```

此后你便可以将处理过的字符串返回至工作流原本的流程中来生成最终的文件。

> 对于自定义实现过程中涉及到其他方面的细节可参考[小程序集成 Windi CSS 的自定义实现](https://juejin.cn/post/7093809282272985119#heading-5)

#### 案例
[原生小程序集成案例（基于 Gulp）](./examples/native)

</details>

- - -
## 可配置参数

| Name        | Type    | Default | Description                                               |
| ----------- | ------- | ------- | --------------------------------------------------------- |
| enableRpx   | Boolean | true    | 是否开启自动转换至 rpx 单位值的功能                       |
| designWidth | Number  | 350     | 设计稿的像素宽度值，该尺寸会影响 rpx 转换过程中的计算比率 |

- - -

## 陷阱
- 在小程序中为了使组件样式可以被 Tailwind/Windi 的 CSS 产物作用到，我们需要在每一个组件的 JSON 配置文件中设置其[样式的作用域](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html#%E7%BB%84%E4%BB%B6%E6%A0%B7%E5%BC%8F%E9%9A%94%E7%A6%BB) `styleIsolation`，否则即使 Tailwind/Windi CSS 工作正常也无法用来开发组件 UI。([Issue#1](https://github.com/dcasia/wechat-mini-program-tailwind/issues/1))
    ```json
    {
      "component": true,
      "styleIsolation": "apply-shared"
    }
    ```
- 由于目前微信开发者工具的热重载功能无法监听到样式文件内由 `@import` 导入的 wxss 文件内容的变动，所以当启用热重载功能开发时，模拟器不会随着你对 Tailwind/Windi CSS 的更改而更新 UI。目前微信官方已知晓该 bug 的存在，在该 bug 修复之前，我们建议你在开发时关闭热重载，用传统的页面自动刷新来预览每一次的 UI 更新。([Issue#3](https://github.com/dcasia/wechat-mini-program-tailwind/issues/3))

- - -

## FAQ

1. Can't tailwind/windi be compatible with WeChat mini programs? What are the restrictions there?

   Naturally it can only be compatible in certain degree, for instance it can still analyze all class names you used in template and style files and pick up what has been used and pack them into a singe style file, which is nice as always. However, the restrictions are that you can't use much flexible and advanced feature, such as value auto-infer `mt-[5px]` , fractions value `translate-x-1/2`, `h-1.5` and color value `bg-[#ffffff]` etc, so your productivity would be drastically decreased.

2. Why are WeChat mini programs so special when it comes to tailwind/windi?

   Well in terms of the business, there is no doubt that WeChat mini programs creates incredible influence in the China market but technically speaking the way it provides for developers to build is conservative and restrictive and out of sync with international technical community. For instance the CSS selector in mini program couldn't support `*` `:hover` etc and also any escaped selector names `\[` `\]` `\!` `\.` etc which are the critical elements that tailwind/windi uses to generate class names.

3. How does this plugin make tailwind/windi compatible with mini program?

   Behind the scene it silently replace all unsupported selector names in mini program when you are developing or building your project by leveraging the ability of Webpack, Postcss, WXML parser and Babel etc.

- - -
## Comparison

| Features                                              | Naturally | With the plugin |
|-------------------------------------------------------|:---------:|:---------------:|
| Regular: h-10, text-white                             | ✅         | ✅               |
| Responsive: md:p-2                                    | ❌         | ✅               |
| Important: !p-1                                       | ❌         | ✅               |
| Variants: dark:bg-gray-800                            | ❌         | ✅               |
| Variants groups: hover:(bg-gray-400 font-medium)      | ❌         | ✅               |
| Fraction: translate-x-1/2, w-8.5                      | ❌         | ✅               |
| Value infer: t-[25px], bg-[#ffffff]                   | ❌         | ✅               |
| RGB value infer: text-[rgb(25,25,25)]                 | ❌         | ✅               |
| Responsive pixel auto conversion from rem and px unit | ❌         | ✅               |

- - -
## 兼容范围

- Webpack >= 5.0.0



