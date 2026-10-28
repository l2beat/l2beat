import { create } from 'zustand'
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware'
import { saveProjectLayout } from '../../../api/api'
import type { Node } from '../panel-nodes/store/State'
import { useStore as useNodeStore } from '../panel-nodes/store/store'
import { getGraphProjection } from '../panel-nodes/store/utils/graphProjection'
import { buildStoredNodeLayout } from '../panel-nodes/store/utils/storage'
import {
  type AgentViewSpec,
  type AppliedView,
  applyView,
  legendOf,
  SET_ASIDE_NAME,
  type ViewGroup,
  type ViewReceipt,
} from './applyView'
import { fitGraphTo, useAgentStore } from './store'

export interface AgentViewEvent {
  type: 'view'
  id: string
  project: string
  view: AgentViewSpec
  // Answers what the view would do and leaves the graph alone.
  dryRun?: boolean
}

// Views change the researcher's graph, so until they decide, everything the
// agent changed is one pending set they can keep, save or discard as a whole.
export interface PendingView {
  project: string
  title: string
  note: string | undefined
  changes: number
  // The graph from before the first view, which discarding brings back.
  before: readonly Node[]
  groups: ViewGroup[]
  receipt: ViewReceipt
}

interface ViewState {
  pending: PendingView | undefined
  // Views that arrived before their project's graph was on screen.
  queued: AgentViewEvent[]
  // The project whose graph a nodes panel shows. The node store outlives the
  // panel, and the panel reloads it when it mounts again.
  shownProject: string | undefined
}

// A huge graph can overflow the quota; the view then stays pending only
// until a reload, as it did before.
const tabStorage: StateStorage = {
  getItem: (name) => sessionStorage.getItem(name),
  setItem: (name, value) => {
    try {
      sessionStorage.setItem(name, value)
    } catch {
      sessionStorage.removeItem(name)
    }
  },
  removeItem: (name) => sessionStorage.removeItem(name),
}

// The graph a view changed survives a reload, so the decision on it must
// too: this tab keeps the pending view until the researcher makes it.
export const useAgentViewStore = create<ViewState>()(
  persist<ViewState, [], [], Pick<ViewState, 'pending'>>(
    () => ({
      pending: undefined,
      queued: [],
      shownProject: undefined,
    }),
    {
      name: 'discoui:agent-pending-view',
      version: 1,
      storage: createJSONStorage(() => tabStorage),
      partialize: (state) => ({ pending: state.pending }),
    },
  ),
)

function isGraphShown(project: string): boolean {
  const nodes = useNodeStore.getState()
  return (
    useAgentViewStore.getState().shownProject === project &&
    nodes.loaded &&
    nodes.projectId === project
  )
}

export function receiveView(event: AgentViewEvent) {
  if (isGraphShown(event.project)) {
    applyAgentView(event)
    return
  }
  if (event.dryRun === true) {
    void sendReceipt(event.id, { ...summarize([]), unavailable: true })
    return
  }
  useAgentViewStore.setState((s) => ({ queued: [...s.queued, event] }))
}

export function applyQueuedViews(project: string) {
  if (!isGraphShown(project)) {
    return
  }
  const { queued } = useAgentViewStore.getState()
  const ready = queued.filter((event) => event.project === project)
  if (ready.length === 0) {
    return
  }
  useAgentViewStore.setState({
    queued: queued.filter((event) => event.project !== project),
  })
  for (const event of ready) applyAgentView(event)
}

function applyAgentView(event: AgentViewEvent) {
  const nodeStore = useNodeStore.getState()
  const pending = useAgentViewStore.getState().pending
  const applied = applyView(nodeStore, event.view)
  if (event.dryRun === true) {
    void sendReceipt(event.id, applied.receipt)
    return
  }
  nodeStore.setNodes(applied.nodes)
  useAgentViewStore.setState({
    pending: {
      project: event.project,
      title: event.view.title,
      note: event.view.note,
      changes: (pending?.changes ?? 0) + 1,
      before: pending?.before ?? nodeStore.nodes,
      groups: legendOf(applied.nodes, [
        ...(pending?.groups ?? []),
        ...applied.groups,
      ]),
      receipt: applied.receipt,
    },
  })
  // The path overlay would cover the graph the view just changed.
  useAgentStore.getState().setView('graph')
  // A contract this tab's graph lacks is reported missing, not selected.
  const select = event.view.select
  if (select !== undefined && !applied.receipt.missing.includes(select)) {
    selectAfterSettling(select)
  }
  fitGraphTo(new Set(framed(applied)))
  void sendReceipt(event.id, applied.receipt)
}

export function discardAgentView(eventId?: string) {
  const { pending, queued } = useAgentViewStore.getState()
  // While another project loads, its graph must not get this one's nodes.
  if (
    pending !== undefined &&
    pending.project === useNodeStore.getState().projectId
  ) {
    useNodeStore.getState().setNodes([...pending.before])
    fitGraphTo(new Set(visibleContracts(pending.before)))
  }
  // Views still waiting for their graph go too, or they would apply later.
  useAgentViewStore.setState({ pending: undefined, queued: [] })
  // Only a tab that put something back answers, so the agent hears from it
  // and not from a tab that had nothing pending.
  const undone = (pending?.changes ?? 0) + queued.length
  if (eventId !== undefined && undone > 0) {
    void sendReceipt(eventId, {
      ...summarize(useNodeStore.getState().nodes),
      undone,
    })
  }
}

export function keepAgentView() {
  useAgentViewStore.setState({ pending: undefined })
}

export async function saveAgentView(name: string) {
  const pending = useAgentViewStore.getState().pending
  const state = useNodeStore.getState()
  const layout = buildStoredNodeLayout(state, {
    description: pending?.note ?? pending?.title,
  })
  await saveProjectLayout(state.projectId, name, layout)
  const current = useAgentViewStore.getState().pending
  if (current === pending) {
    keepAgentView()
    return
  }
  // A view that arrived while saving still waits for its own decision, and
  // discarding it goes back to the graph just saved.
  if (current !== undefined && current.before === pending?.before) {
    useAgentViewStore.setState({
      pending: {
        ...current,
        before: state.nodes,
        changes: current.changes - pending.changes,
      },
    })
  }
}

// On arrival DiscoUI selects a first contract, and a view can move that one
// into a closed group the selection then spreads to. So the view's choice
// goes in a frame later, into the graph and the panels at once, which leaves
// the selection sync nothing to reconcile and the fit nothing to undo.
function selectAfterSettling(address: string) {
  requestAnimationFrame(() => {
    useNodeStore.setState({ selected: [address] })
    useAgentStore.getState().selectForAgent(address)
  })
}

// A view with groups is about them: what stays visible to connect them or is
// set aside would shrink the lanes to fit.
function framed(applied: AppliedView): string[] {
  const lanes = new Set(
    applied.groups.filter((g) => g.name !== SET_ASIDE_NAME).map((g) => g.id),
  )
  const members = applied.nodes
    .filter((node) => lanes.has(node.id))
    .flatMap((node) => node.subnodes.map((member) => member.id))
  return members.length > 0 ? members : visibleContracts(applied.nodes)
}

// Contracts, not top-level items: an open group is drawn as its members, so
// fitting goes by what draws each contract.
function visibleContracts(nodes: readonly Node[]): string[] {
  const projection = getGraphProjection(nodes)
  return projection.leafNodes
    .filter((node) => !projection.hiddenNodeIds.has(node.id))
    .map((node) => node.id)
}

function summarize(nodes: readonly Node[]): ViewReceipt {
  const projection = getGraphProjection(nodes)
  const leaves = projection.leafNodes
  return {
    missing: [],
    notHideable: [],
    cascaded: [],
    connectors: [],
    visible: leaves.filter((n) => !projection.hiddenNodeIds.has(n.id)).length,
    total: leaves.length,
  }
}

async function sendReceipt(
  id: string,
  receipt: ViewReceipt & { undone?: number; unavailable?: boolean },
) {
  const response = await fetch('/api/agent/receipt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...receipt }),
  }).catch(() => undefined)
  // A server that went down no longer waits for the receipt.
  if (response !== undefined && !response.ok) {
    console.warn('Agent receipt rejected', { status: response.status })
  }
}
