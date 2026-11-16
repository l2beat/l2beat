import { expect } from 'earl'
import type { Box, Field, Node, State } from '../State'
import { getGraphProjection } from '../utils/graphProjection'
import { updateNodePositions } from '../utils/updateNodePositions'
import { arrange, readArrangement } from './arrange'

// Small hand-built graphs, arranged without a viewport, so the lanes start
// at the origin; each test reads the boxes and hidden contracts back.
describe(arrange.name, () => {
  // bridge (initial) → inbox → rollup, bridge → admin; lonely has no links.
  function flowState(): State {
    return makeState([
      makeNode(
        'eth:bridge',
        [
          ['inbox', 'eth:inbox'],
          ['admin', 'eth:admin'],
        ],
        true,
      ),
      makeNode('eth:inbox', [['rollup', 'eth:rollup']]),
      makeNode('eth:rollup'),
      makeNode('eth:admin'),
      makeNode('eth:lonely'),
    ])
  }

  it('keeps the others drawn, below the lanes', () => {
    const lanes = [[['eth:bridge'], ['eth:inbox']], [['eth:rollup']]]

    const state = arranged(flowState(), lanes, false)
    const boxes = boxesById(state)

    expect(getGraphProjection(state.nodes).hiddenNodeIds.size).toEqual(0)
    expect(left(boxes, 'eth:bridge') < left(boxes, 'eth:inbox')).toEqual(true)
    const firstLaneBottom = Math.max(
      bottom(boxes, 'eth:bridge'),
      bottom(boxes, 'eth:inbox'),
    )
    expect(top(boxes, 'eth:rollup') > firstLaneBottom).toEqual(true)
    for (const other of ['eth:admin', 'eth:lonely']) {
      expect(top(boxes, other) > bottom(boxes, 'eth:rollup')).toEqual(true)
    }
    expect(readArrangement(state, lanes)).toEqual({
      placed: ['eth:bridge', 'eth:inbox', 'eth:rollup'],
      below: state.nodes.filter((node) =>
        ['eth:admin', 'eth:lonely'].includes(node.id),
      ),
      notDrawn: [],
    })
  })

  it('hides what the lanes do not name, as far as hiding allows', () => {
    const lanes = [[['eth:bridge'], ['eth:inbox']]]

    const state = arranged(flowState(), lanes, true)
    const hidden = getGraphProjection(state.nodes).hiddenNodeIds

    expect([...hidden].sort()).toEqual(['eth:admin', 'eth:rollup'])
    // Nothing links to lonely, so no hidden link can hide it.
    expect(readArrangement(state, lanes).below.map((node) => node.id)).toEqual([
      'eth:lonely',
    ])
    expect(top(boxesById(state), 'eth:lonely')).toBeGreaterThan(
      bottom(boxesById(state), 'eth:bridge'),
    )
  })

  it('shows hidden contracts the lanes name before hiding the others', () => {
    const start = flowState()
    const bridge = start.nodes[0] as Node
    const withHiddenInbox = {
      ...start,
      nodes: [{ ...bridge, hiddenFields: ['inbox'] }, ...start.nodes.slice(1)],
    }

    const state = arranged(withHiddenInbox, [[['eth:inbox']]], true)

    expect(
      getGraphProjection(state.nodes).hiddenNodeIds.has('eth:inbox'),
    ).toEqual(false)
  })

  it('does not place a named contract only the hidden others link to', () => {
    const lanes = [[['eth:bridge'], ['eth:rollup']]]

    const state = arranged(flowState(), lanes, true)
    const arrangement = readArrangement(state, lanes)

    expect(arrangement.placed).toEqual(['eth:bridge'])
    expect(arrangement.notDrawn).toEqual(['eth:rollup'])
  })

  it('moves a group as one unit, placed where its first member is named', () => {
    const group: Node = {
      ...makeNode('group:admins'),
      addressType: 'Group',
      box: box(500, 500, 200, 100),
      subnodes: [
        { ...makeNode('eth:proxyAdmin'), box: box(500, 500, 200, 50) },
        { ...makeNode('eth:safe'), box: box(500, 550, 200, 50) },
      ],
    }
    const start = makeState([
      makeNode('eth:bridge', [['admin', 'eth:proxyAdmin']], true),
      group,
    ])
    const lanes = [[['eth:bridge'], ['eth:safe'], ['eth:proxyAdmin']]]

    const state = arranged(start, lanes, false)
    const moved = state.nodes[1] as Node
    const dx = moved.box.x - 500
    const dy = moved.box.y - 500

    expect(moved.box.x).toEqual(
      left(boxesById(state), 'eth:bridge') + 200 + 160,
    )
    expect(moved.subnodes.map((node) => [node.box.x, node.box.y])).toEqual([
      [500 + dx, 500 + dy],
      [500 + dx, 550 + dy],
    ])
    expect(readArrangement(state, lanes).placed).toEqual([
      'eth:bridge',
      'group:admins',
    ])
  })

  // graph lists every member of a drawn group, so each of them names it.
  it('places a drawn group named by a member that is hidden', () => {
    const group: Node = {
      ...makeNode('group:admins'),
      addressType: 'Group',
      box: box(500, 500, 200, 100),
      subnodes: [makeNode('eth:proxyAdmin'), makeNode('eth:safe')],
    }
    const bridge = makeNode('eth:bridge', [['admin', 'eth:proxyAdmin']], true)
    const start = makeState([{ ...bridge, hiddenFields: ['admin'] }, group])
    const lanes = [[['eth:bridge'], ['eth:proxyAdmin']]]

    const state = arranged(start, lanes, false)

    expect(
      getGraphProjection(state.nodes).hiddenNodeIds.has('eth:proxyAdmin'),
    ).toEqual(true)
    expect(readArrangement(state, lanes)).toEqual({
      placed: ['eth:bridge', 'group:admins'],
      below: [],
      notDrawn: [],
    })
  })
})

function arranged(state: State, lanes: string[][][], hideOthers: boolean) {
  return { ...state, ...arrange(state, { lanes, hideOthers }) }
}

function boxesById(state: State): Map<string, Box> {
  return new Map(state.nodes.map((node) => [node.id, node.box]))
}

function left(boxes: Map<string, Box>, id: string): number {
  return boxOf(boxes, id).x
}

function top(boxes: Map<string, Box>, id: string): number {
  return boxOf(boxes, id).y
}

function bottom(boxes: Map<string, Box>, id: string): number {
  const found = boxOf(boxes, id)
  return found.y + found.height
}

function boxOf(boxes: Map<string, Box>, id: string): Box {
  const found = boxes.get(id)
  if (found === undefined) {
    throw new Error('No box for this id')
  }
  return found
}

function box(x: number, y: number, width: number, height: number): Box {
  return { x, y, width, height }
}

// Laid out once, so the boxes have the heights a loaded node view draws.
function makeState(nodes: Node[]): State {
  return updateNodePositions({
    projectId: 'test',
    nodes,
    selected: [],
    history: { past: [], future: [] },
    userPreferences: {
      enableDimming: true,
      hideLargeArrays: true,
      highlightOverlapping: true,
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
    tool: 'select',
    loaded: true,
    loadCount: 1,
  })
}

function makeNode(
  id: string,
  fields: Array<[name: string, target: string]> = [],
  isInitial = false,
): Node {
  return {
    id,
    address: id,
    isInitial,
    hasTemplate: false,
    addressType: 'Contract',
    name: id,
    fields: fields.map(([name, target]) => makeField(name, target)),
    hiddenFields: [],
    compressedRows: [],
    box: box(0, 0, 200, 0),
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
    box: box(0, 0, 0, 0),
    connection: {
      from: { direction: 'left', x: 0, y: 0 },
      to: { direction: 'left', x: 0, y: 0 },
    },
  }
}
