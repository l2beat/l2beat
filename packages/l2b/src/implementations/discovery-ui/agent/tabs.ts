import { assert } from '@l2beat/shared-pure'
import { randomUUID } from 'crypto'
import type {
  ApiAgentBoard,
  ApiAgentContext,
  ApiAgentEvent,
  ApiAgentShowEvent,
} from '../types'

export interface TabStream {
  write: (chunk: string) => void
  end: () => void
}

interface Tab {
  stream: TabStream
  // The tab's clock, Unix ms; 0 for a tab that has not been focused yet.
  focusedAt: number
  project: string | undefined
  // Of the last report applied; reports may arrive out of order.
  sequence: number
}

export interface TabReport {
  project: string | undefined
  focusedAt: number
  sequence: number
}

export interface ActiveTab {
  id: string
  project: string | undefined
}

// Each show goes to the one tab the researcher used last, so two open tabs
// never walk through the same steps at once.
export class AgentTabs {
  private readonly tabs = new Map<string, Tab>()
  // The tab that shows the note of the last show, wherever focus went since.
  private showTab: string | undefined
  // One board, in the tab the agent last showed it in, so it survives a
  // reload of that tab.
  private board: { tab: string; board: ApiAgentBoard } | undefined
  private readonly connectListeners: ((id: string) => void)[] = []
  // Each removed when its tab answers or the wait times out.
  private readonly contextRequests = new Map<
    string,
    { tab: string; resolve: (context: ApiAgentContext | undefined) => void }
  >()

  // A tab that reconnects under its id replaces its old stream, whose close
  // may arrive after the new one opened.
  connect(id: string, stream: TabStream) {
    const previous = this.tabs.get(id)
    const tab: Tab = {
      stream,
      focusedAt: previous?.focusedAt ?? 0,
      project: previous?.project,
      sequence: previous?.sequence ?? 0,
    }
    this.tabs.set(id, tab)
    previous?.stream.end()
    // A tab without the board learns it has none, like one that held a
    // board of a server that restarted since.
    const board = this.board?.tab === id ? this.board.board : null
    write(tab, { type: 'board-replay', board })
    for (const listener of this.connectListeners) {
      listener(id)
    }
  }

  // Like the chat, which replays its transcript to its tab after a reload.
  onConnect(listener: (id: string) => void) {
    this.connectListeners.push(listener)
  }

  isConnected(id: string): boolean {
    return this.tabs.has(id)
  }

  // The chat's own tab may be reconnecting; it gets the transcript then.
  sendChat(
    id: string,
    event: Extract<ApiAgentEvent, { type: 'chat' | 'chat-replay' }>,
  ) {
    const tab = this.tabs.get(id)
    if (tab !== undefined) {
      write(tab, event)
    }
  }

  disconnect(id: string, stream: TabStream) {
    if (this.tabs.get(id)?.stream === stream) {
      this.tabs.delete(id)
    }
  }

  // Every tab reports its project and when the researcher last had it in
  // front. Tabs keep that time, so after a restart, when all of them
  // reconnect while the researcher is in the terminal, the order survives.
  // The clock is this machine's: agent routes answer only local tabs.
  // Returns false for a tab that is not connected, which reports again once
  // it reconnects.
  report(id: string, report: TabReport): boolean {
    const tab = this.tabs.get(id)
    if (tab === undefined) {
      return false
    }
    if (report.sequence <= tab.sequence) {
      return true
    }
    tab.sequence = report.sequence
    tab.project = report.project
    tab.focusedAt = report.focusedAt
    return true
  }

  tab(id: string): ActiveTab | undefined {
    const tab = this.tabs.get(id)
    return tab && { id, project: tab.project }
  }

  active(): ActiveTab | undefined {
    let active: [string, Tab] | undefined
    for (const entry of this.tabs) {
      if (active === undefined || entry[1].focusedAt > active[1].focusedAt) {
        active = entry
      }
    }
    return active && { id: active[0], project: active[1].project }
  }

  show(id: string, event: ApiAgentShowEvent) {
    const tab = this.tabs.get(id)
    assert(tab !== undefined, 'Showing in a tab that is not connected')
    write(tab, event)
    // The tab reports its new project once it has navigated, and a show
    // without a project right after this one should not wait for that.
    tab.project = event.project
    // A note left in another tab would describe a show the agent replaced.
    const previous = this.showTab === id ? undefined : this.showTab
    const previousTab = previous && this.tabs.get(previous)
    if (previousTab) {
      write(previousTab, { type: 'clear' })
    }
    this.showTab = id
  }

  showBoard(id: string, board: ApiAgentBoard) {
    const tab = this.tabs.get(id)
    assert(tab !== undefined, 'Showing a board in a tab that is not connected')
    write(tab, { type: 'board', board })
    // Like show, the tab opens the board's project.
    tab.project = board.project
    // A board left in another tab would be one the agent replaced.
    const previous = this.board?.tab === id ? undefined : this.board?.tab
    const previousTab = previous && this.tabs.get(previous)
    if (previousTab) {
      write(previousTab, { type: 'board-replay', board: null })
    }
    this.board = { tab: id, board }
  }

  // Asks the tab what the researcher looks at. Resolves undefined when the
  // tab does not answer in time, like one that closed meanwhile.
  askContext(
    id: string,
    timeoutMs: number,
  ): Promise<ApiAgentContext | undefined> {
    const tab = this.tabs.get(id)
    assert(tab !== undefined, 'Asking a tab that is not connected')
    const requestId = randomUUID()
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        this.contextRequests.delete(requestId)
        resolve(undefined)
      }, timeoutMs)
      this.contextRequests.set(requestId, {
        tab: id,
        resolve: (context) => {
          clearTimeout(timeout)
          this.contextRequests.delete(requestId)
          resolve(context)
        },
      })
      write(tab, { type: 'context-request', id: requestId })
    })
  }

  // Returns false for a request that timed out or that another tab got.
  answerContext(id: string, requestId: string, context: ApiAgentContext) {
    const request = this.contextRequests.get(requestId)
    if (request === undefined || request.tab !== id) {
      return false
    }
    request.resolve(context)
    return true
  }

  // Clears the note where it is, or in the active tab when its tab is gone.
  // Returns false when no tab is open.
  clearShow(): boolean {
    const showTab = this.showTab && this.tabs.get(this.showTab)
    this.showTab = undefined
    const activeId = this.active()?.id
    const tab = showTab || (activeId && this.tabs.get(activeId))
    if (!tab) {
      return false
    }
    write(tab, { type: 'clear' })
    return true
  }
}

function write(tab: Tab, event: ApiAgentEvent) {
  tab.stream.write(`data: ${JSON.stringify(event)}\n\n`)
}
