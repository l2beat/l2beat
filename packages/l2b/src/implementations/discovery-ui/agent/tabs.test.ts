import { expect } from 'earl'
import { AgentTabs, type TabStream } from './tabs'

describe(AgentTabs.name, () => {
  it('has no active tab until one connects', () => {
    expect(new AgentTabs().active()).toEqual(undefined)
  })

  it('makes the tab focused last the active one', () => {
    const tabs = new AgentTabs()
    tabs.connect('a', stream())
    tabs.connect('b', stream())
    tabs.focus('a', 'linea')
    tabs.focus('b', 'arbitrum')
    expect(tabs.active()).toEqual({ id: 'b', project: 'arbitrum' })
    tabs.focus('a', 'linea')
    expect(tabs.active()).toEqual({ id: 'a', project: 'linea' })
  })

  it('falls back to the tab focused before the active one closed', () => {
    const tabs = new AgentTabs()
    const streams = { a: stream(), b: stream(), c: stream() }
    for (const [id, s] of Object.entries(streams)) tabs.connect(id, s)
    tabs.focus('b', undefined)
    tabs.focus('c', undefined)
    tabs.focus('a', undefined)
    tabs.disconnect('a', streams.a)
    expect(tabs.active()?.id).toEqual('c')
  })

  it('ignores the late close of a stream its tab already replaced', () => {
    const tabs = new AgentTabs()
    const old = stream()
    const current = stream()
    tabs.connect('a', old)
    tabs.focus('a', 'linea')
    tabs.connect('a', current)
    tabs.disconnect('a', old)
    expect(tabs.active()).toEqual({ id: 'a', project: 'linea' })
    expect(old.ended).toEqual(true)
  })

  it('refuses focus from a tab that is not connected', () => {
    expect(new AgentTabs().focus('a', undefined)).toEqual(false)
  })

  it('remembers the project a show moved a tab to', () => {
    const tabs = new AgentTabs()
    tabs.connect('a', stream())
    tabs.focus('a', 'arbitrum')
    tabs.setProject('a', 'linea')
    expect(tabs.active()).toEqual({ id: 'a', project: 'linea' })
  })

  it('sends an event to one tab only', () => {
    const tabs = new AgentTabs()
    const a = stream()
    const b = stream()
    tabs.connect('a', a)
    tabs.connect('b', b)
    tabs.send('b', { type: 'clear' })
    expect(a.written).toEqual([])
    expect(b.written).toEqual(['data: {"type":"clear"}\n\n'])
  })

  it('ends every stream on shutdown', () => {
    const tabs = new AgentTabs()
    const a = stream()
    tabs.connect('a', a)
    tabs.closeAll()
    expect(a.ended).toEqual(true)
    expect(tabs.size).toEqual(0)
  })
})

function stream(): TabStream & { written: string[]; ended: boolean } {
  const result = {
    written: [] as string[],
    ended: false,
    write: (chunk: string) => result.written.push(chunk),
    end: () => {
      result.ended = true
    },
  }
  return result
}
