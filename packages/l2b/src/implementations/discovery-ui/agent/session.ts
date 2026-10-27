import { randomUUID } from 'crypto'
import type { Request, Response } from 'express'

const KEEPALIVE_INTERVAL_MS = 15_000
// Bumped when tabs need new code to handle an event. A tab loaded before
// views existed would misread one, so it gets only what it understands.
export const AGENT_PROTOCOL = 2
const VIEW_PROTOCOL = 2
const RECEIPT_TIMEOUT_MS = 5_000

// What the agent and the open tabs share. Event ids carry a per-boot prefix,
// so a tab that outlives a server restart never mistakes a new event for one
// it already has.
export class AgentSession<Context, Receipt extends { unavailable?: boolean }> {
  context: Context | undefined
  private readonly tabs = new Map<Response, number>()
  private readonly bootId = randomUUID().slice(0, 8)
  private nextId = 1
  // A tab opened or reloaded later still gets the answer on screen. Views are
  // not replayed: the tab that applied one keeps it in its graph.
  private latestShow: object | undefined
  private readonly receiptWaiters = new Map<string, (r: Receipt) => void>()

  get tabCount() {
    return this.tabs.size
  }

  get outdatedTabCount() {
    return [...this.tabs.values()].filter((p) => p < AGENT_PROTOCOL).length
  }

  connect(req: Request, res: Response) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    })
    res.write(': connected\n\n')
    if (this.latestShow !== undefined) {
      res.write(frame({ ...this.latestShow, replay: true }))
    }
    this.tabs.set(res, Number(req.query.protocol ?? 1))
    const keepalive = setInterval(
      () => res.write(': keepalive\n\n'),
      KEEPALIVE_INTERVAL_MS,
    )
    req.on('close', () => {
      clearInterval(keepalive)
      this.tabs.delete(res)
      // With no tab open, nothing is on screen: a closed project's selection
      // must not answer for the next tab, which reports its own.
      if (this.tabs.size === 0) {
        this.context = undefined
      }
    })
  }

  show(event: object): number {
    this.latestShow = { ...event, id: this.newId() }
    return this.broadcast(this.latestShow)
  }

  // Tells tabs something changed that they fetch themselves, like a board.
  notify(event: object): number {
    return this.broadcast({ ...event, id: this.newId() }, VIEW_PROTOCOL)
  }

  clear(): number {
    this.latestShow = undefined
    return this.broadcast({ type: 'clear' })
  }

  // Sends an event a tab acts on and answers for, like applying a view, and
  // waits for the first tab's receipt.
  // A tab that has nothing to say about the event stays silent, so waiting
  // out timeoutMs without a receipt means no tab had anything to report.
  // A tab that cannot act on it, like one showing another project, answers
  // unavailable at once while another tab may still act, so that answer
  // stands only when every tab gave it.
  async request(
    event: object,
    timeoutMs = RECEIPT_TIMEOUT_MS,
  ): Promise<{ tabs: number; receipt?: Receipt }> {
    const id = this.newId()
    const tabs = this.broadcast({ ...event, id }, VIEW_PROTOCOL)
    if (tabs === 0) {
      return { tabs }
    }
    const receipt = await new Promise<Receipt | undefined>((resolve) => {
      let unavailableCount = 0
      const finish = (r: Receipt | undefined) => {
        clearTimeout(timeout)
        this.receiptWaiters.delete(id)
        resolve(r)
      }
      // A tab still silent may yet act, so a timeout confirms nothing.
      const timeout = setTimeout(() => finish(undefined), timeoutMs)
      this.receiptWaiters.set(id, (r) => {
        if (r.unavailable !== true) {
          finish(r)
          return
        }
        unavailableCount++
        if (unavailableCount === tabs) {
          finish(r)
        }
      })
    })
    return { tabs, receipt }
  }

  receive(id: string, receipt: Receipt) {
    this.receiptWaiters.get(id)?.(receipt)
  }

  private newId(): string {
    return `${this.bootId}-${this.nextId++}`
  }

  private broadcast(event: object, protocol = 1): number {
    let reached = 0
    for (const [tab, tabProtocol] of this.tabs) {
      if (tabProtocol >= protocol) {
        tab.write(frame(event))
        reached++
      }
    }
    return reached
  }
}

function frame(event: object): string {
  return `data: ${JSON.stringify(event)}\n\n`
}
