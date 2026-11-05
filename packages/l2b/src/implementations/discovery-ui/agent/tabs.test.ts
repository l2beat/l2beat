import { expect } from 'earl'
import type { ApiAgentShowEvent } from '../types'
import { AgentTabs, type TabStream } from './tabs'

describe(AgentTabs.name, () => {
  it('has no active tab until one connects', () => {
    expect(new AgentTabs().active()).toEqual(undefined)
  })

  it('makes the tab focused last the active one', () => {
    const tabs = new AgentTabs()
    tabs.connect('a', stream())
    tabs.connect('b', stream())
    tabs.report('a', 'linea', tick())
    tabs.report('b', 'arbitrum', tick())
    expect(tabs.active()).toEqual({ id: 'b', project: 'arbitrum' })
    tabs.report('a', 'linea', tick())
    expect(tabs.active()).toEqual({ id: 'a', project: 'linea' })
  })

  it('falls back to the tab focused before the active one closed', () => {
    const tabs = new AgentTabs()
    const streams = { a: stream(), b: stream(), c: stream() }
    for (const [id, s] of Object.entries(streams)) tabs.connect(id, s)
    tabs.report('b', undefined, tick())
    tabs.report('c', undefined, tick())
    tabs.report('a', undefined, tick())
    tabs.disconnect('a', streams.a)
    expect(tabs.active()?.id).toEqual('c')
  })

  it('ignores the late close of a stream its tab already replaced', () => {
    const tabs = new AgentTabs()
    const old = stream()
    const current = stream()
    tabs.connect('a', old)
    tabs.report('a', 'linea', tick())
    tabs.connect('a', current)
    tabs.disconnect('a', old)
    expect(tabs.active()).toEqual({ id: 'a', project: 'linea' })
    expect(old.ended).toEqual(true)
  })

  it('refuses a report from a tab that is not connected', () => {
    expect(new AgentTabs().report('a', undefined, tick())).toEqual(false)
  })

  it('restores the last-focused tab when every tab reconnects', () => {
    const tabs = new AgentTabs()
    tabs.connect('a', stream())
    tabs.connect('b', stream())
    tabs.report('a', 'linea', 1_000)
    tabs.report('b', 'arbitrum', 2_000)
    expect(tabs.active()).toEqual({ id: 'b', project: 'arbitrum' })
  })

  it('takes the project of a tab in the back without making it active', () => {
    const tabs = new AgentTabs()
    tabs.connect('a', stream())
    tabs.connect('b', stream())
    tabs.report('a', 'linea', tick())
    tabs.report('b', 'arbitrum', 0)
    expect(tabs.active()).toEqual({ id: 'a', project: 'linea' })
  })

  it('knows the project of a reconnected tab before it is focused', () => {
    const tabs = new AgentTabs()
    tabs.connect('a', stream())
    tabs.report('a', 'linea', 0)
    expect(tabs.active()).toEqual({ id: 'a', project: 'linea' })
  })

  it('remembers the project a show moved a tab to', () => {
    const tabs = new AgentTabs()
    tabs.connect('a', stream())
    tabs.report('a', 'arbitrum', tick())
    tabs.show('a', show('linea'))
    expect(tabs.active()).toEqual({ id: 'a', project: 'linea' })
  })

  it('clears the note in the tab that got the show, not the focused one', () => {
    const tabs = new AgentTabs()
    const a = stream()
    const b = stream()
    tabs.connect('a', a)
    tabs.connect('b', b)
    tabs.report('a', 'linea', tick())
    tabs.show('a', show('linea'))
    tabs.report('b', 'arbitrum', tick())
    expect(tabs.clearShow()).toEqual(true)
    expect(a.written.slice(1)).toEqual(['data: {"type":"clear"}\n\n'])
    expect(b.written).toEqual([])
  })

  it('clears the note of a replaced show in another tab', () => {
    const tabs = new AgentTabs()
    const a = stream()
    const b = stream()
    tabs.connect('a', a)
    tabs.connect('b', b)
    tabs.show('a', show('linea'))
    tabs.show('b', show('linea'))
    tabs.show('b', show('linea'))
    expect(a.written.slice(1)).toEqual(['data: {"type":"clear"}\n\n'])
    expect(b.written.length).toEqual(2)
  })

  it('clears in the active tab once the tab with the note is gone', () => {
    const tabs = new AgentTabs()
    const a = stream()
    const b = stream()
    tabs.connect('a', a)
    tabs.connect('b', b)
    tabs.show('a', show('linea'))
    tabs.disconnect('a', a)
    tabs.report('b', 'arbitrum', tick())
    expect(tabs.clearShow()).toEqual(true)
    expect(b.written).toEqual(['data: {"type":"clear"}\n\n'])
    expect(new AgentTabs().clearShow()).toEqual(false)
  })

  it('sends a show to its tab only', () => {
    const tabs = new AgentTabs()
    const a = stream()
    const b = stream()
    tabs.connect('a', a)
    tabs.connect('b', b)
    tabs.show('b', show('linea'))
    expect(a.written).toEqual([])
    expect(b.written).toEqual([`data: ${JSON.stringify(show('linea'))}\n\n`])
  })
})

function show(project: string): ApiAgentShowEvent {
  return { type: 'show', id: 'show-1', project, steps: [] }
}

let clock = 0
function tick(): number {
  clock += 1_000
  return clock
}

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
