# vue-app-template

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### 打包生产环境
```
npm run build 或 npm run build:production
```

### 打包测试环境
```
npm run build:test
```

### 打包开发环境
```
npm run build:localprod
```

### Lints and fixes files
```
npm run lint
```

### SCSS 全局变量，mixin引入
- 由于每次手动引入全局变量和mixin太麻烦了，将他们设置为全局引入
- 再去vscode上下个 **SCSS IntelliSense** 插件配合使用，会有代码提示，便于提高开发效率

```js
vue.config.js中全局引入设置
看自己package.json中有哪个loader就用哪个

module.exports = {
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      scss: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.sass` 这个文件
        // 注意：在 sass-loader v7 中，这个选项名是 "data"
        prependData: '@import "~@/common/css/variable.scss";@import "~@/common/css/mixin.scss";'
      }
    }
  }
}
```
### 请求方式说明
```js
import a from '@/api/a'
import b from '@/api/b'

a.test()
b.test()

/**
 * createApis 将 apiConfig 里的接口地址配置 转换成请求函数
 * apiConfig = {
 *  get: { key: val } get请求地址对应， key 为请求函数名, val 为接口地址
 *  post: { key: val } post请求地址对应， key 为请求函数名, val 为接口地址
 *  put: { key: val } put请求地址对应， key 为请求函数名, val 为接口地址
 *  delete: { key: val } delete请求地址对应， key 为请求函数名, val 为接口地址
 * }, 提交的参数
 * 其他参数与 @/common/js/ajax 文件相同
 */
// api/a.js
import { createApis } from '@/utils/utils'
export default createApis({
  get: { test: '/a/test' }
})
// api/b.js
import { createApis } from '@/utils/utils'
export default createApis({
  get: { test: '/b/test' }
})
```

### 变量文件
- 开发环境变量文件 .env.development(本地运行时用), .env.localprod(打包时用)
- 测试环境变量文件 .env.test
- 生产环境变量文件 .env.production

### 使用vw实现移动端适配
[如何在Vue项目中使用vw实现移动端适配](https://www.jianshu.com/p/1f1b23f8348f)

### vant官网
[vant官网](https://youzan.github.io/vant/#/zh-CN/)
