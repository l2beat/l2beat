import { expect } from 'earl'
import type { State } from '../State'
import { onKeyDown } from './onKeyDown'
import { onMouseDown } from './onMouseDown'

describe('hand tool', () => {
  describe(onMouseDown.name, () => {
    it('pans on a left button press when the hand tool is active', () => {
      const state = makeState({ tool: 'hand' })

      const result = onMouseDown(
        state,
        mouseEvent({ button: 0, clientX: 40, clientY: 50 }),
        container(),
      )

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

    it('starts a selection box on a left button press with the select tool', () => {
      const state = makeState({ tool: 'select' })

      const result = onMouseDown(
        state,
        mouseEvent({ button: 0, clientX: 40, clientY: 50 }),
        container(),
      )

      expect(result.mouseMoveAction).toEqual('select')
    })
  })

  describe(onKeyDown.name, () => {
    it('toggles the hand tool with H', () => {
      expect(onKeyDown(makeState({ tool: 'select' }), keyEvent('h'))).toEqual({
        tool: 'hand',
      })
      expect(onKeyDown(makeState({ tool: 'hand' }), keyEvent('H'))).toEqual({
        tool: 'select',
      })
    })

    it('ignores key repeat and modifier combinations', () => {
      const state = makeState({ tool: 'select' })

      expect(onKeyDown(state, keyEvent('h', { repeat: true }))).toEqual(state)
      expect(onKeyDown(state, keyEvent('h', { ctrlKey: true }))).toEqual(state)
      expect(onKeyDown(state, keyEvent('h', { metaKey: true }))).toEqual(state)
      expect(onKeyDown(state, keyEvent('h', { altKey: true }))).toEqual(state)
    })
  })
})

function mouseEvent(init: {
  button: number
  clientX: number
  clientY: number
}): MouseEvent {
  return {
    ...init,
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
