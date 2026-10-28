import { expect } from 'earl'
import type { Node, State } from '../panel-nodes/store/State'
import { getGraphProjection } from '../panel-nodes/store/utils/graphProjection'
import { emptyHistoryState } from '../panel-nodes/store/utils/history'
import { type AgentViewSpec, applyView, legendOf } from './applyView'

// root → bridge → escrow, root → admin → council, root → oracle
const GRAPH = [
  node('root', ['bridge', 'admin', 'oracle'], true),
  node('bridge', ['escrow']),
  node('escrow', []),
  node('admin', ['council']),
  node('council', []),
  node('oracle', []),
]

describe(applyView.name, () => {
  it('hides a contract and reports what only it reached', () => {
    const { nodes, receipt } = applyView(
      stateOf(GRAPH),
      view({ hide: ['bridge'] }),
    )
    expect(hiddenIds(nodes)).toEqual(['bridge', 'escrow'])
    expect(receipt.cascaded).toEqual(['escrow'])
    expect(receipt.visible).toEqual(4)
    expect(receipt.total).toEqual(6)
  })

  it('sets aside what cannot be hidden in a closed group', () => {
    // Two initial contracts: nothing can hide them, so they are set aside.
    const graph = [...GRAPH, node('lonely', [], true)]
    const { nodes, receipt, groups } = applyView(
      stateOf(graph),
      view({ hide: ['root', 'lonely'] }),
    )
    const aside = nodes.find((n) => n.subnodes.length > 0)
    expect(aside?.opened).toEqual(false)
    expect(aside?.subnodes.map((n) => n.id)).toEqual(['root', 'lonely'])
    expect(receipt.notHideable).toEqual(['root', 'lonely'])
    expect(groups.map((g) => g.members)).toEqual([2])
  })

  it('reports contracts that cannot be hidden and ones not in the graph', () => {
    const { receipt } = applyView(
      stateOf(GRAPH),
      view({ hide: ['root', 'gone'] }),
    )
    expect(receipt.notHideable).toEqual(['root'])
    expect(receipt.missing).toEqual(['gone'])
  })

  it('shows what an earlier view hid', () => {
    const hidden = applyView(stateOf(GRAPH), view({ hide: ['bridge'] })).nodes
    const { nodes } = applyView(stateOf(hidden), view({ show: ['bridge'] }))
    expect(hiddenIds(nodes)).toEqual([])
  })

  it('shows a contract an earlier view set aside', () => {
    const graph = [...GRAPH, node('lonely', [], true)]
    const aside = applyView(stateOf(graph), view({ hide: ['lonely'] })).nodes
    const { nodes } = applyView(stateOf(aside), view({ only: ['lonely'] }))
    expect(nodes.some((n) => n.id === 'lonely')).toEqual(true)
  })

  it('shows a contract on a cycle no initial contract reaches', () => {
    // cycleA ⇄ cycleB, referenced by nothing else.
    const graph = [
      ...GRAPH,
      node('cycleA', ['cycleB']),
      node('cycleB', ['cycleA']),
    ]
    const hidden = applyView(stateOf(graph), view({ hide: ['cycleA'] })).nodes
    expect(hiddenIds(hidden)).toEqual(['cycleA', 'cycleB'])

    const shown = applyView(stateOf(hidden), view({ show: ['cycleA'] }))
    expect(hiddenIds(shown.nodes)).toEqual([])
    const only = applyView(stateOf(hidden), view({ only: ['cycleA'] }))
    expect(hiddenIds(only.nodes)).not.toInclude('cycleA')
    expect(only.receipt.connectors).toEqual(['cycleB'])
  })

  it('keeps only the asked contracts and the chain of references to them', () => {
    const { nodes, receipt } = applyView(
      stateOf(GRAPH),
      view({ only: ['council'] }),
    )
    expect(hiddenIds(nodes)).toEqual(['bridge', 'escrow', 'oracle'])
    expect(receipt.connectors).toEqual(['admin'])
    expect(receipt.cascaded).toEqual([])
  })

  it('leaves the references the researcher hid alone when another chain reaches', () => {
    // root reaches council directly through a hidden reference, and through
    // admin through visible ones.
    const graph = [
      { ...node('root', ['admin', 'council'], true), hiddenFields: ['field1'] },
      node('admin', ['council']),
      node('council', []),
      node('oracle', []),
    ]
    const { nodes, receipt } = applyView(
      stateOf(graph),
      view({ only: ['council'] }),
    )
    expect(findNode(nodes, 'root')?.hiddenFields).toEqual(['field1'])
    expect(receipt.connectors).toEqual(['admin'])
  })

  it('unhides only the chain that reaches a hidden contract', () => {
    const graph = [
      { ...node('root', ['bridge'], true), hiddenFields: ['field0'] },
      { ...node('bridge', ['escrow', 'oracle']), hiddenFields: ['field1'] },
      node('escrow', []),
      node('oracle', []),
    ]
    const { nodes } = applyView(stateOf(graph), view({ show: ['escrow'] }))
    expect(hiddenIds(nodes)).toEqual(['oracle'])
  })

  it('makes named, colored, open groups of the members', () => {
    const { nodes, groups } = applyView(
      stateOf(GRAPH),
      view({
        groups: [{ name: 'Control', color: 1, members: ['admin', 'council'] }],
      }),
    )
    const group = nodes.find((n) => n.subnodes.length > 0)
    expect(group?.name).toEqual('Control')
    expect(group?.opened).toEqual(true)
    expect(group?.subnodes.map((n) => [n.id, n.color])).toEqual([
      ['admin', 1],
      ['council', 1],
    ])
    expect(groups).toEqual([
      { id: group?.id as string, name: 'Control', color: 1, members: 2 },
    ])
  })

  it('labels a single contract with a group of one', () => {
    const { groups } = applyView(
      stateOf(GRAPH),
      view({ groups: [{ name: 'Selected', color: 1, members: ['oracle'] }] }),
    )
    expect(groups.map((g) => [g.name, g.members])).toEqual([['Selected', 1]])
  })

  it('keeps one set-aside group when views stack', () => {
    const graph = [...GRAPH, node('lonely', [], true)]
    const first = applyView(stateOf(graph), view({ hide: ['root'] }))
    const second = applyView(stateOf(first.nodes), view({ hide: ['lonely'] }))
    const aside = second.nodes.filter((n) => n.subnodes.length > 0)
    expect(aside.map((n) => n.subnodes.map((m) => m.id))).toEqual([
      ['root', 'lonely'],
    ])
  })

  it('counts only the visible members of a group', () => {
    const { groups } = applyView(
      stateOf(GRAPH),
      view({
        hide: ['escrow'],
        groups: [{ name: 'Bridge', color: 1, members: ['bridge', 'escrow'] }],
      }),
    )
    expect(groups.map((g) => [g.name, g.members])).toEqual([['Bridge', 1]])
  })

  it('drops a group from the legend once a later view empties it', () => {
    const first = applyView(
      stateOf(GRAPH),
      view({
        groups: [{ name: 'One', color: 1, members: ['admin', 'council'] }],
      }),
    )
    const second = applyView(
      stateOf(first.nodes),
      view({
        groups: [{ name: 'Two', color: 2, members: ['admin', 'council'] }],
      }),
    )
    const legend = legendOf(second.nodes, [...first.groups, ...second.groups])
    expect(legend.map((g) => [g.name, g.members])).toEqual([['Two', 2]])
  })

  it('regroups without nesting when a second view groups the same contracts', () => {
    const first = applyView(
      stateOf(GRAPH),
      view({
        groups: [{ name: 'One', color: 1, members: ['admin', 'council'] }],
      }),
    )
    const { nodes } = applyView(
      stateOf(first.nodes),
      view({
        groups: [{ name: 'Two', color: 2, members: ['admin', 'council'] }],
      }),
    )
    const groups = nodes.filter((n) => n.subnodes.length > 0)
    expect(groups.map((g) => g.name)).toEqual(['Two'])
    expect(groups[0]?.subnodes.map((n) => n.id)).toEqual(['admin', 'council'])
  })

  it('moves an open group of the researcher with its members in lanes', () => {
    const own = applyView(
      stateOf(GRAPH),
      view({
        groups: [{ name: 'Mine', color: 3, members: ['bridge', 'escrow'] }],
      }),
    ).nodes
    const { nodes } = applyView(
      stateOf(own),
      view({
        groups: [{ name: 'Control', color: 1, members: ['admin', 'council'] }],
        arrange: 'lanes',
      }),
    )
    const mine = nodes.find((n) => n.name === 'Mine') as Node
    const control = nodes.find((n) => n.name === 'Control') as Node
    const rightmost = Math.max(
      ...control.subnodes.map((n) => n.box.x + n.box.width),
    )
    for (const member of mine.subnodes) {
      expect(member.box.x).toBeGreaterThan(rightmost)
    }
  })

  it('arranges groups in lanes left to right without overlaps', () => {
    const { nodes } = applyView(
      stateOf(GRAPH),
      view({
        groups: [{ name: 'Control', color: 1, members: ['admin', 'council'] }],
        arrange: 'lanes',
      }),
    )
    const group = nodes.find((n) => n.subnodes.length > 0) as Node
    const [admin, council] = group.subnodes as [Node, Node]
    expect(admin.box.x).toEqual(council.box.x)
    expect(council.box.y).toBeGreaterThan(admin.box.y + admin.box.height)
    const others = nodes.filter((n) => n.subnodes.length === 0)
    for (const other of others) {
      expect(other.box.x).toBeGreaterThan(admin.box.x + admin.box.width)
    }
  })
})

function view(spec: Partial<AgentViewSpec>): AgentViewSpec {
  return {
    title: 'test',
    hide: [],
    show: [],
    groups: [],
    colors: [],
    arrange: 'keep',
    ...spec,
  }
}

function findNode(nodes: readonly Node[], id: string): Node | undefined {
  const stack = [...nodes]
  for (let node = stack.pop(); node !== undefined; node = stack.pop()) {
    if (node.id === id) return node
    stack.push(...node.subnodes)
  }
  return undefined
}

function hiddenIds(nodes: readonly Node[]): string[] {
  return [...getGraphProjection(nodes).hiddenNodeIds].sort()
}

function node(id: string, targets: string[], isInitial = false): Node {
  return {
    id,
    address: id,
    isInitial,
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
    box: { x: 0, y: 0, width: 200, height: 50 },
    color: 0,
    hueShift: 0,
    data: null,
    isReachable: true,
    opened: false,
    subnodes: [],
  }
}

function stateOf(nodes: readonly Node[]): State {
  return {
    projectId: 'test',
    nodes,
    selected: [],
    history: emptyHistoryState(),
    userPreferences: {
      enableDimming: false,
      hideLargeArrays: false,
      highlightOverlapping: false,
    },
    transform: { offsetX: 0, offsetY: 0, scale: 1 },
    tool: 'select',
    input: {
      shiftPressed: false,
      spacePressed: false,
      ctrlPressed: false,
      lmbPressed: false,
      mmbPressed: false,
      mouseStartX: 0,
      mouseStartY: 0,
      mouseX: 0,
      mouseY: 0,
    },
    positionsBeforeMove: {},
    loaded: true,
  }
}
