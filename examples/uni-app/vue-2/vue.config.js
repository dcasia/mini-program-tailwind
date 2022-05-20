const WindiCSSWebpackPlugin = require("windicss-webpack-plugin");
const MiniProgramTailwindWebpackPlugin = require("@dcasia/mini-program-tailwind-webpack-plugin")

module.exports = {  
    configureWebpack: {  
        plugins: [  
            new WindiCSSWebpackPlugin(),
            new MiniProgramTailwindWebpackPlugin()
        ]  
    }  
}
