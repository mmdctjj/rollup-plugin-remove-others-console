import childProcess from 'child_process';
import { parse } from "@babel/parser"
import generate from "@babel/generator"
import t from "@babel/types";
import traverse from "@babel/traverse"

const userName = childProcess.execSync(
  `git config user.name`,
  { encoding: 'utf-8' }
)

const RollupPluginRemoveOthersConsole = () => {

  return {
    name: 'rollup-plugin-remove-ohthers-console',
    enforce: "pre",
    transform: (code, id) => {
      if (!id.includes('node_modules') && code.includes(`console.log(`)) {
        
        // 如果当前文件没有当前作者，就全局替换，无需使用 ast
        const authorList = childProcess.execSync(`git log --pretty="%an" -- ${id}`, {
          encoding: 'utf-8',
        });

        if (!authorList.includes(userName)) {
          
          return code.replace(
            /console\.log\((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*\)[;\n]?/g,
            '{}\n',
          );
        }

        // 初始化 ast
        const ast = parse(code, {
          sourceType: 'module',
          plugins: ['jsx', 'tsx', 'vue', 'typescript', 'classProperties'],
        });

        const consoleLogLines = [];

        const visitor = {
          CallExpression(path) {
            if (
              t.isMemberExpression(path.node.callee) &&
              t.isIdentifier(path.node.callee.object, { name: 'console' }) &&
              t.isIdentifier(path.node.callee.property, { name: 'log' })
            ) {
              const line = path.node.loc.start.line;
              consoleLogLines.push(line);
            }
          },
        };

        traverse(ast, visitor);

        const removeLines = consoleLogLines.filter((line) => {
          const authorInfo = childProcess.execSync(`git blame -L ${line},${line} --porcelain ${id}`, {
            encoding: 'utf-8',
          });
          const authorMatch = authorInfo.match(/^author (.*)$/m);
          const author = authorMatch ? authorMatch[1].trim() : '';
          if (author !== userName && author !== 'Not Committed Yet') {
            return true;
          }
          return false;
        });

         // 遍历AST并替换console.log
        traverse(ast, {
          CallExpression(path) {
            if (removeLines.includes(path.node.loc.start.line)) {
              const emptyObjectExpression = t.objectExpression([]);
              // 设置空对象的 trailingComments 来保留换行效果
              emptyObjectExpression.trailingComments = [{ type: "CommentLine", value: "" }];
              path.replaceWith(emptyObjectExpression);
            }
          },
        });

        result = generate(ast).code;

        return result;
      }
      return code
    }
  }
}

export default RollupPluginRemoveOthersConsole