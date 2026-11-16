import { assert } from '@l2beat/shared-pure'
import { randomUUID } from 'crypto'
import type {
  ApiAgentBoard,
  ApiAgentContext,
  ApiAgentEvent,
  ApiAgentGraph,
  ApiAgentLayout,
  ApiAgentLayoutRequest,
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

// What a tab answers to each kind of request.
interface TabAnswers {
  context: ApiAgentContext
  graph: ApiAgentGraph
  layout: ApiAgentLayout
}
type RequestKind = keyof TabAnswers

interface PendingRequest {
  tab: string
  kind: RequestKind
  resolve: (answer: TabAnswers[RequestKind] | undefined) => void
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
  private readonly requests = new Map<string, PendingRequest>()

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
    return this.ask(id, 'context', timeoutMs, (requestId) => ({
      type: 'context-request',
      id: requestId,
    }))
  }

  answerContext(id: string, requestId: string, context: ApiAgentContext) {
    return this.answer(id, requestId, 'context', context)
  }

  // Asks the tab for its node view as drawn, like askContext.
  askGraph(
    id: string,
    project: string,
    timeoutMs: number,
  ): Promise<ApiAgentGraph | undefined> {
    return this.ask(id, 'graph', timeoutMs, (requestId) => ({
      type: 'graph-request',
      id: requestId,
      project,
    }))
  }

  answerGraph(id: string, requestId: string, graph: ApiAgentGraph) {
    return this.answer(id, requestId, 'graph', graph)
  }

  // Asks the tab to arrange its node view, and what it drew then.
  askLayout(
    id: string,
    request: Omit<ApiAgentLayoutRequest, 'type' | 'id'>,
    timeoutMs: number,
  ): Promise<ApiAgentLayout | undefined> {
    return this.ask(id, 'layout', timeoutMs, (requestId) => ({
      type: 'layout-request',
      id: requestId,
      project: request.project,
      lanes: request.lanes,
      hideOthers: request.hideOthers,
    }))
  }

  answerLayout(id: string, requestId: string, layout: ApiAgentLayout) {
    return this.answer(id, requestId, 'layout', layout)
  }

  private ask<K extends RequestKind>(
    id: string,
    kind: K,
    timeoutMs: number,
    toEvent: (requestId: string) => ApiAgentEvent,
  ): Promise<TabAnswers[K] | undefined> {
    const tab = this.tabs.get(id)
    assert(tab !== undefined, 'Asking a tab that is not connected')
    const requestId = randomUUID()
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        this.requests.delete(requestId)
        resolve(undefined)
      }, timeoutMs)
      this.requests.set(requestId, {
        tab: id,
        kind,
        resolve: (answer) => {
          clearTimeout(timeout)
          this.requests.delete(requestId)
          // answer() hands over only answers of this request's kind.
          resolve(answer as TabAnswers[K] | undefined)
        },
      })
      write(tab, toEvent(requestId))
    })
  }

  // Returns false for a request that timed out, that another tab got, or
  // that waits for another kind of answer.
  private answer<K extends RequestKind>(
    id: string,
    requestId: string,
    kind: K,
    answer: TabAnswers[K],
  ): boolean {
    const request = this.requests.get(requestId)
    if (request === undefined) {
      return false
    }
    if (request.tab !== id) {
      return false
    }
    if (request.kind !== kind) {
      return false
    }
    request.resolve(answer)
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
