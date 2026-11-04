import { useEffect, useRef } from 'react'
import { useMatch, useNavigate } from 'react-router'
import { useDockingStore } from '../multi-view/store'
import { useStore as useNodeStore } from '../panel-nodes/store/store'
import { applyStep } from './applyStep'
import { type AgentEvent, agentEventSchema, useAgentStore } from './store'

// The server sends each show to the tab the researcher focused last, so
// every tab tells it when it comes to the front.
const TAB_ID = createTabId()

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
    const events = new EventSource(`/api/agent/events?tab=${TAB_ID}`)
    const focus = () => {
      if (isConnected.current) postFocus(projectRef.current)
    }
    const focusWhenVisible = () => {
      if (isInFront()) focus()
    }
    events.onopen = () => {
      isConnected.current = true
      focusWhenVisible()
    }
    events.onerror = () => {
      isConnected.current = false
    }
    events.onmessage = (message) => {
      const event = agentEventSchema.safeParse(JSON.parse(message.data))
      if (!event.success) {
        console.warn('Unknown agent event', { message: event.message })
        return
      }
      handleEvent(event.data, (target) => {
        const path = `/ui/p/${encodeURIComponent(target)}`
        if (window.location.pathname !== path) void navigate(path)
      })
    }
    window.addEventListener('focus', focus)
    document.addEventListener('visibilitychange', focusWhenVisible)
    return () => {
      isConnected.current = false
      events.close()
      window.removeEventListener('focus', focus)
      document.removeEventListener('visibilitychange', focusWhenVisible)
    }
  }, [navigate])

  // The server answers show without a project with the one this tab shows.
  useEffect(() => {
    projectRef.current = project
    if (isConnected.current && isInFront()) {
      postFocus(project)
    }
  }, [project])

  useApplyStep()
  useAgentKeyboard(project)
  return null
}

// A visible tab in another, unfocused window is not the one the researcher
// uses, and claiming focus when it reconnects would steal the agent's shows.
function isInFront(): boolean {
  return document.visibilityState === 'visible' && document.hasFocus()
}

function postFocus(project: string | undefined) {
  fetch('/api/agent/focus', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tab: TAB_ID, project }),
  }).catch((error) => console.warn('Agent focus not sent', { error }))
}

function handleEvent(event: AgentEvent, open: (project: string) => void) {
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
    if (show === undefined || show.project !== loadedProject) {
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
  const isNoteShown = useAgentStore(
    (state) => state.show !== undefined && state.show.project === project,
  )

  useEffect(() => {
    if (!isNoteShown) {
      return
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTyping(event) || document.querySelector('[role="dialog"]')) {
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

function isTyping(event: KeyboardEvent): boolean {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
    return true
  }
  const target = event.target
  if (!(target instanceof HTMLElement)) {
    return false
  }
  return (
    target.isContentEditable ||
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT'
  )
}
