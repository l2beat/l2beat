import type { DiscoveryPaths } from '@l2beat/discovery'
import type { CliLogger } from '../common/CliLogger'
import {
  computeComparisonBetweenProjects,
  computeStackSimilarity,
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
  cli: CliLogger
}

export async function executeFindSimilar(
  command: FindSimilarCommand,
): Promise<void> {
  const name = command.projectPath

  const { matrix: perProjectMatrix } = await computeStackSimilarity(
    command.cli,
    command.paths,
  )
  const mostSimilar = getMostSimilar(perProjectMatrix)

  const { name: otherName, similarity } = mostSimilar[name]
  const { matrix, firstProject, secondProject } =
    await computeComparisonBetweenProjects(
      command.cli,
      command.projectPath,
      otherName,
      command.paths,
    )

  printComparisonBetweenProjects(
    command.cli,
    matrix,
    firstProject,
    secondProject,
    command,
  )
  command.cli.log(formatHeader('Most similar to:'))
  command.cli.log(`${otherName} => ${name} @ ${colorMap(similarity)}`)
}
