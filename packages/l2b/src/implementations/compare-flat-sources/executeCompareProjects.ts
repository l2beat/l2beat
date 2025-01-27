import type { CliLogger } from '@l2beat/shared'
import { computeComparisonBetweenProjects } from './common'
import { printComparisonBetweenProjects } from './output'

export interface CompareProjectsCommand {
  firstProjectPath: string
  secondProjectPath: string
  forceTable: boolean
  discoveryPath: string
  logger: CliLogger
}

export async function executeCompareProjects(
  command: CompareProjectsCommand,
): Promise<void> {
  const { matrix, firstProject, secondProject } =
    await computeComparisonBetweenProjects(
      command.logger,
      command.firstProjectPath,
      command.secondProjectPath,
      command.discoveryPath,
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
