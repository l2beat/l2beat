import { expect } from 'earl'
import type { Node, State } from '../State'
import { onDoubleClick } from './onDoubleClick'
import { onKeyDown } from './onKeyDown'
import { onMouseDown } from './onMouseDown'

describe('hand tool', () => {
  describe(onMouseDown.name, () => {
    it('pans on a left button press when the hand tool is active', () => {
      const state = makeState({ tool: 'hand' })

      const result = onMouseDown(state, leftClick(40, 50), container())

      expect(result.mouseMoveAction).toEqual('pan')
      expect(result.input).toEqual({
        ...state.input,
        lmbPressed: true,
        mouseStartX: 40,
        mouseStartY: 50,
        mouseX: 40,
        mouseY: 50,
      })
      expect(result.selected).toEqual(undefined)
    })

    it('starts a selection box on a left button press with the selection tool', () => {
      const state = makeState({ tool: 'select' })

      const result = onMouseDown(state, leftClick(40, 50), container())

      expect(result.mouseMoveAction).toEqual('select')
    })

    it('pans with the selection tool while space is held', () => {
      const state = makeState({ tool: 'select' })
      const withSpace = {
        ...state,
        input: { ...state.input, spacePressed: true },
      }

      const result = onMouseDown(withSpace, leftClick(40, 50), container())

      expect(result.mouseMoveAction).toEqual('pan')
    })
  })

  describe(onDoubleClick.name, () => {
    const group = makeGroup('group', [makeNode('member')])

    it('opens a group with the selection tool', () => {
      const state = makeState({ tool: 'select', nodes: [group] })

      const result = onDoubleClick(state, leftClick(10, 10), container())

      expect(result.nodes?.[0]?.opened).toEqual(true)
    })

    it('does nothing with the hand tool', () => {
      const state = makeState({ tool: 'hand', nodes: [group] })

      const result = onDoubleClick(state, leftClick(10, 10), container())

      expect(result).toEqual({})
    })
  })

  describe(onKeyDown.name, () => {
    it('selects the hand tool with H and the selection tool with V', () => {
      expect(onKeyDown(makeState({ tool: 'select' }), keyEvent('h'))).toEqual({
        tool: 'hand',
      })
      expect(onKeyDown(makeState({ tool: 'hand' }), keyEvent('v'))).toEqual({
        tool: 'select',
      })
      expect(onKeyDown(makeState({ tool: 'hand' }), keyEvent('V'))).toEqual({
        tool: 'select',
      })
    })

    it('ignores key repeat and modifier combinations', () => {
      const state = makeState({ tool: 'select' })

      expect(onKeyDown(state, keyEvent('h', { repeat: true }))).toEqual(state)
      expect(onKeyDown(state, keyEvent('h', { ctrlKey: true }))).toEqual(state)
      expect(onKeyDown(state, keyEvent('h', { metaKey: true }))).toEqual(state)
      expect(onKeyDown(state, keyEvent('v', { altKey: true }))).toEqual(state)
    })
  })
})

function leftClick(clientX: number, clientY: number): MouseEvent {
  return {
    button: 0,
    clientX,
    clientY,
    shiftKey: false,
    metaKey: false,
    altKey: false,
  } as unknown as MouseEvent
}

function keyEvent(
  key: string,
  init: Partial<
    Pick<KeyboardEvent, 'repeat' | 'ctrlKey' | 'metaKey' | 'altKey'>
  > = {},
): KeyboardEvent {
  return {
    key,
    repeat: false,
    ctrlKey: false,
    metaKey: false,
    altKey: false,
    ...init,
  } as unknown as KeyboardEvent
}

function container(): HTMLElement {
  return {
    getBoundingClientRect: () => ({ left: 0, top: 0 }),
  } as unknown as HTMLElement
}

function makeGroup(id: string, subnodes: Node[]): Node {
  return { ...makeNode(id), addressType: 'Group', subnodes }
}

function makeNode(id: string): Node {
  return {
    id,
    address: `test:${id}`,
    isInitial: false,
    hasTemplate: false,
    addressType: 'Contract',
    name: id,
    fields: [],
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

function makeState(overrides: Partial<State>): State {
  return {
    projectId: 'test',
    nodes: [],
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
    tool: 'select',
    loaded: true,
    ...overrides,
  }
}
