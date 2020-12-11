module.exports = (api, options, rootOptions) => {
  // 复制并用 ejs 渲染 `./template` 内所有的文件
  api.render('../template')
  

  // 修改 `package.json` 里的字段
  api.extendPackage({
    "scripts": {
      "serve": "vue-cli-service serve",
      "build": "vue-cli-service build",
      "build:production": "vue-cli-service build --mode production",
      "build:localprod": "vue-cli-service build --mode localprod",
      "build:test": "vue-cli-service build --mode test",
      "lint": "vue-cli-service lint"
    },
    "dependencies": {
      "axios": "^0.21.0",
      "good-storage": "^1.1.1",
      "qs": "^6.9.4",
      "vant": "^2.11.1",
      "vconsole": "^3.3.4"
    },
    "devDependencies": {
      "babel-plugin-import": "^1.13.3",
      // "cssnano": "^4.1.10",
      // "cssnano-preset-advanced": "^4.0.7",
      // "postcss-aspect-ratio-mini": "^1.0.1",
      // "postcss-cssnext": "^3.1.0",
      // "postcss-import": "^12.0.1",
      "postcss-px-to-viewport": "^1.1.1",
      // "postcss-url": "^8.0.0",
      // "postcss-viewport-units": "^0.1.6",
      // "postcss-write-svg": "^3.0.1"
    }
  })
}