import { expect } from 'earl'
import {
  allKeys,
  iterNodes,
  leafCount,
  moveLeaf,
  newLeaf,
  newSplit,
  normalizeTree,
  reassignSplitIds,
  removeLeaf,
  splitLeaf,
  validateLayout,
} from './tree'
import type { Edge, LayoutNode, LeafKey } from './types'

// Every mutation must leave the tree well-formed: valid per validateLayout,
// no split holding a same-direction child (those must flatten), and every
// weight positive. If any of these break, panes decay into unreachable
// slivers, which is the failure this module exists to prevent.
function assertWellFormed(root: LayoutNode): void {
  validateLayout(root)
  for (const node of iterNodes(root)) {
    if (node.kind !== 'split') continue
    expect(node.children.length >= 2).toEqual(true)
    for (const child of node.children) {
      if (child.kind === 'split') {
        expect(child.direction === node.direction).toEqual(false)
      }
    }
    for (const size of node.sizes) {
      expect(size > 0).toEqual(true)
    }
  }
}

function sortedKeys(root: LayoutNode): LeafKey[] {
  return [...allKeys(root)].sort()
}

describe('docking/tree', () => {
  describe('splitLeaf', () => {
    it('keeps same-direction splits flat instead of nesting', () => {
      const root = newSplit('row', [newLeaf('a'), newLeaf('b')], [1, 1])
      const next = splitLeaf(root, 'b', 'right', 'c')
      assertWellFormed(next)
      expect(next.kind).toEqual('split')
      const split = next as Extract<LayoutNode, { kind: 'split' }>
      expect(split.children.every((child) => child.kind === 'leaf')).toEqual(
        true,
      )
      expect(allKeys(next)).toEqual(['a', 'b', 'c'])
    })

    it('nests exactly one level for a perpendicular split', () => {
      const root = newSplit('row', [newLeaf('a'), newLeaf('b')], [1, 1])
      const next = splitLeaf(root, 'b', 'bottom', 'c')
      assertWellFormed(next)
      expect(sortedKeys(next)).toEqual(['a', 'b', 'c'])
    })
  })

  describe('insertion sizing', () => {
    it('does not let repeated adds decay panes into slivers', () => {
      // Simulates pressing "+ Panel" many times: each add splits the active
      // pane to its right and the new pane becomes active. The old logic
      // halved the active pane every time (0.5, 0.25, 0.125, ...). Fair-share
      // insertion must keep weights comparable instead.
      let tree: LayoutNode = newSplit(
        'row',
        [newLeaf('a'), newLeaf('b'), newLeaf('c')],
        [0.5, 1, 1],
      )
      let active = 'c'
      for (let i = 0; i < 20; i++) {
        const tab = `p${i}`
        tree = splitLeaf(tree, active, 'right', tab)
        active = tab
      }
      assertWellFormed(tree)
      expect(leafCount(tree)).toEqual(23)

      const sizes: number[] = []
      for (const node of iterNodes(tree)) {
        if (node.kind === 'split') sizes.push(...node.sizes)
      }
      const min = Math.min(...sizes)
      const max = Math.max(...sizes)
      // Old behavior pushed this ratio past 1e5 within ~20 adds.
      expect(max / min < 4).toEqual(true)
    })
  })

  describe('normalizeTree', () => {
    it('flattens a same-direction split into its parent, preserving weight', () => {
      const inner = newSplit('row', [newLeaf('b'), newLeaf('c')], [1, 1])
      const root = newSplit('row', [newLeaf('a'), inner], [1, 2])
      const flat = normalizeTree(root) as Extract<LayoutNode, { kind: 'split' }>
      assertWellFormed(flat)
      expect(allKeys(flat)).toEqual(['a', 'b', 'c'])
      // Parent gave the inner split weight 2; its two equal children inherit
      // half of that each.
      expect(flat.sizes).toEqual([1, 1, 1])
    })

    it('leaves perpendicular nesting untouched', () => {
      const inner = newSplit('column', [newLeaf('b'), newLeaf('c')], [1, 1])
      const root = newSplit('row', [newLeaf('a'), inner], [1, 1])
      const result = normalizeTree(root) as Extract<
        LayoutNode,
        { kind: 'split' }
      >
      assertWellFormed(result)
      expect(result.children.length).toEqual(2)
      expect(result.children[1]?.kind).toEqual('split')
    })
  })

  describe('validateLayout', () => {
    it('rejects duplicate split ids', () => {
      // Persisted layouts carry ids from a previous session while newId
      // restarts at zero, so collisions are reachable unless ids are
      // re-stamped at the storage boundary. This is the paired assertion.
      const inner = newSplit('column', [newLeaf('b'), newLeaf('c')], [1, 1])
      const root = newSplit('row', [newLeaf('a'), inner], [1, 1])
      inner.id = root.id
      expect(() => validateLayout(root)).toThrow()
    })

    it('accepts the same tree after reassignSplitIds', () => {
      const inner = newSplit('column', [newLeaf('b'), newLeaf('c')], [1, 1])
      const root = newSplit('row', [newLeaf('a'), inner], [1, 1])
      inner.id = root.id
      const fixed = reassignSplitIds(root)
      validateLayout(fixed)
      expect(sortedKeys(fixed)).toEqual(['a', 'b', 'c'])
    })
  })

  describe('removeLeaf', () => {
    it('collapses the parent split when a pane is removed', () => {
      const root = newSplit('row', [newLeaf('a'), newLeaf('b')], [1, 1])
      const next = removeLeaf(root, 'a')
      assertWellFormed(next)
      expect(next.kind).toEqual('leaf')
      expect(allKeys(next)).toEqual(['b'])
    })

    it('refuses to remove the last remaining pane', () => {
      const root = newLeaf('a')
      expect(removeLeaf(root, 'a')).toEqual(root)
    })
  })

  describe('moveLeaf', () => {
    it('no-ops on a stale target instead of dropping the moved leaf', () => {
      // The drop target is hit-tested at hover time; the tree can change
      // before the drop lands. The leaf must never be silently lost.
      const root = newSplit('row', [newLeaf('a'), newLeaf('b')], [1, 1])
      const moved = moveLeaf(root, 'a', { key: 'ghost', edge: 'left' })
      expect(moved).toEqual(root)
      expect(sortedKeys(moved)).toEqual(['a', 'b'])
    })

    it('preserves the full set of tabs and stays well-formed', () => {
      const root = newSplit(
        'row',
        [newLeaf('a'), newLeaf('b'), newLeaf('c')],
        [1, 1, 1],
      )
      const target = { key: 'c', edge: 'bottom' as Edge }
      const moved = moveLeaf(root, 'a', target)
      assertWellFormed(moved)
      expect(sortedKeys(moved)).toEqual(['a', 'b', 'c'])
    })
  })

  describe('invariants under long operation sequences', () => {
    it('stays well-formed across scripted splits, moves, and removes', () => {
      const edges: Edge[] = ['left', 'right', 'top', 'bottom']
      let tree: LayoutNode = newSplit('row', [newLeaf('a'), newLeaf('b')])
      let seed = 12345
      let nextKey = 0
      const random = () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff
        return seed / 0x7fffffff
      }

      for (let step = 0; step < 300; step++) {
        const keys = allKeys(tree)
        const pick = random()
        if (pick < 0.5 || keys.length < 2) {
          const anchor = keys[Math.floor(random() * keys.length)]!
          const edge = edges[Math.floor(random() * edges.length)]!
          const key = `t${nextKey++}`
          tree = splitLeaf(tree, anchor, edge, key)
        } else if (pick < 0.8) {
          const source = keys[Math.floor(random() * keys.length)]!
          let target = keys[Math.floor(random() * keys.length)]!
          if (target === source) {
            target = keys[(keys.indexOf(source) + 1) % keys.length]!
          }
          const edge = edges[Math.floor(random() * edges.length)]!
          tree = moveLeaf(tree, source, { key: target, edge })
        } else {
          const victim = keys[Math.floor(random() * keys.length)]
          tree = removeLeaf(tree, victim!)
        }
        assertWellFormed(tree)
      }
    })
  })
})
