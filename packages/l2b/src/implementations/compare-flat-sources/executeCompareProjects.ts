import type { Logger } from '@l2beat/backend-tools'
import type { DiscoveryPaths } from '@l2beat/discovery'
import { computeComparisonBetweenProjects } from './common'
import { printComparisonBetweenProjects } from './output'

export interface CompareProjectsCommand {
  firstProjectPath: string
  secondProjectPath: string
  forceTable: boolean
  paths: DiscoveryPaths
  logger: Logger
}

export async function executeCompareProjects(
  command: CompareProjectsCommand,
): Promise<void> {
  const { matrix, firstProject, secondProject } =
    await computeComparisonBetweenProjects(
      command.logger,
      command.firstProjectPath,
      command.secondProjectPath,
      command.paths,
    )

  printComparisonBetweenProjects(
    command.logger,
    matrix,
    firstProject,
    secondProject,
    {
      forceTable: command.forceTable,
    },
  )
}
