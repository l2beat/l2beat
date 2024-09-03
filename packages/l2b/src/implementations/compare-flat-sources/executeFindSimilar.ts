import path from 'path'
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
  discoveryPath: string
}

export async function executeFindSimilar(
  command: FindSimilarCommand,
): Promise<void> {
  const { name, chain } = decodeProjectPath(command.projectPath)

  const { matrix: perProjectMatrix } = await computeStackSimilarity(
    command.discoveryPath,
  )
  const mostSimilar = getMostSimilar(perProjectMatrix)

  const { name: otherName, chain: otherChain, similarity } = mostSimilar[name]
  const { matrix, firstProject, secondProject } =
    await computeComparisonBetweenProjects(
      command.projectPath,
      `${otherChain}:${otherName}`,
      command.discoveryPath,
    )

  printComparisonBetweenProjects(matrix, firstProject, secondProject, command)
  console.log(formatHeader('Most similar to:'))
  console.log(`${otherName} => ${name} @ ${colorMap(similarity)}`)

  if (similarity === 1) {
    console.log('No need to run powerdiff, projects are identical')
    return
  }

  if (keyInYN('Run powerdiff?')) {
    const path1 = path.join(
      command.discoveryPath,
      'discovery',
      name,
      chain,
      '.flat',
    )
    const path2 = path.join(
      command.discoveryPath,
      'discovery',
      otherName,
      otherChain,
      '.flat',
    )
    powerdiff(path1, path2)
  }
}
