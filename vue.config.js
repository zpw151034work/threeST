const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    config
      .plugin("webpack-bundle-analyzer")
      .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
  },
  configureWebpack: {
    externals: {
      "./cptable": "var cptable",
    },
    resolve: {
      fallback: {
        fs: false,
      },
    },
  },
});
// webpack.config.js
