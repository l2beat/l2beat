import { expect } from 'earl'
import { applyStoredLayout } from '../actions/applyStoredLayout'
import { hideSelected } from '../actions/other'
import type { Node, State } from '../State'
import { applyFieldVisibility, planFieldVisibility } from './fieldVisibility'
import { getGraphProjection } from './graphProjection'

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
  })
})

describe(planFieldVisibility.name, () => {
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

    const updated = setVisibility(nodes, new Set(['target']), true)

    expect(updated[0]?.hiddenFields).toEqual(['owner'])
    expect(updated[1]?.hiddenFields).toEqual(['members[0]'])
    expect(hidden(updated)).toEqual(['target'])
  })

  it('shows a node by restoring all of its inbound fields', () => {
    const nodes = [
      makeNode('root', [['owner', 'target']], ['owner']),
      makeNode('target'),
    ]

    const updated = setVisibility(nodes, new Set(['target']), false)

    expect(updated[0]?.hiddenFields).toEqual([])
    expect(hidden(updated)).toEqual([])
  })

  it('restores a cascade by showing all derived hidden targets', () => {
    const nodes = [
      makeNode('root', [['middle', 'middle']], ['middle']),
      makeNode('middle', [['target', 'target']]),
      makeNode('target'),
    ]
    const hiddenIds = getGraphProjection(nodes).hiddenNodeIdSet

    const updated = setVisibility(nodes, hiddenIds, false)

    expect(updated[0]?.hiddenFields).toEqual([])
    expect(hidden(updated)).toEqual([])
  })

  it('expands group targets to their members', () => {
    const group = makeGroup('group', [makeNode('member')])
    const nodes = [makeNode('root', [['member', 'member']]), group]

    const updated = setVisibility(nodes, new Set(['group']), true)

    expect(updated[0]?.hiddenFields).toEqual(['member'])
    expect(hidden(updated)).toEqual(['group', 'member'])
  })

  it('keeps standalone targets and node references unchanged', () => {
    const nodes = [makeNode('standalone')]

    const updated = setVisibility(nodes, new Set(['standalone']), true)

    expect(updated[0] === nodes[0]).toEqual(true)
  })

  it('does not hide initial targets', () => {
    const nodes = [
      makeNode('root', [['initial', 'initial']]),
      makeNode('initial', [], [], true),
    ]

    const updated = setVisibility(nodes, new Set(['initial']), true)

    expect(updated[0] === nodes[0]).toEqual(true)
    expect(hidden(updated)).toEqual([])
  })
})

describe(applyStoredLayout.name, () => {
  it('translates legacy hidden group ids into hidden inbound fields', () => {
    const group = makeGroup('group', [makeNode('member')])
    const state = makeState([makeNode('root', [['member', 'member']]), group])

    const result = applyStoredLayout(
      state,
      {
        version: 4,
        projectId: 'test',
        locations: {},
        hiddenNodes: ['group'],
      },
      'merge',
    )

    expect(result.nodes?.[0]?.hiddenFields).toEqual(['member'])
  })

  it('unions hidden fields in merge mode', () => {
    const state = makeState([
      makeNode(
        'root',
        [
          ['first', 'first'],
          ['second', 'second'],
        ],
        ['first'],
      ),
      makeNode('first'),
      makeNode('second'),
    ])

    const result = applyStoredLayout(
      state,
      {
        version: 4,
        projectId: 'test',
        locations: {},
        hiddenFields: { root: ['second'] },
      },
      'merge',
    )

    expect(result.nodes?.[0]?.hiddenFields).toEqual(['first', 'second'])
  })

  it('clears nested hidden fields in replace mode', () => {
    const member = makeNode('member', [['owner', 'target']], ['owner'])
    const state = makeState([makeGroup('group', [member]), makeNode('target')])

    const result = applyStoredLayout(
      state,
      { version: 4, projectId: 'test', locations: {} },
      'replace',
    )

    expect(result.nodes?.[0]?.subnodes[0]?.hiddenFields).toEqual([])
  })
})

describe(hideSelected.name, () => {
  it('keeps selection when a standalone node cannot be hidden', () => {
    const state = {
      ...makeState([makeNode('standalone')]),
      selected: ['standalone'],
    }

    expect(hideSelected(state)).toEqual({})
  })
})

function hidden(nodes: Node[]): string[] {
  return [...getGraphProjection(nodes).hiddenNodeIds].sort()
}

function setVisibility(
  nodes: Node[],
  itemIds: ReadonlySet<string>,
  hidden: boolean,
): Node[] {
  const projection = getGraphProjection(nodes)
  const plan = planFieldVisibility(projection, itemIds, hidden)
  return applyFieldVisibility(nodes, plan)
}

function makeGroup(id: string, subnodes: Node[]): Node {
  return { ...makeNode(id), addressType: 'Group', subnodes }
}

function makeState(nodes: Node[]): State {
  return {
    projectId: 'test',
    nodes,
    selected: [],
    history: { past: [], future: [] },
    userPreferences: {
      enableDimming: true,
      hideLargeArrays: true,
      highlightOverlapping: true,
      useExperimentalRenderer: false,
    },
    transform: { offsetX: 0, offsetY: 0, scale: 1 },
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
