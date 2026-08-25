# Zip Plugin

一个简易的 Webpack 插件：在构建产物生成阶段（`emit`），将本次编译的全部资源打包为 ZIP 文件，并写入输出目录。

适用于离线包分发、构建产物归档等场景。

## 原理

1. 在 Webpack 的 `compiler.hooks.emit` 阶段异步拦截编译结果
2. 用 [JSZip](https://stuk.github.io/jszip/) 创建以 `filename` 命名的文件夹
3. 遍历 `compilation.assets`，将每个资源写入该文件夹
4. 生成 ZIP 二进制内容，并通过 `webpack-sources` 的 `RawSource` 追加为新的构建产物（如 `offline.zip`）

## 项目结构

```
zip-plugin/
├── plugins/
│   └── zip-plugin.js   # ZipPlugin 实现
├── main.js             # 示例入口（演示用）
├── webpack.config.js   # 示例 Webpack 配置
└── package.json
```

## 快速开始

```bash
# 安装依赖
npm install

# 构建（会输出 dist/ 及 ZIP 包）
npm run build
```

构建完成后，`dist/` 中除了正常的 JS 产物外，还会多出一个 ZIP 文件（默认示例为 `offline.zip`）。

## 使用方式

在 `webpack.config.js` 中引入并注册插件：

```js
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
      filename: 'offline' // ZIP 内文件夹名，同时作为产物名：offline.zip
    })
  ]
}
```

### 配置项

| 选项 | 类型 | 说明 |
|------|------|------|
| `filename` | `string` | ZIP 内根文件夹名称；产物文件名为 `{filename}.zip` |

## 核心实现要点

```js
compiler.hooks.emit.tapAsync('ZipPlugin', (compilation, callback) => {
  const folder = zip.folder(this.options.filename)
  for (let filename in compilation.assets) {
    folder.file(filename, compilation.assets[filename].source())
  }
  zip.generateAsync({ type: 'nodebuffer' }).then((content) => {
    compilation.assets[this.options.filename + '.zip'] = new RawSource(content)
    callback()
  })
})
```

- **钩子**：`emit` + `tapAsync`，保证异步 ZIP 生成完成后再继续构建流程
- **资源读取**：通过 `compilation.assets[filename].source()` 获取文件内容
- **产物写入**：将 ZIP Buffer 包装为 `RawSource` 挂到 `compilation.assets`

## 依赖

| 包名 | 用途 |
|------|------|
| `jszip` | 生成 ZIP |
| `webpack-sources` | 提供 `RawSource`，向 Webpack 追加产物 |
| `webpack` / `webpack-cli` | 构建与运行（开发依赖） |

## License

ISC
