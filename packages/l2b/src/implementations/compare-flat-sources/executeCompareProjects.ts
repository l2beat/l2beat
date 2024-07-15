import { computeComparisonBetweenProjects } from './common'
import { printComparisonBetweenProjects } from './output'

export interface CompareProjectsCommand {
  firstProjectPath: string
  secondProjectPath: string
  forceTable: boolean
  discoveryPath: string
}

export async function executeCompareProjects(
  command: CompareProjectsCommand,
): Promise<void> {
  const { matrix, firstProject, secondProject } =
    await computeComparisonBetweenProjects(
      command.firstProjectPath,
      command.secondProjectPath,
      command.discoveryPath,
    )

  printComparisonBetweenProjects(matrix, firstProject, secondProject, {
    forceTable: command.forceTable,
  })
}
