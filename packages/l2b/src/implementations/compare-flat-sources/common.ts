import type { Logger } from '@l2beat/backend-tools'
import {
  buildSimilarityHashmap,
  ConfigReader,
  type DiscoveryPaths,
  estimateSimilarity,
  format,
  type HashedFileContent,
} from '@l2beat/discovery'
import { assert } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'

export interface Project {
  name: string
  concatenatedSource: HashedFileContent
  sources: HashedFileContent[]
}

interface FileId {
  id: string
  path: string
}

export async function computeStackSimilarity(
  logger: Logger,
  paths: DiscoveryPaths,
): Promise<{
  matrix: Record<string, Record<string, number>>
  projects: Project[]
}> {
  const configReader = new ConfigReader(paths.discovery)
  const configs = configReader
    .readAllDiscoveredProjects()
    .flatMap((project) => configReader.readConfig(project))

  const stackProject = await Promise.all(
    configs.flatMap((config) => readProject(logger, config.name, paths)),
  )
  const projects = stackProject.filter((p) => p !== undefined) as Project[]

  const matrix: Record<string, Record<string, number>> = {}
  for (let row = 0; row < projects.length; row++) {
    const p1 = projects[row]
    const path1 = p1.name

    matrix[path1] ??= {}
    matrix[path1][path1] = 1
    for (let col = row + 1; col < projects.length; col++) {
      const p2 = projects[col]
      const path2 = p2.name

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
  similarity: number
}

export function getMostSimilar(
  matrix: Record<string, Record<string, number>>,
): Record<string, Similarity> {
  const mostSimilar: Record<string, Similarity> = {}

  for (const [p1Path, row] of Object.entries(matrix)) {
    for (const [p2Path, similarity] of Object.entries(row)) {
      if (p1Path !== p2Path) {
        if (
          mostSimilar[p1Path] === undefined ||
          similarity > mostSimilar[p1Path].similarity
        ) {
          mostSimilar[p1Path] = {
            name: p2Path,
            similarity,
          }
        }
      }
    }
  }

  return mostSimilar
}

export async function computeComparisonBetweenProjects(
  logger: Logger,
  firstProjectPath: string,
  secondProjectPath: string,
  paths: DiscoveryPaths,
): Promise<{
  matrix: Record<string, Record<string, number>>
  firstProject: Project
  secondProject: Project
}> {
  const firstProject = await readProject(logger, firstProjectPath, paths)
  const secondProject = await readProject(logger, secondProjectPath, paths)
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
  logger: Logger,
  projectName: string,
  paths: DiscoveryPaths,
): Promise<Project | undefined> {
  try {
    const sources = await getFlatSources(projectName, paths)
    const concatenatedSources = sources.map((source) => source.content).join('')
    const concatenatedSourceHashChunks =
      buildSimilarityHashmap(concatenatedSources)
    return {
      name: projectName,
      concatenatedSource: {
        path: 'virtualPath.sol',
        hashChunks: concatenatedSourceHashChunks,
        content: concatenatedSources,
      },
      sources,
    }
  } catch {
    logger.info(
      `[${chalk.red('FAIL')}] Reading ${projectName} - ${chalk.magenta(
        'run discovery to generate flat files',
      )}`,
    )
  }
}

async function getFlatSources(
  project: string,
  paths: DiscoveryPaths,
): Promise<HashedFileContent[]> {
  const configReader = new ConfigReader(paths.discovery)
  const basePath = configReader.getProjectPath(project)
  const path = join(basePath, '.flat')

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
      const resolved = join(path, entry.name)
      return entry.isDirectory() ? listFilesRecursively(resolved) : resolved
    }),
  )

  return files.flat()
}
