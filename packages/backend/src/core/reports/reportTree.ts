import { assert } from '@l2beat/shared-pure'

export class ReportTree<Root = unknown, Branch = unknown, Leaf = unknown> {
  private readonly roots: Root[]

  static from<Root, Branch, Leaf>(
    roots: Root[],
    branches: Branch[],
    leafValue: () => Leaf,
  ) {
    const tree = new Map<Root, Map<Branch, Leaf>>()

    for (const root of roots) {
      const leafPairs = branches.map((branch) => [branch, leafValue()] as const)
      const leafs = new Map(leafPairs)

      tree.set(root, leafs)
    }

    return new ReportTree(tree)
  }

  constructor(private readonly tree: Map<Root, Map<Branch, Leaf>>) {
    this.roots = [...tree.keys()]
  }

  getRawTree() {
    return this.tree
  }

  getRoots() {
    return [...this.roots]
  }

  get(root: Root, branch: Branch) {
    const leaf = this.tree.get(root)?.get(branch)

    assert(leaf, 'unreachable leaf')

    return leaf
  }

  set(root: Root, branch: Branch, cb: (previousLeaf: Leaf) => Leaf) {
    const oldValue = this.get(root, branch)
    const newValue = cb(oldValue)

    this.tree.get(root)?.set(branch, newValue)
  }

  mergeWith(otherTree: ReportTree<Root, Branch, Leaf>) {
    const newTree = new Map([...this.tree, ...otherTree.tree])

    return new ReportTree(newTree)
  }

  replaceRoots<NewRoot>(newRoots: NewRoot[]) {
    assert(newRoots.length === this.roots.length, 'amount of roots mismatch')

    const entries = [...this.tree.entries()]

    const newTree = new Map(
      entries.map(([_, valueMap], i) => {
        return [newRoots[i], valueMap] as const
      }),
    )

    return new ReportTree(newTree)
  }

  *[Symbol.iterator]() {
    for (const root of this.roots) {
      const branches = this.tree.get(root)

      assert(branches, 'unreachable branches')

      yield [root, branches] as const
    }
  }
}
