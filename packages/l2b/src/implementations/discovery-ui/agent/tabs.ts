import { assert } from '@l2beat/shared-pure'

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

  get size(): number {
    return this.tabs.size
  }

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

  // Returns false for a tab that is not connected, which reconnects and
  // focuses again.
  focus(id: string, project: string | undefined): boolean {
    const tab = this.tabs.get(id)
    if (tab === undefined) {
      return false
    }
    this.focusCount++
    tab.focusOrder = this.focusCount
    tab.project = project
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

  send(id: string, event: object): void {
    const tab = this.tabs.get(id)
    assert(tab !== undefined, 'Sending to a tab that is not connected')
    tab.stream.write(`data: ${JSON.stringify(event)}\n\n`)
  }

  // Event streams never finish on their own, so a server closing gracefully
  // would otherwise wait on every open tab.
  closeAll() {
    for (const tab of this.tabs.values()) {
      tab.stream.end()
    }
    this.tabs.clear()
  }
}
