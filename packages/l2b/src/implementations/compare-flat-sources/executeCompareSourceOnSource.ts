import path from 'path'
import {
  type DiscoveryPaths,
  type HashedFileContent,
  estimateSimilarity,
} from '@l2beat/discovery'
import type { CliLogger } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import {
  type Project,
  computeStackSimilarity,
  decodeProjectPath,
} from './common'
import { colorMap } from './output'

export interface CompareSourceOnSourceCommand {
  projectPath: string
  paths: DiscoveryPaths
  forceTable: boolean
  logger: CliLogger
}

export async function executeCompareSourceOnSource(
  command: CompareSourceOnSourceCommand,
): Promise<void> {
  const { name, chain } = decodeProjectPath(command.projectPath)
  const { projects: projectsWithBase } = await computeStackSimilarity(
    command.logger,
    command.paths,
  )
  const base = projectsWithBase.find(
    (e) => e.name === name && e.chain === chain,
  )
  assert(base !== undefined, 'Project not found')
  const projects = projectsWithBase.filter(
    (e) => e.name !== name || e.chain !== chain,
  )
  for (const source of base.sources) {
    const mostSimmilar = findMostSimmilarContract(source, projects)
    command.logger.logLine(`${path.basename(source.path)}`)
    for (const [i, e] of mostSimmilar.entries()) {
      const prefix = i === mostSimmilar.length - 1 ? `└─` : `├─`
      command.logger.logLine(
        `${prefix} [${colorMap(e.similarity)}] in ${e.chain}:${
          e.projectName
        }:${path.basename(e.path)}`,
      )
    }
  }
}

interface ResultEntry {
  projectName: string
  chain: string
  similarity: number
  path: string
}

function findMostSimmilarContract(
  source: HashedFileContent,
  projects: Project[],
): ResultEntry[] {
  const result: ResultEntry[] = []
  for (const project of projects) {
    for (const entry of project.sources) {
      const similarity = estimateSimilarity(entry, source)
      result.push({
        projectName: project.name,
        chain: project.chain,
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
