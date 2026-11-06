import { type QueryClient, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useMatch, useNavigate } from 'react-router'
import {
  openAgentEvents,
  postAgentContext,
  postAgentTab,
} from '../../../api/api'
import type { ApiAgentEvent } from '../../../api/types'
import { isEditableTarget } from '../../../utils/isEditableTarget'
import { useDockingStore } from '../multi-view/store'
import { useBoardStore } from '../panel-board/boardStore'
import { useChatStore } from '../panel-chat/chatStore'
import { useStore as useNodeStore } from '../panel-nodes/store/store'
import { applyStep } from './applyStep'
import { readContext } from './readContext'
import { useAgentStore, useIsNoteShown } from './store'

const TAB_ID_KEY = 'discoui-agent-tab-id'
const TAB_ID_LENGTH = 32
const HEX = '0123456789abcdef'

// The server sends each show to the tab the researcher focused last, so
// every tab tells it its project and when it comes to the front.
const TAB_ID = takeSavedTabId() ?? createTabId()
// Kept by the tab, so a restarted server learns which tab was used last.
let focusedAt = 0
// Reports may arrive out of order, and the server keeps the latest.
let reportCount = 0
let serverId: string | undefined

// The chat routes act for the tab that owns the chat.
export function agentTabId(): string {
  return TAB_ID
}

// randomUUID exists only on secure pages, and DiscoUI is also opened over
// plain HTTP from other machines.
function createTabId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

// A reload keeps the tab's id, so the tab gets its chat back. The id is
// saved only while the page goes away and taken back as it loads: a tab
// duplicated meanwhile copies the session storage, and must not share it.

function takeSavedTabId(): string | undefined {
  try {
    const id = sessionStorage.getItem(TAB_ID_KEY)
    sessionStorage.removeItem(TAB_ID_KEY)
    if (id?.length === TAB_ID_LENGTH && [...id].every((c) => HEX.includes(c))) {
      return id
    }
  } catch {
    // Storage blocked: a reload starts a new chat.
  }
  return undefined
}

window.addEventListener('pagehide', () => {
  try {
    sessionStorage.setItem(TAB_ID_KEY, TAB_ID)
  } catch {
    // Storage blocked: a reload starts a new chat.
  }
})
// Back from the browser's page cache the page keeps running, so the saved
// id must not stay behind for a duplicate to copy.
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    takeSavedTabId()
  }
})

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
      handleEvent(event, {
        queryClient,
        project: () => projectRef.current,
        open: (target) => {
          const path = `/ui/p/${encodeURIComponent(target)}`
          if (window.location.pathname !== path) void navigate(path)
        },
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
  reportCount++
  const report = { tab: TAB_ID, project, focusedAt, sequence: reportCount }
  postAgentTab(report).catch((error) =>
    console.warn('Agent tab report not sent', { error }),
  )
}

function handleEvent(
  event: ApiAgentEvent,
  tab: {
    queryClient: QueryClient
    project: () => string | undefined
    open: (project: string) => void
  },
) {
  if (event.type === 'context-request') {
    readContext(tab.project())
      .then((context) =>
        postAgentContext({ tab: TAB_ID, request: event.id, context }),
      )
      .catch((error) => console.warn('Agent context not sent', { error }))
    return
  }
  if (event.type === 'connected') {
    // A new server forgot the show it sent here and could not clear it.
    if (serverId !== undefined && serverId !== event.serverId) {
      useAgentStore.getState().clear()
    }
    serverId = event.serverId
    return
  }
  if (event.type === 'clear') {
    useAgentStore.getState().clear()
    return
  }
  if (event.type === 'chat') {
    useChatStore.getState().apply(event.event)
    return
  }
  if (event.type === 'chat-replay') {
    useChatStore.getState().replay(event.events)
    return
  }
  if (event.type === 'board-replay') {
    useBoardStore.getState().set(event.board ?? undefined)
    return
  }
  // A new board, unlike a replay, comes to the front with its project.
  if (event.type === 'board') {
    tab.open(event.board.project)
    useDockingStore.getState().ensureLeaf('board')
    useBoardStore.getState().set(event.board)
    return
  }
  // The agent may have run discovery since this tab loaded the project, like
  // the terminal's Run discovery does. Data that did not change keeps its
  // identity, so the graph reloads only when it did.
  void tab.queryClient.invalidateQueries({
    queryKey: ['projects', event.project],
  })
  // The graph loads only in a nodes panel, and the steps wait for the graph.
  tab.open(event.project)
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
  // A graph that loads again, with data refetched for the show or after the
  // researcher changed its depth, comes without the step's selection.
  const loadCount = useNodeStore((state) => state.loadCount)
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
    const key = `${show.id}:${index}:${loadCount}`
    const step = show.steps[index]
    if (appliedKey.current === key || step === undefined) {
      return
    }
    appliedKey.current = key
    applyStep(step)
  }, [show, index, loadedProject, loadCount])
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
