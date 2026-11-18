import { expect } from 'earl'
import type {
  AuditsScopeNode,
  AuditsScopeSnapshot,
} from '~/server/features/audits/types'
import { laneOf, layoutScopeGraph } from './scopeGraphLayout'

function node(
  name: string,
  state: AuditsScopeNode['state'],
  external?: AuditsScopeNode['external'],
): AuditsScopeNode {
  return { name, kind: 'contract', path: `src/${name}.sol`, state, external }
}

function snapshot(nodes: AuditsScopeNode[]): AuditsScopeSnapshot {
  return {
    repository: 'o/r',
    commit: '1'.repeat(40),
    url: '',
    nodes,
    edges: nodes.slice(1).map((_, i) => [0, i + 1, 'uses']),
    interfaces: 0,
    explicitness: {
      own: { named: 0, total: 0 },
      external: { named: 0, total: 0 },
    },
  }
}

describe(layoutScopeGraph.name, () => {
  it('puts a unit in the lane of what the report says, external code apart', () => {
    expect(laneOf(node('A', 'included'))).toEqual('named')
    expect(laneOf(node('B', 'excluded'))).toEqual('named')
    expect(laneOf(node('C', 'not-mentioned'))).toEqual('silent')
    expect(
      laneOf(node('D', 'excluded', { package: 'OpenZeppelin/contracts' })),
    ).toEqual('external')
  })

  it('orders the lanes left to right and heads each package', () => {
    const layout = layoutScopeGraph(
      snapshot([
        node('Vault', 'included'),
        node('Math', 'not-mentioned'),
        node('ERC20', 'not-mentioned', { package: 'oz', version: 'v4' }),
        node('Clone', 'not-mentioned', { package: 'solady' }),
      ]),
    )
    expect(layout.lanes.map((lane) => [lane.id, lane.count])).toEqual([
      ['named', 1],
      ['silent', 1],
      ['external', 2],
    ])
    expect(layout.packages.map((label) => label.text)).toEqual([
      'oz v4',
      'solady',
    ])
    const [vault, math, erc20] = layout.boxes
    expect((vault?.x ?? 0) < (math?.x ?? 0)).toEqual(true)
    expect((math?.x ?? 0) < (erc20?.x ?? 0)).toEqual(true)
  })

  it('gives every unit a place of its own inside the graph', () => {
    const nodes = Array.from({ length: 60 }, (_, i) =>
      node(`U${i}`, i < 20 ? 'included' : 'not-mentioned'),
    )
    const layout = layoutScopeGraph(snapshot(nodes))
    const places = new Set(layout.boxes.map((box) => `${box.x},${box.y}`))
    expect(places.size).toEqual(60)
    for (const box of layout.boxes) {
      expect(box.x + box.width <= layout.width).toEqual(true)
      expect(box.y + box.height <= layout.height).toEqual(true)
    }
  })
})
