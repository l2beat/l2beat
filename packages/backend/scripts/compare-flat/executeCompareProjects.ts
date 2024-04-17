import { CompareProjectsCommand } from './cli'
import { computeComparisonBetweenProjects } from './common'
import { printComparisonBetweenProjects } from './output'

export async function executeCompareProjects(
  command: CompareProjectsCommand,
): Promise<void> {
  const { matrix, firstProject, secondProject } =
    await computeComparisonBetweenProjects(
      command.firstProjectPath,
      command.secondProjectPath,
    )

  printComparisonBetweenProjects(matrix, firstProject, secondProject, {
    forceTable: command.forceTable,
  })
}
