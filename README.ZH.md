# rollup-plugin-remove-others-console

[![NPM version](https://img.shields.io/npm/v/rollup-plugin-remove-others-console.svg?style=flat)](https://npmjs.com/package/rollup-plugin-remove-others-console)
[![NPM downloads](http://img.shields.io/npm/dm/rollup-plugin-remove-others-console.svg?style=flat)](https://npmjs.com/package/rollup-plugin-remove-others-console)

## 🚀 rollup-plugin-remove-others-console

去除其他开发者的 console 语句，仅保留自己的，让你的开发更清爽

Remove console statements from other developers and keep only your own, making your development more refreshing

### install

```
npm i rollup-plugin-remove-others-console -D
```

### use

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import removeOthersConsole from "rollup-plugin-remove-others-console";

export default defineConfig({
  plugins: [
    removeOthersConsole(),
    // ... others
  ],
});
```

### warn

#### 1.不建议在生产环境使用

如果打包只会留下打包者的 console.log 语句，可能会影响其他开发者调试，虽然这是个坏习惯！

你可以根据据下面的例子使用 vite 官方方法 drop 所有 console 语句。

```js
//vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        //生产环境时移除console
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
```

#### 2. 请确保将处理的是最原始的文件

由于插件严格依赖行判读 git 作者，所以该插件需要确保在可能会修改源文件的插件之前执行。

### LICENSE

MIT
