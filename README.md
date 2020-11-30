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
## 使用方式
在根目录新建mock文件夹

在目录中添加js文件 格式如下
```
import mockjs from 'mockjs'
export default {
    "get /test": {code: 0, msg: ""},
    "POST /test": (req, res) => {
        res.json({code: 0, msg: ""});
    },
    "POST /test2":mockjs.mock({code:"@natural(0,100)",msg:"@ctitle"}),
    "GET /test2": (req, res) => {
        res.json(mockjs.mock({code:"@natural(0,100)",msg:"@ctitle"}));
    },
    "GET /test3": (req, res) => {
        res.end("test3");
    },
]
```