import { computeStackSimilarity } from './common'
import { generateAndOpenGraph } from './graph'
import { colorMap } from './output'

export interface CompareAllCommand {
  discoveryPath: string
  minProjectSimilarity: number
  minClusterSimilarity: number
  showGraph: boolean
}

export async function executeCompareAll(
  command: CompareAllCommand,
): Promise<void> {
  const { matrix } = await computeStackSimilarity(command.discoveryPath)

  const clusters = computeClusters(
    matrix,
    command.minProjectSimilarity,
    command.minClusterSimilarity,
  )
  const unique = Object.keys(matrix).filter(
    (x) => !clusters.some((c) => c.includes(x)),
  )

  for (const cluster of clusters) {
    console.log(`:: === (${cluster.length} projects) === ::`)
    const longestItem = cluster.reduce((acc, i) => Math.max(acc, i.length), 0)

    cluster
      .map((item) => {
        const totalSimilarity = cluster
          .filter((x) => x !== item)
          .reduce((sum, x) => sum + matrix[item][x], 0)
        const average = totalSimilarity / (cluster.length - 1)
        return { item, average }
      })
      .sort((a, b) => b.average - a.average)
      .forEach((i) =>
        console.log(`${i.item.padEnd(longestItem)} ${colorMap(i.average)}`),
      )
  }

  console.log(':: === (unique) === ::')
  for (const item of unique) {
    console.log(item)
  }

  console.log('STATS:')
  console.log('projects', Object.keys(matrix).length)
  console.log('clusters', clusters.length)
  console.log('unique', unique.length)

  if (command.showGraph) {
    await generateAndOpenGraph(clusters)
  }
}

function computeClusters(
  matrix: Record<string, Record<string, number>>,
  minProjectSimilarity: number,
  minClusterSimilarity: number,
): string[][] {
  const clusters: Set<string>[] = []
  for (const name in matrix) {
    clusters.push(new Set([name]))
    const matching = clusters.filter((x) => x.has(name))
    for (const cluster of matching) {
      for (const other in matrix) {
        if (
          name !== other &&
          Array.from(cluster).every(
            (x) => matrix[x][other] > minProjectSimilarity,
          )
        ) {
          cluster.add(other)
        }
      }
    }
  }

  const setEqual = (a: Set<string>, b: Set<string>) => {
    if (a.size !== b.size) {
      return false
    }
    for (const item of a) {
      if (!b.has(item)) {
        return false
      }
    }
    return true
  }

  const deduplicated = clusters.filter(
    (c1, i, a) => c1.size > 1 && a.findIndex((c2) => setEqual(c1, c2)) === i,
  )

  const hasItems = (
    source: Set<string>,
    target: Set<string>,
    threshold: number,
  ) => {
    let count = 0
    for (const item of source) {
      if (target.has(item)) {
        count++
      }
    }
    return count / source.size >= threshold
  }

  const combined: Set<string>[] = []
  for (const cluster of deduplicated) {
    const existing = combined.find((target) =>
      hasItems(cluster, target, minClusterSimilarity),
    )
    if (existing) {
      for (const item of cluster) {
        existing.add(item)
      }
    } else {
      combined.push(cluster)
    }
  }

  return combined.map((x) => Array.from(x).sort())
}
