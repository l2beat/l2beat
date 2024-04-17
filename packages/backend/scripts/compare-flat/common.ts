import { assert } from '@l2beat/backend-tools'
import {
  Layer2Provider,
  layer2s,
  Layer3Provider,
  layer3s,
} from '@l2beat/config'
import chalk from 'chalk'
import { readdir, readFile } from 'fs/promises'
import { resolve } from 'path'

import { formatHeader } from './output'

export const ALL_CONFIGS = [...layer2s, ...layer3s]

interface HashedFileContent {
  path: string
  hashChunks: HashedChunks[]
  content: string
}

export interface Project {
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

export function needsToBe(
  expression: boolean,
  message: string,
): asserts expression {
  if (!expression) {
    console.log(`${chalk.red('ERROR')}: ${message}`)
    process.exit(1)
  }
}

export async function computeStackSimilarity(
  stack: Layer2Provider | Layer3Provider,
): Promise<{
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

export function getMostSimilar(
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

export async function computeComparisonBetweenProjects(
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

export function transpose(input: string[][]): string[][] {
  return input[0].map((_, i) => input.map((row) => row[i]))
}

export function removeCommonPath(fileIds: FileId[]): FileId[] {
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

export function estimateSimilarity(
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

function encodeProjectPath(name: string, chain: string): string {
  return `${chain}:${name}`
}

export function decodeProjectPath(projectPath: string): {
  name: string
  chain: string
} {
  if (!projectPath.includes(':')) {
    return { name: projectPath, chain: 'ethereum' }
  }

  const [chain, name] = projectPath.split(':')
  return { name, chain }
}
