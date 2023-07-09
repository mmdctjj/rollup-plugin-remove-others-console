import childProcess from 'child_process';
const os = require('os');

// 判断平台，win平台不支持grep
const isWin = os.type() === 'Windows_NT'
const findStr = isWin ? 'findstr' : 'grep'

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
        const rows = code.split('\n')

        const includesLines = rows.map((row, idx) => row.includes(`console.log(`) ? idx : undefined).filter(n => n)

        const removeLine = includesLines.filter(line => {
          const authorInfo = childProcess.execSync(
            `git blame -L ${line+1},${line+1} --porcelain ${id} | ${findStr} "^author "`,
            { encoding: 'utf-8' }
          )
          const author = authorInfo.slice(authorInfo.indexOf(`author `) + 7)
          return ![userName, `Not Committed Yet`].includes(author)
        })

        rows.map((row, idx) => {
          if (removeLine.includes(idx)) {
            return row.replace(/console\.log\((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*\)[;\n]?/g, '')
          }
          return row
        })
      }
      return code
    }
  }
}

export default RollupPluginRemoveOthersConsole