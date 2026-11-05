import { assert } from '@l2beat/shared-pure'
import type { ApiAgentEvent, ApiAgentShowEvent } from '../types'

export interface TabStream {
  write: (chunk: string) => void
  end: () => void
}

interface Tab {
  stream: TabStream
  // Higher is more recent; 0 for a tab that has not been focused yet.
  focusOrder: number
  project: string | undefined
}

export interface ActiveTab {
  id: string
  project: string | undefined
}

// Each show goes to the one tab the researcher used last, so two open tabs
// never walk through the same steps at once.
export class AgentTabs {
  private readonly tabs = new Map<string, Tab>()
  private focusCount = 0
  // The tab that shows the note of the last show, wherever focus went since.
  private showTab: string | undefined

  // A tab that reconnects under its id replaces its old stream, whose close
  // may arrive after the new one opened.
  connect(id: string, stream: TabStream) {
    const previous = this.tabs.get(id)
    this.tabs.set(id, {
      stream,
      focusOrder: previous?.focusOrder ?? 0,
      project: previous?.project,
    })
    previous?.stream.end()
  }

  disconnect(id: string, stream: TabStream) {
    if (this.tabs.get(id)?.stream === stream) {
      this.tabs.delete(id)
    }
  }

  // Every tab reports its project, but only the one in front claims focus:
  // after a restart all tabs reconnect while the researcher is in the
  // terminal. Returns false for a tab that is not connected, which reports
  // again once it reconnects.
  report(id: string, project: string | undefined, isFocused: boolean): boolean {
    const tab = this.tabs.get(id)
    if (tab === undefined) {
      return false
    }
    tab.project = project
    if (isFocused) {
      this.focusCount++
      tab.focusOrder = this.focusCount
    }
    return true
  }

  active(): ActiveTab | undefined {
    let active: [string, Tab] | undefined
    for (const entry of this.tabs) {
      if (active === undefined || entry[1].focusOrder > active[1].focusOrder) {
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
