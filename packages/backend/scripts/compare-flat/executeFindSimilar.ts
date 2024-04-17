import path from 'path'
import { keyInYN } from 'readline-sync'

import { powerdiff } from '../powerdiffCore'
import { FindSimilarCommand } from './cli'
import {
  ALL_CONFIGS,
  computeComparisonBetweenProjects,
  computeStackSimilarity,
  decodeProjectPath,
  getMostSimilar,
  needsToBe,
} from './common'
import {
  colorMap,
  formatHeader,
  printComparisonBetweenProjects,
} from './output'

export async function executeFindSimilar(
  command: FindSimilarCommand,
): Promise<void> {
  const { name, chain } = decodeProjectPath(command.projectPath)
  const project = getProject(name, command)

  const { matrix: perProjectMatrix } = await computeStackSimilarity(
    project.stack,
  )
  const mostSimilar = getMostSimilar(perProjectMatrix)

  const {
    name: otherName,
    chain: otherChain,
    similarity,
  } = mostSimilar[project.id.toString()]
  const { matrix, firstProject, secondProject } =
    await computeComparisonBetweenProjects(
      command.projectPath,
      `${otherChain}:${otherName}`,
    )

  printComparisonBetweenProjects(matrix, firstProject, secondProject, command)
  console.log(formatHeader('Most similar to:'))
  console.log(`${otherName} => ${name} @ ${colorMap(similarity)}`)

  if (similarity === 1) {
    console.log('No need to run powerdiff, projects are identical')
    return
  }

  if (keyInYN('Run powerdiff?')) {
    const path1 = path.join('discovery', name, chain, '.flat')
    const path2 = path.join('discovery', otherName, otherChain, '.flat')
    powerdiff(path1, path2)
  }
}

function getProject(name: string, command: FindSimilarCommand) {
  const projects = ALL_CONFIGS.filter((p) => p.id.toString() === name)
  needsToBe(
    projects.length <= 1,
    `More than one project found matching ${
      command.projectPath
    } ${projects.toString()}`,
  )
  needsToBe(
    projects.length === 1,
    `No project found matching ${command.projectPath}`,
  )
  const project = projects[0]
  needsToBe(
    project.display.provider !== undefined,
    `Project ${project.display.name} has no provider`,
  )
  return {
    id: project.id,
    stack: project.display.provider,
  }
}
