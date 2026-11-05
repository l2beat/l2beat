import { type QueryClient, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useMatch, useNavigate } from 'react-router'
import { openAgentEvents, postAgentTab } from '../../../api/api'
import type {
  ApiAgentEvent,
  ApiAgentShowEvent,
  ApiProjectResponse,
} from '../../../api/types'
import { isEditableTarget } from '../../../utils/isEditableTarget'
import {
  getProjectQueryOptions,
  invalidateProjectPayloads,
} from '../hooks/projectQuery'
import { useDockingStore } from '../multi-view/store'
import type { Node } from '../panel-nodes/store/State'
import { useStore as useNodeStore } from '../panel-nodes/store/store'
import { topLevelByDescendant } from '../panel-nodes/store/utils/subnodes'
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
  const queryClient = useQueryClient()
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
      handleEvent(event, queryClient, (target) => {
        const path = `/ui/p/${encodeURIComponent(target)}`
        if (window.location.pathname !== path) void navigate(path)
      }),
    )
    // A restarted server forgot every tab and the show it sent here, so it
    // could not clear that note once a later show goes to another tab.
    events.onopen = () => {
      isConnected.current = true
      useAgentStore.getState().clear()
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
  }, [navigate, queryClient])

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

function handleEvent(
  event: ApiAgentEvent,
  queryClient: QueryClient,
  open: (project: string) => void,
) {
  if (event.type === 'clear') {
    useAgentStore.getState().clear()
    return
  }
  // The agent may have discovered contracts since this tab loaded the
  // project, which DiscoUI otherwise keeps until a reload.
  const cached = queryClient.getQueryData<ApiProjectResponse>(
    getProjectQueryOptions(event.project).queryKey,
  )
  if (cached !== undefined && !hasEveryContract(cached, event)) {
    void invalidateProjectPayloads(queryClient, event.project)
  }
  // The graph loads only in a nodes panel, and the steps wait for the graph.
  open(event.project)
  useDockingStore.getState().ensureLeaf('nodes')
  useAgentStore.getState().start(event)
}

function hasEveryContract(
  data: ApiProjectResponse,
  show: ApiAgentShowEvent,
): boolean {
  const addresses = new Set<string>()
  for (const chain of data.entries) {
    for (const entry of chain.initialContracts) addresses.add(entry.address)
    for (const entry of chain.discoveredContracts) addresses.add(entry.address)
    for (const entry of chain.eoas) addresses.add(entry.address)
  }
  return show.steps.every((step) => step.select.every((a) => addresses.has(a)))
}

// Applies each step once its project's graph has loaded: arriving at a
// project selects its first contract, which would replace the step's.
function useApplyStep() {
  const show = useAgentStore((state) => state.show)
  const index = useAgentStore((state) => state.index)
  const loadedProject = useNodeStore((state) =>
    state.loaded ? state.projectId : undefined,
  )
  const select = show?.steps[index]?.select
  // A graph refetched for new contracts loads after the show arrived.
  const hasStepContracts = useNodeStore((state) =>
    select === undefined ? true : hasNodes(state.nodes, select),
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
    if (!hasStepContracts) {
      return
    }
    appliedKey.current = key
    applyStep(step)
  }, [show, index, loadedProject, hasStepContracts])
}

function hasNodes(
  nodes: readonly Node[],
  addresses: readonly string[],
): boolean {
  const known = topLevelByDescendant(nodes)
  return addresses.every((address) => known.has(address))
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
