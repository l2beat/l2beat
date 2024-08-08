import { expect } from 'earl'
import {
  Edge,
  Node,
  Permission,
  resolvePermissions,
} from './resolvePermissions'

describe(resolvePermissions.name, () => {
  it('op mainnet', () => {
    const graph: Node<string>[] = [
      node('contract1', [
        edge('configure', 6, { delay: 7 }),
        edge('upgrade', 2),
      ]),
      node('contract2', [edge('upgrade', 2)]),
      node('l1Proxy', [edge('act', 7)]),
      node('l2Proxy', [edge('act', 2)]),
      node('l2Contract1', [edge('upgrade', 3)]),
      node('l2Contract2', [edge('upgrade', 3)]),
      node('guardian', [edge('act', 8), edge('act', 9)]),
      node('admins', [edge('member', 8), edge('member', 9)], { threshold: 2 }),
      node('foundationMsig'),
      node('securityCounil'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: 'contract1', delay: 7 },
          { address: 'guardian', delay: 0 },
          { address: 'securityCounil', delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: 'contract1', delay: 7 },
          { address: 'guardian', delay: 0 },
          { address: 'foundationMsig', delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: 'contract1', delay: 0 },
          { address: 'l1Proxy', delay: 0 },
          { address: 'admins', delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: 'contract2', delay: 0 },
          { address: 'l1Proxy', delay: 0 },
          { address: 'admins', delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: 'l2Contract1', delay: 0 },
          { address: 'l2Proxy', delay: 0 },
          { address: 'l1Proxy', delay: 0 },
          { address: 'admins', delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: 'l2Contract2', delay: 0 },
          { address: 'l2Proxy', delay: 0 },
          { address: 'l1Proxy', delay: 0 },
          { address: 'admins', delay: 0 },
        ],
      },
    ])
  })

  it('zksync lite', () => {
    const graph: Node<string>[] = [
      node('verifier', [edge('upgrade', 3)]),
      node('governance', [edge('upgrade', 3)]),
      node(
        'zkSync',
        [
          edge('upgrade', 3),
          edge('configure', 2),
          edge('member', 5),
          edge('member', 6),
        ],
        { threshold: 2 },
      ),
      node('upgradeGatekeeper', [edge('act', 4, { delay: 21 })]),
      node('zkSyncMsig'),
      node('actorA'),
      node('actorB'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: 'verifier', delay: 0 },
          { address: 'upgradeGatekeeper', delay: 21 },
          { address: 'zkSyncMsig', delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: 'governance', delay: 0 },
          { address: 'upgradeGatekeeper', delay: 21 },
          { address: 'zkSyncMsig', delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: 'zkSync', delay: 0 },
          { address: 'upgradeGatekeeper', delay: 21 },
          { address: 'zkSyncMsig', delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: 'zkSync', delay: 0 }, // contract
          { address: 'zkSync', delay: 0 }, // embedded security council
        ],
      },
    ])
  })

  it('one actor, four contracts, two timelocks with same delays', () => {
    const graph: Node<string>[] = [
      node('actor'),
      node('timelockA', [edge('act', 0, { delay: 100 })]),
      node('timelockB', [edge('act', 0, { delay: 100 })]),
      node('proxy', [edge('act', 2)]),
      node('vault', [edge('configure', 1), edge('upgrade', 3)]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'timelockB', delay: 100 },
          { address: 'actor', delay: 0 },
        ],
      },
    ])
  })

  it('one actor, four contracts, configure shorter delay than upgrade', () => {
    const graph: Node<string>[] = [
      node('actor'),
      node('timelockA', [edge('act', 0, { delay: 90 })]),
      node('timelockB', [edge('act', 0, { delay: 100 })]),
      node('proxy', [edge('act', 2)]),
      node('vault', [edge('configure', 1), edge('upgrade', 3)]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'timelockB', delay: 100 },
          { address: 'actor', delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'timelockA', delay: 90 },
          { address: 'actor', delay: 0 },
        ],
      },
    ])
  })

  it('one actor, four contracts, configure longer delay than upgrade', () => {
    const graph: Node<string>[] = [
      node('actor'),
      node('timelockA', [edge('act', 0, { delay: 110 })]),
      node('timelockB', [edge('act', 0, { delay: 100 })]),
      node('proxy', [edge('act', 2)]),
      node('vault', [edge('configure', 1), edge('upgrade', 3)]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'timelockB', delay: 100 },
          { address: 'actor', delay: 0 },
        ],
      },
    ])
  })

  it('two diverging and converging paths', () => {
    const graph: Node<string>[] = [
      node('vault', [edge('upgrade', 1)]),
      node('proxy', [edge('act', 2), edge('act', 3)]),
      node('timelockA', [edge('act', 4, { delay: 50 })]),
      node('timelockB', [edge('act', 4, { delay: 100 })]),
      node('multisig', [edge('member', 5)]),
      node('actor'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'timelockA', delay: 50 },
          { address: 'multisig', delay: 0 },
          { address: 'actor', delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'timelockB', delay: 100 },
          { address: 'multisig', delay: 0 },
          { address: 'actor', delay: 0 },
        ],
      },
    ])
  })

  it('one actor, four contracts, two upgrades with same delay on different path', () => {
    const graph: Node<string>[] = [
      node('actor'),
      node('timelockA', [edge('act', 0, { delay: 100 })]),
      node('timelockB', [edge('act', 0, { delay: 100 })]),
      node('proxy', [edge('act', 2)]),
      node('vault', [edge('upgrade', 1), edge('upgrade', 3)]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'timelockB', delay: 100 },
          { address: 'actor', delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'timelockA', delay: 100 },
          { address: 'actor', delay: 0 },
        ],
      },
    ])
  })

  it('one actor, four contracts, two upgrades with different delay on different path', () => {
    const graph: Node<string>[] = [
      node('actor'),
      node('timelockA', [edge('act', 0, { delay: 110 })]),
      node('timelockB', [edge('act', 0, { delay: 100 })]),
      node('proxy', [edge('act', 2)]),
      node('vault', [edge('upgrade', 3), edge('upgrade', 1)]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'timelockB', delay: 100 },
          { address: 'actor', delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'timelockA', delay: 110 },
          { address: 'actor', delay: 0 },
        ],
      },
    ])
  })

  it('one actor, four contracts, two timelocks with different delays', () => {
    const graph: Node<string>[] = [
      node('actor'),
      node('timelockA', [edge('act', 0, { delay: 10 })]),
      node('timelockB', [edge('act', 0, { delay: 100 })]),
      node('proxy', [edge('act', 2)]),
      node('vault', [edge('configure', 1), edge('upgrade', 3)]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'timelockA', delay: 10 },
          { address: 'actor', delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'timelockB', delay: 100 },
          { address: 'actor', delay: 0 },
        ],
      },
    ])
  })

  it('three actors, four contracts, three multisigs with members, mixed threshold', () => {
    const graph: Node<string>[] = [
      node('actorA'),
      node('actorB'),
      node('actorC'),
      node('msigM', [edge('member', 4), edge('member', 5)]),
      node('msigA', [edge('member', 0), edge('member', 1)]),
      node('msigB', [edge('member', 0), edge('member', 1), edge('member', 2)], {
        threshold: 2,
      }),
      node('vault', [edge('configure', 3)]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'msigM', delay: 0 },
          { address: 'msigB', delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'msigM', delay: 0 },
          { address: 'msigA', delay: 0 },
          { address: 'actorA', delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'msigM', delay: 0 },
          { address: 'msigA', delay: 0 },
          { address: 'actorB', delay: 0 },
        ],
      },
    ])
  })

  it('three actors, two contracts, one multisig with members, threshold greater than one with delay', () => {
    const graph: Node<string>[] = [
      node('actorA'),
      node('actorB'),
      node('actorC'),
      node('msig', [edge('member', 0), edge('member', 1), edge('member', 2)], {
        threshold: 2,
        delay: 10,
      }),
      node('vault', [edge('configure', 3)]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'msig', delay: 10 },
        ],
      },
    ])
  })

  it('three actors, two contracts, one multisig with members, threshold greater than one', () => {
    const graph: Node<string>[] = [
      node('actorA'),
      node('actorB'),
      node('actorC'),
      node('msig', [edge('member', 0), edge('member', 1), edge('member', 2)], {
        threshold: 2,
      }),
      node('vault', [edge('configure', 3)]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'msig', delay: 0 },
        ],
      },
    ])
  })

  it('three actors, two contracts, one multisig with members, threshold one and delay', () => {
    const graph: Node<string>[] = [
      node('actorA'),
      node('actorB'),
      node('actorC'),
      node('msig', [edge('member', 0), edge('member', 1), edge('member', 2)], {
        threshold: 1,
        delay: 10,
      }),
      node('vault', [edge('configure', 3)]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'msig', delay: 10 },
          { address: 'actorA', delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'msig', delay: 10 },
          { address: 'actorB', delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'msig', delay: 10 },
          { address: 'actorC', delay: 0 },
        ],
      },
    ])
  })

  it('three actors, two contracts, one multisig with members, threshold one', () => {
    const graph: Node<string>[] = [
      node('actorA'),
      node('actorB'),
      node('actorC'),
      node('msig', [edge('member', 0), edge('member', 1), edge('member', 2)]),
      node('vault', [edge('configure', 3)]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'msig', delay: 0 },
          { address: 'actorA', delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'msig', delay: 0 },
          { address: 'actorB', delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'msig', delay: 0 },
          { address: 'actorC', delay: 0 },
        ],
      },
    ])
  })

  it('three actors, one contract, shared ownership of a single contract with proxy', () => {
    const graph: Node<string>[] = [
      node('actorA'),
      node('actorB'),
      node('actorC'),
      node('proxy', [edge('act', 0), edge('act', 1), edge('act', 2)]),
      node('vault', [edge('configure', 3)]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'actorA', delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'actorB', delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'actorC', delay: 0 },
        ],
      },
    ])
  })

  it('three actors, one contract, shared ownership of a single contract', () => {
    const graph: Node<string>[] = [
      node('actorA'),
      node('actorB'),
      node('actorC'),
      node('vault', [
        edge('configure', 0),
        edge('configure', 1),
        edge('configure', 2),
      ]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'actorA', delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'actorB', delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'actorC', delay: 0 },
        ],
      },
    ])
  })

  it('one actor, three contracts, shared ownership through proxy', () => {
    const graph: Node<string>[] = [
      node('actor'),
      node('proxy', [edge('act', 0)]),
      node('vaultA', [edge('upgrade', 1)]),
      node('vaultB', [edge('upgrade', 1)]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: 'vaultA', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'actor', delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: 'vaultB', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'actor', delay: 0 },
        ],
      },
    ])
  })

  it('one actor, four contracts, shared ownership', () => {
    const graph: Node<string>[] = [
      node('actor'),
      node('proxyA', [edge('act', 0)]),
      node('vaultA', [edge('upgrade', 1)]),
      node('proxyB', [edge('act', 0)]),
      node('vaultB', [edge('upgrade', 3)]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: 'vaultA', delay: 0 },
          { address: 'proxyA', delay: 0 },
          { address: 'actor', delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: 'vaultB', delay: 0 },
          { address: 'proxyB', delay: 0 },
          { address: 'actor', delay: 0 },
        ],
      },
    ])
  })

  it('one actor, four contracts, stacking delays', () => {
    const graph: Node<string>[] = [
      node('actor'),
      node('timelockA', [edge('act', 0, { delay: 420 })]),
      node('timelockB', [edge('act', 1, { delay: 69 })]),
      node('proxy', [edge('act', 2)]),
      node('vault', [edge('upgrade', 3)]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'timelockB', delay: 69 },
          { address: 'timelockA', delay: 420 },
          { address: 'actor', delay: 0 },
        ],
      },
    ])
  })

  it('two actors, one contract, two different delays', () => {
    const graph: Node<string>[] = [
      node('ownerActor'),
      node('adminActor'),
      node('vault', [
        edge('upgrade', 0, { delay: 69 }),
        edge('upgrade', 1, { delay: 420 }),
      ]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: 'vault', delay: 69 },
          { address: 'ownerActor', delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: 'vault', delay: 420 },
          { address: 'adminActor', delay: 0 },
        ],
      },
    ])
  })

  it('single actor, three contracts, proxy with act and timelock with delay', () => {
    const graph: Node<string>[] = [
      node('actorA'),
      node('actorB'),
      node('timelock', [edge('act', 0, { delay: 42069 })]),
      node('vault', [edge('configure', 1), edge('configure', 2)]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'timelock', delay: 42069 },
          { address: 'actorA', delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'actorB', delay: 0 },
        ],
      },
    ])
  })

  it('single actor, three contracts, proxy with act and timelock with delay', () => {
    const graph: Node<string>[] = [
      node('actor'),
      node('timelock', [edge('act', 0, { delay: 42069 })]),
      node('proxy', [edge('act', 1)]),
      node('vault', [edge('upgrade', 2)]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'timelock', delay: 42069 },
          { address: 'actor', delay: 0 },
        ],
      },
    ])
  })

  it('two actors, two contracts, proxy with act and single configure', () => {
    const graph: Node<string>[] = [
      node('actorA'),
      node('actorB'),
      node('proxy', [edge('act', 1)]),
      node('vault', [edge('upgrade', 2), edge('configure', 0)]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'actorB', delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'actorA', delay: 0 },
        ],
      },
    ])
  })

  it('single actor, two contracts, proxy and act', () => {
    const graph: Node<string>[] = [
      node('actor'),
      node('proxy', [edge('act', 0)]),
      node('vault', [edge('upgrade', 1)]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'actor', delay: 0 },
        ],
      },
    ])
  })

  it('single actor, single contract, proxy', () => {
    const graph: Node<string>[] = [
      node('actor'),
      node('vault', [edge('upgrade', 0)]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'actor', delay: 0 },
        ],
      },
    ])
  })

  it('single actor, single contract, no proxy', () => {
    const graph: Node<string>[] = [
      node('actor'),
      node('vault', [edge('configure', 0)]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'actor', delay: 0 },
        ],
      },
    ])
  })

  it('empty graph returns an empty result', () => {
    const graph: Node<string>[] = []
    expect(resolvePermissions(graph)).toEqualUnsorted([])
  })
})

function node(
  address: string,
  edges?: Edge[],
  options?: Partial<Node<string>>,
): Node<string> {
  return {
    address,
    delay: 0,
    threshold: 1,
    edges: edges ?? [],
    ...options,
  }
}

function edge(type: Permission, toNode: number, options?: Partial<Edge>): Edge {
  return { type, toNode, delay: 0, ...options }
}
