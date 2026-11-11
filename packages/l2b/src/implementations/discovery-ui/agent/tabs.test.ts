import { expect } from 'earl'
import type { ApiAgentBoard, ApiAgentShowEvent } from '../types'
import { AgentTabs, type TabReport, type TabStream } from './tabs'

describe(AgentTabs.name, () => {
  it('has no active tab until one connects', () => {
    expect(new AgentTabs().active()).toEqual(undefined)
  })

  it('makes the tab focused last the active one', () => {
    const tabs = new AgentTabs()
    tabs.connect('a', stream())
    tabs.connect('b', stream())
    tabs.report('a', at('linea', tick()))
    tabs.report('b', at('arbitrum', tick()))
    expect(tabs.active()).toEqual({ id: 'b', project: 'arbitrum' })
    tabs.report('a', at('linea', tick()))
    expect(tabs.active()).toEqual({ id: 'a', project: 'linea' })
  })

  it('falls back to the tab focused before the active one closed', () => {
    const tabs = new AgentTabs()
    const streams = { a: stream(), b: stream(), c: stream() }
    for (const [id, s] of Object.entries(streams)) tabs.connect(id, s)
    tabs.report('b', at(undefined, tick()))
    tabs.report('c', at(undefined, tick()))
    tabs.report('a', at(undefined, tick()))
    tabs.disconnect('a', streams.a)
    expect(tabs.active()?.id).toEqual('c')
  })

  it('ignores the late close of a stream its tab already replaced', () => {
    const tabs = new AgentTabs()
    const old = stream()
    const current = stream()
    tabs.connect('a', old)
    tabs.report('a', at('linea', tick()))
    tabs.connect('a', current)
    tabs.disconnect('a', old)
    expect(tabs.active()).toEqual({ id: 'a', project: 'linea' })
    expect(old.ended).toEqual(true)
  })

  it('refuses a report from a tab that is not connected', () => {
    expect(new AgentTabs().report('a', at(undefined, tick()))).toEqual(false)
  })

  it('ignores a report older than the one it applied', () => {
    const tabs = new AgentTabs()
    tabs.connect('a', stream())
    const older = at('arbitrum', 1_000)
    const newer = at('linea', 2_000)
    tabs.report('a', newer)
    tabs.report('a', older)
    expect(tabs.active()).toEqual({ id: 'a', project: 'linea' })
  })

  it('restores the last-focused tab when every tab reconnects', () => {
    const tabs = new AgentTabs()
    tabs.connect('a', stream())
    tabs.connect('b', stream())
    tabs.report('a', at('linea', 1_000))
    tabs.report('b', at('arbitrum', 2_000))
    expect(tabs.active()).toEqual({ id: 'b', project: 'arbitrum' })
  })

  it('takes the project of a tab in the back without making it active', () => {
    const tabs = new AgentTabs()
    tabs.connect('a', stream())
    tabs.connect('b', stream())
    tabs.report('a', at('linea', tick()))
    tabs.report('b', at('arbitrum', 0))
    expect(tabs.active()).toEqual({ id: 'a', project: 'linea' })
  })

  it('knows the project of a reconnected tab before it is focused', () => {
    const tabs = new AgentTabs()
    tabs.connect('a', stream())
    tabs.report('a', at('linea', 0))
    expect(tabs.active()).toEqual({ id: 'a', project: 'linea' })
  })

  it('remembers the project a show moved a tab to', () => {
    const tabs = new AgentTabs()
    tabs.connect('a', stream())
    tabs.report('a', at('arbitrum', tick()))
    tabs.show('a', show('linea'))
    expect(tabs.active()).toEqual({ id: 'a', project: 'linea' })
  })

  it('clears the note in the tab that got the show, not the focused one', () => {
    const tabs = new AgentTabs()
    const a = stream()
    const b = stream()
    tabs.connect('a', a)
    tabs.connect('b', b)
    tabs.report('a', at('linea', tick()))
    tabs.show('a', show('linea'))
    tabs.report('b', at('arbitrum', tick()))
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
    tabs.report('b', at('arbitrum', tick()))
    expect(tabs.clearShow()).toEqual(true)
    expect(b.written).toEqual(['data: {"type":"clear"}\n\n'])
    expect(new AgentTabs().clearShow()).toEqual(false)
  })

  it('resolves a context request with the answer of the tab asked', async () => {
    const tabs = new AgentTabs()
    const a = stream()
    tabs.connect('a', a)
    const answer = tabs.askContext('a', 1_000)
    const request = JSON.parse(a.written[0]?.slice('data: '.length) ?? '')
    const context = { project: 'linea', selected: [] }
    expect(tabs.answerContext('b', request.id, context)).toEqual(false)
    expect(tabs.answerContext('a', request.id, context)).toEqual(true)
    expect(await answer).toEqual(context)
    expect(tabs.answerContext('a', request.id, context)).toEqual(false)
  })

  it('gives up on a tab that does not answer', async () => {
    const tabs = new AgentTabs()
    tabs.connect('a', stream())
    expect(await tabs.askContext('a', 1)).toEqual(undefined)
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

  it('keeps one board, in the tab it went to last, across reloads', () => {
    const tabs = new AgentTabs()
    const a = stream({ withReplays: true })
    const b = stream({ withReplays: true })
    tabs.connect('a', a)
    tabs.connect('b', b)
    // A tab that connects learns it has no board.
    expect(a.written).toEqual([replay(null)])
    tabs.showBoard('a', board('first'))
    const reloaded = stream({ withReplays: true })
    tabs.connect('a', reloaded)
    expect(reloaded.written).toEqual([replay(board('first'))])
    // The board moves, and the tab that had it drops it.
    tabs.showBoard('b', board('second'))
    expect(reloaded.written.at(-1)).toEqual(replay(null))
    expect(b.written.at(-1)).toEqual(
      `data: ${JSON.stringify({ type: 'board', board: board('second') })}\n\n`,
    )
    expect(tabs.tab('b')).toEqual({ id: 'b', project: 'linea' })
  })
})

function board(title: string): ApiAgentBoard {
  return { id: title, project: 'linea', title, blocks: [] }
}

function replay(board: ApiAgentBoard | null): string {
  return `data: ${JSON.stringify({ type: 'board-replay', board })}\n\n`
}

function show(project: string): ApiAgentShowEvent {
  return { type: 'show', id: 'show-1', project, steps: [] }
}

let sequence = 0
function at(project: string | undefined, focusedAt: number): TabReport {
  sequence++
  return { project, focusedAt, sequence }
}

let clock = 0
function tick(): number {
  clock += 1_000
  return clock
}

// Every tab gets a board replay as it connects; most tests look at the rest.
function stream(
  options = { withReplays: false },
): TabStream & { written: string[]; ended: boolean } {
  const result = {
    written: [] as string[],
    ended: false,
    write: (chunk: string) => {
      if (options.withReplays || !chunk.includes('"board-replay"')) {
        result.written.push(chunk)
      }
    },
    end: () => {
      result.ended = true
    },
  }
  return result
}
