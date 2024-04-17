import { assert } from '@l2beat/backend-tools'
import { Layer2, layer2s, Layer3, layer3s } from '@l2beat/config'
import chalk from 'chalk'
import { readdir, readFile } from 'fs/promises'
import path, { resolve } from 'path'
import { keyInYN } from 'readline-sync'

import { printAsciiTable } from '../src/tools/printAsciiTable'
import { powerdiff } from './powerdiffCore'

type ShortStackKey =
  | 'arbitrum'
  | 'loopring'
  | 'opstack'
  | 'ovm'
  | 'polygon'
  | 'starkex'
  | 'starknet'
  | 'zks'
  | 'zksync'

type LongStackKey =
  | Layer2['display']['provider']
  | Layer3['display']['provider']

const shortStackToFullName: Record<ShortStackKey, LongStackKey> = {
  arbitrum: 'Arbitrum',
  loopring: 'Loopring',
  opstack: 'OP Stack',
  ovm: 'OVM',
  polygon: 'Polygon',
  starkex: 'StarkEx',
  starknet: 'Starknet',
  zks: 'ZK Stack',
  zksync: 'zkSync Lite',
}

const allShortStacks = Object.keys(shortStackToFullName)
const ALL_CONFIGS = [...layer2s, ...layer3s]

interface AllConfig {
  subcommand: 'all'
  stack: ShortStackKey
  forceTable: boolean
}

interface SimilarConfig {
  subcommand: 'similar'
  projectPath: string
  forceTable: boolean
}

interface ProjectConfig {
  subcommand: 'project'
  firstProjectPath: string
  secondProjectPath: string
  forceTable: boolean
}

type ForceTableConfig = AllConfig | SimilarConfig | ProjectConfig

interface HelpConfig {
  subcommand: 'help'
}

type Config = ForceTableConfig | HelpConfig

interface HashedFileContent {
  path: string
  hashChunks: HashedChunks[]
  content: string
}

interface Project {
  name: string
  chain: string
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
    case 'similar':
      await findMostSimilarProject(config)
      break
    case 'project':
      await compareTwoProjects(config)
      break
    case 'all':
      await compareAllProjects(config)
      break
  }
}

function parseCliParameters(): Config {
  const args = process.argv.slice(2)

  if (args.includes('--help') || args.includes('-h')) {
    return { subcommand: 'help' }
  }

  const mode = args.shift()
  if (mode === 'all') {
    const stack = args.shift()
    needsToBe(
      stack !== undefined,
      `You need to provide a stack, choose from ${allShortStacks.join(', ')}`,
    )
    needsToBe(
      stack in shortStackToFullName,
      'Invalid stack chosen, choose from ' + allShortStacks.join(', '),
    )

    let forceTable = false
    if (args.includes('--force-table')) {
      forceTable = true
    }

    return {
      subcommand: 'all',
      forceTable,
      stack: stack as ShortStackKey,
    }
  } else if (mode === 'similar') {
    const projectPath = args.shift()
    needsToBe(
      projectPath !== undefined,
      'You need to provide a project path in the format chain:name',
    )

    let forceTable = false
    if (args.includes('--force-table')) {
      forceTable = true
    }

    return {
      subcommand: 'similar',
      forceTable,
      projectPath,
    }
  } else if (mode === 'project') {
    const firstProjectPath = args.shift()
    const secondProjectPath = args.shift()
    needsToBe(
      firstProjectPath !== undefined,
      'You need to provide the first project path in the format chain:name',
    )
    needsToBe(
      secondProjectPath !== undefined,
      'You need to provide the second project path in the format chain:name',
    )

    let forceTable = false
    if (args.includes('--force-table')) {
      forceTable = true
    }

    return {
      subcommand: 'project',
      firstProjectPath,
      secondProjectPath,
      forceTable,
    }
  } else {
    console.log('Invalid mode, expected "project" or "all"')
    return { subcommand: 'help' }
  }
}

function printUsage(): void {
  console.log(
    [
      'yarn compare-flat-sources all <stackType> ........................... Compare all projects of a given stack',
      'yarn compare-flat-sources similar <chain:project> ................... Compare project, find the most similar and diff it with powerdiff',
      'yarn compare-flat-sources project <chain:project> <chain:project> ... Compare two projects, file by file',
      'yarn compare-flat-sources help ...................................... Print this usage',
    ]
      .map((s) => chalk.yellow(s))
      .join('\n'),
  )
}

async function compareAllProjects(config: AllConfig): Promise<void> {
  const stack = config.stack
  assert(stack !== undefined, 'stack is required')

  const { matrix, projects } = await computeStackSimilarity(
    shortStackToFullName[stack],
  )
  const mostSimilar = getMostSimilar(matrix)

  const table = formatTable(
    config,
    projects.map((p) => p.name),
    projects.map((p) => p.name),
    matrix,
  )

  if (table) {
    console.log(formatHeader('Comparison matrix'))
    console.log(table)
  }

  console.log(formatHeader('Most similar projects'))
  const longestName = Math.max(
    ...Object.keys(mostSimilar).map((name) => name.length),
  )
  for (const [name, { name: similarName, similarity }] of Object.entries(
    mostSimilar,
  )) {
    console.log(
      `${name.padStart(longestName)} => ${similarName.padEnd(
        longestName,
      )} @ ${colorMap(similarity)}`,
    )
  }
}

async function computeStackSimilarity(stack: LongStackKey): Promise<{
  matrix: Record<string, Record<string, number>>
  projects: Project[]
}> {
  const configs = ALL_CONFIGS.filter(
    (config) =>
      config.display.provider === stack &&
      ('isArchived' in config ? !config.isArchived : true) &&
      ('hostChain' in config ? config.hostChain !== 'Multiple' : true) &&
      !config.isUpcoming,
  )

  console.log(formatHeader('Reading projects'))
  const stackProject = await Promise.all(
    configs.map((config) =>
      readProject(
        config.id.toString(),
        'hostChain' in config ? config.hostChain : 'ethereum',
      ),
    ),
  )
  const projects = stackProject.filter((p) => p !== undefined) as Project[]

  const matrix: Record<string, Record<string, number>> = {}

  for (const p1 of projects) {
    const c1Object: Record<string, number> = {}

    for (const p2 of projects) {
      const similarity = estimateSimilarity(
        p1.concatenatedSource,
        p2.concatenatedSource,
      )
      c1Object[encodeProjectPath(p2.name, p2.chain)] = similarity
    }

    matrix[encodeProjectPath(p1.name, p1.chain)] = c1Object
  }

  return { matrix, projects }
}

interface Similarity {
  name: string
  chain: string
  similarity: number
}

function getMostSimilar(
  matrix: Record<string, Record<string, number>>,
): Record<string, Similarity> {
  const mostSimilar: Record<string, Similarity> = {}

  for (const [p1Path, row] of Object.entries(matrix)) {
    for (const [p2Path, similarity] of Object.entries(row)) {
      if (p1Path !== p2Path) {
        const { name: p1Name } = decodeProjectPath(p1Path)
        if (
          mostSimilar[p1Name] === undefined ||
          similarity > mostSimilar[p1Name].similarity
        ) {
          const { name: p2Name, chain: p2Chain } = decodeProjectPath(p2Path)
          mostSimilar[p1Name] = {
            name: p2Name,
            chain: p2Chain,
            similarity,
          }
        }
      }
    }
  }

  return mostSimilar
}

async function findMostSimilarProject(config: SimilarConfig): Promise<void> {
  const { name, chain } = decodeProjectPath(config.projectPath)

  const projects = ALL_CONFIGS.filter((p) => p.id.toString() === name)
  needsToBe(
    projects.length <= 1,
    `More than one project found matching ${
      config.projectPath
    } ${projects.toString()}`,
  )
  needsToBe(
    projects.length === 1,
    `No project found matching ${config.projectPath}`,
  )
  const project = projects[0]

  const { matrix: perProjectMatrix } = await computeStackSimilarity(
    project.display.provider,
  )
  const mostSimilar = getMostSimilar(perProjectMatrix)

  const {
    name: otherName,
    chain: otherChain,
    similarity,
  } = mostSimilar[project.id.toString()]
  const { matrix, firstProject, secondProject } =
    await computeComparisonBetweenProjects(
      config.projectPath,
      `${otherChain}:${otherName}`,
    )

  printComparisonBetweenProjects(matrix, firstProject, secondProject, config)
  console.log(formatHeader('Most similar to:'))
  console.log(`${otherName} => ${name} @ ${colorMap(similarity)}`)

  if(similarity === 1) {
    console.log('No need to run powerdiff, projects are identical')
    return
  }

  if (keyInYN('Run powerdiff?')) {
    const path1 = path.join('discovery', name, chain, '.flat')
    const path2 = path.join('discovery', otherName, otherChain, '.flat')
    powerdiff(path1, path2)
  }
}

async function compareTwoProjects(config: ProjectConfig): Promise<void> {
  const { matrix, firstProject, secondProject } =
    await computeComparisonBetweenProjects(
      config.firstProjectPath,
      config.secondProjectPath,
    )

  printComparisonBetweenProjects(matrix, firstProject, secondProject, config)
}

async function computeComparisonBetweenProjects(
  firstProjectPath: string,
  secondProjectPath: string,
): Promise<{
  matrix: Record<string, Record<string, number>>
  firstProject: Project
  secondProject: Project
}> {
  const { name: firstProjectName, chain: firstProjectChain } =
    decodeProjectPath(firstProjectPath)
  const { name: secondProjectName, chain: secondProjectChain } =
    decodeProjectPath(secondProjectPath)

  const firstProject = await readProject(firstProjectName, firstProjectChain)
  const secondProject = await readProject(secondProjectName, secondProjectChain)
  assert(firstProject, `Project ${firstProjectPath} not found`)
  assert(secondProject, `Project ${secondProjectPath} not found`)

  const matrix: Record<string, Record<string, number>> = {}

  for (const c1 of firstProject.sources) {
    const c1Object: Record<string, number> = {}

    for (const c2 of secondProject.sources) {
      c1Object[c2.path] = estimateSimilarity(c1, c2)
    }

    matrix[c1.path] = c1Object
  }

  return {
    matrix,
    firstProject,
    secondProject,
  }
}

function printComparisonBetweenProjects(
  matrix: Record<string, Record<string, number>>,
  firstProject: Project,
  secondProject: Project,
  config: ForceTableConfig,
): void {
  const aIds = removeCommonPath(
    firstProject.sources.map((source, i) => ({
      id: `A${i}`,
      path: source.path,
    })),
  )
  const bIds = removeCommonPath(
    secondProject.sources.map((source, i) => ({
      id: `B${i}`,
      path: source.path,
    })),
  )

  const table = formatTable(
    config,
    aIds.map((a) => a.id),
    bIds.map((a) => a.id),
    matrix,
  )

  if (table) {
    console.log(formatHeader(firstProject.name))
    console.log(aIds.map((e) => `${e.id} - ${e.path}`).join('\n'))
    console.log(formatHeader(secondProject.name))
    console.log(bIds.map((e) => `${e.id} - ${e.path}`).join('\n'))
    console.log('====================================\n')
    console.log(table)
  }

  const concatenatedSimilarity = estimateSimilarity(
    firstProject.concatenatedSource,
    secondProject.concatenatedSource,
  )
  console.log(
    `\nEstimated similarity between two projects: ${colorMap(
      concatenatedSimilarity,
    )}`,
  )
}

function formatHeader(title: string): string {
  return `= ${title} `.padEnd(36, '=')
}

function formatTable(
  config: ForceTableConfig,
  aIDs: string[],
  bIDs: string[],
  matrix: Record<string, Record<string, number>>,
): string | undefined {
  const terminalWidth = process.stdout.columns

  const widths = [computeTableWidth(aIDs), computeTableWidth(bIDs)]
  const minTableWidth = Math.min(...widths)

  if (minTableWidth > terminalWidth && !config.forceTable) {
    console.log(
      [
        `${chalk.yellow('WARNING')}: Table is too wide to fit in the terminal`,
        `Terminal is ${terminalWidth} characters wide, table is ${minTableWidth} characters wide`,
        `Use ${chalk.magenta('--force-table')} to print the table anyway.`,
      ].join('\n'),
    )
    return
  }

  const shouldTranspose = widths[0] < widths[1]
  const header = ['IDs', ...(shouldTranspose ? aIDs : bIDs)]
  let rows = Object.values(matrix).map((row) =>
    Object.values(row).map(colorMap),
  )

  if (shouldTranspose) {
    rows = transpose(rows)
  }

  for (const [i, row] of rows.entries()) {
    row.unshift(shouldTranspose ? bIDs[i] : aIDs[i])
  }

  return printAsciiTable(header, rows)
}

function transpose(input: string[][]): string[][] {
  return input[0].map((_, i) => input.map((row) => row[i]))
}

function computeTableWidth(headerColumns: string[]): number {
  const overhead = 5 + headerColumns.length + 2
  const columnWidths = headerColumns.map(
    (column) => Math.max(column.length, 4) + 2,
  )
  const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0)
  return totalWidth + overhead
}

function removeCommonPath(fileIds: FileId[]): FileId[] {
  const findCommonPath = (array: string[]) => {
    if (array.length === 0) return ''

    let prefix = array[0]
    for (let i = 1; i < array.length; i++) {
      while (array[i].indexOf(prefix) !== 0) {
        prefix = prefix.substring(0, prefix.length - 1)
        if (prefix === '') return ''
      }
    }
    return prefix
  }

  const commonPath = findCommonPath(fileIds.map((fileId) => fileId.path))
  return fileIds.map((fileId) => ({
    id: fileId.id,
    path: fileId.path.substring(commonPath.length),
  }))
}

async function readProject(
  projectName: string,
  chain: string,
): Promise<Project | undefined> {
  try {
    const sources = await getFlatSources(projectName, chain)
    const concatenatedSources = sources.map((source) => source.content).join('')
    const concatenatedSourceHashChunks =
      buildSimilarityHashmap(concatenatedSources)
    console.log(`[ OK ] Reading ${projectName}`)
    return {
      name: projectName,
      chain,
      concatenatedSource: {
        path: `virtualPath.sol`,
        hashChunks: concatenatedSourceHashChunks,
        content: concatenatedSources,
      },
      sources,
    }
  } catch (e) {
    console.log(
      `[${chalk.red('FAIL')}] Reading ${projectName} - ${chalk.magenta(
        'run discovery to generate flat files',
      )}`,
    )
  }
}

function removeComments(source: string): string {
  let result = ''
  let isInSingleLineComment = false
  let isInMultiLineComment = false

  for (let i = 0; i < source.length; i++) {
    if (isInSingleLineComment && source[i] === '\n') {
      isInSingleLineComment = false
      result += source[i] // Keep newline characters
    } else if (
      isInMultiLineComment &&
      source[i] === '*' &&
      source[i + 1] === '/'
    ) {
      isInMultiLineComment = false
      i++ // Skip the '/'
    } else if (
      !isInMultiLineComment &&
      source[i] === '/' &&
      source[i + 1] === '/'
    ) {
      isInSingleLineComment = true
      i++ // Skip the second '/'
    } else if (
      !isInSingleLineComment &&
      source[i] === '/' &&
      source[i + 1] === '*'
    ) {
      isInMultiLineComment = true
      i++ // Skip the '*'
    } else if (!isInSingleLineComment && !isInMultiLineComment) {
      result += source[i]
    }
  }

  return result
}

async function getFlatSources(
  project: string,
  chain: string,
): Promise<HashedFileContent[]> {
  const path = `./discovery/${project}/${chain}/.flat/`

  const filePaths = await listFilesRecursively(path)
  const allFilesAreSol = filePaths.every((file) => file.endsWith('.sol'))
  assert(allFilesAreSol, 'All files should be .sol files')

  const contents: HashedFileContent[] = []
  for (const filePath of filePaths.filter((file) => !file.endsWith('.p.sol'))) {
    const rawContent = await readFile(filePath, 'utf-8')
    const content = removeComments(rawContent)

    contents.push({
      path: filePath,
      hashChunks: buildSimilarityHashmap(content),
      content,
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

function estimateSimilarity(
  lhs: HashedFileContent,
  rhs: HashedFileContent,
): number {
  let lhsIndex = 0
  let rhsIndex = 0
  let sourceCopied = 0

  while (true) {
    const lhsIsDone = lhsIndex === lhs.hashChunks.length
    if (lhsIsDone) {
      break
    }

    while (rhsIndex < rhs.hashChunks.length) {
      if (
        lhs.hashChunks[lhsIndex].content <= rhs.hashChunks[rhsIndex].content
      ) {
        break
      }

      rhsIndex++
    }

    const lhsCount = lhs.hashChunks[lhsIndex].length
    let rhsCount = 0

    if (
      rhsIndex < rhs.hashChunks.length &&
      lhs.hashChunks[lhsIndex].content === rhs.hashChunks[rhsIndex].content
    ) {
      rhsCount = rhs.hashChunks[rhsIndex].length
      rhsIndex++
    }

    sourceCopied += Math.min(lhsCount, rhsCount)
    lhsIndex++
  }

  return sourceCopied / Math.max(lhs.content.length, rhs.content.length)
}

function buildSimilarityHashmap(input: string): HashedChunks[] {
  const lines = splitLineKeepingNewlines(input)

  const stringChunks = lines.flatMap((line) => {
    const result = []
    for (let i = 0; i < line.length; i += 64) {
      result.push(line.slice(i, i + 64))
    }
    return result
  })

  checkIfLineCountIsCorrect(input, lines)

  const map = new Map<string, number>()

  for (const stringChunk of stringChunks) {
    const element = map.get(stringChunk)

    if (element !== undefined) {
      map.set(stringChunk, element + stringChunk.length)
    } else {
      map.set(stringChunk, stringChunk.length)
    }
  }

  // Transform that map to an array of Chunk objects
  const chunks: HashedChunks[] = Array.from(map).map(([content, length]) => ({
    content,
    length,
  }))
  // Sort alphabetically by content
  chunks.sort((lhs, rhs) => lhs.content.localeCompare(rhs.content))

  return chunks
}

function checkIfLineCountIsCorrect(input: string, lines: string[]): void {
  const inputLines = input.split('\n')
  if (inputLines.at(-1) === '') {
    inputLines.pop()
  }
  const inputLineCount = inputLines.length
  const linesLineCount = lines.length

  if (inputLineCount !== linesLineCount) {
    throw new Error(
      `Line count mismatch: ${inputLineCount} vs ${linesLineCount}`,
    )
  }
}

function splitLineKeepingNewlines(input: string): string[] {
  const lines = []
  let start = 0

  for (let i = 0; i < input.length; i++) {
    if (input[i] === '\n') {
      const part = input.substring(start, i + 1)
      lines.push(part)
      start = i + 1
    }
  }

  if (start < input.length) {
    lines.push(input.substring(start))
  }

  return lines
}

function colorMap(value: number): string {
  const valueString = value.toFixed(2)

  if (value < 0.125) {
    return chalk.grey(valueString)
  } else if (value < 0.25) {
    return chalk.red(valueString)
  } else if (value < 0.375) {
    return chalk.redBright(valueString)
  } else if (value < 0.5) {
    return chalk.magenta(valueString)
  } else if (value < 0.625) {
    return chalk.magentaBright(valueString)
  } else if (value < 0.75) {
    return chalk.yellow(valueString)
  } else if (value < 0.875) {
    return chalk.yellowBright(valueString)
  } else {
    return chalk.greenBright(valueString)
  }
}

function needsToBe(expression: boolean, message: string): asserts expression {
  if (!expression) {
    console.log(`${chalk.red('ERROR')}: ${message}`)
    process.exit(1)
  }
}

function encodeProjectPath(name: string, chain: string): string {
  return `${chain}:${name}`
}

function decodeProjectPath(projectPath: string): {
  name: string
  chain: string
} {
  if (!projectPath.includes(':')) {
    return { name: projectPath, chain: 'ethereum' }
  }

  const [chain, name] = projectPath.split(':')
  return { name, chain }
}
