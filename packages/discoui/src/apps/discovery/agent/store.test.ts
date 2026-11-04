import { expect } from 'earl'
import { type AgentShow, isStepIndex, useAgentStore } from './store'

const SHOW: AgentShow = {
  type: 'show',
  id: 'show-1',
  project: 'linea',
  steps: [
    { note: 'One', select: [] },
    { note: 'Two', select: ['eth:0x1'] },
  ],
}

describe('useAgentStore', () => {
  afterEach(() => useAgentStore.getState().clear())

  it('starts a show at its first step', () => {
    useAgentStore.getState().start(SHOW)
    useAgentStore.getState().goTo(1)
    useAgentStore.getState().start({ ...SHOW, id: 'show-2' })
    expect(useAgentStore.getState().index).toEqual(0)
  })

  it('pages only within the steps', () => {
    useAgentStore.getState().start(SHOW)
    useAgentStore.getState().goTo(1)
    useAgentStore.getState().goTo(2)
    expect(useAgentStore.getState().index).toEqual(1)
    useAgentStore.getState().goTo(-1)
    expect(useAgentStore.getState().index).toEqual(1)
  })

  it('drops the show on clear', () => {
    useAgentStore.getState().start(SHOW)
    useAgentStore.getState().clear()
    expect(useAgentStore.getState().show).toEqual(undefined)
  })
})

describe(isStepIndex.name, () => {
  it('accepts whole indexes below the step count', () => {
    expect(isStepIndex(0, 2)).toEqual(true)
    expect(isStepIndex(1, 2)).toEqual(true)
    expect(isStepIndex(2, 2)).toEqual(false)
    expect(isStepIndex(-1, 2)).toEqual(false)
    expect(isStepIndex(0.5, 2)).toEqual(false)
  })
})
