import { expect } from 'earl'
import type { Box, Node } from '../State'
import {
  computeSecurityPerimeter,
  countCriticalLeaves,
  getNodeCriticality,
  PERIMETER_BORDER_WIDTH,
  PERIMETER_PADDING,
} from './securityPerimeter'

const EMPTY_HIDDEN = new Set<string>()

describe(computeSecurityPerimeter.name, () => {
  it('returns nothing when no nodes are critical', () => {
    const nodes = [
      makeNode('eth:a', { x: 0, y: 0, width: 200, height: 80 }, false),
      makeNode('eth:b', { x: 300, y: 0, width: 200, height: 80 }, false),
    ]

    expect(computeSecurityPerimeter(nodes, EMPTY_HIDDEN)).toEqual([])
  })

  it('encloses all critical nodes in one padded box when no obstacle lies inside', () => {
    const nodes = [
      makeNode('eth:c1', { x: 0, y: 0, width: 200, height: 80 }, true),
      makeNode('eth:c2', { x: 300, y: 120, width: 200, height: 100 }, true),
      makeNode('eth:out', { x: 700, y: 0, width: 200, height: 80 }, false),
    ]

    const zones = computeSecurityPerimeter(nodes, EMPTY_HIDDEN)

    expect(zones).toEqual([
      {
        box: {
          x: -PERIMETER_PADDING,
          y: -PERIMETER_PADDING,
          width: 500 + PERIMETER_PADDING * 2,
          height: 220 + PERIMETER_PADDING * 2,
        },
        count: 2,
        nodeIds: ['eth:c1', 'eth:c2'],
      },
    ])
  })

  it('splits into separate zones rather than enclosing a non-critical node between them', () => {
    const obstacle = makeNode(
      'eth:safe',
      { x: 300, y: 0, width: 200, height: 80 },
      false,
    )
    const nodes = [
      makeNode('eth:left', { x: 0, y: 0, width: 200, height: 80 }, true),
      obstacle,
      makeNode('eth:right', { x: 600, y: 0, width: 200, height: 80 }, true),
    ]

    const zones = computeSecurityPerimeter(nodes, EMPTY_HIDDEN)

    expect(zones.length).toEqual(2)
    for (const zone of zones) {
      expect(boxesIntersect(zone.box, obstacle.box)).toEqual(false)
    }
    expect(zones.map((z) => z.nodeIds)).toEqual([['eth:left'], ['eth:right']])
  })

  it('clamps padding so a close non-critical node is never overlapped by the stroked border', () => {
    const obstacle = makeNode(
      'eth:safe',
      { x: 220, y: 0, width: 200, height: 80 },
      false,
    )
    const nodes = [
      makeNode('eth:c1', { x: 0, y: 0, width: 200, height: 80 }, true),
      obstacle,
    ]

    const zones = computeSecurityPerimeter(nodes, EMPTY_HIDDEN)

    expect(zones.length).toEqual(1)
    const zone = zones[0]
    expect(zone).not.toEqual(undefined)
    if (!zone) return
    const strokeHalf = PERIMETER_BORDER_WIDTH / 2
    expect(zone.box.x + zone.box.width + strokeHalf).toBeLessThanOrEqual(
      obstacle.box.x,
    )
    expect(boxesIntersect(zone.box, obstacle.box)).toEqual(false)
  })

  it('suppresses an enclosure when a non-critical node overlaps a critical node', () => {
    const nodes = [
      makeNode('eth:c1', { x: 0, y: 0, width: 200, height: 120 }, true),
      makeNode('eth:inside', { x: 40, y: 30, width: 80, height: 40 }, false),
    ]

    expect(computeSecurityPerimeter(nodes, EMPTY_HIDDEN)).toEqual([])
  })

  it('suppresses an enclosure when a non-critical node touches a critical node with no room for the stroke', () => {
    const nodes = [
      makeNode('eth:c1', { x: 0, y: 0, width: 200, height: 80 }, true),
      makeNode('eth:touching', { x: 200, y: 0, width: 200, height: 80 }, false),
    ]

    expect(computeSecurityPerimeter(nodes, EMPTY_HIDDEN)).toEqual([])
  })

  it('treats all-critical collapsed groups as inside and mixed groups as outside', () => {
    const allCriticalGroup = makeGroup(
      'group:all',
      { x: 0, y: 0, width: 200, height: 80 },
      [
        makeNode('eth:c1', { x: 0, y: 0, width: 200, height: 80 }, true),
        makeNode('eth:c2', { x: 0, y: 100, width: 200, height: 80 }, true),
      ],
    )
    const mixedGroup = makeGroup(
      'group:mixed',
      { x: 400, y: 0, width: 200, height: 80 },
      [
        makeNode('eth:c3', { x: 400, y: 0, width: 200, height: 80 }, true),
        makeNode('eth:n1', { x: 400, y: 100, width: 200, height: 80 }, false),
      ],
    )

    expect(getNodeCriticality(allCriticalGroup, EMPTY_HIDDEN)).toEqual('all')
    expect(getNodeCriticality(mixedGroup, EMPTY_HIDDEN)).toEqual('some')
    expect(
      countCriticalLeaves([allCriticalGroup, mixedGroup], EMPTY_HIDDEN),
    ).toEqual(3)

    const zones = computeSecurityPerimeter(
      [allCriticalGroup, mixedGroup],
      EMPTY_HIDDEN,
    )
    expect(zones.length).toEqual(1)
    expect(zones[0]?.nodeIds).toEqual(['group:all'])
    expect(zones[0]?.count).toEqual(2)
  })

  it('excludes hidden nodes from zones and counts', () => {
    const nodes = [
      makeNode('eth:c1', { x: 0, y: 0, width: 200, height: 80 }, true),
      makeNode('eth:c2', { x: 400, y: 0, width: 200, height: 80 }, true),
    ]
    const hidden = new Set(['eth:c2'])

    const zones = computeSecurityPerimeter(nodes, hidden)

    expect(zones.length).toEqual(1)
    expect(zones[0]?.nodeIds).toEqual(['eth:c1'])
    expect(countCriticalLeaves(nodes, hidden)).toEqual(1)
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

function makeNode(id: string, box: Box, isCritical: boolean): Node {
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
    box,
    color: 0,
    hueShift: 0,
    data: null,
    isReachable: true,
    opened: false,
    subnodes: [],
  }
}

function makeGroup(id: string, box: Box, subnodes: Node[]): Node {
  return {
    ...makeNode(id, box, false),
    addressType: 'Group',
    subnodes,
  }
}
