import { expect } from 'earl'
import { EventEmitter } from 'events'
import type { Request, Response } from 'express'
import { AgentSession } from './session'

interface Receipt {
  applied?: boolean
  unavailable?: boolean
}

describe(AgentSession.name, () => {
  it('takes a tab that acts over one that cannot', async () => {
    const session = new AgentSession<unknown, Receipt>()
    const background = connectTab(session)
    connectTab(session)

    const request = session.request({ type: 'view' })
    const id = background.lastEventId()
    session.receive(id, { unavailable: true })
    session.receive(id, { applied: true })

    expect(await request).toEqual({ tabs: 2, receipt: { applied: true } })
  })

  it('confirms nothing when a tab stays silent', async () => {
    const session = new AgentSession<unknown, Receipt>()
    const tab = connectTab(session)
    connectTab(session)

    const request = session.request({ type: 'view' }, 10)
    session.receive(tab.lastEventId(), { unavailable: true })

    expect(await request).toEqual({ tabs: 2, receipt: undefined })
  })

  it('answers unavailable once every tab said so', async () => {
    const session = new AgentSession<unknown, Receipt>()
    const tab = connectTab(session)

    const request = session.request({ type: 'view' }, 60_000)
    session.receive(tab.lastEventId(), { unavailable: true })

    expect(await request).toEqual({ tabs: 1, receipt: { unavailable: true } })
  })
})

// Each tab's connection is closed after the test, which stops its keepalive.
const tabs: EventEmitter[] = []
afterEach(() => {
  for (const tab of tabs.splice(0)) tab.emit('close')
})

function connectTab(session: AgentSession<unknown, Receipt>) {
  const req = Object.assign(new EventEmitter(), { query: { protocol: '2' } })
  const frames: string[] = []
  const res = { writeHead: () => res, write: (f: string) => frames.push(f) }
  session.connect(req as unknown as Request, res as unknown as Response)
  tabs.push(req)
  return {
    lastEventId(): string {
      const data = frames.at(-1)?.slice('data: '.length) ?? '{}'
      return JSON.parse(data).id
    },
  }
}
