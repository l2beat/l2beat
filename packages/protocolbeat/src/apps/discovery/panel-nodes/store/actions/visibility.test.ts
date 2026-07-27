import { expect } from 'earl'
import type { Field, Node, State } from '../State'
import { getGraphProjection } from '../utils/graphProjection'
import { applyStoredLayout } from './applyStoredLayout'
import { collectOutgoingFields, groupSelected } from './group'
import { hideSelected, showHidden } from './other'

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

  it('imports hidden fields for groups', () => {
    const group = {
      ...makeGroup('group', [makeNode('member')]),
      fields: [makeField('group-row', 'target')],
    }
    const state = makeState([group, makeNode('target')])

    const result = applyStoredLayout(
      state,
      {
        version: 4,
        projectId: 'test',
        locations: {},
        hiddenFields: { group: ['group-row'] },
      },
      'merge',
    )

    expect(result.nodes?.[0]?.hiddenFields).toEqual(['group-row'])
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

describe(showHidden.name, () => {
  it('clears every hidden value, including group rows', () => {
    const root = makeNode(
      'root',
      [
        ['manual', 'target'],
        ['visible', 'target'],
      ],
      ['manual'],
    )
    const group = {
      ...makeGroup('group', [makeNode('member')]),
      fields: [makeField('group-row', 'target')],
      hiddenFields: ['group-row'],
    }
    const state = makeState([root, makeNode('target'), group])

    const result = showHidden(state)
    const nodes = result.nodes ?? []

    expect(nodes[0]?.hiddenFields).toEqual([])
    expect(nodes[2]?.hiddenFields).toEqual([])
    expect(getGraphProjection(nodes).hiddenFieldCount).toEqual(0)
  })
})

describe(collectOutgoingFields.name, () => {
  it('gives every synthetic group row a stable identity and display label', () => {
    const member = makeNode('member', [
      ['first', 'first-target'],
      ['second', 'second-target'],
    ])

    const fields = collectOutgoingFields([member])

    expect(fields.map((field) => field.name)).toEqual([
      'group-field:first-target',
      'group-field:second-target',
    ])
    expect(fields.map((field) => field.label)).toEqual(['member', 'member'])
  })
})

describe(groupSelected.name, () => {
  it('drops hidden group fields whose target leaves the group', () => {
    const first = makeNode('first', [['outgoing', 'target']])
    const existingGroup = {
      ...makeGroup('existing-group', [first, makeNode('second')]),
      fields: collectOutgoingFields([first, makeNode('second')]),
      hiddenFields: ['group-field:target'],
    }
    const state = {
      ...makeState([existingGroup, makeNode('third'), makeNode('target')]),
      selected: ['first', 'third'],
    }

    const result = groupSelected(state)
    const rebuilt = result.nodes?.find((node) => node.id === 'existing-group')

    expect(rebuilt?.fields).toEqual([])
    expect(rebuilt?.hiddenFields).toEqual([])
  })
})

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
    fields: fields.map(([name, target]) => makeField(name, target)),
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

function makeField(name: string, target: string): Field {
  return {
    name,
    target,
    box: { x: 0, y: 0, width: 0, height: 0 },
    connection: {
      from: { direction: 'left', x: 0, y: 0 },
      to: { direction: 'left', x: 0, y: 0 },
    },
  }
}
