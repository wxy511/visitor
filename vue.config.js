const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  runtimeCompiler: true,
  publicPath: '/',
  assetsDir: 'static/appointment/',
  lintOnSave: process.env.NODE_ENV === 'development',
  //不在production环境使用SourceMap
  productionSourceMap: false,
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ],
  devServer: {
    port: 9099,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: { // 配置跨域
      '/proxy': {
        target: process.env.VUE_APP_BASE_API_PROXY,
        changOrigin: true, // 允许跨域
        pathRewrite: {
          '^/proxy': ''
        }
      }
    }
  },

  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },

  chainWebpack(config) {
    // svg设置
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    if (process.env.NODE_ENV === 'production') {
      if (process.env.npm_config_report) {
        config
          .plugin('webpack-bundle-analyzer')
          .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
          .end()
      }
    } else {}
  },
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        prependData: `@import "@/custom/${process.env.VUE_APP_BUILD_VERSION }/styles/define.scss";@import "@/styles/define.scss";`
      }
    }
  }
}
