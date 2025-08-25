import type { Logger } from '@l2beat/backend-tools'
import {
  type DiscoveryPaths,
  estimateSimilarity,
  type HashedFileContent,
} from '@l2beat/discovery'
import { assert } from '@l2beat/shared-pure'
import path from 'path'
import { computeStackSimilarity, type Project } from './common'
import { colorMap } from './output'

export interface CompareSourceOnSourceCommand {
  projectPath: string
  paths: DiscoveryPaths
  forceTable: boolean
  logger: Logger
}

export async function executeCompareSourceOnSource(
  command: CompareSourceOnSourceCommand,
): Promise<void> {
  const name = command.projectPath
  const { projects: projectsWithBase } = await computeStackSimilarity(
    command.logger,
    command.paths,
  )
  const base = projectsWithBase.find((e) => e.name === name)
  assert(base !== undefined, 'Project not found')
  const projects = projectsWithBase.filter((e) => e.name !== name)
  for (const source of base.sources) {
    const mostSimilar = findMostSimilarContract(source, projects)
    command.logger.info(`${path.basename(source.path)}`)
    for (const [i, e] of mostSimilar.entries()) {
      const prefix = i === mostSimilar.length - 1 ? '└─' : '├─'
      command.logger.info(
        `${prefix} [${colorMap(e.similarity)}] ${
          e.projectName
        }:${path.basename(e.path)}`,
      )
    }
  }
}

interface ResultEntry {
  projectName: string
  similarity: number
  path: string
}

function findMostSimilarContract(
  source: HashedFileContent,
  projects: Project[],
): ResultEntry[] {
  const result: ResultEntry[] = []
  for (const project of projects) {
    for (const entry of project.sources) {
      const similarity = estimateSimilarity(entry, source)
      result.push({
        projectName: project.name,
        similarity,
        path: entry.path,
      })
    }
  }

  const sorted = result.sort((a, b) => {
    return b.similarity - a.similarity
  })

  const highestSimilarity = sorted[0].similarity

  return sorted.filter((e) => e.similarity === highestSimilarity)
}
