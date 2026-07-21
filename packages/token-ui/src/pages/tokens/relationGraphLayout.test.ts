import { expect } from 'earl'
import {
  type LayoutLink,
  type LayoutNode,
  layoutRelationGraph,
} from './relationGraphLayout'

describe(layoutRelationGraph.name, () => {
  it('sorts connected clusters by size and places them in a grid', () => {
    const nodes = ['b2', 'c3', 'a2', 'd1', 'c1', 'b1', 'a1', 'c2'].map(
      (id): LayoutNode => ({ id }),
    )
    const nodeById = new Map(nodes.map((node) => [node.id, node]))
    const links = [
      link(nodeById, 'c1', 'c2'),
      link(nodeById, 'c2', 'c3'),
      link(nodeById, 'a1', 'a2'),
      link(nodeById, 'b1', 'b2'),
    ]

    const layout = layoutRelationGraph(nodes, links)

    expect(
      layout.clusters.map((cluster) => cluster.nodes.map((node) => node.id)),
    ).toEqual([['c1', 'c2', 'c3'], ['a1', 'a2'], ['b1', 'b2'], ['d1']])

    const [first, second, third, fourth] = layout.clusters.map((cluster) =>
      center(cluster.nodes),
    )
    if (
      first === undefined ||
      second === undefined ||
      third === undefined ||
      fourth === undefined
    ) {
      throw new Error('Expected four graph clusters')
    }
    expect(first.x < second.x).toEqual(true)
    expect(first.y < third.y).toEqual(true)
    expect(third.x < fourth.x).toEqual(true)
  })
})

function link(
  nodeById: Map<string, LayoutNode>,
  sourceId: string,
  targetId: string,
): LayoutLink<LayoutNode> {
  const source = nodeById.get(sourceId)
  const target = nodeById.get(targetId)
  if (source === undefined || target === undefined) {
    throw new Error('Test link contains an unknown node')
  }
  return { source, target }
}

function center(nodes: LayoutNode[]) {
  const x = nodes.map((node) => node.x ?? 0)
  const y = nodes.map((node) => node.y ?? 0)
  return {
    x: (Math.min(...x) + Math.max(...x)) / 2,
    y: (Math.min(...y) + Math.max(...y)) / 2,
  }
}
