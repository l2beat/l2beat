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
        edge('configure', 'guardian', { delay: 7 }),
        edge('upgrade', 'l1Proxy'),
      ]),
      node('contract2', [edge('upgrade', 'l1Proxy')]),
      node('l1Proxy', [edge('act', 'admins')]),
      node('l2Proxy', [edge('act', 'l1Proxy')]),
      node('l2Contract1', [edge('upgrade', 'l2Proxy')]),
      node('l2Contract2', [edge('upgrade', 'l2Proxy')]),
      node('guardian', [
        edge('act', 'foundationMsig'),
        edge('act', 'securityCounil'),
      ]),
      node(
        'admins',
        [edge('member', 'foundationMsig'), edge('member', 'securityCounil')],
        { threshold: 2 },
      ),
      node('foundationMsig'),
      node('securityCounil'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'configure',
        path: [
          { address: 'contract1', delay: 7 },
          { address: 'guardian', delay: 0 },
          { address: 'securityCounil', delay: 0 },
        ],
      },
      {
        permission: 'configure',
        path: [
          { address: 'contract1', delay: 7 },
          { address: 'guardian', delay: 0 },
          { address: 'foundationMsig', delay: 0 },
        ],
      },
      {
        permission: 'upgrade',
        path: [
          { address: 'contract1', delay: 0 },
          { address: 'l1Proxy', delay: 0 },
          { address: 'admins', delay: 0 },
        ],
      },
      {
        permission: 'upgrade',
        path: [
          { address: 'contract2', delay: 0 },
          { address: 'l1Proxy', delay: 0 },
          { address: 'admins', delay: 0 },
        ],
      },
      {
        permission: 'upgrade',
        path: [
          { address: 'l2Contract1', delay: 0 },
          { address: 'l2Proxy', delay: 0 },
          { address: 'l1Proxy', delay: 0 },
          { address: 'admins', delay: 0 },
        ],
      },
      {
        permission: 'upgrade',
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
      node('verifier', [edge('upgrade', 'upgradeGatekeeper')]),
      node('governance', [edge('upgrade', 'upgradeGatekeeper')]),
      node(
        'zkSync',
        [
          edge('upgrade', 'upgradeGatekeeper'),
          edge('configure', 'zkSync'),
          edge('member', 'actorA'),
          edge('member', 'actorB'),
        ],
        { threshold: 2 },
      ),
      node('upgradeGatekeeper', [edge('act', 'zkSyncMsig', { delay: 21 })]),
      node('zkSyncMsig'),
      node('actorA'),
      node('actorB'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'upgrade',
        path: [
          { address: 'verifier', delay: 0 },
          { address: 'upgradeGatekeeper', delay: 21 },
          { address: 'zkSyncMsig', delay: 0 },
        ],
      },
      {
        permission: 'upgrade',
        path: [
          { address: 'governance', delay: 0 },
          { address: 'upgradeGatekeeper', delay: 21 },
          { address: 'zkSyncMsig', delay: 0 },
        ],
      },
      {
        permission: 'upgrade',
        path: [
          { address: 'zkSync', delay: 0 },
          { address: 'upgradeGatekeeper', delay: 21 },
          { address: 'zkSyncMsig', delay: 0 },
        ],
      },
      {
        permission: 'configure',
        path: [
          { address: 'zkSync', delay: 0 }, // contract
          { address: 'zkSync', delay: 0 }, // embedded security council
        ],
      },
    ])
  })

  it('A->A (zksync lite simplified)', () => {
    const graph: Node<string>[] = [node('A', [edge('configure', 'A')])]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'configure',
        path: [
          { address: 'A', delay: 0 },
          { address: 'A', delay: 0 },
        ],
      },
    ])
  })

  it('A->A->B', () => {
    const graph: Node<string>[] = [
      node('A', [edge('configure', 'A'), edge('act', 'B')]),
      node('B'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'configure',
        path: [
          { address: 'A', delay: 0 },
          { address: 'A', delay: 0 },
          { address: 'B', delay: 0 },
        ],
      },
    ])
  })

  it('A->B->A', () => {
    const graph: Node<string>[] = [
      node('A', [edge('configure', 'B')]),
      node('B', [edge('act', 'A')]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'configure',
        path: [
          { address: 'A', delay: 0 },
          { address: 'B', delay: 0 },
          { address: 'A', delay: 0 },
        ],
      },
    ])
  })

  it('A->B->A->C->A (ignore loop - a upgrade b, b act a, a act c, c act a)', () => {
    const graph: Node<string>[] = [
      node('A', [edge('upgrade', 'B'), edge('act', 'C')]),
      node('B', [edge('act', 'A')]),
      node('C', [edge('act', 'A')]),
    ]
    expect(resolvePermissions(graph)).toEqualUnsorted([])
  })

  it('one actor, four contracts, two timelocks with same delays', () => {
    const graph: Node<string>[] = [
      node('actor'),
      node('timelockA', [edge('act', 'actor', { delay: 100 })]),
      node('timelockB', [edge('act', 'actor', { delay: 100 })]),
      node('proxy', [edge('act', 'timelockB')]),
      node('vault', [edge('configure', 'timelockA'), edge('upgrade', 'proxy')]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'upgrade',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'timelockB', delay: 100 },
          { address: 'actor', delay: 0 },
        ],
      },
      {
        permission: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'timelockA', delay: 100 },
          { address: 'actor', delay: 0 },
        ],
      },
    ])
  })

  it('one actor, four contracts, configure shorter delay than upgrade', () => {
    const graph: Node<string>[] = [
      node('actor'),
      node('timelockA', [edge('act', 'actor', { delay: 90 })]),
      node('timelockB', [edge('act', 'actor', { delay: 100 })]),
      node('proxy', [edge('act', 'timelockB')]),
      node('vault', [edge('configure', 'timelockA'), edge('upgrade', 'proxy')]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'upgrade',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'timelockB', delay: 100 },
          { address: 'actor', delay: 0 },
        ],
      },
      {
        permission: 'configure',
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
      node('timelockA', [edge('act', 'actor', { delay: 110 })]),
      node('timelockB', [edge('act', 'actor', { delay: 100 })]),
      node('proxy', [edge('act', 'timelockB')]),
      node('vault', [edge('configure', 'timelockA'), edge('upgrade', 'proxy')]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'upgrade',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'timelockB', delay: 100 },
          { address: 'actor', delay: 0 },
        ],
      },
      {
        permission: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'timelockA', delay: 110 },
          { address: 'actor', delay: 0 },
        ],
      },
    ])
  })

  it('two diverging and converging paths', () => {
    const graph: Node<string>[] = [
      node('vault', [edge('upgrade', 'proxy')]),
      node('proxy', [edge('act', 'timelockA'), edge('act', 'timelockB')]),
      node('timelockA', [edge('act', 'multisig', { delay: 50 })]),
      node('timelockB', [edge('act', 'multisig', { delay: 100 })]),
      node('multisig', [edge('member', 'actor')]),
      node('actor'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'upgrade',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'timelockA', delay: 50 },
          { address: 'multisig', delay: 0 },
          { address: 'actor', delay: 0 },
        ],
      },
      {
        permission: 'upgrade',
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
      node('timelockA', [edge('act', 'actor', { delay: 100 })]),
      node('timelockB', [edge('act', 'actor', { delay: 100 })]),
      node('proxy', [edge('act', 'timelockB')]),
      node('vault', [edge('upgrade', 'timelockA'), edge('upgrade', 'proxy')]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'upgrade',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'timelockB', delay: 100 },
          { address: 'actor', delay: 0 },
        ],
      },
      {
        permission: 'upgrade',
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
      node('timelockA', [edge('act', 'actor', { delay: 110 })]),
      node('timelockB', [edge('act', 'actor', { delay: 100 })]),
      node('proxy', [edge('act', 'timelockB')]),
      node('vault', [edge('upgrade', 'proxy'), edge('upgrade', 'timelockA')]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'upgrade',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'timelockB', delay: 100 },
          { address: 'actor', delay: 0 },
        ],
      },
      {
        permission: 'upgrade',
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
      node('timelockA', [edge('act', 'actor', { delay: 10 })]),
      node('timelockB', [edge('act', 'actor', { delay: 100 })]),
      node('proxy', [edge('act', 'timelockB')]),
      node('vault', [edge('configure', 'timelockA'), edge('upgrade', 'proxy')]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'timelockA', delay: 10 },
          { address: 'actor', delay: 0 },
        ],
      },
      {
        permission: 'upgrade',
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
      node('vault', [edge('configure', 'msigM')]),
      node('msigM', [edge('member', 'msigA'), edge('member', 'msigB')]),
      node(
        'msigB',
        [
          edge('member', 'actorA'),
          edge('member', 'actorB'),
          edge('member', 'actorC'),
        ],
        { threshold: 2 },
      ),
      node('msigA', [edge('member', 'actorA'), edge('member', 'actorB')]),
      node('actorA'),
      node('actorB'),
      node('actorC'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'msigM', delay: 0 },
          { address: 'msigB', delay: 0 },
        ],
      },
      {
        permission: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'msigM', delay: 0 },
          { address: 'msigA', delay: 0 },
          { address: 'actorA', delay: 0 },
        ],
      },
      {
        permission: 'configure',
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
      node('vault', [edge('configure', 'msig')]),
      node(
        'msig',
        [
          edge('member', 'actorA'),
          edge('member', 'actorB'),
          edge('member', 'actorC'),
        ],
        { threshold: 2, delay: 10 },
      ),
      node('actorA'),
      node('actorB'),
      node('actorC'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'configure',
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
      node(
        'msig',
        [
          edge('member', 'actorA'),
          edge('member', 'actorB'),
          edge('member', 'actorC'),
        ],
        { threshold: 2 },
      ),
      node('vault', [edge('configure', 'msig')]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'msig', delay: 0 },
        ],
      },
    ])
  })

  it('three actors, two contracts, one multisig with members, threshold one and delay', () => {
    const graph: Node<string>[] = [
      node('vault', [edge('configure', 'msig')]),
      node(
        'msig',
        [
          edge('member', 'actorA'),
          edge('member', 'actorB'),
          edge('member', 'actorC'),
        ],
        { threshold: 1, delay: 10 },
      ),
      node('actorA'),
      node('actorB'),
      node('actorC'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'msig', delay: 10 },
          { address: 'actorA', delay: 0 },
        ],
      },
      {
        permission: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'msig', delay: 10 },
          { address: 'actorB', delay: 0 },
        ],
      },
      {
        permission: 'configure',
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
      node('vault', [edge('configure', 'msig')]),
      node('msig', [
        edge('member', 'actorA'),
        edge('member', 'actorB'),
        edge('member', 'actorC'),
      ]),
      node('actorA'),
      node('actorB'),
      node('actorC'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'msig', delay: 0 },
          { address: 'actorA', delay: 0 },
        ],
      },
      {
        permission: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'msig', delay: 0 },
          { address: 'actorB', delay: 0 },
        ],
      },
      {
        permission: 'configure',
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
      node('vault', [edge('configure', 'proxy')]),
      node('proxy', [
        edge('act', 'actorA'),
        edge('act', 'actorB'),
        edge('act', 'actorC'),
      ]),
      node('actorA'),
      node('actorB'),
      node('actorC'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'actorA', delay: 0 },
        ],
      },
      {
        permission: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'actorB', delay: 0 },
        ],
      },
      {
        permission: 'configure',
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
      node('vault', [
        edge('configure', 'actorA'),
        edge('configure', 'actorB'),
        edge('configure', 'actorC'),
      ]),
      node('actorA'),
      node('actorB'),
      node('actorC'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'actorA', delay: 0 },
        ],
      },
      {
        permission: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'actorB', delay: 0 },
        ],
      },
      {
        permission: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'actorC', delay: 0 },
        ],
      },
    ])
  })

  it('one actor, three contracts, shared ownership through proxy', () => {
    const graph: Node<string>[] = [
      node('vaultA', [edge('upgrade', 'proxy')]),
      node('vaultB', [edge('upgrade', 'proxy')]),
      node('proxy', [edge('act', 'actor')]),
      node('actor'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'upgrade',
        path: [
          { address: 'vaultA', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'actor', delay: 0 },
        ],
      },
      {
        permission: 'upgrade',
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
      node('vaultB', [edge('upgrade', 'proxyB')]),
      node('proxyB', [edge('act', 'actor')]),
      node('vaultA', [edge('upgrade', 'proxyA')]),
      node('proxyA', [edge('act', 'actor')]),
      node('actor'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'upgrade',
        path: [
          { address: 'vaultA', delay: 0 },
          { address: 'proxyA', delay: 0 },
          { address: 'actor', delay: 0 },
        ],
      },
      {
        permission: 'upgrade',
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
      node('vault', [edge('upgrade', 'proxy')]),
      node('proxy', [edge('act', 'timelockB')]),
      node('timelockB', [edge('act', 'timelockA', { delay: 69 })]),
      node('timelockA', [edge('act', 'actor', { delay: 420 })]),
      node('actor'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'upgrade',
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
      node('vault', [
        edge('upgrade', 'ownerActor', { delay: 69 }),
        edge('upgrade', 'adminActor', { delay: 420 }),
      ]),
      node('ownerActor'),
      node('adminActor'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'upgrade',
        path: [
          { address: 'vault', delay: 69 },
          { address: 'ownerActor', delay: 0 },
        ],
      },
      {
        permission: 'upgrade',
        path: [
          { address: 'vault', delay: 420 },
          { address: 'adminActor', delay: 0 },
        ],
      },
    ])
  })

  it('single actor, three contracts, proxy with act and timelock with delay', () => {
    const graph: Node<string>[] = [
      node('vault', [
        edge('configure', 'timelock'),
        edge('configure', 'actorB'),
      ]),
      node('timelock', [edge('act', 'actorA', { delay: 42069 })]),
      node('actorA'),
      node('actorB'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'timelock', delay: 42069 },
          { address: 'actorA', delay: 0 },
        ],
      },
      {
        permission: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'actorB', delay: 0 },
        ],
      },
    ])
  })

  it('single actor, three contracts, proxy with act and timelock with delay', () => {
    const graph: Node<string>[] = [
      node('vault', [edge('upgrade', 'proxy')]),
      node('proxy', [edge('act', 'timelock')]),
      node('timelock', [edge('act', 'actor', { delay: 42069 })]),
      node('actor'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'upgrade',
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
      node('vault', [edge('upgrade', 'proxy'), edge('configure', 'actorA')]),
      node('proxy', [edge('act', 'actorB')]),
      node('actorA'),
      node('actorB'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'upgrade',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'proxy', delay: 0 },
          { address: 'actorB', delay: 0 },
        ],
      },
      {
        permission: 'configure',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'actorA', delay: 0 },
        ],
      },
    ])
  })

  it('single actor, two contracts, proxy and act', () => {
    const graph: Node<string>[] = [
      node('vault', [edge('upgrade', 'proxy')]),
      node('proxy', [edge('act', 'actor')]),
      node('actor'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'upgrade',
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
      node('vault', [edge('upgrade', 'actor')]),
      node('actor'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'upgrade',
        path: [
          { address: 'vault', delay: 0 },
          { address: 'actor', delay: 0 },
        ],
      },
    ])
  })

  it('single actor, single contract, no proxy', () => {
    const graph: Node<string>[] = [
      node('vault', [edge('configure', 'actor')]),
      node('actor'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        permission: 'configure',
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
  edges?: Edge<string>[],
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

function edge(
  permission: Permission,
  toNode: string,
  options?: Partial<Edge<string>>,
): Edge<string> {
  return { permission, toNode, delay: 0, ...options }
}
