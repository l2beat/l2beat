import { expect } from 'earl'
import type { Node, State } from '../State'
import { updateNodePositions } from './updateNodePositions'

describe('updateNodePositions', () => {
  it('returns the same state object when nothing changed', () => {
    const state = buildState([
      makeNode('a', 0, 0, [['field', 'b']]),
      makeNode('b', 400, 0, []),
    ])

    const result = updateNodePositions(state)

    expect(result === state).toEqual(true)
  })

  it('reuses untouched node and field references during drag', () => {
    const state = buildState([
      makeNode('a', 0, 0, [['field', 'c']]),
      makeNode('b', 400, 0, []),
      makeNode('c', 800, 0, []),
    ])

    const untouchedNode = state.nodes[0] as Node
    const untouchedField = untouchedNode.fields[0]
    const movedNode = state.nodes[1] as Node

    const result = updateNodePositions(state, {
      input: {
        ...state.input,
        mouseStartX: 0,
        mouseStartY: 0,
        mouseX: 50,
        mouseY: 25,
      },
      positionsBeforeMove: {
        [movedNode.id]: { x: movedNode.box.x, y: movedNode.box.y },
      },
    })

    expect(result.nodes[0] === untouchedNode).toEqual(true)
    expect(result.nodes[0]?.fields[0] === untouchedField).toEqual(true)
    expect(result.nodes[1] === movedNode).toEqual(false)
  })

  it('recomputes fields when hidden field membership changes with the same count', () => {
    const state = buildState([
      makeNode(
        'a',
        0,
        0,
        [
          ['first', 'b'],
          ['second', 'c'],
          ['third', 'd'],
        ],
        ['second'],
      ),
      makeNode('b', 400, 0, []),
      makeNode('c', 800, 0, []),
      makeNode('d', 1200, 0, []),
    ])

    const nextNode: Node = {
      ...(state.nodes[0] as Node),
      hiddenFields: ['first'],
    }

    const result = updateNodePositions(state, {
      nodes: [nextNode, ...state.nodes.slice(1)],
    })

    expect(result.nodes[0] === nextNode).toEqual(false)
    expect(result.nodes[0]?.fields[1] === nextNode.fields[1]).toEqual(false)
    expect(
      result.nodes[0]?.fields[1]?.connection.from.y ===
        nextNode.fields[1]?.connection.from.y,
    ).toEqual(false)
  })

  it('updates connections when target nodes move outside drag state', () => {
    const state = buildState([
      makeNode('a', 0, 0, [['field', 'b']]),
      makeNode('b', 400, 0, []),
    ])

    const oldConnection = (state.nodes[0] as Node).fields[0]?.connection
    const movedTarget: Node = {
      ...(state.nodes[1] as Node),
      box: {
        ...(state.nodes[1] as Node).box,
        x: 900,
        y: 200,
      },
    }

    const result = updateNodePositions(state, {
      nodes: [state.nodes[0] as Node, movedTarget],
    })

    expect(result.nodes[0]?.fields[0]?.connection === oldConnection).toEqual(
      false,
    )
    expect(
      result.nodes[0]?.fields[0]?.connection.to.y === oldConnection?.to.y,
    ).toEqual(false)
  })

  it('recomputes fields when hidden fields change from non-empty to empty', () => {
    const state = buildState([
      makeNode(
        'a',
        0,
        0,
        [
          ['first', 'b'],
          ['second', 'c'],
        ],
        ['first'],
      ),
      makeNode('b', 400, 0, []),
      makeNode('c', 800, 0, []),
    ])

    const nextNode: Node = {
      ...(state.nodes[0] as Node),
      hiddenFields: [],
    }

    const result = updateNodePositions(state, {
      nodes: [nextNode, ...state.nodes.slice(1)],
    })

    expect(result.nodes[0]?.fields[1] === nextNode.fields[1]).toEqual(false)
    expect(
      result.nodes[0]?.fields[1]?.connection.from.y ===
        nextNode.fields[1]?.connection.from.y,
    ).toEqual(false)
  })

  it('recomputes fields when node fields are replaced with fresh data', () => {
    const state = buildState([
      makeNode('a', 0, 0, [['field', 'b']]),
      makeNode('b', 400, 0, []),
    ])

    const refreshedNode: Node = {
      ...(state.nodes[0] as Node),
      fields: [
        {
          ...(state.nodes[0] as Node).fields[0]!,
          box: { x: 0, y: 0, width: 0, height: 0 },
          connection: {
            from: { direction: 'left', x: 0, y: 0 },
            to: { direction: 'left', x: 0, y: 0 },
          },
        },
      ],
    }

    const result = updateNodePositions(state, {
      nodes: [refreshedNode, state.nodes[1] as Node],
    })

    expect(result.nodes[0]?.fields[0] === refreshedNode.fields[0]).toEqual(
      false,
    )
    expect(result.nodes[0]?.fields[0]?.connection.to.x === 0).toEqual(false)
  })
})

function buildState(nodes: Node[]): State {
  return updateNodePositions({
    projectId: 'test',
    nodes,
    selected: [],
    hidden: [],
    history: {
      past: [],
      future: [],
    },
    userPreferences: {
      enableDimming: true,
      hideLargeArrays: false,
    },
    transform: {
      offsetX: 0,
      offsetY: 0,
      scale: 1,
    },
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
  })
}

function makeNode(
  id: string,
  x: number,
  y: number,
  fields: Array<[name: string, target: string]>,
  hiddenFields: string[] = [],
): Node {
  return {
    id,
    address: `test:${id}`,
    isInitial: false,
    hasTemplate: false,
    addressType: 'Contract',
    name: id,
    fields: fields.map(([name, target]) => ({
      name,
      target,
      box: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      connection: {
        from: { direction: 'left', x: 0, y: 0 },
        to: { direction: 'left', x: 0, y: 0 },
      },
    })),
    hiddenFields,
    box: {
      x,
      y,
      width: 200,
      height: 0,
    },
    color: 0,
    hueShift: 0,
    data: null,
    isReachable: true,
  }
}
