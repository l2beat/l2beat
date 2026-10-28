import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { allKeys } from '../../../components/docking'
import { useCodeStore } from '../../../components/editor/store'
import { findSelected } from '../../../utils/findSelected'
import { useProjectQueryOptions } from '../hooks/projectQuery'
import { useDockingStore } from '../multi-view/store'
import { useStore as useNodeStore } from '../panel-nodes/store/store'
import { usePanelStore } from '../store/panel-store'
import { AGENT_CONNECTED } from './AgentBridge'
import { describeGraph } from './graphState'
import { useAgentStore } from './store'
import { useAgentViewStore } from './viewStore'

const REPORT_DELAY_MS = 300
// The server keeps one context: only the tab that reported it last may
// clear it, not a background tab closing.
const REPORTER_KEY = 'discoui:agent-context-reporter'
const TAB_ID = `${Date.now()}-${Math.random()}`
const CODE_TEXT_LENGTH_MAX = 8_000

// The report waiting out its delay, which a message sent meanwhile flushes:
// a question about "this" is about what was selected when it was asked.
let pending:
  | { timeout: ReturnType<typeof setTimeout>; send: () => Promise<void> }
  | undefined

export async function flushAgentContext() {
  const report = pending
  if (report === undefined) return
  clearTimeout(report.timeout)
  await report.send()
}

// Reports what the researcher looks at, so an agent asked "what is this?" can
// read it instead of being told addresses and pasted code.
export function AgentContextReporter(props: { project: string }) {
  const response = useQuery(useProjectQueryOptions(props.project))
  const selected = usePanelStore((state) => state.selected)
  const tree = useDockingStore((state) => state.tree)
  const focus = useAgentStore((state) => state.focus)
  const view = useAgentStore((state) => state.view)

  useEffect(() => {
    const entries = response.data?.entries
    if (entries === undefined) {
      return
    }
    // Only the tab in front speaks for the researcher: the server keeps one
    // context, and a tab in the background would overwrite it.
    const report = () => {
      clearTimeout(pending?.timeout)
      pending = undefined
      if (document.visibilityState !== 'visible') {
        return
      }
      const send = async () => {
        pending = undefined
        if (document.visibilityState !== 'visible') {
          return
        }
        localStorage.setItem(REPORTER_KEY, TAB_ID)
        await putContext({
          project: props.project,
          selected: selected.map((address) => ({
            address,
            name: findSelected(entries, address)?.name ?? '',
          })),
          panels: allKeys(tree),
          code: readCodeSelection(selected[0]),
          // A tour or view of another project is not on this screen.
          agent:
            focus?.project === props.project
              ? { step: focus.stepIndex + 1, steps: focus.stepCount, view }
              : undefined,
          graph: readGraph(props.project),
        })
      }
      pending = {
        timeout: setTimeout(() => void send(), REPORT_DELAY_MS),
        send,
      }
    }
    report()
    document.addEventListener('mouseup', report)
    document.addEventListener('keyup', report)
    window.addEventListener(AGENT_CONNECTED, report)
    document.addEventListener('visibilitychange', report)
    const unsubscribeNodes = useNodeStore.subscribe(
      (state, previous) => state.nodes !== previous.nodes && report(),
    )
    const unsubscribeView = useAgentViewStore.subscribe(report)
    return () => {
      clearTimeout(pending?.timeout)
      pending = undefined
      document.removeEventListener('mouseup', report)
      document.removeEventListener('keyup', report)
      window.removeEventListener(AGENT_CONNECTED, report)
      document.removeEventListener('visibilitychange', report)
      unsubscribeNodes()
      unsubscribeView()
    }
  }, [props.project, response.data, selected, tree, focus, view])

  // Leaving the project page or closing the tab leaves no project on screen,
  // so the agent must not keep answering about the last one.
  useEffect(() => {
    const leave = () => {
      if (localStorage.getItem(REPORTER_KEY) === TAB_ID) {
        void putContext({ selected: [], panels: [] }, true)
      }
    }
    window.addEventListener('pagehide', leave)
    return () => {
      window.removeEventListener('pagehide', leave)
      leave()
    }
  }, [])

  return null
}

function readGraph(project: string) {
  const nodes = useNodeStore.getState()
  if (!nodes.loaded || nodes.projectId !== project) {
    return undefined
  }
  const pending = useAgentViewStore.getState().pending
  const pendingHere = pending?.project === project ? pending : undefined
  return {
    contracts: describeGraph(nodes.nodes),
    pendingView: pendingHere && {
      title: pendingHere.title,
      changes: pendingHere.changes,
    },
  }
}

function readCodeSelection(address: string | undefined) {
  const editor = useCodeStore.getState().editors['code-panel']
  if (address === undefined || editor === undefined) {
    return undefined
  }
  const { from, to } = editor.view.state.selection.main
  if (from === to) {
    return undefined
  }
  const text = editor.view.state.sliceDoc(from, to)
  return { address, text: text.slice(0, CODE_TEXT_LENGTH_MAX) }
}

// The tab reports again on the next change, so a server that is down misses
// nothing that matters.
// Browsers cap a keepalive body at 64 KiB, which a full report of a large
// graph passes, so only the small clear sent as the tab closes keeps alive.
async function putContext(context: object, keepalive = false) {
  const response = await fetch('/api/agent/context', {
    method: 'PUT',
    keepalive,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(context),
  }).catch(() => undefined)
  if (response !== undefined && !response.ok) {
    console.warn('Agent context rejected', { status: response.status })
  }
}
