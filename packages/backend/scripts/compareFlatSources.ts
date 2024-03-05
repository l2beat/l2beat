import { assert } from "@l2beat/backend-tools"
import { readFile, readdir } from 'fs/promises'
import { resolve, basename } from 'path'
import chalk from 'chalk'
import { printAsciiTable } from "../src/tools/printAsciiTable"

interface Config {
  subcommand: 'run' | 'help'
  firstProjectName?: string
  secondProjectName?: string
  forceTable?: boolean
}

interface HashedFileContent {
    path: string
    hashChunks: HashedChunks[]
    content: string
}

interface Project {
    name: string
    concatenatedSource: HashedFileContent
    sources: HashedFileContent[]
}

interface HashedChunks {
  content: string
  length: number
}

interface FileId {
    id: string
    path: string
}

void main().catch((e) => {
  console.log(e)
})

async function main() {
  const config = parseCliParameters()
  switch (config.subcommand) {
    case 'help':
      printUsage()
      break
    case 'run':
      await compareFlatSources(config)
      break
  }
}

function parseCliParameters(): Config {
  const args = process.argv.slice(2)

  if (args.includes('--help') || args.includes('-h')) {
    return { subcommand: 'help' }
  }

  let firstProjectName = args.shift()
  let secondProjectName = args.shift()

  let forceTable = false
  if(args.includes('--force-table')) {
      forceTable = true
  }

  return {
    subcommand: 'run',
    firstProjectName,
    secondProjectName,
    forceTable
  }
}

function printUsage(): void {
  console.log(
    'Usage: yarn compare-flat-sources <project1> <project2> --force-table',
  )
}

async function compareFlatSources(config: Config): Promise<void> {
  assert(config.firstProjectName, 'project1 is required')
  assert(config.secondProjectName, 'project2 is required')

  const firstProject = await readProject(config.firstProjectName)
  const secondProject = await readProject(config.secondProjectName)
  
  let matrix: Record<string, Record<string, string>> = {}

  for(const c1 of firstProject.sources) {
      let c1Object: Record<string, string> = {}

      for(const c2 of secondProject.sources) {
          const similarity = estimateSimilarity(c1, c2)
          c1Object[c2.path] = colorMap(similarity)
      }

      matrix[c1.path] = c1Object
  }

  printResult(config, firstProject, secondProject, matrix)
}

function printResult(
    config: Config,
    firstProject: Project,
    secondProject: Project,
    matrix: Record<string, Record<string, string>>
): void {
    printTable(config, firstProject, secondProject, matrix)
    const concatenatedSimilarity = estimateSimilarity(firstProject.concatenatedSource, secondProject.concatenatedSource)
    console.log(`\nEstimated similarity between two projects: ${colorMap(concatenatedSimilarity)}`)
}

function printTable(
    config: Config,
    firstProject: Project,
    secondProject: Project,
    matrix: Record<string, Record<string, string>>
): void {
    const terminalWidth = process.stdout.columns

    const widths = [computeTableWidth(firstProject), computeTableWidth(secondProject)]
    const minTableWidth = Math.min(...widths)

    if(minTableWidth > terminalWidth && !config.forceTable) {
        console.log(`${chalk.yellow("WARNING")}: Table is too wide to fit in the terminal`)
        console.log(`Terminal is ${terminalWidth} characters wide, table is ${minTableWidth} characters wide`)
        console.log(`Use ${chalk.magenta("--force-table")} to print the table anyway.`)
        return;
    }

    const shouldTranspose = widths[0] < widths[1]
    const aIds = removeCommonPath(firstProject.sources.map((source, i) => ({id: `A${i}`, path: source.path})))
    const bIds = removeCommonPath(secondProject.sources.map((source, i) => ({id: `B${i}`, path: source.path})))

    const header = ["IDs", ...((shouldTranspose ? aIds : bIds).map(({id}) => id))]
    let rows = Object.values(matrix).map(row => Object.values(row))

    if(shouldTranspose) {
        rows = transpose(rows)
    }

    for(const [i, row] of rows.entries()) {
        row.unshift(shouldTranspose ? bIds[i].id : aIds[i].id)
    }

    const table = printAsciiTable(header, rows)

    console.log(`= ${firstProject.name} `.padEnd(36, '='))
    console.log(aIds.map((e) => `${e.id} - ${e.path}`).join('\n'))
    console.log(`= ${secondProject.name} `.padEnd(36, '='))
    console.log(bIds.map((e) => `${e.id} - ${e.path}`).join('\n'))
    console.log("====================================\n")
    console.log(table)
}

function transpose(input: string[][]): string[][] {
    return input[0].map((_, i) => input.map((row) => row[i]))
}

function computeTableWidth(project: Project): number {
    return project.sources.length * 6 + 5 + project.sources.length + 2
}

function removeCommonPath(fileIds: FileId[]): FileId[] {
    const findCommonPath = (array: string[]) => {
        if (array.length === 0) return '';
        
        let prefix = array[0];
        for (let i = 1; i < array.length; i++) {
            while (array[i].indexOf(prefix) !== 0) {
                prefix = prefix.substring(0, prefix.length - 1);
                if (prefix === '') return '';
            }
        }
        return prefix;
    };

    const commonPath = findCommonPath(fileIds.map((fileId) => fileId.path));
    return fileIds.map((fileId) => ({ id: fileId.id, path: fileId.path.substring(commonPath.length) }));
}

async function readProject(projectName: string): Promise<Project> {
    const sources = await getFlatSources(projectName)
    const concatenatedSources = sources.map((source) => source.content).join('')
    const concatenatedSourceHashChunks = buildSimilarityHashmap(concatenatedSources)
    return { name: projectName, concatenatedSource:{
        path: `virtualPath.sol`,
        hashChunks: concatenatedSourceHashChunks,
        content: concatenatedSources
    }, sources}
}

async function getFlatSources(
  project: string,
): Promise<HashedFileContent[]> {
    const path = `./discovery/${project}/ethereum/.flat/`

    const filePaths = await listFilesRecursively(path)
    const allFilesAreSol = filePaths.every((file) => file.endsWith('.sol'))
    assert(allFilesAreSol, 'All files should be .sol files')

    const contents: HashedFileContent[] = []
    for(const filePath of filePaths.filter((file) => !file.endsWith('.p.sol'))) {
        const content = await readFile(filePath, 'utf-8')
        contents.push({ 
            path: filePath,
            hashChunks: buildSimilarityHashmap(content),
            content
        })
    }

    return contents
}

async function listFilesRecursively(path: string): Promise<string[]> {
  const entries = await readdir(path, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const resolved = resolve(path, entry.name)
      return entry.isDirectory() ? listFilesRecursively(resolved) : resolved
    }),
  )

  return files.flat()
}

function estimateSimilarity(lhs: HashedFileContent, rhs: HashedFileContent): number {
    let lhsIndex = 0
    let rhsIndex = 0
    let sourceCopied = 0

    while(true) {
        const lhsIsDone = lhsIndex === lhs.hashChunks.length
        if(lhsIsDone) {
            break
        }

        while(rhsIndex < rhs.hashChunks.length) {
            if(lhs.hashChunks[lhsIndex].content <= rhs.hashChunks[rhsIndex].content) {
                break
            }

            rhsIndex++
        }

        let lhsCount = lhs.hashChunks[lhsIndex].length
        let rhsCount = 0

        if(rhsIndex < rhs.hashChunks.length && lhs.hashChunks[lhsIndex].content === rhs.hashChunks[rhsIndex].content) {
            rhsCount = rhs.hashChunks[rhsIndex].length
            rhsIndex++;
        }

        sourceCopied += Math.min(lhsCount, rhsCount);
        lhsIndex++;
    }

    return sourceCopied / Math.max(lhs.content.length, rhs.content.length)
}

function buildSimilarityHashmap(input: string): HashedChunks[] {
    let lines = splitLineKeepingNewlines(input)

    const stringChunks = lines.flatMap((line) => {
        const result = []
        for (let i = 0; i < line.length; i += 64) {
            result.push(line.slice(i, i + 64))
        }
        return result
    })

    checkIfLineCountIsCorrect(input, lines)

    const map = new Map<string, number>()

    for(const stringChunk of stringChunks) {
        const element = map.get(stringChunk)

        if(element !== undefined) {
            map.set(stringChunk, element + stringChunk.length)
        } else {
            map.set(stringChunk, stringChunk.length)
        }
    }

    // Transform that map to an array of Chunk objects
    const chunks: HashedChunks[] = Array.from(map).map(([content, length]) => ({ content, length }))
    // Sort alphabetically by content
    chunks.sort((lhs, rhs) => lhs.content.localeCompare(rhs.content))

    return chunks
}

function checkIfLineCountIsCorrect(input: string, lines: string[]): void {
    const inputLines = input.split('\n')
    if(inputLines.at(-1) === '') {
        inputLines.pop()
    }
    const inputLineCount = inputLines.length
    const linesLineCount = lines.length

    if (inputLineCount !== linesLineCount) {
        throw new Error(`Line count mismatch: ${inputLineCount} vs ${linesLineCount}`)
    }
}

function splitLineKeepingNewlines(input: string): string[] {
    let lines = [];
    let start = 0;

    for (let i = 0; i < input.length; i++) {
        if (input[i] === '\n') {
            let part = input.substring(start, i + 1);
            lines.push(part);
            start = i + 1;
        }
    }

    if (start < input.length) {
        lines.push(input.substring(start));
    }

    return lines;
}

function colorMap(value: number): string {
    const valueString = value.toFixed(2)

    if (value < 0.125) {
        return chalk.grey(valueString);
    } else if (value < 0.25) {
        return chalk.red(valueString);
    } else if (value < 0.375) {
        return chalk.redBright(valueString);
    } else if (value < 0.5) {
        return chalk.magenta(valueString);
    } else if (value < 0.625) {
        return chalk.magentaBright(valueString);
    } else if (value < 0.75) {
        return chalk.yellow(valueString);
    } else if (value < 0.875) {
        return chalk.yellowBright(valueString);
    } else {
        return chalk.greenBright(valueString);
    }
}
