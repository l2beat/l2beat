import { type Validator, v } from '@l2beat/validate'
import { create, type StoreApi, type UseBoundStore } from 'zustand'
import {
  allKeys,
  canRemoveLeaf,
  findFirstLeaf,
  findLeafByKey,
  normalizeTree,
  reassignSplitIds,
  ensureLeaf as treeEnsureLeaf,
  moveLeaf as treeMoveLeaf,
  removeLeaf as treeRemoveLeaf,
  resizeSplit as treeResizeSplit,
  setLeafKey as treeSetLeafKey,
  validateLayout,
} from './tree'
import type {
  DockingConfig,
  DropTarget,
  LayoutNode,
  LeafKey,
  NodeId,
} from './types'

const DEFAULT_MAX_LAYOUTS = 6

export interface DockingState {
  tree: LayoutNode
  layouts: LayoutNode[]
  selectedLayout: number
  activeLeaf: LeafKey | undefined
  fullScreenLeaf: LeafKey | undefined
  pickedUpLeaf: LeafKey | undefined
  dragHover: DropTarget | undefined
  mouse: { x: number; y: number }
  config: DockingConfig
}

export interface DockingActions {
  ensureLeaf: (key: LeafKey) => void
  removeLeaf: (key?: LeafKey) => void
  activateLeaf: (key: LeafKey) => void
  setLeafKey: (key: LeafKey, newKey: LeafKey) => void
  moveLeaf: (key: LeafKey, target: DropTarget) => void
  resizeSplit: (splitId: NodeId, index: number, fraction: number) => void
  resetLayout: () => void
  toggleFullScreen: (key?: LeafKey) => void
  pickUpLeaf: (key: LeafKey) => void
  setDragHover: (target: DropTarget | undefined) => void
  dropLeaf: () => void
  setMouse: (x: number, y: number) => void
  loadLayout: (n: number) => void
}

export type DockingStore = DockingState & DockingActions

const zLeaf = v.object({
  kind: v.literal('leaf'),
  key: v.string(),
})

const zLayoutNode: Validator<LayoutNode> = v.lazy(() =>
  v.union([
    zLeaf,
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

function isValidLayout(node: LayoutNode, config: DockingConfig): boolean {
  try {
    validateLayout(node)
  } catch {
    return false
  }
  if (!config.isValidKey) return true
  return allKeys(node).every(config.isValidKey)
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
      if (candidate && isValidLayout(candidate, config)) {
        fallback[i] = normalizeTree(reassignSplitIds(candidate))
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

function firstKey(tree: LayoutNode): LeafKey | undefined {
  return findFirstLeaf(tree).key
}

// Every structural action writes the new tree into both `tree` and the active
// slot of `layouts`, and usually sets the focused leaf. Centralizing that here
// keeps the actions to a single expressive line each.
function applyTree(
  state: DockingState,
  tree: LayoutNode,
  activeLeaf: LeafKey | undefined = state.activeLeaf,
): Partial<DockingState> {
  return {
    tree,
    layouts: state.layouts.map((layout, i) =>
      i === state.selectedLayout ? tree : layout,
    ),
    activeLeaf,
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
    activeLeaf: firstKey(initialTree),
    fullScreenLeaf: undefined,
    pickedUpLeaf: undefined,
    dragHover: undefined,
    mouse: { x: 0, y: 0 },
    config,
    ensureLeaf: (key) =>
      set((state) => {
        if (config.isValidKey && !config.isValidKey(key)) return state
        // Exit another leaf's fullscreen, otherwise the ensured leaf would
        // appear or focus invisibly behind it.
        const fullScreenLeaf =
          state.fullScreenLeaf === key ? state.fullScreenLeaf : undefined
        if (findLeafByKey(state.tree, key)) {
          return { activeLeaf: key, fullScreenLeaf }
        }
        const tree = treeEnsureLeaf(state.tree, key, state.activeLeaf)
        return { ...applyTree(state, tree, key), fullScreenLeaf }
      }),
    removeLeaf: (key) =>
      set((state) => {
        const target = key ?? state.activeLeaf
        if (!target || !canRemoveLeaf(state.tree, target)) return state
        const tree = treeRemoveLeaf(state.tree, target)
        return {
          ...applyTree(
            state,
            tree,
            state.activeLeaf === target ? firstKey(tree) : state.activeLeaf,
          ),
          fullScreenLeaf:
            state.fullScreenLeaf === target ? undefined : state.fullScreenLeaf,
        }
      }),
    activateLeaf: (key) =>
      set((state) =>
        findLeafByKey(state.tree, key) ? { activeLeaf: key } : state,
      ),
    setLeafKey: (key, newKey) =>
      set((state) => {
        if (config.isValidKey && !config.isValidKey(newKey)) return state
        if (!findLeafByKey(state.tree, key)) return state
        const tree = treeSetLeafKey(state.tree, key, newKey)
        return {
          ...applyTree(state, tree, newKey),
          fullScreenLeaf:
            state.fullScreenLeaf === key ? newKey : state.fullScreenLeaf,
        }
      }),
    moveLeaf: (key, target) =>
      set((state) => {
        if (!findLeafByKey(state.tree, key)) return state
        return applyTree(state, treeMoveLeaf(state.tree, key, target), key)
      }),
    resizeSplit: (splitId, index, fraction) =>
      set((state) =>
        applyTree(state, treeResizeSplit(state.tree, splitId, index, fraction)),
      ),
    resetLayout: () =>
      set((state) => {
        const tree = structuredClone(config.defaultLayout)
        return {
          ...applyTree(state, tree, firstKey(tree)),
          fullScreenLeaf: undefined,
        }
      }),
    toggleFullScreen: (key) =>
      set((state) => {
        const target = key ?? state.activeLeaf
        if (!target) return state
        return {
          fullScreenLeaf: state.fullScreenLeaf === target ? undefined : target,
        }
      }),
    pickUpLeaf: (key) =>
      set(() => ({ pickedUpLeaf: key, dragHover: undefined })),
    setDragHover: (target) => set(() => ({ dragHover: target })),
    dropLeaf: () =>
      set((state) => {
        const key = state.pickedUpLeaf
        const target = state.dragHover
        if (!key || !target || !findLeafByKey(state.tree, key)) {
          return { pickedUpLeaf: undefined, dragHover: undefined }
        }
        const tree = treeMoveLeaf(state.tree, key, target)
        return {
          ...applyTree(state, tree, key),
          pickedUpLeaf: undefined,
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
          activeLeaf: firstKey(layout),
          fullScreenLeaf: undefined,
        }
      }),
  }))

  let timeout: ReturnType<typeof setTimeout>
  let persistedLayouts = layouts
  store.subscribe((state) => {
    if (state.layouts === persistedLayouts) return
    persistedLayouts = state.layouts
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
