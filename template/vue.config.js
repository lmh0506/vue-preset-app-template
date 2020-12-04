module.exports = {
  publicPath: process.env.VUE_APP_BASE_URL || '/',
  <% 
    let externals = {} 
    if(options.isAmap) {
      externals.AMap = 'AMap'
    }
    if(options.isWechat) {
      externals.wx = 'wx'
    }
  %>
  configureWebpack: {
    // 把原本需要写在webpack.config.js中的配置代码 写在这里 会自动合并
    externals: <%- JSON.stringify(externals) %>
  },
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
  },
  devServer: {
    disableHostCheck: true,
    proxy: {
      // 三中心
      '^/oauth2': {
        target: process.env.VUE_APP_OAUTH_URL,
        changeOrigin: true,
        onProxyReq: function (proxyReq) {
          proxyReq.removeHeader('origin')
        }
      }
    }
  }
}
