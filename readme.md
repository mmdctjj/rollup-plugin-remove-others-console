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

### LICENSE
MIT
