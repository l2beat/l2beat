import type {
  DropTarget,
  Edge,
  LayoutNode,
  LeafNode,
  NodeId,
  SplitDirection,
  SplitNode,
  TabId,
} from './types'

export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`docking: ${message}`)
  }
}

let nextId = 0
export function newId(): NodeId {
  nextId += 1
  return `n${nextId}`
}

export function newLeaf(tab: TabId): LeafNode {
  return { kind: 'leaf', tab }
}

export function newSplit(
  direction: SplitDirection,
  children: LayoutNode[],
  sizes?: number[],
): SplitNode {
  assert(children.length >= 2, 'split must have at least two children')
  const useSizes = sizes ?? children.map(() => 1)
  assert(useSizes.length === children.length, 'sizes length mismatch')
  return {
    kind: 'split',
    id: newId(),
    direction,
    sizes: [...useSizes],
    children,
  }
}

export function cloneTree(root: LayoutNode): LayoutNode {
  return structuredClone(root)
}

export function* iterNodes(root: LayoutNode): Generator<LayoutNode> {
  const stack: LayoutNode[] = [root]
  while (stack.length > 0) {
    const node = stack.pop()
    assert(node !== undefined, 'stack pop returned undefined')
    yield node
    if (node.kind === 'split') {
      for (let i = node.children.length - 1; i >= 0; i--) {
        const child = node.children[i]
        assert(child !== undefined, 'split has hole in children')
        stack.push(child)
      }
    }
  }
}

export function findLeafByTab(
  root: LayoutNode,
  tab: TabId,
): LeafNode | undefined {
  for (const node of iterNodes(root)) {
    if (node.kind === 'leaf' && node.tab === tab) {
      return node
    }
  }
  return undefined
}

export function findFirstLeaf(root: LayoutNode): LeafNode {
  for (const node of iterNodes(root)) {
    if (node.kind === 'leaf') return node
  }
  assert(false, 'tree has no leaves')
}

export function findParent(
  root: LayoutNode,
  match: (node: LayoutNode) => boolean,
): { parent: SplitNode; index: number } | undefined {
  for (const node of iterNodes(root)) {
    if (node.kind !== 'split') continue
    const index = node.children.findIndex(match)
    if (index >= 0) return { parent: node, index }
  }
  return undefined
}

function isLeafTab(tab: TabId): (node: LayoutNode) => boolean {
  return (node) => node.kind === 'leaf' && node.tab === tab
}

function isSplitId(splitId: NodeId): (node: LayoutNode) => boolean {
  return (node) => node.kind === 'split' && node.id === splitId
}

export function findSplit(
  root: LayoutNode,
  splitId: NodeId,
): SplitNode | undefined {
  for (const node of iterNodes(root)) {
    if (node.kind === 'split' && node.id === splitId) return node
  }
  return undefined
}

export function allTabs(root: LayoutNode): TabId[] {
  const tabs: TabId[] = []
  for (const node of iterNodes(root)) {
    if (node.kind === 'leaf') tabs.push(node.tab)
  }
  return tabs
}

export function leafCount(root: LayoutNode): number {
  let count = 0
  for (const node of iterNodes(root)) {
    if (node.kind === 'leaf') count += 1
  }
  return count
}

export function validateLayout(root: LayoutNode): void {
  const seen = new Set<TabId>()
  for (const node of iterNodes(root)) {
    if (node.kind === 'leaf') {
      assert(!seen.has(node.tab), `duplicate tab in tree: ${node.tab}`)
      seen.add(node.tab)
    } else {
      assert(node.children.length >= 2, 'single-child split must collapse')
      assert(
        node.sizes.length === node.children.length,
        'split sizes/children length mismatch',
      )
      for (const size of node.sizes) {
        assert(size > 0, 'split size must be positive')
      }
    }
  }
}

export function canRemoveTab(root: LayoutNode, tab: TabId): boolean {
  if (!findLeafByTab(root, tab)) return false
  return leafCount(root) > 1
}

export function removeTab(root: LayoutNode, tab: TabId): LayoutNode {
  if (!canRemoveTab(root, tab)) return root
  const clone = cloneTree(root)
  const parent = findParent(clone, isLeafTab(tab))
  assert(parent !== undefined, 'removeTab: leaf must have a parent')
  parent.parent.children.splice(parent.index, 1)
  parent.parent.sizes.splice(parent.index, 1)
  const normalized = normalizeTree(clone)
  validateLayout(normalized)
  return normalized
}

// Tree invariant: a split never holds a singleton, and never holds a child
// split of its own direction (row-in-row / column-in-column). Enforcing this
// after every mutation keeps layouts flat and shallow, so panes stay
// resizable instead of decaying into unreachable slivers.
type NormalizeTarget =
  | { kind: 'singleton'; splitId: NodeId }
  | { kind: 'flatten'; splitId: NodeId; childIndex: number }

function findNormalizeTarget(root: LayoutNode): NormalizeTarget | undefined {
  for (const node of iterNodes(root)) {
    if (node.kind !== 'split') continue
    if (node.children.length === 1) {
      return { kind: 'singleton', splitId: node.id }
    }
    const childIndex = node.children.findIndex(
      (child) => child.kind === 'split' && child.direction === node.direction,
    )
    if (childIndex >= 0) {
      return { kind: 'flatten', splitId: node.id, childIndex }
    }
  }
  return undefined
}

export function normalizeTree(root: LayoutNode): LayoutNode {
  let current = root
  while (true) {
    const target = findNormalizeTarget(current)
    if (target === undefined) return current
    current =
      target.kind === 'singleton'
        ? collapseSingletonSplit(current, target.splitId)
        : flattenSplit(current, target.splitId, target.childIndex)
  }
}

function flattenSplit(
  root: LayoutNode,
  splitId: NodeId,
  childIndex: number,
): LayoutNode {
  const clone = cloneTree(root)
  const split = findSplit(clone, splitId)
  assert(split !== undefined, 'flattenSplit: split missing')
  const child = split.children[childIndex]
  assert(child?.kind === 'split', 'flattenSplit: target not a split')
  assert(child.direction === split.direction, 'flattenSplit: direction differs')
  const parentWeight = split.sizes[childIndex]
  assert(parentWeight !== undefined, 'flattenSplit: missing parent weight')
  const childTotal = child.sizes.reduce((sum, size) => sum + size, 0)
  assert(childTotal > 0, 'flattenSplit: child sizes must be positive')
  const scaled = child.sizes.map((size) => (size * parentWeight) / childTotal)
  split.children.splice(childIndex, 1, ...child.children)
  split.sizes.splice(childIndex, 1, ...scaled)
  return clone
}

function collapseSingletonSplit(root: LayoutNode, splitId: NodeId): LayoutNode {
  if (root.kind === 'split' && root.id === splitId) {
    const sole = root.children[0]
    assert(sole !== undefined, 'sole child missing')
    return cloneTree(sole)
  }
  const clone = cloneTree(root)
  const split = findSplit(clone, splitId)
  assert(split !== undefined, 'collapseSingletonSplit: split missing')
  const parent = findParent(clone, isSplitId(splitId))
  assert(parent !== undefined, 'collapseSingletonSplit: parent missing')
  const sole = split.children[0]
  assert(sole !== undefined, 'sole child missing')
  parent.parent.children.splice(parent.index, 1, sole)
  return clone
}

export function splitLeaf(
  root: LayoutNode,
  targetTab: TabId,
  edge: Edge,
  newTab: TabId,
): LayoutNode {
  const direction: SplitDirection =
    edge === 'left' || edge === 'right' ? 'row' : 'column'
  const before = edge === 'left' || edge === 'top'
  const newLeafNode = newLeaf(newTab)

  if (root.kind === 'leaf' && root.tab === targetTab) {
    const targetClone = cloneTree(root) as LeafNode
    const children: LayoutNode[] = before
      ? [newLeafNode, targetClone]
      : [targetClone, newLeafNode]
    return newSplit(direction, children, [1, 1])
  }
  return splitLeafNested(root, targetTab, newLeafNode, direction, before)
}

function splitLeafNested(
  root: LayoutNode,
  targetTab: TabId,
  newLeafNode: LeafNode,
  direction: SplitDirection,
  before: boolean,
): LayoutNode {
  const clone = cloneTree(root)
  const parent = findParent(clone, isLeafTab(targetTab))
  assert(parent !== undefined, 'splitLeafNested: parent not found')
  const targetIndex = parent.index
  const target = parent.parent.children[targetIndex]
  assert(target !== undefined && target.kind === 'leaf', 'target not leaf')
  if (parent.parent.direction === direction) {
    const insertAt = before ? targetIndex : targetIndex + 1
    const sizes = parent.parent.sizes
    const fairSize = sizes.reduce((sum, size) => sum + size, 0) / sizes.length
    parent.parent.children.splice(insertAt, 0, newLeafNode)
    parent.parent.sizes.splice(insertAt, 0, fairSize)
  } else {
    const wrapped = newSplit(
      direction,
      before ? [newLeafNode, target] : [target, newLeafNode],
      [1, 1],
    )
    parent.parent.children.splice(targetIndex, 1, wrapped)
  }
  const normalized = normalizeTree(clone)
  validateLayout(normalized)
  return normalized
}

export function moveTab(
  root: LayoutNode,
  tab: TabId,
  target: DropTarget,
): LayoutNode {
  if (!findLeafByTab(root, tab)) return root
  if (tab === target.tab) return root
  if (leafCount(root) <= 1) return root
  const removed = removeTab(root, tab)
  if (!findLeafByTab(removed, target.tab)) return removed
  return splitLeaf(removed, target.tab, target.edge, tab)
}

export function resizeSplit(
  root: LayoutNode,
  splitId: NodeId,
  index: number,
  fraction: number,
): LayoutNode {
  const clone = cloneTree(root)
  const split = findSplit(clone, splitId)
  assert(split !== undefined, `resizeSplit: split ${splitId} not found`)
  assert(index >= 0 && index < split.children.length - 1, 'resize index oob')
  assert(fraction > 0 && fraction < 1, 'resize fraction out of range')
  const a = split.sizes[index]
  const b = split.sizes[index + 1]
  assert(a !== undefined && b !== undefined, 'resize sizes missing')
  const total = a + b
  split.sizes[index] = total * fraction
  split.sizes[index + 1] = total * (1 - fraction)
  return clone
}

export function changeTab(
  root: LayoutNode,
  tab: TabId,
  newTab: TabId,
): LayoutNode {
  if (tab === newTab) return root
  const clone = cloneTree(root)
  const leaf = findLeafByTab(clone, tab)
  assert(leaf !== undefined, `changeTab: leaf ${tab} not found`)
  const other = findLeafByTab(clone, newTab)
  leaf.tab = newTab
  if (other) {
    other.tab = tab
  }
  validateLayout(clone)
  return clone
}

export function ensureTab(
  root: LayoutNode,
  tab: TabId,
  anchorTab?: TabId,
): LayoutNode {
  if (findLeafByTab(root, tab)) return root
  const anchor =
    (anchorTab !== undefined ? findLeafByTab(root, anchorTab) : undefined) ??
    findFirstLeaf(root)
  return splitLeaf(root, anchor.tab, 'right', tab)
}

export function nextAvailableTab(
  root: LayoutNode,
  available: readonly TabId[],
): TabId | undefined {
  const present = new Set(allTabs(root))
  return available.find((id) => !present.has(id))
}
