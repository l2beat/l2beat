import { useEffect, useRef } from 'react'
import { useMatch, useNavigate } from 'react-router'
import { RangeHighlightPlugin } from '../../../components/editor/code/plugins/range'
import { useCodeStore } from '../../../components/editor/store'
import { useDockingStore } from '../multi-view/store'
import { useStore as useNodeStore } from '../panel-nodes/store/store'
import {
  type AgentEvent,
  type AgentStep,
  dismissAgent,
  useAgentStore,
} from './store'
import {
  applyQueuedViews,
  discardAgentView,
  keepAgentView,
  receiveView,
  useAgentViewStore,
} from './viewStore'

// Matches the server's: tabs declare what they understand when connecting.
const AGENT_PROTOCOL = 2
export const AGENT_CONNECTED = 'agent-connected'

// Long enough to read and check the code the agent points at; dismissing the
// agent clears it sooner.
const AGENT_HIGHLIGHT_DURATION_MS = 30 * 60 * 1000
const CODE_EDITOR_ID = 'code-panel'

export function AgentBridge() {
  const navigate = useNavigate()

  useEffect(() => {
    const events = new EventSource(
      `/api/agent/events?protocol=${AGENT_PROTOCOL}`,
    )
    // A restarted server knows nothing about this tab until it reports.
    events.onopen = () => window.dispatchEvent(new Event(AGENT_CONNECTED))
    events.onmessage = (message) => {
      handleEvent(JSON.parse(message.data) as AgentEvent, (project) => {
        const projectPath = `/ui/p/${project}`
        if (window.location.pathname !== projectPath) {
          void navigate(projectPath)
        }
      })
    }
    return () => events.close()
  }, [navigate])

  useApplyFocusedStep()
  useViewLifecycle()
  useAgentKeyboard()
  return null
}

function handleEvent(event: AgentEvent, open: (project: string) => void) {
  switch (event.type) {
    case 'clear':
      useAgentStore.getState().clear()
      return
    case 'discard':
      discardAgentView(event.id)
      return
    case 'view':
      // A dry run only reports, so it leaves the researcher where they are.
      if (event.dryRun !== true) {
        open(event.project)
        useDockingStore.getState().ensureLeaf('nodes')
      }
      receiveView(event)
      return
    case 'show':
      // A reconnect replays the show this tab already has: keep its step.
      if (useAgentStore.getState().show?.id === event.id) {
        return
      }
      // A replay waits for the researcher to open its project.
      if (event.replay !== true) {
        open(event.project)
      }
      useAgentStore.getState().start(event)
  }
}

// Views wait for their project's graph to load. Leaving the project keeps a
// pending view as it is: the graph was saved with it.
function useViewLifecycle() {
  const loaded = useNodeStore((state) => state.loaded)
  const projectId = useNodeStore((state) => state.projectId)
  const shownProject = useAgentViewStore((state) => state.shownProject)

  useEffect(() => {
    if (!loaded) {
      return
    }
    const pending = useAgentViewStore.getState().pending
    if (pending !== undefined && pending.project !== projectId) {
      keepAgentView()
    }
    applyQueuedViews(projectId)
  }, [loaded, projectId, shownProject])
}

// Applies each step once, when the researcher is on its project and its
// graph has loaded: arriving at a project selects its first contract, which
// would replace the step's selection.
function useApplyFocusedStep() {
  const focus = useAgentStore((state) => state.focus)
  const openProject = useMatch('/ui/p/:project')?.params.project
  const loadedProject = useNodeStore((state) =>
    state.loaded ? state.projectId : undefined,
  )
  const applied = useRef<string>(undefined)

  useEffect(() => {
    if (focus === undefined) {
      applied.current = undefined
      clearCodeHighlight()
      return
    }
    // Another project's file can share the editor, and the highlight would
    // move onto it; coming back applies the step again.
    if (focus.project !== openProject || focus.project !== loadedProject) {
      applied.current = undefined
      clearCodeHighlight()
      return
    }
    if (applied.current === focus.key) {
      return
    }
    applied.current = focus.key
    applyStep(focus.step)
  }, [focus, openProject, loadedProject])
}

export function applyStep(step: AgentStep) {
  const docking = useDockingStore.getState()
  docking.ensureLeaf('nodes')
  if (step.select !== undefined) {
    useAgentStore.getState().selectForAgent(step.select)
  }
  if (step.code === undefined) {
    clearCodeHighlight()
    return
  }
  docking.ensureLeaf('code')
  const code = useCodeStore.getState()
  code.setSourceIndex(step.code.address, step.code.sourceIndex)
  code.showRange(step.code.address, {
    startOffset: step.code.offset,
    length: step.code.length,
    highlightDurationMs: AGENT_HIGHLIGHT_DURATION_MS,
  })
}

function clearCodeHighlight() {
  useCodeStore
    .getState()
    .editors[CODE_EDITOR_ID]?.getPlugin(RangeHighlightPlugin)
    ?.clearHighlight()
}

function useAgentKeyboard() {
  const isActive = useAgentStore((state) => state.focus !== undefined)

  useEffect(() => {
    if (!isActive) {
      return
    }
    const onKeyDown = (event: KeyboardEvent) => {
      // A dialog owns Escape and the arrows while it is open.
      if (isTyping(event) || document.querySelector('[role="dialog"]')) {
        return
      }
      const store = useAgentStore.getState()
      const index = store.focus?.stepIndex ?? 0
      if (event.key === 'Escape') dismissAgent()
      else if (event.key === 'ArrowRight') store.goToStep(index + 1)
      else if (event.key === 'ArrowLeft') store.goToStep(index - 1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isActive])
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
