import { expect } from 'earl'

import { ReportTree } from './reportTree'

describe(ReportTree.name, () => {
  it('creates a tree from roots and branches', () => {
    const tree = ReportTree.from(
      ['root1', 'root2'],
      ['branch1', 'branch2'],
      () => 'leaf',
    )

    expect(tree.getRoots()).toEqual(['root1', 'root2'])

    expect(tree.get('root1', 'branch1')).toEqual('leaf')
    expect(tree.get('root1', 'branch2')).toEqual('leaf')
    expect(tree.get('root2', 'branch1')).toEqual('leaf')
    expect(tree.get('root2', 'branch2')).toEqual('leaf')
  })

  it('fills initial values using provided callback and does not share references', () => {
    let incisingNumber = 0
    const tree = ReportTree.from(
      ['root1', 'root2'],
      ['branch1', 'branch2'],
      () => ({
        leafValue: incisingNumber++,
      }),
    )

    // If references were shared, this would be '3' in all cases
    expect(tree.get('root1', 'branch1')).toEqual({ leafValue: 0 })
    expect(tree.get('root1', 'branch2')).toEqual({ leafValue: 1 })
    expect(tree.get('root2', 'branch1')).toEqual({ leafValue: 2 })
    expect(tree.get('root2', 'branch2')).toEqual({ leafValue: 3 })
  })

  describe('throws if leaf is unreachable', () => {
    it('throws when setting a value', () => {
      const tree = ReportTree.from(
        ['root1', 'root2'],
        ['branch1', 'branch2'],
        () => 'leaf',
      )

      expect(() =>
        tree.set('unreachable_root', 'unreachable_branch', () => 'throw'),
      ).toThrow()
    })

    it('throws when getting a value', () => {
      const tree = ReportTree.from(
        ['root1', 'root2'],
        ['branch1', 'branch2'],
        () => 'leaf',
      )

      expect(() => tree.get('unreachable_root', 'unreachable_branch')).toThrow()
    })
  })
  it('merges with another tree', () => {
    const tree1 = ReportTree.from(
      ['root1', 'root2'],
      ['branch1', 'branch2'],
      () => 'leaf1',
    )

    const tree2 = ReportTree.from(
      ['root2', 'root3'],
      ['branch3', 'branch4'],
      () => 'leaf2',
    )

    const mergedTree = tree1.mergeWith(tree2)

    expect(mergedTree.getRoots()).toEqual(['root1', 'root2', 'root3'])

    // It does not replace nor reevaluates the values - simply merges those two, replacing the overlapped roots from the first tree with the roots from second one
    expect(mergedTree.get('root1', 'branch1')).toEqual('leaf1')
    expect(mergedTree.get('root1', 'branch2')).toEqual('leaf1')
    expect(mergedTree.get('root2', 'branch3')).toEqual('leaf2')
    expect(mergedTree.get('root2', 'branch4')).toEqual('leaf2')
    expect(mergedTree.get('root3', 'branch3')).toEqual('leaf2')
    expect(mergedTree.get('root3', 'branch4')).toEqual('leaf2')

    // Overlaps
    expect(() => mergedTree.get('root2', 'branch1')).toThrow()
    expect(() => mergedTree.get('root2', 'branch2')).toThrow()
  })

  describe('replaces the roots of the tree and ', () => {
    it('keeps the branches and leafs if roots are equal length', () => {
      const tree = ReportTree.from(
        ['root1', 'root2'],
        ['branch1', 'branch2'],
        () => 'leaf',
      )

      const newRoots = ['root3', 'root4']

      const newTree = tree.replaceRoots(newRoots)

      expect(newTree.getRoots()).toEqual(newRoots)

      expect(newTree.get('root3', 'branch1')).toEqual('leaf')
      expect(newTree.get('root3', 'branch2')).toEqual('leaf')
      expect(newTree.get('root4', 'branch1')).toEqual('leaf')
      expect(newTree.get('root4', 'branch2')).toEqual('leaf')
    })
    it('throws if roots are not equal length', () => {
      const tree = ReportTree.from(
        ['root1', 'root2'],
        ['branch1', 'branch2'],
        () => 'leaf',
      )

      const newRoots = ['root3']

      expect(() => tree.replaceRoots(newRoots)).toThrow()
    })
  })
})
