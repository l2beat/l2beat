import { expect } from 'earl'
import { findDraggableNodeAt } from './relationGraphInteraction'
import type { RelationGraphNode } from './relationGraphModel'
import type { RelationGraphScene, SceneNode } from './relationGraphScene'

describe(findDraggableNodeAt.name, () => {
  const node = sceneNode()
  const scene = sceneWith(node)

  it('returns undefined while node labels are hidden', () => {
    expect(findDraggableNodeAt(scene, node.x, node.y, 10, 0.5)).toEqual(
      undefined,
    )
  })

  it('returns the node once node labels are visible', () => {
    expect(
      found(findDraggableNodeAt(scene, node.x, node.y, 10, 1)),
    ).toExactlyEqual(node)
  })
})

function found<T>(value: T | undefined): T {
  if (value === undefined) throw new Error('Expected the hit test to hit')
  return value
}

function sceneNode(): SceneNode {
  const data: RelationGraphNode = {
    id: 'unichain:0xaaa',
    chain: 'unichain',
    address: '0xaaa',
    symbol: 'TOKEN',
    isDeployed: true,
  }
  return { data, label: 'TOKEN', x: 50, y: 50 }
}

function sceneWith(node: SceneNode): RelationGraphScene {
  return {
    nodes: [node],
    links: [],
    clusterLabels: [],
    nodeById: new Map([[node.data.id, node]]),
    width: 100,
    height: 100,
  }
}
