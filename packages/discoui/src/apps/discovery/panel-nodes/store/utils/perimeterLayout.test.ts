import { expect } from 'earl'
import type { Box, Node } from '../State'
import type { GraphEdge } from './graphProjection'
import { perimeterLayout } from './perimeterLayout'
import { computeSecurityPerimeter } from './securityPerimeter'

const EMPTY_HIDDEN = new Set<string>()

describe(perimeterLayout.name, () => {
  it('places all critical nodes inside one unified perimeter with zero overlaps', () => {
    const nodes = [
      makeNode('eth:upstream', false),
      makeNode('eth:coreA', true),
      makeNode('eth:coreB', true),
      makeNode('eth:safe', false),
      makeNode('eth:signer', false),
      makeNode('eth:stray', false),
    ]
    const edges: GraphEdge[] = [
      { source: 'eth:upstream', target: 'eth:coreA', fieldName: 'bridge' },
      { source: 'eth:coreA', target: 'eth:coreB', fieldName: 'verifier' },
      { source: 'eth:coreB', target: 'eth:safe', fieldName: 'owner' },
      { source: 'eth:safe', target: 'eth:signer', fieldName: '$members[0]' },
    ]

    const locations = perimeterLayout(nodes, true, edges)
    const placed = nodes.map((node) => ({
      ...node,
      box: {
        ...node.box,
        x: locations[node.id]?.x ?? 0,
        y: locations[node.id]?.y ?? 0,
      },
    }))

    const zones = computeSecurityPerimeter(placed, EMPTY_HIDDEN)
    expect(zones.length).toEqual(1)
    expect(zones[0]?.nodeIds).toEqual(['eth:coreA', 'eth:coreB'])

    const byId = new Map(placed.map((node) => [node.id, node]))
    const upstream = byId.get('eth:upstream') as Node
    const coreA = byId.get('eth:coreA') as Node
    const safe = byId.get('eth:safe') as Node
    const signer = byId.get('eth:signer') as Node
    const stray = byId.get('eth:stray') as Node

    expect(upstream.box.x + upstream.box.width).toBeLessThan(coreA.box.x)
    expect(coreA.box.x + coreA.box.width).toBeLessThan(safe.box.x)
    expect(safe.box.x + safe.box.width).toBeLessThan(signer.box.x)
    expect(stray.box.y).toBeGreaterThan(coreA.box.y + coreA.box.height)

    for (let i = 0; i < placed.length; i++) {
      for (let j = i + 1; j < placed.length; j++) {
        expect(
          boxesIntersect((placed[i] as Node).box, (placed[j] as Node).box),
        ).toEqual(false)
      }
    }
  })

  it('preserves the selection anchor when freshLayout is false', () => {
    const nodes = [
      makeNode('eth:c', true, 400, 300),
      makeNode('eth:n', false, 600, 500),
    ]
    const edges: GraphEdge[] = [
      { source: 'eth:c', target: 'eth:n', fieldName: 'owner' },
    ]

    const locations = perimeterLayout(nodes, false, edges)
    const minX = Math.min(...Object.values(locations).map((p) => p.x))
    const minY = Math.min(...Object.values(locations).map((p) => p.y))

    expect(minX).toEqual(400)
    expect(minY).toEqual(300)
  })

  it('falls back cleanly when all or no nodes are critical', () => {
    const noCritical = [makeNode('eth:a', false), makeNode('eth:b', false)]
    const allCritical = [makeNode('eth:c', true), makeNode('eth:d', true)]

    expect(Object.keys(perimeterLayout(noCritical, true, []))).toEqual([
      'eth:a',
      'eth:b',
    ])
    expect(Object.keys(perimeterLayout(allCritical, true, []))).toEqual([
      'eth:c',
      'eth:d',
    ])
    expect(perimeterLayout([], true, [])).toEqual({})
  })
})

function boxesIntersect(a: Box, b: Box): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}

function makeNode(id: string, isCritical: boolean, x = 0, y = 0): Node {
  return {
    id,
    address: id,
    isInitial: false,
    isCritical,
    hasTemplate: false,
    addressType: 'Contract',
    name: id,
    fields: [],
    hiddenFields: [],
    compressedRows: [],
    box: { x, y, width: 200, height: 80 },
    color: 0,
    hueShift: 0,
    data: null,
    isReachable: true,
    opened: false,
    subnodes: [],
  }
}
