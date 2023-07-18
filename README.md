## 🚀 rollup-plugin-remove-others-console

去除其他开发者的console语句，仅保留自己的，让你的开发更清爽

Remove console statements from other developers and keep only your own, making your development more refreshing

### install
```
npm i rollup-plugin-remove-others-console -D
```
### use

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import removeOthersConsole from 'rollup-plugin-remove-others-console';

export default defineConfig({
  plugins: [
    removeOthersConsole(),
    // ... others
  ]
});
```
### warn

#### 1.不建议在生产环境使用

如果打包只会留下打包者的console.log语句，可能会影响其他开发者调试，虽然这是个坏习惯！

你可以根据据下面的例子使用vite官方方法drop所有console语句。

```js
//vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
 
export default defineConfig({
    plugins: [vue()],
    build: {
        minify: 'terser',
        terserOptions: {
            compress: {
                //生产环境时移除console
                drop_console: true,
                drop_debugger: true,
            },
        },
    },
})
```
#### 2. 特殊情况说明
`catch`代码块中的 console 不会去除
```js
Promise()
  .then(res => {})
  .catch(err => console.log(err))
/** useEffect(() => console.log(data), [data]) */
```
### LICENSE
MIT
