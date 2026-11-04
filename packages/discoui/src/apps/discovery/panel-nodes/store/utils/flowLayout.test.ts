import { expect } from 'earl'
import type { Box, Node } from '../State'
import { BOTTOM_PADDING, FIELD_HEIGHT, HEADER_HEIGHT } from './constants'
import { flowLayout } from './flowLayout'
import type { GraphEdge } from './graphProjection'
import type { NodeLocations } from './storage'

describe(flowLayout.name, () => {
  it('returns the same layout when run twice', () => {
    const { nodes, edges } = graph({
      'eth:a': ['eth:b', 'eth:c'],
      'eth:b': ['eth:c', 'eth:d'],
      'eth:c': ['eth:a'],
      'eth:d': [],
      'eth:e': [],
    })

    const first = flowLayout(nodes, true, edges)
    const second = flowLayout(nodes, true, edges)

    expect(second).toEqual(first)
    expect(Object.keys(first).sort()).toEqual(nodes.map((n) => n.id).sort())
  })

  it('starts a fresh layout at the origin', () => {
    const { nodes, edges } = graph({ 'eth:a': ['eth:b'], 'eth:b': [] })

    expect(topLeft(flowLayout(nodes, true, edges))).toEqual({ x: 0, y: 0 })
  })

  it('keeps a partial layout at the top-left corner of the nodes it moves', () => {
    const { nodes, edges } = graph({ 'eth:a': ['eth:b'], 'eth:b': [] })
    const moved = nodes.map((node, i) => ({
      ...node,
      box: { ...node.box, x: 500 - i * 100, y: 300 + i * 50 },
    }))

    expect(topLeft(flowLayout(moved, false, edges))).toEqual({ x: 400, y: 300 })
  })

  it('never overlaps nodes', () => {
    const { nodes, edges } = graph({
      'eth:portal': ['eth:admin', 'eth:config', 'eth:safe'],
      'eth:config': ['eth:admin', 'eth:safe', 'eth:eoa1'],
      'eth:bridge': ['eth:admin', 'eth:portal', 'eth:safe'],
      'eth:admin': ['eth:safe'],
      'eth:safe': ['eth:eoa1', 'eth:eoa2', 'eth:eoa3'],
      'eth:eoa1': [],
      'eth:eoa2': [],
      'eth:eoa3': [],
      'eth:lonely': [],
    })

    const boxes = placedBoxes(nodes, flowLayout(nodes, true, edges))

    for (const [i, a] of boxes.entries()) {
      for (const b of boxes.slice(i + 1)) {
        expect(overlaps(a, b)).toEqual(false)
      }
    }
  })

  it('reads left to right along references', () => {
    const { nodes, edges } = graph({
      'eth:a': ['eth:b'],
      'eth:b': ['eth:c'],
      'eth:c': [],
    })

    const locations = flowLayout(nodes, true, edges)

    expect(x(locations, 'eth:a')).toBeLessThan(x(locations, 'eth:b'))
    expect(x(locations, 'eth:b')).toBeLessThan(x(locations, 'eth:c'))
  })

  it('aligns a lone target header with the field row that points at it', () => {
    const { nodes, edges } = graph({ 'eth:a': ['eth:b'], 'eth:b': [] })

    const locations = flowLayout(nodes, true, edges)

    const fieldRowY = y(locations, 'eth:a') + HEADER_HEIGHT + FIELD_HEIGHT / 2
    const headerY = y(locations, 'eth:b') + HEADER_HEIGHT / 2
    expect(headerY).toBeCloseTo(fieldRowY, 1)
  })

  it('stacks children in the order their parent lists them', () => {
    const { nodes, edges } = graph({
      'eth:a': ['eth:third', 'eth:first', 'eth:second'],
      'eth:first': [],
      'eth:second': [],
      'eth:third': [],
    })

    const locations = flowLayout(nodes, true, edges)

    expect(y(locations, 'eth:third')).toBeLessThan(y(locations, 'eth:first'))
    expect(y(locations, 'eth:first')).toBeLessThan(y(locations, 'eth:second'))
  })

  it('places a shared admin among its proxies rather than behind all of them', () => {
    const { nodes, edges } = graph({
      'eth:p1': ['eth:m1', 'eth:admin'],
      'eth:m1': ['eth:p2'],
      'eth:p2': ['eth:m2', 'eth:admin'],
      'eth:m2': ['eth:p3'],
      'eth:p3': ['eth:admin'],
      'eth:admin': [],
    })

    const locations = flowLayout(nodes, true, edges)

    expect(x(locations, 'eth:admin')).toBeLessThan(x(locations, 'eth:p3'))
  })

  it('keeps nodes clear of an edge that skips their column', () => {
    const { nodes, edges } = graph({
      'eth:a': ['eth:b', 'eth:c'],
      'eth:b': ['eth:c'],
      'eth:c': [],
    })

    const locations = flowLayout(nodes, true, edges)

    const a = placedBox(nodes, locations, 'eth:a')
    const b = placedBox(nodes, locations, 'eth:b')
    const c = placedBox(nodes, locations, 'eth:c')
    const from = {
      x: a.x + a.width,
      y: a.y + HEADER_HEIGHT + FIELD_HEIGHT * 1.5,
    }
    const to = { x: c.x, y: c.y + HEADER_HEIGHT / 2 }
    for (const columnX of [b.x, b.x + b.width]) {
      const t = (columnX - from.x) / (to.x - from.x)
      const lineY = from.y + (to.y - from.y) * t
      expect(lineY < b.y || lineY > b.y + b.height).toEqual(true)
    }
  })

  it('gives every chain its own band and puts counterparts in neighbouring columns', () => {
    const { nodes, edges } = graph({
      'eth:bridge': ['eth:admin', 'arb1:bridge'],
      'eth:admin': [],
      'arb1:bridge': ['arb1:admin', 'eth:bridge'],
      'arb1:admin': [],
    })

    const locations = flowLayout(nodes, true, edges)

    const ethBottom = Math.max(
      ...placedBoxes(nodes, locations)
        .filter((box) => box.id.startsWith('eth:'))
        .map((box) => box.y + box.height),
    )
    expect(y(locations, 'arb1:bridge')).toBeGreaterThan(ethBottom)
    expect(y(locations, 'arb1:admin')).toBeGreaterThan(ethBottom)
    const gap = Math.abs(
      x(locations, 'eth:bridge') - x(locations, 'arb1:bridge'),
    )
    expect(gap).toBeGreaterThan(0)
    expect(gap).toBeLessThan(400)
  })
})

function graph(spec: Record<string, string[]>) {
  const edges: GraphEdge[] = []
  const nodes = Object.entries(spec).map(([id, targets]): Node => {
    for (const [i, target] of targets.entries()) {
      edges.push({ source: id, target, fieldName: `field${i}` })
    }
    return {
      id,
      address: id,
      isInitial: false,
      hasTemplate: false,
      addressType: 'Contract',
      name: id,
      fields: targets.map((target, i) => ({
        name: `field${i}`,
        target,
        box: { x: 0, y: 0, width: 0, height: 0 },
        connection: {
          from: { direction: 'left', x: 0, y: 0 },
          to: { direction: 'left', x: 0, y: 0 },
        },
      })),
      hiddenFields: [],
      compressedRows: [],
      box: {
        x: 0,
        y: 0,
        width: 200,
        height: HEADER_HEIGHT + targets.length * FIELD_HEIGHT + BOTTOM_PADDING,
      },
      color: 0,
      hueShift: 0,
      data: null,
      isReachable: true,
      opened: false,
      subnodes: [],
    }
  })
  return { nodes, edges }
}

function x(locations: NodeLocations, id: string): number {
  const location = locations[id]
  if (location === undefined) throw new Error('Missing location')
  return location.x
}

function y(locations: NodeLocations, id: string): number {
  const location = locations[id]
  if (location === undefined) throw new Error('Missing location')
  return location.y
}

function placedBox(
  nodes: readonly Node[],
  locations: NodeLocations,
  id: string,
): Box & { id: string } {
  const node = nodes.find((node) => node.id === id)
  if (node === undefined) throw new Error('Missing node')
  return { ...node.box, id, x: x(locations, id), y: y(locations, id) }
}

function placedBoxes(nodes: readonly Node[], locations: NodeLocations) {
  return nodes.map((node) => placedBox(nodes, locations, node.id))
}

function overlaps(a: Box, b: Box): boolean {
  return (
    a.x < b.x + b.width &&
    b.x < a.x + a.width &&
    a.y < b.y + b.height &&
    b.y < a.y + a.height
  )
}

function topLeft(locations: NodeLocations) {
  const values = Object.values(locations)
  return {
    x: Math.min(...values.map((location) => location.x)),
    y: Math.min(...values.map((location) => location.y)),
  }
}
