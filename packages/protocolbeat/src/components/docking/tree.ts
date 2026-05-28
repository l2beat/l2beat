import type {
  DropTarget,
  Edge,
  GroupNode,
  LayoutNode,
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

export function newGroup(tabs: TabId[], active?: TabId): GroupNode {
  assert(tabs.length > 0, 'group must have at least one tab')
  const activeTab = active ?? tabs[0]
  assert(activeTab !== undefined, 'group active tab undefined')
  assert(tabs.includes(activeTab), 'active must be one of tabs')
  return { kind: 'group', id: newId(), tabs: [...tabs], active: activeTab }
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

export function findGroup(
  root: LayoutNode,
  groupId: NodeId,
): GroupNode | undefined {
  for (const node of iterNodes(root)) {
    if (node.kind === 'group' && node.id === groupId) {
      return node
    }
  }
  return undefined
}

export function findGroupOfTab(
  root: LayoutNode,
  tab: TabId,
): GroupNode | undefined {
  for (const node of iterNodes(root)) {
    if (node.kind === 'group' && node.tabs.includes(tab)) {
      return node
    }
  }
  return undefined
}

export function findFirstGroup(root: LayoutNode): GroupNode {
  for (const node of iterNodes(root)) {
    if (node.kind === 'group') {
      return node
    }
  }
  assert(false, 'tree has no groups')
}

export function findParent(
  root: LayoutNode,
  nodeId: NodeId,
): { parent: SplitNode; index: number } | undefined {
  for (const node of iterNodes(root)) {
    if (node.kind !== 'split') continue
    const index = node.children.findIndex((child) => child.id === nodeId)
    if (index >= 0) {
      return { parent: node, index }
    }
  }
  return undefined
}

export function findSplit(
  root: LayoutNode,
  splitId: NodeId,
): SplitNode | undefined {
  for (const node of iterNodes(root)) {
    if (node.kind === 'split' && node.id === splitId) {
      return node
    }
  }
  return undefined
}

export function allTabs(root: LayoutNode): TabId[] {
  const tabs: TabId[] = []
  for (const node of iterNodes(root)) {
    if (node.kind === 'group') {
      tabs.push(...node.tabs)
    }
  }
  return tabs
}

export function validateLayout(root: LayoutNode): void {
  for (const node of iterNodes(root)) {
    if (node.kind === 'group') {
      assert(node.tabs.length > 0, 'empty group')
      assert(node.tabs.includes(node.active), 'group active not in tabs')
      const set = new Set(node.tabs)
      assert(set.size === node.tabs.length, 'duplicate tab in group')
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

export function insertTabInGroup(
  root: LayoutNode,
  groupId: NodeId,
  tab: TabId,
  index: number,
): LayoutNode {
  const clone = cloneTree(root)
  const group = findGroup(clone, groupId)
  assert(group !== undefined, `insertTabInGroup: group ${groupId} not found`)
  assert(!group.tabs.includes(tab), 'tab already in target group')
  const clamped = Math.max(0, Math.min(index, group.tabs.length))
  group.tabs.splice(clamped, 0, tab)
  group.active = tab
  validateLayout(clone)
  return clone
}

export function reorderTabInGroup(
  root: LayoutNode,
  groupId: NodeId,
  tab: TabId,
  index: number,
): LayoutNode {
  const clone = cloneTree(root)
  const group = findGroup(clone, groupId)
  assert(group !== undefined, 'reorderTabInGroup: group not found')
  const from = group.tabs.indexOf(tab)
  assert(from >= 0, 'reorderTabInGroup: tab not in group')
  const clamped = Math.max(0, Math.min(index, group.tabs.length - 1))
  if (from === clamped) return clone
  group.tabs.splice(from, 1)
  group.tabs.splice(clamped, 0, tab)
  group.active = tab
  validateLayout(clone)
  return clone
}

export function canRemoveTab(root: LayoutNode, tab: TabId): boolean {
  const group = findGroupOfTab(root, tab)
  if (!group) return false
  const tabs = allTabs(root)
  return tabs.length > 1
}

export function removeTab(
  root: LayoutNode,
  tab: TabId,
): { tree: LayoutNode; removedFrom: NodeId | undefined } {
  if (!canRemoveTab(root, tab)) {
    return { tree: root, removedFrom: undefined }
  }
  const clone = cloneTree(root)
  const group = findGroupOfTab(clone, tab)
  assert(group !== undefined, 'removeTab: group disappeared after clone')
  const removedFrom = group.id
  const at = group.tabs.indexOf(tab)
  group.tabs.splice(at, 1)
  if (group.active === tab && group.tabs.length > 0) {
    const fallback = group.tabs[Math.min(at, group.tabs.length - 1)]
    assert(fallback !== undefined, 'no fallback tab after removal')
    group.active = fallback
  }
  const collapsed = collapseTree(clone)
  validateLayout(collapsed)
  return { tree: collapsed, removedFrom }
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
  const empty = findEmptyGroupParent(root)
  if (empty !== undefined) {
    return removeChildAt(root, empty.parentId, empty.index)
  }
  const singleton = findSingletonSplit(root)
  if (singleton !== undefined) {
    return collapseSingletonSplit(root, singleton)
  }
  return root
}

function findEmptyGroupParent(
  root: LayoutNode,
): { parentId: NodeId; index: number } | undefined {
  for (const node of iterNodes(root)) {
    if (node.kind !== 'split') continue
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i]
      assert(child !== undefined, 'child hole')
      if (child.kind === 'group' && child.tabs.length === 0) {
        return { parentId: node.id, index: i }
      }
    }
  }
  return undefined
}

function removeChildAt(
  root: LayoutNode,
  parentId: NodeId,
  index: number,
): LayoutNode {
  const clone = cloneTree(root)
  const split = findSplit(clone, parentId)
  assert(split !== undefined, 'removeChildAt: parent not found')
  split.children.splice(index, 1)
  split.sizes.splice(index, 1)
  return clone
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

export function splitGroup(
  root: LayoutNode,
  targetGroupId: NodeId,
  edge: Edge,
  insertGroup: GroupNode,
): LayoutNode {
  const direction: SplitDirection =
    edge === 'left' || edge === 'right' ? 'row' : 'column'
  const before = edge === 'left' || edge === 'top'
  if (root.kind === 'group' && root.id === targetGroupId) {
    const targetClone = cloneTree(root) as GroupNode
    const newGroupClone = cloneTree(insertGroup) as GroupNode
    const children = before
      ? [newGroupClone, targetClone]
      : [targetClone, newGroupClone]
    return newSplit(direction, children, [1, 1])
  }
  return splitGroupNested(root, targetGroupId, edge, insertGroup)
}

function splitGroupNested(
  root: LayoutNode,
  targetGroupId: NodeId,
  edge: Edge,
  insertGroup: GroupNode,
): LayoutNode {
  const clone = cloneTree(root)
  const direction: SplitDirection =
    edge === 'left' || edge === 'right' ? 'row' : 'column'
  const before = edge === 'left' || edge === 'top'
  const parent = findParent(clone, targetGroupId)
  assert(parent !== undefined, 'splitGroupNested: parent not found')
  const targetIndex = parent.index
  const target = parent.parent.children[targetIndex]
  assert(target !== undefined && target.kind === 'group', 'target not group')
  const newGroupClone = cloneTree(insertGroup) as GroupNode
  if (parent.parent.direction === direction) {
    const insertAt = before ? targetIndex : targetIndex + 1
    const targetSize = parent.parent.sizes[targetIndex] ?? 1
    parent.parent.children.splice(insertAt, 0, newGroupClone)
    parent.parent.sizes.splice(insertAt, 0, targetSize / 2)
    parent.parent.sizes[before ? targetIndex + 1 : targetIndex] = targetSize / 2
  } else {
    const wrapped = newSplit(
      direction,
      before ? [newGroupClone, target] : [target, newGroupClone],
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
  const source = findGroupOfTab(root, tab)
  if (!source) return root
  if (target.kind === 'into-group' && source.id === target.groupId) {
    return reorderTabInGroup(root, target.groupId, tab, target.index)
  }
  if (
    target.kind === 'split' &&
    source.id === target.groupId &&
    source.tabs.length === 1
  ) {
    return root
  }
  const removed = removeTab(root, tab)
  if (target.kind === 'into-group') {
    const targetGroup = findGroup(removed.tree, target.groupId)
    if (!targetGroup) return removed.tree
    return insertTabInGroup(removed.tree, target.groupId, tab, target.index)
  }
  const targetGroup = findGroup(removed.tree, target.groupId)
  if (!targetGroup) return removed.tree
  const inserted = newGroup([tab])
  return splitGroup(removed.tree, target.groupId, target.edge, inserted)
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

export function ensureTab(root: LayoutNode, tab: TabId): LayoutNode {
  const existing = findGroupOfTab(root, tab)
  if (existing) return root
  const clone = cloneTree(root)
  const target = findFirstGroup(clone)
  target.tabs.push(tab)
  target.active = tab
  validateLayout(clone)
  return clone
}

export function activateTab(root: LayoutNode, tab: TabId): LayoutNode {
  const existing = findGroupOfTab(root, tab)
  if (!existing) return root
  const clone = cloneTree(root)
  const group = findGroupOfTab(clone, tab)
  assert(group !== undefined, 'group missing after clone')
  group.active = tab
  return clone
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
