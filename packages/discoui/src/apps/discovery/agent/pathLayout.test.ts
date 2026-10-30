import { expect, mockObject } from 'earl'
import type { Field, Node } from '../panel-nodes/store/State'
import { edgeKey } from './pathEdges'
import { fitScale, layoutAgentPaths } from './pathLayout'

describe(layoutAgentPaths.name, () => {
  const nodeById = new Map([
    node('council', []),
    node('executor', ['council']),
    node('timelock', [...Array(100).fill('executor'), 'executor']),
    node('admin', ['executor']),
  ])
  const keep = (from: string, to: string) =>
    [
      edgeKey('executor', 'council'),
      edgeKey('admin', 'executor'),
      edgeKey('timelock', 'executor'),
    ].includes(edgeKey(from, to))

  it('stacks a path top to bottom in a tall viewport and left to right in a wide one', () => {
    const lanes = [['council', 'executor', 'admin']]
    const tall = layoutAgentPaths(lanes, nodeById, keep, {
      width: 300,
      height: 900,
    })
    const wide = layoutAgentPaths(lanes, nodeById, keep, {
      width: 900,
      height: 300,
    })
    expect(tall.orientation).toEqual('vertical')
    expect(wide.orientation).toEqual('horizontal')
    expect(tall.nodes.map((n) => n.id)).toEqual([
      'council',
      'executor',
      'admin',
    ])
  })

  it('places a contract shared by two paths once', () => {
    const layout = layoutAgentPaths(
      [
        ['council', 'executor', 'admin'],
        ['timelock', 'executor'],
      ],
      nodeById,
      keep,
      { width: 900, height: 900 },
    )
    expect(layout.nodes.map((n) => n.id)).toEqual([
      'council',
      'executor',
      'admin',
      'timelock',
    ])
  })

  it('keeps at most three fields per link, so a timelock stays readable', () => {
    const layout = layoutAgentPaths(
      [['timelock', 'executor']],
      nodeById,
      keep,
      {
        width: 900,
        height: 900,
      },
    )
    const timelock = layout.nodes.find((n) => n.id === 'timelock')
    expect(timelock?.fields.length).toEqual(3)
    expect(timelock?.hiddenFields).toEqual([])
  })

  it('skips contracts missing from the graph', () => {
    const layout = layoutAgentPaths([['council', 'gone']], nodeById, keep, {
      width: 900,
      height: 900,
    })
    expect(layout.nodes.map((n) => n.id)).toEqual(['council'])
  })
})

describe(fitScale.name, () => {
  it('shrinks to fit but never enlarges', () => {
    expect(
      fitScale({ width: 400, height: 200 }, { width: 200, height: 400 }),
    ).toEqual(0.5)
    expect(
      fitScale({ width: 100, height: 100 }, { width: 800, height: 800 }),
    ).toEqual(1)
  })
})

function node(id: string, targets: string[]): [string, Node] {
  const fields = targets.map((target, i) =>
    mockObject<Field>({
      name: `field${i}`,
      label: undefined,
      target,
      box: { x: 0, y: 0, width: 0, height: 0 },
      connection: {
        from: { direction: 'left', x: 0, y: 0 },
        to: { direction: 'left', x: 0, y: 0 },
      },
    }),
  )
  return [
    id,
    mockObject<Node>({
      id,
      fields,
      hiddenFields: [],
      compressedRows: [],
      subnodes: [],
      opened: false,
      box: { x: 0, y: 0, width: 200, height: 0 },
    }),
  ]
}
