# rollup-plugin-remove-others-console

[![NPM version](https://img.shields.io/npm/v/rollup-plugin-remove-others-console.svg?style=flat)](https://npmjs.com/package/rollup-plugin-remove-others-console)
[![NPM downloads](http://img.shields.io/npm/dm/rollup-plugin-remove-others-console.svg?style=flat)](https://npmjs.com/package/rollup-plugin-remove-others-console)

[中文 README](./README.ZH.md)

## 🚀 rollup-plugin-remove-others-console

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
    // . .. others
  ],
});
```

### warn

####1. Not recommended for use in production environments

If packaging only leaves the packager's console.log statement, it may affect other developers' debugging, although this is a bad habit!

You can use the official Vite method to drop all console statements based on the following example.

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
        //Remove console in production environment
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
```

#### 2. Please ensure that the files being processed are the most original ones

Due to the strict dependence of the plugin on line interpretation of Git authors, it is necessary to ensure that the plugin is executed before any plugins that may modify the source file.

### LICENSE

MIT
