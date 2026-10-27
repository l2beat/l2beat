import { expect } from 'earl'
import { usePanelStore } from '../store/panel-store'
import { type AgentShow, toFocus, useAgentStore } from './store'

const SHOW: AgentShow = {
  type: 'show',
  id: 'boot-7',
  project: 'arbitrum',
  steps: [
    { note: 'one', paths: [['a', 'b']], nodes: ['c'] },
    { note: 'two', paths: [], nodes: ['d'] },
  ],
}

describe(toFocus.name, () => {
  it('focuses the contract of a step that only points at code', () => {
    const show: AgentShow = {
      ...SHOW,
      steps: [{ note: 'code', paths: [], nodes: [], select: 'bridge' }],
    }
    expect([...toFocus(show, 0).nodes]).toEqual(['bridge'])
  })

  it('collects every contract of a step and keys the step', () => {
    const focus = toFocus(SHOW, 0)
    expect(focus.key).toEqual('boot-7:0')
    expect([...focus.nodes]).toEqual(['a', 'b', 'c'])
    expect(focus.stepCount).toEqual(2)
  })
})

describe('useAgentStore', () => {
  beforeEach(() => useAgentStore.getState().clear())

  it('starts on the first step in path view and stays within the tour', () => {
    const store = useAgentStore.getState()
    store.setView('graph')
    store.start(SHOW)
    expect(useAgentStore.getState().view).toEqual('path')
    store.goToStep(1)
    expect(useAgentStore.getState().focus?.step.note).toEqual('two')
    store.goToStep(2)
    expect(useAgentStore.getState().focus?.stepIndex).toEqual(1)
  })

  it('puts the selection back on clear unless the researcher changed it', () => {
    usePanelStore.getState().select(['mine'])
    useAgentStore.getState().start(SHOW)
    useAgentStore.getState().selectForAgent('b')
    useAgentStore.getState().clear()
    expect(usePanelStore.getState().selected).toEqual(['mine'])

    useAgentStore.getState().start(SHOW)
    useAgentStore.getState().selectForAgent('b')
    usePanelStore.getState().select(['picked'])
    useAgentStore.getState().clear()
    expect(usePanelStore.getState().selected).toEqual(['picked'])
  })

  it('forgets everything on clear', () => {
    useAgentStore.getState().start(SHOW)
    useAgentStore.getState().clear()
    expect(useAgentStore.getState().focus).toEqual(undefined)
    expect(useAgentStore.getState().show).toEqual(undefined)
  })
})
