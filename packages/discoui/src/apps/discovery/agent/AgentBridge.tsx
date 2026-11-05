import { useEffect, useRef } from 'react'
import { useMatch, useNavigate } from 'react-router'
import { openAgentEvents, postAgentTab } from '../../../api/api'
import type { ApiAgentEvent } from '../../../api/types'
import { isEditableTarget } from '../../../utils/isEditableTarget'
import { useDockingStore } from '../multi-view/store'
import { useStore as useNodeStore } from '../panel-nodes/store/store'
import { applyStep } from './applyStep'
import { useAgentStore, useIsNoteShown } from './store'

// The server sends each show to the tab the researcher focused last, so
// every tab tells it its project and when it comes to the front.
const TAB_ID = createTabId()
// Kept by the tab, so a restarted server learns which tab was used last.
let focusedAt = 0

// randomUUID exists only on secure pages, and DiscoUI is also opened over
// plain HTTP from other machines.
function createTabId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

export function AgentBridge() {
  const navigate = useNavigate()
  const project = useMatch('/ui/p/:project')?.params.project
  const projectRef = useRef(project)
  // The server knows a tab only once its stream is open.
  const isConnected = useRef(false)

  useEffect(() => {
    const report = () => {
      noteFocus()
      if (isConnected.current) reportTab(projectRef.current)
    }
    const events = openAgentEvents(TAB_ID, (event) =>
      handleEvent(event, (target) => {
        const path = `/ui/p/${encodeURIComponent(target)}`
        if (window.location.pathname !== path) void navigate(path)
      }),
    )
    // A restarted server forgot every tab, so each one reports on reconnect.
    events.onopen = () => {
      isConnected.current = true
      report()
    }
    events.onerror = () => {
      isConnected.current = false
    }
    window.addEventListener('focus', report)
    document.addEventListener('visibilitychange', report)
    return () => {
      isConnected.current = false
      events.close()
      window.removeEventListener('focus', report)
      document.removeEventListener('visibilitychange', report)
    }
  }, [navigate])

  // The server answers show without a project with the one this tab shows.
  useEffect(() => {
    projectRef.current = project
    noteFocus()
    if (isConnected.current) {
      reportTab(project)
    }
  }, [project])

  useApplyStep()
  useAgentKeyboard(project)
  return null
}

// A visible tab in another, unfocused window is not the one the researcher
// uses, and claiming focus when it reconnects would steal the agent's shows.
function noteFocus() {
  if (document.visibilityState === 'visible' && document.hasFocus()) {
    focusedAt = Date.now()
  }
}

function reportTab(project: string | undefined) {
  postAgentTab({ tab: TAB_ID, project, focusedAt }).catch((error) =>
    console.warn('Agent tab report not sent', { error }),
  )
}

function handleEvent(event: ApiAgentEvent, open: (project: string) => void) {
  if (event.type === 'clear') {
    useAgentStore.getState().clear()
    return
  }
  // The graph loads only in a nodes panel, and the steps wait for the graph.
  open(event.project)
  useDockingStore.getState().ensureLeaf('nodes')
  useAgentStore.getState().start(event)
}

// Applies each step once its project's graph has loaded: arriving at a
// project selects its first contract, which would replace the step's.
function useApplyStep() {
  const show = useAgentStore((state) => state.show)
  const index = useAgentStore((state) => state.index)
  const loadedProject = useNodeStore((state) =>
    state.loaded ? state.projectId : undefined,
  )
  const appliedKey = useRef<string>(undefined)

  useEffect(() => {
    if (show === undefined) {
      return
    }
    // A graph that unloads, like when the researcher leaves and comes back,
    // loads without the step's selection, so the step applies again.
    if (show.project !== loadedProject) {
      appliedKey.current = undefined
      return
    }
    const key = `${show.id}:${index}`
    const step = show.steps[index]
    if (appliedKey.current === key || step === undefined) {
      return
    }
    appliedKey.current = key
    applyStep(step)
  }, [show, index, loadedProject])
}

function useAgentKeyboard(project: string | undefined) {
  const isNoteShown = useIsNoteShown(project)

  useEffect(() => {
    if (!isNoteShown) {
      return
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (hasModifier(event) || isEditableTarget(event.target)) {
        return
      }
      // Escape closes an open dialog, and arrows move inside it.
      if (document.querySelector('[role="dialog"]')) {
        return
      }
      const store = useAgentStore.getState()
      if (event.key === 'Escape') store.clear()
      else if (event.key === 'ArrowRight') store.goTo(store.index + 1)
      else if (event.key === 'ArrowLeft') store.goTo(store.index - 1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isNoteShown])
}

function hasModifier(event: KeyboardEvent): boolean {
  return event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
}
