import { expect } from 'earl'
import type { ApiAgentShowEvent } from '../../../api/types'
import { useAgentStore } from './store'

const SHOW: ApiAgentShowEvent = {
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
    useAgentStore.getState().goTo(0.5)
    expect(useAgentStore.getState().index).toEqual(1)
  })

  it('drops the show on clear', () => {
    useAgentStore.getState().start(SHOW)
    useAgentStore.getState().clear()
    expect(useAgentStore.getState().show).toEqual(undefined)
  })
})
