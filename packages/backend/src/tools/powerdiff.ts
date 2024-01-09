import Convert from 'ansi-to-html'
import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import path from 'path'

// This is a CLI tool. Run logic immediately.
powerdiff()

function powerdiff() {
  console.log(`
  <!DOCTYPE html>
  <html>
  <head>
      <style>
        .collapsible {
            font: 1em sans-serif;
            cursor: pointer;
            overflow: hidden;
            line-height: 1em;
            height: 1em; /* Adjust to line height */
            transition: height 0.3s ease-out;
            margin-top: 0.5em;
        }

        .icon {
            display: inline-block;
            margin-right: 10px;
            transition: transform 0.3s ease-out;
        }

        .expanded {
            height: auto; /* Adjust to content */
        }

        .expanded .icon {
            transform: rotate(90deg);
        }
    </style>
  </head>

  <body style="background-color: #222; color: white; margin: 2em;">
    <script>
      function toggleCollapse(element) {
        var content = element;
        var icon = element.querySelector('.icon');
        
        if (content.classList.contains('expanded')) {
            content.classList.remove('expanded');
        } else {
            content.classList.add('expanded');
        }
      }
    </script>
    <br><br>
  `)
  console.log('>>>> Powerdiff <<<<')
  const currentDirectory = process.env.INIT_CWD ?? process.cwd()
  const path1 = process.argv[2]
  const path2 = process.argv[3]
  const difftasticPath = process.argv[4]

  const absPath1 = path.resolve(currentDirectory, path1)
  const absPath2 = path.resolve(currentDirectory, path2)

  const gitDiff = gitDiffFolders(absPath1, absPath2)
  const filePathsList = processGitDiff(gitDiff)
  for (const filePaths of filePathsList) {
    let status: 'diff' | 'added' | 'removed' = 'diff'
    let diff
    if (filePaths[0] === filePaths[1]) {
      if (filePaths[0].startsWith(absPath1)) {
        status = 'removed'
      } else {
        status = 'added'
      }
      diff = readFileSync(filePaths[0]).toString()
    } else {
      diff = compareUsingDifftastic(filePaths[0], filePaths[1], difftasticPath)
      const difftasticStatus = diff.split('\n')[1] ?? 'Error'
      if (
        difftasticStatus === 'No syntactic changes.' ||
        difftasticStatus === 'No changes.'
      ) {
        continue
      }
    }
    console.log('<div class="collapsible" onclick="toggleCollapse(this)">')
    console.log(
      '<span class="icon">&#9654;</span> <!-- Right-pointing triangle; rotates when expanded -->',
    )
    console.log(`(${status})`)
    console.log(filePaths[0].split('/').slice(-1)[0])
    console.log('<pre>')
    console.log(filePaths[0])
    console.log('&#8595;') // arrow down
    console.log(filePaths[1])
    console.log()
    console.log(new Convert().toHtml(diff ?? ''))
    console.log('</pre>')
    console.log('</div>')
  }
  console.log('<br><br></body></html>')
}

function processGitDiff(gitDiff: string) {
  const lines = gitDiff.split('\n')
  const pathLines = lines.filter((line) => line.startsWith('diff --git'))
  const pathsList = pathLines.map((path) => {
    const split = path.split(' ')
    return [split[2].replace('a/', ''), split[3].replace('b/', '')]
  })
  return pathsList
}

function compareUsingDifftastic(
  filePath1: string,
  filePath2: string,
  difftasticPath?: string,
) {
  const difftasticCommand = difftasticPath ?? 'difft'
  try {
    const cmd = `${difftasticCommand} --ignore-comments --display=inline --color=always ${filePath1} ${filePath2}`
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
