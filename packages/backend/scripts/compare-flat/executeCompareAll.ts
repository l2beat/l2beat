import { CompareAllCommand } from './cli'
import { computeStackSimilarity, getMostSimilar } from './common'
import { colorMap, formatHeader,formatTable } from './output'

export async function executeCompareAll(
  command: CompareAllCommand,
): Promise<void> {
  const { matrix, projects } = await computeStackSimilarity(command.stack)
  const mostSimilar = getMostSimilar(matrix)

  const table = formatTable(
    projects.map((p) => p.name),
    projects.map((p) => p.name),
    matrix,
    { forceTable: command.forceTable },
  )

  if (table) {
    console.log(formatHeader('Comparison matrix'))
    console.log(table)
  }

  console.log(formatHeader('Most similar projects'))
  const longestName = Math.max(
    ...Object.keys(mostSimilar).map((name) => name.length),
  )
  for (const [name, { name: similarName, similarity }] of Object.entries(
    mostSimilar,
  )) {
    console.log(
      `${name.padStart(longestName)} => ${similarName.padEnd(
        longestName,
      )} @ ${colorMap(similarity)}`,
    )
  }
}
