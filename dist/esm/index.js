import generate from "@babel/generator";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import * as childProcess from "child_process";

// 缓存作者信息和文件的最新提交哈希
var authorCache = new Map();
var fileHashCache = new Map();

// 获取当前用户
var userName = childProcess.execSync("git config user.name", {
  encoding: "utf-8"
});

// 执行 git log，返回文件的所有作者
var getFileAuthors = function getFileAuthors(id) {
  // 获取文件的最新提交哈希
  var commitHash = childProcess.execSync("git rev-parse ".concat(id), {
    encoding: "utf-8"
  }).trim();

  // 如果文件的哈希没有变化，直接返回缓存的结果
  if (fileHashCache.has(id) && fileHashCache.get(id) === commitHash) {
    return authorCache.get(id) || "";
  }

  // 更新缓存：如果哈希变化了，重新查询 Git
  var authorList = childProcess.execSync("git log --pretty=\"%an\" -- ".concat(id), {
    encoding: "utf-8"
  });
  authorCache.set(id, authorList);
  fileHashCache.set(id, commitHash);
  return authorList;
};

// 执行 git blame，返回特定行的作者信息
var getLineAuthor = function getLineAuthor(line, id) {
  var authorInfo = childProcess.execSync("git blame -L ".concat(line, ",").concat(line, " --porcelain ").concat(id), {
    encoding: "utf-8"
  });
  var authorMatch = authorInfo.match(/^author (.*)$/m);
  return authorMatch ? authorMatch[1].trim() : "";
};

// 插件函数
var RollupPluginRemoveOthersConsole = function RollupPluginRemoveOthersConsole() {
  return {
    name: "rollup-plugin-remove-others-console",
    enforce: "pre",
    transform: function transform(code, id) {
      if (!id.includes("node_modules") && code.includes("console.log")) {
        // 检查文件的作者列表
        var authorList = getFileAuthors(id);
        if (!authorList.includes(userName)) {
          return code.replace(/console\.log\((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*\)[;\n]?/g, "{}\n");
        }

        // 初始化 AST
        var ast = parse(code, {
          sourceType: "module",
          plugins: ["jsx", "tsx", "vue", "typescript", "classProperties"]
        });
        var consoleLogLines = [];
        var visitor = {
          CallExpression: function CallExpression(path) {
            if (t.isMemberExpression(path.node.callee) && t.isIdentifier(path.node.callee.object, {
              name: "console"
            }) && t.isIdentifier(path.node.callee.property, {
              name: "log"
            })) {
              var line = path.node.loc.start.line;
              consoleLogLines.push(line);
            }
          }
        };
        traverse(ast, visitor);

        // 过滤出需要删除的行
        var removeLines = consoleLogLines.filter(function (line) {
          var author = getLineAuthor(line, id);
          if (author !== userName && author !== "Not Committed Yet") {
            return true;
          }
          return false;
        });

        // 遍历AST并替换console.log
        traverse(ast, {
          CallExpression: function CallExpression(path) {
            // 判断是否是 console.log
            if (t.isMemberExpression(path.node.callee) && t.isIdentifier(path.node.callee.object, {
              name: "console"
            }) && t.isIdentifier(path.node.callee.property, {
              name: "log"
            })) {
              var line = path.node.loc.start.line;

              // 如果当前行需要被移除
              if (removeLines.includes(line)) {
                var isInline = path.parentPath.isExpressionStatement(); // 判断是否为行内语句

                // 如果是行内语句，保留结构但注释掉
                if (isInline) {
                  path.replaceWith(t.callExpression(t.identifier("/* console.log removed */"), []));
                } else {
                  // 对于普通的 console.log，直接替换为一个空对象，保留注释
                  var emptyObjectExpression = t.objectExpression([]);
                  emptyObjectExpression.trailingComments = [{
                    type: "CommentLine",
                    value: "// console.log removed"
                  }];
                  path.replaceWith(emptyObjectExpression);
                }
              }
            }
          }
        });
        var result = generate(ast).code;
        return result;
      }
      return code;
    }
  };
};
export default RollupPluginRemoveOthersConsole;