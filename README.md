## 安装方式 

`yarn add -D @vue/cli-plugin-mock`

`npm i -dev @vue/cli-plugin-mock`

## 修改配置
`vue.config.js` 

可不修改,不修改采用默认参数
```
module.exports = {
    pluginOptions: {
        mock: {
            disable: false, //是否禁用 默认值 false 不禁用
            type: "local", // 打包方式, "local"打包到本地 默认不打包mock到项目
        }
    }
}
```