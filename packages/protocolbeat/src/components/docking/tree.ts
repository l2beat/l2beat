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
  return { kind: 'leaf', id: newId(), tab }
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

export function findLeafById(
  root: LayoutNode,
  leafId: NodeId,
): LeafNode | undefined {
  for (const node of iterNodes(root)) {
    if (node.kind === 'leaf' && node.id === leafId) {
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
  nodeId: NodeId,
): { parent: SplitNode; index: number } | undefined {
  for (const node of iterNodes(root)) {
    if (node.kind !== 'split') continue
    const index = node.children.findIndex((child) => child.id === nodeId)
    if (index >= 0) return { parent: node, index }
  }
  return undefined
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
  const leaf = findLeafByTab(clone, tab)
  assert(leaf !== undefined, 'removeTab: leaf disappeared after clone')
  const parent = findParent(clone, leaf.id)
  assert(parent !== undefined, 'removeTab: leaf must have a parent')
  parent.parent.children.splice(parent.index, 1)
  parent.parent.sizes.splice(parent.index, 1)
  const collapsed = collapseTree(clone)
  validateLayout(collapsed)
  return collapsed
}

function collapseTree(root: LayoutNode): LayoutNode {
  let current = root
  while (true) {
    const step = collapseStep(current)
    if (step === current) return current
    current = step
  }
}

function collapseStep(root: LayoutNode): LayoutNode {
  const singleton = findSingletonSplit(root)
  if (singleton !== undefined) {
    return collapseSingletonSplit(root, singleton)
  }
  return root
}

function findSingletonSplit(root: LayoutNode): NodeId | undefined {
  for (const node of iterNodes(root)) {
    if (node.kind === 'split' && node.children.length === 1) {
      return node.id
    }
  }
  return undefined
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
  const parent = findParent(clone, splitId)
  assert(parent !== undefined, 'collapseSingletonSplit: parent missing')
  const sole = split.children[0]
  assert(sole !== undefined, 'sole child missing')
  parent.parent.children.splice(parent.index, 1, sole)
  return clone
}

export function splitLeaf(
  root: LayoutNode,
  targetLeafId: NodeId,
  edge: Edge,
  newTab: TabId,
): LayoutNode {
  const direction: SplitDirection =
    edge === 'left' || edge === 'right' ? 'row' : 'column'
  const before = edge === 'left' || edge === 'top'
  const newLeafNode = newLeaf(newTab)

  if (root.kind === 'leaf' && root.id === targetLeafId) {
    const targetClone = cloneTree(root) as LeafNode
    const children: LayoutNode[] = before
      ? [newLeafNode, targetClone]
      : [targetClone, newLeafNode]
    return newSplit(direction, children, [1, 1])
  }
  return splitLeafNested(root, targetLeafId, newLeafNode, direction, before)
}

function splitLeafNested(
  root: LayoutNode,
  targetLeafId: NodeId,
  newLeafNode: LeafNode,
  direction: SplitDirection,
  before: boolean,
): LayoutNode {
  const clone = cloneTree(root)
  const parent = findParent(clone, targetLeafId)
  assert(parent !== undefined, 'splitLeafNested: parent not found')
  const targetIndex = parent.index
  const target = parent.parent.children[targetIndex]
  assert(target !== undefined && target.kind === 'leaf', 'target not leaf')
  if (parent.parent.direction === direction) {
    const insertAt = before ? targetIndex : targetIndex + 1
    const targetSize = parent.parent.sizes[targetIndex] ?? 1
    parent.parent.children.splice(insertAt, 0, newLeafNode)
    parent.parent.sizes.splice(insertAt, 0, targetSize / 2)
    parent.parent.sizes[before ? targetIndex + 1 : targetIndex] = targetSize / 2
  } else {
    const wrapped = newSplit(
      direction,
      before ? [newLeafNode, target] : [target, newLeafNode],
      [1, 1],
    )
    parent.parent.children.splice(targetIndex, 1, wrapped)
  }
  validateLayout(clone)
  return clone
}

export function moveTab(
  root: LayoutNode,
  tab: TabId,
  target: DropTarget,
): LayoutNode {
  const source = findLeafByTab(root, tab)
  if (!source) return root
  if (source.id === target.leafId) return root
  if (leafCount(root) <= 1) return root
  const removed = removeTab(root, tab)
  const targetLeaf = findLeafById(removed, target.leafId)
  if (!targetLeaf) return removed
  return splitLeaf(removed, target.leafId, target.edge, tab)
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

export function ensureTab(
  root: LayoutNode,
  tab: TabId,
  anchorLeafId?: NodeId,
): LayoutNode {
  if (findLeafByTab(root, tab)) return root
  const anchor =
    (anchorLeafId !== undefined
      ? findLeafById(root, anchorLeafId)
      : undefined) ?? findFirstLeaf(root)
  return splitLeaf(root, anchor.id, 'right', tab)
}

export function resetSizes(root: LayoutNode): LayoutNode {
  const clone = cloneTree(root)
  for (const node of iterNodes(clone)) {
    if (node.kind === 'split') {
      node.sizes = node.children.map(() => 1)
    }
  }
  return clone
}

export function nextAvailableTab(
  root: LayoutNode,
  available: readonly TabId[],
): TabId | undefined {
  const present = new Set(allTabs(root))
  return available.find((id) => !present.has(id))
}
