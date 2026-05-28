import { type Validator, v } from '@l2beat/validate'
import { create, type StoreApi, type UseBoundStore } from 'zustand'
import {
  allTabs,
  canRemoveTab,
  findFirstGroup,
  findGroupOfTab,
  nextAvailableTab,
  activateTab as treeActivateTab,
  ensureTab as treeEnsureTab,
  moveTab as treeMoveTab,
  removeTab as treeRemoveTab,
  resetSizes as treeResetSizes,
  resizeSplit as treeResizeSplit,
  validateLayout,
} from './tree'
import type {
  DockingConfig,
  DropTarget,
  LayoutNode,
  NodeId,
  TabId,
} from './types'

const DEFAULT_MAX_LAYOUTS = 6

export interface DockingState {
  tree: LayoutNode
  layouts: LayoutNode[]
  selectedLayout: number
  activeTab: TabId | undefined
  fullScreenTab: TabId | undefined
  pickedUpTab: TabId | undefined
  dragHover: DropTarget | undefined
  mouse: { x: number; y: number }
  config: DockingConfig
}

export interface DockingActions {
  ensureTab: (id: TabId) => void
  addTab: () => void
  removeTab: (id?: TabId) => void
  activateTab: (id: TabId) => void
  moveTab: (id: TabId, target: DropTarget) => void
  resizeSplit: (splitId: NodeId, index: number, fraction: number) => void
  resetSizes: () => void
  toggleFullScreen: (id?: TabId) => void
  pickUpTab: (id: TabId) => void
  setDragHover: (target: DropTarget | undefined) => void
  dropTab: () => void
  setMouse: (x: number, y: number) => void
  loadLayout: (n: number) => void
}

export type DockingStore = DockingState & DockingActions

const zGroup = v.object({
  kind: v.literal('group'),
  id: v.string(),
  tabs: v.array(v.string()),
  active: v.string(),
})

const zLayoutNode: Validator<LayoutNode> = v.lazy(() =>
  v.union([
    zGroup,
    v.object({
      kind: v.literal('split'),
      id: v.string(),
      direction: v.union([v.literal('row'), v.literal('column')]),
      sizes: v.array(v.number().check((n) => n > 0)),
      children: v.array(zLayoutNode),
    }),
  ]),
) as Validator<LayoutNode>

function layoutsKey(storageKey: string): string {
  return `${storageKey}/layouts`
}

function selectedKey(storageKey: string): string {
  return `${storageKey}/selected`
}

function isValidLayout(node: LayoutNode, available: readonly TabId[]): boolean {
  const allowed = new Set(available)
  try {
    validateLayout(node)
  } catch {
    return false
  }
  for (const tab of allTabs(node)) {
    if (!allowed.has(tab)) return false
  }
  return true
}

function readLayouts(config: DockingConfig): LayoutNode[] {
  const max = config.maxLayouts ?? DEFAULT_MAX_LAYOUTS
  const fallback: LayoutNode[] = new Array(max)
    .fill(undefined)
    .map(() => structuredClone(config.defaultLayout))
  const raw = localStorage.getItem(layoutsKey(config.storageKey))
  if (!raw) return fallback
  try {
    const parsed = v.array(zLayoutNode).parse(JSON.parse(raw))
    for (let i = 0; i < max; i++) {
      const candidate = parsed[i]
      if (candidate && isValidLayout(candidate, config.availableTabs)) {
        fallback[i] = candidate
      }
    }
  } catch (e) {
    console.error('docking: failed to read layouts', e)
  }
  return fallback
}

function readSelected(config: DockingConfig): number {
  const max = config.maxLayouts ?? DEFAULT_MAX_LAYOUTS
  const raw = localStorage.getItem(selectedKey(config.storageKey)) ?? '0'
  try {
    const value = JSON.parse(raw)
    if (
      typeof value === 'number' &&
      Number.isInteger(value) &&
      value >= 0 &&
      value < max
    ) {
      return value
    }
  } catch {}
  return 0
}

function activeOf(tree: LayoutNode): TabId | undefined {
  const group = findFirstGroup(tree)
  return group.active
}

function withTree(
  state: DockingState,
  tree: LayoutNode,
): Partial<DockingState> {
  return {
    tree,
    layouts: state.layouts.map((layout, i) =>
      i === state.selectedLayout ? tree : layout,
    ),
  }
}

export function createDockingStore(
  config: DockingConfig,
): UseBoundStore<StoreApi<DockingStore>> {
  const layouts = readLayouts(config)
  const selected = readSelected(config)
  const initialTree = layouts[selected]
  if (!initialTree) {
    throw new Error('docking: no initial tree')
  }
  const store = create<DockingStore>((set) => ({
    tree: initialTree,
    layouts,
    selectedLayout: selected,
    activeTab: activeOf(initialTree),
    fullScreenTab: undefined,
    pickedUpTab: undefined,
    dragHover: undefined,
    mouse: { x: 0, y: 0 },
    config,
    ensureTab: (id) =>
      set((state) => {
        if (!config.availableTabs.includes(id)) return state
        if (findGroupOfTab(state.tree, id)) {
          return {
            ...withTree(state, treeActivateTab(state.tree, id)),
            activeTab: id,
          }
        }
        const tree = treeEnsureTab(state.tree, id)
        return { ...withTree(state, tree), activeTab: id }
      }),
    addTab: () =>
      set((state) => {
        const filter = config.filterTab ?? (() => true)
        const allowed = config.availableTabs.filter(filter)
        const next = nextAvailableTab(state.tree, allowed)
        if (!next) return state
        const tree = treeEnsureTab(state.tree, next)
        return { ...withTree(state, tree), activeTab: next }
      }),
    removeTab: (id) =>
      set((state) => {
        const targetId = id ?? state.activeTab
        if (!targetId) return state
        if (!canRemoveTab(state.tree, targetId)) return state
        const { tree } = treeRemoveTab(state.tree, targetId)
        const newActive = activeOf(tree)
        return {
          ...withTree(state, tree),
          activeTab: newActive,
          fullScreenTab:
            state.fullScreenTab === targetId ? undefined : state.fullScreenTab,
        }
      }),
    activateTab: (id) =>
      set((state) => {
        if (!findGroupOfTab(state.tree, id)) return state
        const tree = treeActivateTab(state.tree, id)
        return { ...withTree(state, tree), activeTab: id }
      }),
    moveTab: (id, target) =>
      set((state) => {
        if (!findGroupOfTab(state.tree, id)) return state
        const tree = treeMoveTab(state.tree, id, target)
        return { ...withTree(state, tree), activeTab: id }
      }),
    resizeSplit: (splitId, index, fraction) =>
      set((state) => {
        const tree = treeResizeSplit(state.tree, splitId, index, fraction)
        return withTree(state, tree)
      }),
    resetSizes: () =>
      set((state) => withTree(state, treeResetSizes(state.tree))),
    toggleFullScreen: (id) =>
      set((state) => {
        const targetId = id ?? state.activeTab
        if (!targetId) return state
        return {
          fullScreenTab:
            state.fullScreenTab === targetId ? undefined : targetId,
        }
      }),
    pickUpTab: (id) => set(() => ({ pickedUpTab: id, dragHover: undefined })),
    setDragHover: (target) => set(() => ({ dragHover: target })),
    dropTab: () =>
      set((state) => {
        const tab = state.pickedUpTab
        const target = state.dragHover
        if (!tab || !target) {
          return { pickedUpTab: undefined, dragHover: undefined }
        }
        if (!findGroupOfTab(state.tree, tab)) {
          return { pickedUpTab: undefined, dragHover: undefined }
        }
        const tree = treeMoveTab(state.tree, tab, target)
        return {
          ...withTree(state, tree),
          activeTab: tab,
          pickedUpTab: undefined,
          dragHover: undefined,
        }
      }),
    setMouse: (x, y) => set(() => ({ mouse: { x, y } })),
    loadLayout: (n) =>
      set((state) => {
        const layout = state.layouts[n]
        if (!layout) return state
        localStorage.setItem(selectedKey(config.storageKey), JSON.stringify(n))
        return {
          tree: layout,
          selectedLayout: n,
          activeTab: activeOf(layout),
          fullScreenTab: undefined,
        }
      }),
  }))

  let timeout: ReturnType<typeof setTimeout>
  store.subscribe((state) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      localStorage.setItem(
        layoutsKey(config.storageKey),
        JSON.stringify(state.layouts),
      )
    }, 50)
  })

  return store
}
