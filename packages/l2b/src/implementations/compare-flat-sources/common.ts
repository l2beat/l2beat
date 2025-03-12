import { join, resolve } from 'path'
import {
  ConfigReader,
  type DiscoveryPaths,
  type HashedFileContent,
  buildSimilarityHashmap,
  estimateSimilarity,
  format,
} from '@l2beat/discovery'
import type { CliLogger } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { readFile, readdir } from 'fs/promises'

export interface Project {
  name: string
  chain: string
  concatenatedSource: HashedFileContent
  sources: HashedFileContent[]
}

interface FileId {
  id: string
  path: string
}

export async function computeStackSimilarity(
  logger: CliLogger,
  paths: DiscoveryPaths,
): Promise<{
  matrix: Record<string, Record<string, number>>
  projects: Project[]
}> {
  const configReader = new ConfigReader(paths.discovery)
  const configs = configReader.readAllConfigs()

  const stackProject = await Promise.all(
    configs.map((config) =>
      readProject(logger, config.name, config.chain, paths),
    ),
  )
  const projects = stackProject.filter((p) => p !== undefined) as Project[]

  const matrix: Record<string, Record<string, number>> = {}
  for (let row = 0; row < projects.length; row++) {
    const p1 = projects[row]
    const path1 = encodeProjectPath(p1.name, p1.chain)

    matrix[path1] ??= {}
    matrix[path1][path1] = 1
    for (let col = row + 1; col < projects.length; col++) {
      const p2 = projects[col]
      const path2 = encodeProjectPath(p2.name, p2.chain)

      const similarity = estimateSimilarity(
        p1.concatenatedSource,
        p2.concatenatedSource,
      )

      matrix[path2] ??= {}
      matrix[path1][path2] = similarity
      matrix[path2][path1] = similarity
    }
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
  logger: CliLogger,
  firstProjectPath: string,
  secondProjectPath: string,
  paths: DiscoveryPaths,
): Promise<{
  matrix: Record<string, Record<string, number>>
  firstProject: Project
  secondProject: Project
}> {
  const { name: firstProjectName, chain: firstProjectChain } =
    decodeProjectPath(firstProjectPath)
  const { name: secondProjectName, chain: secondProjectChain } =
    decodeProjectPath(secondProjectPath)

  const firstProject = await readProject(
    logger,
    firstProjectName,
    firstProjectChain,
    paths,
  )
  const secondProject = await readProject(
    logger,
    secondProjectName,
    secondProjectChain,
    paths,
  )
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
  logger: CliLogger,
  projectName: string,
  chain: string,
  paths: DiscoveryPaths,
): Promise<Project | undefined> {
  try {
    const sources = await getFlatSources(projectName, chain, paths)
    const concatenatedSources = sources.map((source) => source.content).join('')
    const concatenatedSourceHashChunks =
      buildSimilarityHashmap(concatenatedSources)
    logger.updateStatus('readProject', `[ OK ] Reading ${projectName}`)
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
  } catch {
    logger.logLine(
      `[${chalk.red('FAIL')}] Reading ${projectName} - ${chalk.magenta(
        'run discovery to generate flat files',
      )}`,
    )
  }
}

async function getFlatSources(
  project: string,
  chain: string,
  paths: DiscoveryPaths,
): Promise<HashedFileContent[]> {
  const path = join(paths.discovery, project, chain, '.flat')

  const filePaths = await listFilesRecursively(path)
  const allFilesAreSol = filePaths.every((file) => file.endsWith('.sol'))
  assert(allFilesAreSol, 'All files should be .sol files')

  const contents: HashedFileContent[] = []
  for (const filePath of filesToCompare(filePaths)) {
    const rawContent = await readFile(filePath, 'utf-8')
    const content = format(rawContent)

    contents.push({
      path: filePath,
      hashChunks: buildSimilarityHashmap(content),
      content,
    })
  }

  return contents
}

function filesToCompare(paths: string[]): string[] {
  return paths.filter(
    (file) => !file.endsWith('.p.sol') && !file.endsWith('GnosisSafe.sol'),
  )
}

export async function listFilesRecursively(path: string): Promise<string[]> {
  const entries = await readdir(path, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const resolved = resolve(path, entry.name)
      return entry.isDirectory() ? listFilesRecursively(resolved) : resolved
    }),
  )

  return files.flat()
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
