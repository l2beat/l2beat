import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import http from 'http'
import path from 'path'
import Convert from 'ansi-to-html'
import chalk from 'chalk'
import { splitIntoSubfiles } from './powerdiff/splitIntoFiles'
import type { Configuration } from './powerdiff/types'

export const DIFFING_MODES = ['together', 'split'] as const
export type DiffingMode = (typeof DIFFING_MODES)[number]

export const DISPLAY_MODES = ['inline', 'side-by-side'] as const
export type DisplayMode = (typeof DISPLAY_MODES)[number]
const displayModeMap: Record<DisplayMode, string> = {
  inline: '--display=inline',
  'side-by-side': '--display=side-by-side-show-both --width=200',
}

export interface LeftRightPair {
  left: string
  right: string
}

function diffToHtml(
  path1: string,
  path2: string,
  difftasticPath: string,
  mode: DiffingMode,
  displayMode: DisplayMode,
  context: number,
): string {
  const currentDirectory = process.env.INIT_CWD ?? process.cwd()

  const absPath1 = path.resolve(currentDirectory, path1)
  const absPath2 = path.resolve(currentDirectory, path2)

  const gitDiff = gitDiffFolders(absPath1, absPath2)
  let filePathsList = processGitDiff(gitDiff)

  const config: Configuration = {
    path1: absPath1,
    path2: absPath2,
    displayMode,
    difftasticPath,
    context,
  }

  const result = []
  result.push(HTML_START)

  if (mode === 'split') {
    const splitResult = splitIntoSubfiles(config, filePathsList)

    config.path1 = splitResult.path1
    config.path2 = splitResult.path2
    for (const list of splitResult.filePathsList) {
      const { left, right } = list
      if (left === right) {
        result.push(diffPaths(config, [list]))
      } else {
        const filePathsList = processGitDiff(gitDiffFolders(left, right))
        const title = `${path.basename(left)} <-> ${path.basename(right)}`
        result.push(
          collapsible(title, diffPaths(config, filePathsList).join('\n')),
        )
      }
    }

    if (splitResult.filePathsList.length === 0) {
      result.push(genNoChangesHtml())
    }
    filePathsList = splitResult.filePathsList
  } else if (mode === 'together') {
    const diffs = diffPaths(config, filePathsList)

    if (diffs.length === 0) {
      diffs.push(genNoChangesHtml())
    }
    result.push(...diffs)
  }

  result.push(HTML_END)
  return result.join('\n')
}

function diffPaths(
  config: Configuration,
  filePathsList: LeftRightPair[],
): string[] {
  const result = []
  for (const filePaths of filePathsList) {
    let status: 'diff' | 'added' | 'removed' = 'diff'
    let diff
    if (filePaths.left === filePaths.right) {
      diff = readFileSync(filePaths.left).toString()
      if (filePaths.left.startsWith(addTrailingSlash(config.path1))) {
        status = 'removed'
        diff = chalk.redBright(diff)
      } else {
        status = 'added'
        diff = chalk.greenBright(diff)
      }
    } else {
      diff = compareUsingDifftastic(
        filePaths.left,
        filePaths.right,
        displayModeMap[config.displayMode],
        config.difftasticPath,
        config.context,
      )
      const difftasticStatus = diff.split('\n')[1] ?? 'Error'
      if (
        difftasticStatus === 'No syntactic changes.' ||
        difftasticStatus === 'No changes.'
      ) {
        continue
      }
      if (diff.includes('exceeded DFT_PARSE_ERROR_LIMIT')) {
        chalk.redBright(
          `Error with difftastic: exceeded DFT_PARSE_ERROR_LIMIT for ${filePaths.left}`,
        )
        result.push(
          `<div class="warning">  
            <p>Error with difftastic:</p>
            <p><code>exceeded DFT_PARSE_ERROR_LIMIT</code></p>
            <p>Include the following command to increase the limit:</p>
            <p><code>export DFT_PARSE_ERROR_LIMIT=100; pnpm powerdiff ...</code></p>
          </div>`,
        )
      }
    }

    result.push(genDiffHtml(filePaths, status, diff))
  }

  return result
}

function processGitDiff(gitDiff: string): LeftRightPair[] {
  const lines = gitDiff.split('\n')
  const pathLines = lines.filter((line) => line.startsWith('diff --git'))
  const pathsList = pathLines.map((path) => {
    const split = path.split(' ')
    return {
      left: split[2].replace('a/', ''),
      right: split[3].replace('b/', ''),
    }
  })
  return pathsList
}

function compareUsingDifftastic(
  filePath1: string,
  filePath2: string,
  displayMode: string,
  difftasticPath: string,
  context: number,
) {
  const fileName = filePath1.split('/').slice(-1)[0]
  console.log(`Processing ${fileName}`)
  try {
    const cmd = `${difftasticPath} --ignore-comments ${displayMode} --color=always "${filePath1}" "${filePath2}" --context ${context}`
    return osExec(cmd).toString()
  } catch (error) {
    console.log(error)
    return 'Error with difftastic: '
  }
}

function gitDiffFolders(absPath1: string, absPath2: string): string {
  try {
    return osExec(
      `git diff --no-index "/${absPath1}" "/${absPath2}"`,
    ).toString()
  } catch (error) {
    // When difference is found, git diff returns non-zero exit code
    // so execSync throws and error, which we handle here
    const execSyncError = error as {
      code?: number
      stdout?: Buffer
      stderr?: Buffer
    }
    if (execSyncError.stderr && execSyncError.stderr.toString().trim() !== '') {
      const errorMessage = `Error with git diff: ${execSyncError.stderr.toString()}`
      console.log(errorMessage)
      return errorMessage
    }
    if (execSyncError.stdout) {
      return execSyncError.stdout.toString().trim()
    }
    return 'Error with git diff: no stderr or stdout found'
  }
}

function osExec(command: string) {
  return execSync(command, { maxBuffer: 1024 * 1024 * 10 }) // 10 MB
}

function genNoChangesHtml(): string {
  return `
    <div class="container">
      <div class="message-box">
        <h1 class="main-message">Looks like there are no differences!</h1>
        <p class="sub-message">The content in both of those directories appears to be <i>the same</i>.</p>
      </div>
    </div>`
}

function genDiffHtml(
  filePaths: LeftRightPair,
  status: string,
  diff: string,
): string {
  const result = []
  result.push('<pre>')
  result.push(filePaths.left)
  result.push('&#8595;') // arrow down
  result.push(filePaths.right)
  result.push()
  result.push(new Convert().toHtml(diff))
  result.push('</pre>')

  return collapsible(
    `(${status}) ${filePaths.left.split('/').slice(-1)[0]}`,
    result.join('\n'),
  )
}

function collapsible(button: string, content: string): string {
  const result = []
  result.push('<div class="collapsible">')
  result.push(
    '<button class="button" onclick="toggleCollapse(this.parentElement)">',
  )
  result.push('<span class="icon">&#9654;</span>')
  result.push(button)
  result.push('</button>')
  result.push('<div class="content">')
  result.push(content)
  result.push('</div>')
  result.push('</div>')
  return result.join('\n')
}

function checkDeps() {
  try {
    osExec('which difft')
  } catch {
    console.log(
      'difft is not found. Please install it using `brew install difftastic`',
    )
    process.exit(1)
  }
}

const HTML_START = `
  <!DOCTYPE html>
  <html>
  <head>
      <style>
        .collapsible {
            font: 1em sans-serif;
            cursor: pointer;
            overflow: hidden;
            line-height: 1em;
            height: 2em; /* Adjust to line height + button padding */
            transition: height 0.12s cubic-bezier(0.22, 1, 0.36, 1);
            margin-bottom: 0.5em;
            padding-left: 0px;
        }

        .collapsible .content {
          padding-left: 20px;
        }

        .collapsible .collapsible {
          padding-left: 20px;
        }

        .icon {
            display: inline-block;
            margin-right: 10px;
            transition: transform 0.12s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .button {
            background-color: #444;
            color: white;
            padding: 0.5em 1em;
            border: none;
            margin-bottom: 0.5em;
            cursor: pointer;
        }

        .warning {
            background-color: #ff000050;
            padding: 0.5em 1em;
            border: none;
            margin-bottom: 0.5em;
        }

        .warning > p {
          margin-top: 0;
        }

        .warning > p:last-child {
          margin-bottom: 0;
        }

        code {
            background-color: #444;
            color: white;
            padding: 0.2em 0.4em;
        }

        .expanded {
            height: auto; /* Adjust to content */
        }

        .collapsible.expanded > .button {
            background-color: #CCB18F;
        }

        .collapsible.expanded > .button > .icon {
            transform: rotate(90deg);
        }

        // Classes related to no changes message

        .container {
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #444;
            padding: 20px;
        }

        .message-box {
            text-align: center;
        }

        .main-message {
            font-size: 2.8em;
            font-weight: 600;
            color: #3a8fdc;
            margin-bottom: 10px;
        }

        .sub-message {
            font-size: 1.2em;
            color: #666;
            margin-top: 0;
        }
    </style>
  </head>

  <body style="background-color: #222; color: white; margin: 2em;">
    <script>
      function toggleCollapse(element) {
        var content = element;
        
        if (content.classList.contains('expanded')) {
            content.classList.remove('expanded');
        } else {
            content.classList.add('expanded');
        }
      }
    </script>
    <br><br>
  `

const HTML_END = '<br><br></body></html>'

function addTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`
}

export function powerdiff(
  path1: string,
  path2: string,
  difftasticPath: string = 'difft',
  mode: DiffingMode = 'together',
  displayMode: DisplayMode = 'inline',
  context: number = 3,
) {
  checkDeps()
  const htmlContent = diffToHtml(
    path1,
    path2,
    difftasticPath,
    mode,
    displayMode,
    context,
  )

  const server = http.createServer((_, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(htmlContent)
  })

  const PORT = 30123
  server.listen(PORT, () => {
    console.log(
      [
        '',
        `Diff is served on http://localhost:${PORT}`,
        'Use Ctrl+C to stop the server.',
      ].join('\n'),
    )
  })
}
