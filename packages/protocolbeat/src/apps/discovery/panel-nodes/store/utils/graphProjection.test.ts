import { expect } from 'earl'
import type { Node } from '../State'
import {
  getGraphProjection,
  hideItems,
  isHideable,
  mapGraphItems,
} from './graphProjection'

describe(getGraphProjection.name, () => {
  it('hides a node referenced only through a hidden field', () => {
    const nodes = [
      makeNode('root', [['large[0]', 'target']], ['large[0]']),
      makeNode('target'),
    ]
    expect(hidden(nodes)).toEqual(['target'])
  })

  it('keeps a node with another visible incoming field', () => {
    const nodes = [
      makeNode('first', [['large[0]', 'target']], ['large[0]']),
      makeNode('second', [['owner', 'target']]),
      makeNode('target'),
    ]
    expect(hidden(nodes)).toEqual([])
  })

  it('cascades through outgoing fields of newly hidden nodes', () => {
    const nodes = [
      makeNode('root', [['large[0]', 'middle']], ['large[0]']),
      makeNode('middle', [['owner', 'target']]),
      makeNode('target'),
    ]
    expect(hidden(nodes)).toEqual(['middle', 'target'])
  })

  it('hides a cycle disconnected by a hidden field', () => {
    const nodes = [
      makeNode('root', [['entry', 'first']], ['entry']),
      makeNode('first', [['next', 'second']]),
      makeNode('second', [['next', 'first']]),
    ]
    expect(hidden(nodes)).toEqual(['first', 'second'])
  })

  it('keeps a detached cycle visible while nothing is hidden into it', () => {
    const nodes = [
      makeNode('first', [['next', 'second']]),
      makeNode('second', [['next', 'first']]),
    ]
    expect(hidden(nodes)).toEqual([])
  })

  it('hides a detached node when all of its inbound fields are hidden', () => {
    const nodes = [
      makeNode('first', [['next', 'second']]),
      makeNode('second', [['next', 'first']], ['next']),
    ]
    expect(hidden(nodes)).toEqual(['first', 'second'])
  })

  it('keeps a detached cycle while every node has visible inbound support', () => {
    const nodes = [
      makeNode(
        'first',
        [
          ['visible', 'second'],
          ['hidden', 'second'],
        ],
        ['hidden'],
      ),
      makeNode(
        'second',
        [
          ['visible', 'first'],
          ['hidden', 'first'],
        ],
        ['hidden'],
      ),
    ]
    expect(hidden(nodes)).toEqual([])
  })

  it('preserves initial nodes and nodes with no references', () => {
    const nodes = [
      makeNode('root', [['hidden', 'initial']], ['hidden']),
      makeNode('initial', [], [], true),
      makeNode('unreferenced'),
    ]
    expect(hidden(nodes)).toEqual([])
  })

  it('preserves components that were unreachable before fields were hidden', () => {
    const nodes = [
      makeNode('root', [['entry', 'hidden']], ['entry'], true),
      makeNode('hidden'),
      makeNode('detached', [['next', 'detached-target']]),
      makeNode('detached-target'),
    ]
    expect(hidden(nodes)).toEqual(['hidden'])
  })

  it('projects only edges connecting visible nodes through visible fields', () => {
    const nodes = [
      makeNode(
        'root',
        [
          ['hidden', 'hidden-target'],
          ['visible', 'visible-target'],
        ],
        ['hidden'],
      ),
      makeNode('hidden-target'),
      makeNode('visible-target'),
    ]

    const projection = getGraphProjection(nodes)

    expect(projection.visibleEdges).toEqual([
      { source: 'root', target: 'visible-target', fieldName: 'visible' },
    ])
    expect(projection.hiddenFieldCount).toEqual(1)
  })
})

describe(hideItems.name, () => {
  it('hides every inbound field instead of storing a hidden node', () => {
    const nodes = [
      makeNode('first', [['owner', 'target']]),
      makeNode('second', [
        ['members[0]', 'target'],
        ['other', 'root'],
      ]),
      makeNode('target'),
      makeNode('root'),
    ]

    const updated = hideItems(nodes, new Set(['target']))

    expect(updated[0]?.hiddenFields).toEqual(['owner'])
    expect(updated[1]?.hiddenFields).toEqual(['members[0]'])
    expect(hidden(updated)).toEqual(['target'])
  })

  it('hides a target in a detached cycle', () => {
    const nodes = [
      makeNode('first', [['next', 'second']]),
      makeNode('second', [['next', 'first']]),
    ]

    const updated = hideItems(nodes, new Set(['first']))

    expect(updated[1]?.hiddenFields).toEqual(['next'])
    expect(hidden(updated)).toEqual(['first', 'second'])
  })

  it('expands group targets to their members', () => {
    const group = makeGroup('group', [makeNode('member')])
    const nodes = [makeNode('root', [['member', 'member']]), group]

    const updated = hideItems(nodes, new Set(['group']))

    expect(updated[0]?.hiddenFields).toEqual(['member'])
    expect(hidden(updated)).toEqual(['group', 'member'])
  })

  it('keeps standalone targets and node references unchanged', () => {
    const nodes = [makeNode('standalone')]

    const updated = hideItems(nodes, new Set(['standalone']))

    expect(updated === nodes).toEqual(true)
    expect(updated[0] === nodes[0]).toEqual(true)
  })

  it('does not hide initial targets', () => {
    const nodes = [
      makeNode('root', [['initial', 'initial']]),
      makeNode('initial', [], [], true),
    ]

    const updated = hideItems(nodes, new Set(['initial']))

    expect(updated === nodes).toEqual(true)
    expect(hidden(updated)).toEqual([])
  })
})

describe(isHideable.name, () => {
  it('only accepts non-initial nodes with inbound fields', () => {
    const referenced = makeNode('referenced')
    const initial = makeNode('initial', [], [], true)
    const root = makeNode('root', [
      ['referenced', 'referenced'],
      ['initial', 'initial'],
    ])
    const standalone = makeNode('standalone')
    const nodes = [root, referenced, initial, standalone]
    const projection = getGraphProjection(nodes)

    expect(isHideable(projection, referenced)).toEqual(true)
    expect(isHideable(projection, initial)).toEqual(false)
    expect(isHideable(projection, standalone)).toEqual(false)
  })
})

describe(mapGraphItems.name, () => {
  it('updates leaves and groups without clearing group fields', () => {
    const member = makeNode('member')
    const group = {
      ...makeGroup('group', [member]),
      hiddenFields: ['group-field'],
    }

    const updated = mapGraphItems([group], (node) =>
      node.id === 'member' ? { ...node, name: 'updated' } : node,
    )

    expect(updated[0]?.hiddenFields).toEqual(['group-field'])
    expect(updated[0]?.subnodes[0]?.name).toEqual('updated')
  })

  it('preserves references when nothing changes', () => {
    const group = makeGroup('group', [makeNode('member')])
    const nodes = [group]

    const updated = mapGraphItems(nodes, (node) => node)

    expect(updated[0] === group).toEqual(true)
    expect(updated[0]?.subnodes[0] === group.subnodes[0]).toEqual(true)
  })
})

function hidden(nodes: readonly Node[]): string[] {
  return [...getGraphProjection(nodes).hiddenNodeIds].sort()
}

function makeGroup(id: string, subnodes: Node[]): Node {
  return { ...makeNode(id), addressType: 'Group', subnodes }
}

function makeNode(
  id: string,
  fields: Array<[name: string, target: string]> = [],
  hiddenFields: string[] = [],
  isInitial = false,
): Node {
  return {
    id,
    address: `test:${id}`,
    isInitial,
    hasTemplate: false,
    addressType: 'Contract',
    name: id,
    fields: fields.map(([name, target]) => ({
      name,
      target,
      box: { x: 0, y: 0, width: 0, height: 0 },
      connection: {
        from: { direction: 'left', x: 0, y: 0 },
        to: { direction: 'left', x: 0, y: 0 },
      },
    })),
    hiddenFields,
    box: { x: 0, y: 0, width: 200, height: 0 },
    color: 0,
    hueShift: 0,
    data: null,
    isReachable: true,
    opened: false,
    subnodes: [],
  }
}
