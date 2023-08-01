import { assert } from '@l2beat/shared-pure'

/**
 * Simple wrapper around two-level nested `Map` for report aggregation purposes.
 * Useful when aggregating many sub-variants of a value.
 * For example, when aggregating reports, we have a root value (project) and a branch value (value type from report).
 * The leaf value may be the aggregated value of i.e all EBV reports
 *
 * @example
 *    const tree = ReportTree.from(
 *      [ARBITRUM, OPTIMISM],
 *      [ValueType.CBV, ValueType.EBV, ValueType.NMV, ValueType.TVL],
 *      () => ({ valueUsd: 0n, valueEth: 0n }),
 *    )
 *
 *    tree.set(ARBITRUM, ValueType.CBV, () => ({ valueUsd: 1n, valueEth: 2n }))
 *    tree.set(ARBITRUM, ValueType.NMV, () => ({ valueUsd: 10n, valueEth: 20n }))
 *    tree.set(ARBITRUM, ValueType.TVL, () => ({ valueUsd: 11n, valueEth: 22n }))
 *
 *    console.dir({ tree }, { depth: null })
 *
 *
 *    // Output:
 *    tree: Map(2) {
 *      'arbitrum' => Map(4) {
 *        'CBV' => { valueUsd: 1n, valueEth: 2n },
 *        'EBV' => { valueUsd: 0n, valueEth: 0n },
 *        'NMV' => { valueUsd: 10n, valueEth: 20n },
 *        'TVL' => { valueUsd: 11n, valueEth: 22n }
 *      },
 *      'optimism' => Map(4) {
 *        'CBV' => { valueUsd: 0n, valueEth: 0n },
 *        'EBV' => { valueUsd: 0n, valueEth: 0n },
 *        'NMV' => { valueUsd: 0n, valueEth: 0n },
 *        'TVL' => { valueUsd: 0n, valueEth: 0n }
 *      }
 *    },
 */
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

    assert(leaf !== undefined, 'unreachable leaf')

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

  flat() {
    const flatResult: {
      root: Root
      branch: Branch
      leaf: Leaf
    }[] = []

    for (const [root, branches] of this) {
      for (const [branch, leaf] of branches) {
        flatResult.push({ root: root, branch: branch, leaf: leaf })
      }
    }

    return flatResult
  }
}
