![wechat-mp-plugin](https://user-images.githubusercontent.com/3030587/158826917-30c79222-b79d-4857-88f9-7e4184d1e771.jpg)

# Mini Program Tailwind Webpack Plugin

让你的小程序用上原汁原味的 Tailwind/Windi CSS

> 来自 [Digital Creative](https://digitalcreative.cn/), 一家位于上海的数字产品调研、设计与开发公司。
> <details>
>   <summary>了解我们</summary>
>  
> - [What we do](https://en.digitalcreative.cn/what-we-do/)
> - [About us](https://en.digitalcreative.cn/about)
> - [Contact us](https://en.digitalcreative.cn/contact)
> </details>

*推荐阅读 [独立文档](https://www.craft.do/s/Wx2f9cjGwyZYOx) 以获得更好的阅读体验 ♥️*

---

## 介绍

由于小程序本身不支持由 Tailwind/Windi CSS 产生的选择器名称中包含的一些特殊转义字符（如 `\[` `\!` `\.` 等），这使得你在开发小程序时无法使用一些本该在开发 Web 应用时使用的得心应手的灵活语法与 JIT/Value auto-infer 功能，如 `w-[30px]` `translate-x-1/2` `!bg-[#ff0000]` 等。这无疑对我们的开发效率与心智负担带来了不小的影响。

为了突破这一限制，我们开发了这一款插件来帮助你在使用 Tailwind/Windi CSS 开发小程序时仍然保持着与开发 Web 应用高度一致的开发体验，你不再需要关注因为哪些字符串不被支持而不得不换一种写法的问题，而是继续**按照 Tailwind/Windi CSS 的官方语法继续编写你的小程序样式**，背后的兼容工作则由这款插件静默处理。

此外，本插件还集成了 `rpx` 值自动转换的功能。该功能可以将 Tailwind/Windi CSS 配置文件中以及源码中我们书写的 `rem` 与 `px` 单位的值在最终生成的样式文件中自动转换为 `rpx` 单位的值。这既可以让开发者复用在 Web 项目中使用的同一份主题配置又可以让小程序继续使用 responsive pixel 带来的特性。

> <details>
>     <summary>进一步了解本插件的工作原理</summary>
>     
> [让你的小程序用上原汁原味的 Tailwind/Windi CSS](https://juejin.cn/post/7093809282272985119/)
> </details>

- - -
## 快速开始

选择其中一个适合你的小程序类型进行插件安装

<details>

<summary>⚙️ 常规 Webpack 类小程序（以 MPX 为例）</summary>

### 常规 Webpack 类小程序（以 MPX 为例）

> [MPX](https://mpxjs.cn/), 一款具有优秀开发体验和深度性能优化的增强型跨端小程序框架。

由于 MPX 框架为典型的以 Webpack 为构建工具的增强型小程序开发框架，所以本次安装示范将 MPX 项目作为典型案例来演示如何为大部分 Webpack 类小程序项目进行插件安装。**以下安装步骤在 Webpack 项目中具有广泛的通用性**，对于大部分 Webpack 类小程序项目只需参考相同步骤进行安装即可。

#### 安装 windicss-webpack-plugin

```sh
npm i windicss-webpack-plugin -D
```

> <details>
> <summary>参考 Windi CSS 官方文档了解更多细节</summary>
>    
> [Windi CSS Webpack 集成](https://windicss.org/integrations/webpack.html)
> </details>

#### 安装 @dcasia/mini-program-tailwind-webpack-plugin

```sh
npm i @dcasia/mini-program-tailwind-webpack-plugin -D
```

#### 更新 webpack 配置文件

使用 Webpack 插件

```javascript
//webpack.base.conf.js
const WindiCSSWebpackPlugin = require("windicss-webpack-plugin");
const MiniProgramTailwindWebpackPlugin = require("@dcasia/mini-program-tailwind-webpack-plugin")

module.exports = {
  plugins: [
    new WindiCSSWebpackPlugin(),
    new MiniProgramTailwindWebpackPlugin({
      // options
    })
  ]
}
```

#### 新建 Windi CSS 配置文件

在项目根目录新建 `windi.config.js` 配置文件

```javascript
//windi.config.js
export default {
  preflight: false,
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
}
```

> 此处 Tailwind CSS 配置文件同样适用
> <details>
> <summary>参考 Windi CSS 官方文档了解更多细节</summary>
>    
> [Windi CSS 配置文件兼容规则](https://windicss.org/guide/configuration.html)
> </details>

#### 在入口文件中引入 Windi CSS 的产物

```html
// app.mpx
<style src="windi.css"></style>
```
  
> 对于其余非 MPX 项目的 Webpack 类小程序，可参考类似的方式在入口文件中引入 `windi.css` 即可，如：
> ```javascript
> // main.js
> import 'windi.css'
> ``` 
> <details>
> <summary>参考 Windi CSS 官方文档了解更多细节</summary>
>    
> [引入 Windi CSS 样式文件](https://windicss.org/integrations/webpack.html#include-the-virtual-module)
> </details>

#### 完成
开始享受在小程序项目中由 Windi CSS 带来的高效开发体验 🎉

#### 可配置参数

| **名称**      | **类型**  | **默认** | **描述**                          |
| ----------- | ------- | ------ | ------------------------------- |
| enableRpx   | Boolean | `true`   | 是否开启自动转换至 rpx 单位值的功能            |
| designWidth | Number  | `350`    | 设计稿的像素宽度值，该尺寸会影响 rpx 转换过程中的计算比率 |
| utilitiesSettings.spaceBetweenItems | `Array<string>`  | `[]`   | 使用了 Space Between utilities 的容器中的子组件的名称。默认已包含 view, button, text, image 四个常用组件，所以大部分情况下开发者不需要配置该项。如需新增则可以在数组中添加新的组件名称。 |

#### 案例
> [集成案例：MPX 项目](./examples/mpx)
  
</details>

<details>

<summary>👽 Taro 小程序</summary>

### Taro 小程序

> [Taro](https://taro.jd.com/), 多端统一开发解决方案

本插件包含 Taro 插件，通过“一键安装”的方式来便捷的适配 Taro 小程序。

> Taro 插件已兼容以下前端框架
> - React
> - Vue 2
> - Vue 3
> - Preact
>
> 同时也兼容在混合原生组件开发中使用 Tailwind/Windi CSS

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

在项目根目录新建 `windi.config.js` 配置文件

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

> 此处 Tailwind CSS 配置文件同样适用
> <details>
> <summary>参考 Windi CSS 官方文档了解更多细节</summary>
>    
> [Windi CSS 配置文件兼容规则](https://windicss.org/guide/configuration.html)
> </details>

#### 在入口文件中引入 Windi CSS 的产物

```javascript
// app.js
import 'windi.css';
```

#### 完成

开始享受在 Taro 中由 Windi CSS 带来的高效开发体验 🎉

#### 可配置参数

| **名称**             | **类型**  | **默认**      | **描述**                                   |
| ------------------ | ------- | ------------ | ---------------------------------------- |
| enableWindiCSS     | Boolean | `true`         | 是否开启插件自带的 Windi CSS                      |
| windiCSSConfigFile | String  | 读取项目根目录的配置文件 | 必要时手动设置 Windi CSS 配置文件的路径                |
| enableRpx          | Boolean | `false`        | 是否开启自动转换至 rpx 单位值的功能（由于 Taro 自带该功能，默认关闭） |
| designWidth        | Number  | `375`         | 设计稿的像素宽度值，该尺寸会影响 rpx 转换过程中的计算比率          |
| utilitiesSettings.spaceBetweenItems | `Array<string>`  | `[]`   | 使用了 Space Between utilities 的容器中的子组件的名称。默认已包含 view, button, text, image 四个常用组件，所以大部分情况下开发者不需要配置该项。如需新增则可以在数组中添加新的组件名称。 |
| enableDebugLog     | Boolean | `false`        | 是否开启打印本插件的内部运行日志                         |

#### 案例

> - [集成案例：Taro - React 项目](https://github.com/dcasia/mini-program-tailwind/tree/development/examples/taro/react)
> - [集成案例：Taro - Vue 2 项目](https://github.com/dcasia/mini-program-tailwind/tree/development/examples/taro/vue-2)
> - [集成案例：Taro - Vue 3 项目](https://github.com/dcasia/mini-program-tailwind/tree/development/examples/taro/vue-3)

</details>

<details>

<summary>🔗 uni-app 小程序</summary>

### uni-app 小程序

> [uni-app](https://uniapp.dcloud.net.cn/), 开发一次，多端覆盖。

本篇内容包含 uni-app 的 Vue 3 与 Vue 2 两种安装示范。

### Vue 3 安装示范

> 请参考下一个小程序类型：常规 Vite 类小程序（以 uni-app 为例）

### Vue 2 安装示范

#### 安装 windicss-webpack-plugin

```sh
npm i windicss-webpack-plugin -D
```

> <details>
> <summary>参考 Windi CSS 官方文档了解更多细节</summary>
>    
> [Windi CSS Webpack 集成](https://windicss.org/integrations/webpack.html)
> </details>

#### 安装 @dcasia/mini-program-tailwind-webpack-plugin

```sh
npm i @dcasia/mini-program-tailwind-webpack-plugin -D
```

#### 新建 Vue 配置文件

在项目根目录新建 `vue.config.js` 配置文件并使用 Webpack 插件

```javascript
// vue.config.js
const WindiCSSWebpackPlugin = require("windicss-webpack-plugin");
const MiniProgramTailwindWebpackPlugin = require("@dcasia/mini-program-tailwind-webpack-plugin")

module.exports = {  
  configureWebpack: {  
    plugins: [  
      new WindiCSSWebpackPlugin(),
      new MiniProgramTailwindWebpackPlugin({
        // options
      })
    ]  
  }  
}
```

#### 新建 Windi CSS 配置文件

在项目根目录新建 `windi.config.js` 配置文件

```javascript
//windi.config.js
export default {
  preflight: false,
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

> 此处 Tailwind CSS 配置文件同样适用
> <details>
> <summary>参考 Windi CSS 官方文档了解更多细节</summary>
>    
> [Windi CSS 配置文件兼容规则](https://windicss.org/guide/configuration.html)
> </details>

#### 在入口文件中引入 Windi CSS 的产物

```javascript
// main.js
import 'windi.css'
```

#### 完成
开始享受在小程序项目中由 Windi CSS 带来的高效开发体验 🎉

#### 可配置参数

| **名称**      | **类型**  | **默认** | **描述**                          |
| ----------- | ------- | ------ | ------------------------------- |
| enableRpx   | Boolean | `true`   | 是否开启自动转换至 rpx 单位值的功能            |
| designWidth | Number  | `350`    | 设计稿的像素宽度值，该尺寸会影响 rpx 转换过程中的计算比率 |
| utilitiesSettings.spaceBetweenItems | `Array<string>`  | `[]`   | 使用了 Space Between utilities 的容器中的子组件的名称。默认已包含 view, button, text, image 四个常用组件，所以大部分情况下开发者不需要配置该项。如需新增则可以在数组中添加新的组件名称。 |

#### 案例
> [集成案例：uni-app Vue 2 项目](https://github.com/dcasia/mini-program-tailwind/tree/development/examples/uni-app/vue-2)
  
</details>

<details>

<summary>🔩 常规 Vite 类小程序（以 uni-app 为例）</summary>

### 常规 Vite 类小程序（以 uni-app 为例）

> [uni-app](https://uniapp.dcloud.net.cn/), 开发一次，多端覆盖。

由于在 uni-app 中使用 Vue 3 进行小程序开发时项目是基于 Vite 进行构建的，所以本次安装示范将 uni-app Vue 3 项目作为典型案例来演示如何为大部分 Vite 类小程序项目进行插件安装。**以下安装步骤在 Vite 项目中具有广泛的通用性**，对于大部分 Vite 类小程序项目只需参考相同步骤进行安装即可。

#### 安装 vite-plugin-windicss 与 windicss

```sh
npm i vite-plugin-windicss windicss -D
```

> <details>
> <summary>参考 Windi CSS 官方文档了解更多细节</summary>
>    
> [Windi CSS Vite 集成](https://windicss.org/integrations/vite.html)
> </details>

#### 安装 @dcasia/mini-program-tailwind-webpack-plugin

```sh
npm i @dcasia/mini-program-tailwind-webpack-plugin -D
```

#### 更新 Vite 配置文件

在 `vite.config.js` 配置文件中使用插件

```javascript
// vite.config.js
import WindiCSS from 'vite-plugin-windicss';
import MiniProgramTailwind from '@dcasia/mini-program-tailwind-webpack-plugin/rollup';

export default {
  plugins: [
    WindiCSS(),
    MiniProgramTailwind()
  ]
}
```

#### 新建 Windi CSS 配置文件

在项目根目录新建 `windi.config.js` 配置文件

```javascript
//windi.config.js
export default {
  preflight: false,
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

> 此处 Tailwind CSS 配置文件同样适用
> <details>
> <summary>参考 Windi CSS 官方文档了解更多细节</summary>
>    
> [Windi CSS 配置文件兼容规则](https://windicss.org/guide/configuration.html)
> </details>

#### 在入口文件中引入 Windi CSS 的产物

```javascript
// main.js
import 'virtual:windi.css'
```

#### 完成
开始享受在小程序项目中由 Windi CSS 带来的高效开发体验 🎉

#### 可配置参数

| **名称**      | **类型**  | **默认** | **描述**                          |
| ----------- | ------- | ------ | ------------------------------- |
| enableRpx   | Boolean | `true`   | 是否开启自动转换至 rpx 单位值的功能            |
| designWidth | Number  | `350`    | 设计稿的像素宽度值，该尺寸会影响 rpx 转换过程中的计算比率 |
| utilitiesSettings.spaceBetweenItems | `Array<string>`  | `[]`   | 使用了 Space Between utilities 的容器中的子组件的名称。默认已包含 view, button, text, image 四个常用组件，所以大部分情况下开发者不需要配置该项。如需新增则可以在数组中添加新的组件名称。 |

#### 案例
> [集成案例：uni-app Vue 3 项目](https://github.com/dcasia/mini-program-tailwind/tree/development/examples/uni-app/vue-3)
  
</details>

<details>

<summary>🛠 原生开发或自定义构建的小程序</summary>

### 原生开发或自定义构建工具的小程序
  
无论你的项目基于什么 bundler 或 workflow 工具进行开发，只要有一个可编程的文件监听与处理服务便可以进行自定义实现。但这里需要明确的一点是，**若想在以原生开发模式的基础之上去集成本插件的功能，则一定需要我们去启动一套可编程的文件监听处理服务作为插件的运行基础**，这个服务通常由配置好的 Webpack, Gulp 等第三方工具完成。

> <details>
> <summary>使用 Tailwind/Windi CSS CLI 的开发者请看</summary>
>    
> 如果你是通过 Tailwind/Windi CSS 官方的 CLI 进行小程序 UI 开发，遗憾的是由于该 CLI 不支持插件机制而且不可能支持对于模板文件的修改，所以我们无法在此基础之上以自定义的方式集成本插件。
> </details>

我们将本插件的核心功能解耦并打包进了 `universal-handler.js` 文件中，若你想在自定义的构建工具中集成本插件的核心功能，可以在工作流逻辑中引入 `universal-handler`：

```javascript
const { handleTemplate, handleStyle } = require('@dcasia/mini-program-tailwind-webpack-plugin/universal-handler')
```

处理 template:
```javascript
const rawContent = '<view class="w-10 h-[0.5px] text-[#ffffff]"></view>'
const handledTemplate = handleTemplate(rawContent)
```

处理 style:
```javascript
const rawContent = '.h-\\[0\\.5px\\] {height: 0.5px;}'
const handledStyle = handleStyle(rawContent, options)
```

此后你便可以将处理过的字符串返回至工作流原本的流程中来生成最终的文件。

> <details>
> <summary>进一步了解自定义实现过程中的实践细节</summary>
>    
> [小程序集成 Windi CSS 的自定义实现](https://juejin.cn/post/7093809282272985119#heading-5)
> </details>

#### 可配置参数

| **名称**      | **类型**  | **默认** | **描述**                          |
| ----------- | ------- | ------ | ------------------------------- |
| enableRpx   | Boolean | `false`  | 是否开启自动转换至 rpx 单位值的功能            |
| designWidth | Number  | `350`    | 设计稿的像素宽度值，该尺寸会影响 rpx 转换过程中的计算比率 |
| utilitiesSettings.spaceBetweenItems | `Array<string>`  | `[]`   | 使用了 Space Between utilities 的容器中的子组件的名称。默认已包含 view, button, text, image 四个常用组件，所以大部分情况下开发者不需要配置该项。如需新增则可以在数组中添加新的组件名称。 |


#### 案例

> [集成案例：基于 Gulp 进行自定义实现](./examples/native)

</details>

> 示范操作步骤均以集成 Windi CSS 为例（Windi CSS 的体验更佳且兼容 Tailwind CSS）
> <details>
>   <summary>进一步了解 Windi CSS</summary>
>  
> [Windi CSS](https://windicss.org/)
> </details>

- - -

## 陷阱
- 在小程序中为了使组件样式可以被 Tailwind/Windi 的 CSS 产物作用到，我们需要在每一个组件的 JSON 配置文件中设置其[样式的作用域](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html#%E7%BB%84%E4%BB%B6%E6%A0%B7%E5%BC%8F%E9%9A%94%E7%A6%BB) `styleIsolation`，否则即使 Tailwind/Windi CSS 工作正常也无法用来开发组件 UI。
    > Taro 小程序不受该限制影响
    ```json
    {
      "component": true,
      "styleIsolation": "apply-shared"
    }
    ```
    > <details>
    > <summary>相关 issue</summary>
    >    
    > [Issue #1](https://github.com/dcasia/wechat-mini-program-tailwind/issues/1)
    > </details>

- 由于目前微信开发者工具的热重载功能无法监听到样式文件内由 `@import` 导入的 wxss 文件内容的变动，所以当启用热重载功能开发时，模拟器不会随着你对 Tailwind/Windi CSS 的更改而更新 UI。目前微信官方已知晓该 bug 的存在，在该 bug 修复之前，我们建议你在开发时关闭热重载，用传统的页面自动刷新来预览每一次的 UI 更新。
目前，该问题已在微信开发者工具 [1.06.2205231 RC](https://developers.weixin.qq.com/miniprogram/dev/devtools/rc.html#_1-06-2205231-%E6%9B%B4%E6%96%B0%E8%AF%B4%E6%98%8E) 中被修复。
    > <details>
    > <summary>相关 issue</summary>
    >    
    > [Issue #3](https://github.com/dcasia/wechat-mini-program-tailwind/issues/3)
    > </details>


- - -
## 功能对比

| **语法**                                                 | **不使用本插件** | **使用本插件** |
| ------------------------------------------------------ | ---------- | --------- |
| **Regular**: `h-10` `text-white`                       | ✅          | ✅         |
| **JIT/Value infer**: `t-[25px]` `bg-[#ffffff]`         | ❌          | ✅         |
| **Fraction**: `translate-x-1/2` `w-8.5`                | ❌          | ✅         |
| **Important**: `!p-1`                                  | ❌          | ✅         |
| **RGB value infer**: `text-[rgb(25,25,25)]`            | ❌          | ✅         |
| **Space between**: `space-y-2` `space-y-reverse`       | ❌          | ✅         |
| **Variants**: `dark:bg-gray-800`                       | ❌          | ✅         |
| **Variants groups**: `hover:(bg-gray-400 font-medium)` | ❌          | ✅         |
| **Responsive**: `md:p-2`                               | ❌          | ✅         |
| `rpx` value transformed from `rem` and `px` value      | ❌          | ✅         |

- - -
## 兼容范围

- Webpack >= `4.0.0`
- Taro >= `3.0.0`
- MPX >= `2.7.5`
- uni-app



