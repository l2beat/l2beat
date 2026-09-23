import type { DiscoveryPaths } from '@l2beat/discovery'
import type { CliLogger } from '../common/CliLogger'
import { computeComparisonBetweenProjects } from './common'
import { printComparisonBetweenProjects } from './output'

export interface CompareProjectsCommand {
  firstProjectPath: string
  secondProjectPath: string
  forceTable: boolean
  paths: DiscoveryPaths
  cli: CliLogger
}

export async function executeCompareProjects(
  command: CompareProjectsCommand,
): Promise<void> {
  const { matrix, firstProject, secondProject } =
    await computeComparisonBetweenProjects(
      command.cli,
      command.firstProjectPath,
      command.secondProjectPath,
      command.paths,
    )

  printComparisonBetweenProjects(
    command.cli,
    matrix,
    firstProject,
    secondProject,
    {
      forceTable: command.forceTable,
    },
  )
}
