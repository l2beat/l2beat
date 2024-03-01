import { assert } from "@l2beat/backend-tools"
import { readFile, readdir } from 'fs/promises'
import { resolve, basename } from 'path'
import chalk from 'chalk'
import { printAsciiTable } from "../src/tools/printAsciiTable"

interface Config {
  subcommand: 'run' | 'help'
  project1?: string
  project2?: string
}

interface FileContent {
    path: string
    content: string
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

  let project1 = args.shift()
  let project2 = args.shift()

  return {
    subcommand: 'run',
    project1,
    project2,
  }
}

function printUsage(): void {
  console.log(
    'Usage: yarn compare-flat-sources <project1> <project2>',
  )
}

async function compareFlatSources(config: Config): Promise<void> {
  assert(config.project1, 'project1 is required')
  assert(config.project2, 'project2 is required')

  const project1Sources = await getFlatSources(config.project1)
  const project2Sources = await getFlatSources(config.project2)

  let matrix: Record<string, Record<string, string>> = {}

  for(const c1 of project1Sources) {
      let c1Object: Record<string, string> = {}

      for(const c2 of project2Sources) {
          const similarity = estimateSimilarity(c1.content, c2.content)
          c1Object[c2.path] = colorMap(similarity)
      }

      matrix[c1.path] = c1Object
  }

  printResult(config.project1, project1Sources, config.project2, project2Sources, matrix)
}

function printResult(
    project1Name: string,
    project1Sources: FileContent[],
    project2Name: string,
    project2Sources: FileContent[],
    matrix: Record<string, Record<string, string>>
): void {
    const aIds = removeCommonPath(project1Sources.map((source, i) => ({id: `A${i}`, path: source.path})))
    const bIds = removeCommonPath(project2Sources.map((source, i) => ({id: `B${i}`, path: source.path})))

    const header = ["IDs", ...bIds.map(({id}) => id)]
    const rows = Object.values(matrix).map((row, j) => [aIds[j].id, ...Object.values(row)])
    const table = printAsciiTable(header, rows)

    console.log(`= ${project1Name} `.padEnd(36, '='))
    console.log(aIds.map((e) => `${e.id} - ${e.path}`).join('\n'))
    console.log(`= ${project2Name} `.padEnd(36, '='))
    console.log(bIds.map((e) => `${e.id} - ${e.path}`).join('\n'))
    console.log("====================================\n")
    console.log(table)
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

async function getFlatSources(
  project: string,
): Promise<FileContent[]> {
    const path = `./discovery/${project}/ethereum/.flat/`

    const filePaths = await listFilesRecursively(path)
    const allFilesAreSol = filePaths.every((file) => file.endsWith('.sol'))
    assert(allFilesAreSol, 'All files should be .sol files')

    const contents: FileContent[] = []
    for(const filePath of filePaths.filter((file) => !file.endsWith('.p.sol'))) {
        const content = await readFile(filePath, 'utf-8')
        contents.push({ path: filePath, content })
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

function estimateSimilarity(lhs: string, rhs: string): number {
    const lhsChunks = buildSimilarityHashmap(lhs)
    const rhsChunks = buildSimilarityHashmap(rhs)

    let lhsIndex = 0
    let rhsIndex = 0
    let sourceCopied = 0

    while(true) {
        const lhsIsDone = lhsIndex === lhsChunks.length
        if(lhsIsDone) {
            break
        }

        while(rhsIndex < rhsChunks.length) {
            if(lhsChunks[lhsIndex].content <= rhsChunks[rhsIndex].content) {
                break
            }

            rhsIndex++
        }

        let lhsCount = lhsChunks[lhsIndex].length
        let rhsCount = 0

        if(rhsIndex < rhsChunks.length && lhsChunks[lhsIndex].content === rhsChunks[rhsIndex].content) {
            rhsCount = rhsChunks[rhsIndex].length
            rhsIndex++;
        }

        sourceCopied += Math.min(lhsCount, rhsCount);
        lhsIndex++;
    }

    return sourceCopied / Math.max(lhs.length, rhs.length)
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
