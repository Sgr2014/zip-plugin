const path = require('path')
const ZipPlugin = require('./plugins/zip-plugin.js')

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'main.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new ZipPlugin({
      filename: 'offline' // 打包后的文件名
    })
  ]
}