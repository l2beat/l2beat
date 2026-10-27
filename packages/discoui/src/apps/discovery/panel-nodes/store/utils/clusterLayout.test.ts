import { expect } from 'earl'
import type { Node } from '../State'
import { clusterLayout } from './clusterLayout'
import type { GraphEdge } from './graphProjection'
import type { NodeLocations } from './storage'

describe(clusterLayout.name, () => {
  const nodes = [
    makeNode('a', 500, 300),
    makeNode('b', 900, 100),
    makeNode('c', 700, 800),
    makeNode('d', 650, 450),
  ]
  const edges: GraphEdge[] = [
    { source: 'a', target: 'b', fieldName: 'owner' },
    { source: 'a', target: 'c', fieldName: 'admin' },
  ]

  it('places every node at a finite position', () => {
    const locations = clusterLayout(nodes, true, edges)

    expect(Object.keys(locations).sort()).toEqual(['a', 'b', 'c', 'd'])
    for (const location of Object.values(locations)) {
      expect(Number.isFinite(location.x)).toEqual(true)
      expect(Number.isFinite(location.y)).toEqual(true)
    }
  })

  it('returns the same layout when run twice', () => {
    const first = clusterLayout(nodes, true, edges)
    const second = clusterLayout(nodes, true, edges)

    expect(second).toEqual(first)
  })

  it('starts a fresh layout at the origin', () => {
    const locations = clusterLayout(nodes, true, edges)

    expect(topLeft(locations)).toEqual({ x: 0, y: 0 })
  })

  it('keeps a partial layout at the top-left corner of the nodes it moves', () => {
    const locations = clusterLayout(nodes, false, edges)

    expect(topLeft(locations)).toEqual({ x: 500, y: 100 })
  })
})

function topLeft(locations: NodeLocations) {
  const values = Object.values(locations)
  return {
    x: Math.min(...values.map((location) => location.x)),
    y: Math.min(...values.map((location) => location.y)),
  }
}

function makeNode(id: string, x: number, y: number): Node {
  return {
    id,
    address: `test:${id}`,
    isInitial: false,
    hasTemplate: false,
    addressType: 'Contract',
    name: id,
    fields: [],
    hiddenFields: [],
    compressedRows: [],
    box: { x, y, width: 200, height: 100 },
    color: 0,
    hueShift: 0,
    data: null,
    isReachable: true,
    opened: false,
    subnodes: [],
  }
}
