import { terser } from "rollup-plugin-terser";

const isProd = process.env.BUILD === "prod";

export default {
  input: "src/index.js", // 入口文件路径
  output: {
    file: isProd ? "dist/index.min.js" : "dist/index.js", // 根据环境输出不同文件
    format: "es", // 输出格式（可选：amd, cjs, es, iife, umd）
    name: "rollup-plugin-remove-others-console", // 输出的UMD模块名称
  },
  plugins: [
    isProd && terser(), // 仅在生产环境启用压缩插件
  ].filter(Boolean),
};
