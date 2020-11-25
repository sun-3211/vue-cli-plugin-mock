修改文件 `vue.config.js`

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