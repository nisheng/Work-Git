/*
 * @Author: nisheng nisheng@bwoil.com
 * @Date: 2022-09-14 16:48:33
 * @LastEditors: nisheng nisheng@bwoil.com
 * @LastEditTime: 2022-09-23 18:15:26
 * @FilePath: /web-buryingPoint/webpack.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const path = require("path");


module.exports = (env) => {
  const _cdnPath = env.build_env === 'prod' ? 'https://cdn.emarineonline.com.cn/sdk' : 'https://cdn-staging.emarineonline.com.cn/sdk'
  return {
    mode: env.build_env === 'prod' ? "production" : 'development',
    entry: "./src/index.js",
    output: {
      clean: true,
      filename: 'bTag.js',
      path: path.join(__dirname, "build"),
      library: {
        name: 'Report',
        type: 'umd',
        export: 'default'
      },
      publicPath: _cdnPath
    },
    // experiments: {
    //   topLevelAwait: true
    // },
    // performance: {
    //   hints: false,
    // }
  };
} 


