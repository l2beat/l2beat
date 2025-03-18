import path from 'path'
import type { DiscoveryPaths } from '@l2beat/discovery'
import type { CliLogger } from '@l2beat/shared'
import { keyInYN } from 'readline-sync'
import { powerdiff } from '../powerdiff'
import {
  computeComparisonBetweenProjects,
  computeStackSimilarity,
  decodeProjectPath,
  getMostSimilar,
} from './common'
import {
  colorMap,
  formatHeader,
  printComparisonBetweenProjects,
} from './output'

export interface FindSimilarCommand {
  projectPath: string
  forceTable: boolean
  paths: DiscoveryPaths
  logger: CliLogger
}

export async function executeFindSimilar(
  command: FindSimilarCommand,
): Promise<void> {
  const { name, chain } = decodeProjectPath(command.projectPath)

  const { matrix: perProjectMatrix } = await computeStackSimilarity(
    command.logger,
    command.paths,
  )
  const mostSimilar = getMostSimilar(perProjectMatrix)

  const { name: otherName, chain: otherChain, similarity } = mostSimilar[name]
  const { matrix, firstProject, secondProject } =
    await computeComparisonBetweenProjects(
      command.logger,
      command.projectPath,
      `${otherChain}:${otherName}`,
      command.paths,
    )

  printComparisonBetweenProjects(
    command.logger,
    matrix,
    firstProject,
    secondProject,
    command,
  )
  command.logger.logLine(formatHeader('Most similar to:'))
  command.logger.logLine(`${otherName} => ${name} @ ${colorMap(similarity)}`)

  if (similarity === 1) {
    command.logger.logLine('No need to run powerdiff, projects are identical')
    return
  }

  if (keyInYN('Run powerdiff?')) {
    const path1 = path.join(command.paths.discovery, name, chain, '.flat')
    const path2 = path.join(
      command.paths.discovery,
      otherName,
      otherChain,
      '.flat',
    )
    powerdiff(path1, path2)
  }
}
