import { expect } from 'earl'
import type { Permission } from '../config/RawDiscoveryConfig'
import {
  type Edge,
  type Node,
  type PathElement,
  resolvePermissions,
} from './resolvePermissions'

describe(resolvePermissions.name, () => {
  it('op mainnet', () => {
    const graph: Node<string>[] = [
      node('contract1', [
        edge('interact', 'guardian', { delay: 7 }),
        edge('upgrade', 'l1Proxy'),
      ]),
      node('contract2', [edge('upgrade', 'l1Proxy')]),
      node('l1Proxy', [edge('act', 'admins')]),
      node('l2Proxy', [edge('act', 'l1Proxy')]),
      node('l2Contract1', [edge('upgrade', 'l2Proxy')]),
      node('l2Contract2', [edge('upgrade', 'l2Proxy')]),
      node('guardian', [
        edge('act', 'foundationMsig'),
        edge('act', 'securityCouncil'),
      ]),
      node(
        'admins',
        [edge('member', 'foundationMsig'), edge('member', 'securityCouncil')],
        { threshold: 2 },
      ),
      node('foundationMsig'),
      node('securityCouncil'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        path: [
          pathElem({
            address: 'contract1',
            gives: 'interact',
            delay: 7,
          }),
          pathElem({ address: 'guardian', gives: 'act' }),
          pathElem({ address: 'securityCouncil' }),
        ],
      },
      {
        path: [
          pathElem({
            address: 'contract1',
            gives: 'interact',
            delay: 7,
          }),
          pathElem({ address: 'guardian', gives: 'act' }),
          pathElem({ address: 'foundationMsig' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'contract1', gives: 'upgrade' }),
          pathElem({ address: 'l1Proxy', gives: 'act' }),
          pathElem({ address: 'admins' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'contract2', gives: 'upgrade' }),
          pathElem({ address: 'l1Proxy', gives: 'act' }),
          pathElem({ address: 'admins' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'l2Contract1', gives: 'upgrade' }),
          pathElem({ address: 'l2Proxy', gives: 'act' }),
          pathElem({ address: 'l1Proxy', gives: 'act' }),
          pathElem({ address: 'admins' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'l2Contract2', gives: 'upgrade' }),
          pathElem({ address: 'l2Proxy', gives: 'act' }),
          pathElem({ address: 'l1Proxy', gives: 'act' }),
          pathElem({ address: 'admins' }),
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
          edge('interact', 'zkSync'),
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
        path: [
          pathElem({ address: 'verifier', gives: 'upgrade' }),
          pathElem({ address: 'upgradeGatekeeper', gives: 'act', delay: 21 }),
          pathElem({ address: 'zkSyncMsig' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'governance', gives: 'upgrade' }),
          pathElem({ address: 'upgradeGatekeeper', gives: 'act', delay: 21 }),
          pathElem({ address: 'zkSyncMsig' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'zkSync', gives: 'upgrade' }),
          pathElem({ address: 'upgradeGatekeeper', gives: 'act', delay: 21 }),
          pathElem({ address: 'zkSyncMsig' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'zkSync', gives: 'interact' }), // contract
          pathElem({ address: 'zkSync' }), // embedded security council
        ],
      },
    ])
  })

  it('A->A (zksync lite simplified)', () => {
    const graph: Node<string>[] = [node('A', [edge('interact', 'A')])]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        path: [
          pathElem({ address: 'A', gives: 'interact' }),
          pathElem({ address: 'A' }),
        ],
      },
    ])
  })

  it('A->A->B', () => {
    const graph: Node<string>[] = [
      node('A', [edge('interact', 'A'), edge('act', 'B')]),
      node('B'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        path: [
          pathElem({ address: 'A', gives: 'interact' }),
          pathElem({ address: 'A', gives: 'act' }),
          pathElem({ address: 'B' }),
        ],
      },
    ])
  })

  it('A->B->A', () => {
    const graph: Node<string>[] = [
      node('A', [edge('interact', 'B')]),
      node('B', [edge('act', 'A')]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        path: [
          pathElem({ address: 'A', gives: 'interact' }),
          pathElem({ address: 'B', gives: 'act' }),
          pathElem({ address: 'A' }),
        ],
      },
    ])
  })

  it('A->B->A->C->A (ignore deadlock/loop - a upgrade b, b act a, a act c, c act a)', () => {
    const graph: Node<string>[] = [
      node('A', [edge('upgrade', 'B'), edge('act', 'C')]),
      node('B', [edge('act', 'A')]),
      node('C', [edge('act', 'A')]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([])
  })

  it('A->B->A->C->(A,D) (ignore deadlock/loop - preserve actual path)', () => {
    const graph: Node<string>[] = [
      node('A', [edge('upgrade', 'B'), edge('act', 'C')]),
      node('B', [edge('act', 'A')]),
      node('C', [edge('act', 'A'), edge('act', 'D')]),
      node('D'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        path: [
          pathElem({ address: 'A', gives: 'upgrade' }),
          pathElem({ address: 'B', gives: 'act' }),
          pathElem({ address: 'A', gives: 'act' }),
          pathElem({ address: 'C', gives: 'act' }),
          pathElem({ address: 'D' }),
        ],
      },
    ])
  })

  it('one actor, one contract, multiple configures', () => {
    const graph: Node<string>[] = [
      node('actor'),
      node('timelock', [
        edge('interact', 'actor', { description: 'can zig', delay: 100 }),
        edge('interact', 'actor', { description: 'can zag', delay: 200 }),
      ]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        path: [
          pathElem({
            address: 'timelock',
            gives: 'interact',
            description: 'can zig',
            delay: 100,
          }),
          pathElem({ address: 'actor' }),
        ],
      },
      {
        path: [
          pathElem({
            address: 'timelock',
            gives: 'interact',
            description: 'can zag',
            delay: 200,
          }),
          pathElem({ address: 'actor' }),
        ],
      },
    ])
  })

  it('one actor, four contracts, two timelocks with same delays', () => {
    const graph: Node<string>[] = [
      node('actor'),
      node('timelockA', [edge('act', 'actor', { delay: 100 })]),
      node('timelockB', [edge('act', 'actor', { delay: 100 })]),
      node('proxy', [edge('act', 'timelockB')]),
      node('vault', [edge('interact', 'timelockA'), edge('upgrade', 'proxy')]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        path: [
          pathElem({ address: 'vault', gives: 'upgrade' }),
          pathElem({ address: 'proxy', gives: 'act' }),
          pathElem({ address: 'timelockB', gives: 'act', delay: 100 }),
          pathElem({ address: 'actor' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'timelockA', gives: 'act', delay: 100 }),
          pathElem({ address: 'actor' }),
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
      node('vault', [edge('interact', 'timelockA'), edge('upgrade', 'proxy')]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        path: [
          pathElem({ address: 'vault', gives: 'upgrade' }),
          pathElem({ address: 'proxy', gives: 'act' }),
          pathElem({ address: 'timelockB', gives: 'act', delay: 100 }),
          pathElem({ address: 'actor' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'timelockA', gives: 'act', delay: 90 }),
          pathElem({ address: 'actor' }),
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
      node('vault', [edge('interact', 'timelockA'), edge('upgrade', 'proxy')]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        path: [
          pathElem({ address: 'vault', gives: 'upgrade' }),
          pathElem({ address: 'proxy', gives: 'act' }),
          pathElem({ address: 'timelockB', gives: 'act', delay: 100 }),
          pathElem({ address: 'actor' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'timelockA', gives: 'act', delay: 110 }),
          pathElem({ address: 'actor' }),
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
        path: [
          pathElem({ address: 'vault', gives: 'upgrade' }),
          pathElem({ address: 'proxy', gives: 'act' }),
          pathElem({ address: 'timelockA', gives: 'act', delay: 50 }),
          pathElem({ address: 'multisig', gives: 'member' }),
          pathElem({ address: 'actor' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vault', gives: 'upgrade' }),
          pathElem({ address: 'proxy', gives: 'act' }),
          pathElem({ address: 'timelockB', gives: 'act', delay: 100 }),
          pathElem({ address: 'multisig', gives: 'member' }),
          pathElem({ address: 'actor' }),
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
        path: [
          pathElem({ address: 'vault', gives: 'upgrade' }),
          pathElem({ address: 'proxy', gives: 'act' }),
          pathElem({ address: 'timelockB', gives: 'act', delay: 100 }),
          pathElem({ address: 'actor' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vault', gives: 'upgrade' }),
          pathElem({ address: 'timelockA', gives: 'act', delay: 100 }),
          pathElem({ address: 'actor' }),
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
        path: [
          pathElem({ address: 'vault', gives: 'upgrade' }),
          pathElem({ address: 'proxy', gives: 'act' }),
          pathElem({ address: 'timelockB', gives: 'act', delay: 100 }),
          pathElem({ address: 'actor' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vault', gives: 'upgrade' }),
          pathElem({ address: 'timelockA', gives: 'act', delay: 110 }),
          pathElem({ address: 'actor' }),
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
      node('vault', [edge('interact', 'timelockA'), edge('upgrade', 'proxy')]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'timelockA', gives: 'act', delay: 10 }),
          pathElem({ address: 'actor' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vault', gives: 'upgrade' }),
          pathElem({ address: 'proxy', gives: 'act' }),
          pathElem({ address: 'timelockB', gives: 'act', delay: 100 }),
          pathElem({ address: 'actor' }),
        ],
      },
    ])
  })

  it('three actors, four contracts, three multisigs with members, mixed threshold', () => {
    const graph: Node<string>[] = [
      node('vault', [edge('interact', 'msigM')]),
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
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'msigM', gives: 'member' }),
          pathElem({ address: 'msigB' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'msigM', gives: 'member' }),
          pathElem({ address: 'msigA', gives: 'member' }),
          pathElem({ address: 'actorA' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'msigM', gives: 'member' }),
          pathElem({ address: 'msigA', gives: 'member' }),
          pathElem({ address: 'actorB' }),
        ],
      },
    ])
  })

  it("two actors, three contracts, one final node can't act independently", () => {
    const graph: Node<string>[] = [
      node('vault', [edge('upgrade', 'timelock')]),
      node('timelock', [edge('act', 'proxy')]),
      node('proxy', [edge('act', 'actorA'), edge('act', 'noOpStub')]),
      node('actorA'),
      node('noOpStub', undefined, { canActIndependently: false }),
    ]
    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        path: [
          pathElem({ address: 'vault', gives: 'upgrade' }),
          pathElem({ address: 'timelock', gives: 'act' }),
          pathElem({ address: 'proxy', gives: 'act' }),
          pathElem({ address: 'actorA' }),
        ],
      },
    ])
  })

  it('two actors, three contracts, proxy can act independently', () => {
    const graph: Node<string>[] = [
      node('vault', [edge('upgrade', 'timelock')]),
      node('timelock', [edge('act', 'proxy')]),
      node('proxy', [edge('act', 'actorA'), edge('act', 'actorB')], {
        canActIndependently: true,
      }),
      node('actorA'),
      node('actorB'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        path: [
          pathElem({ address: 'vault', gives: 'upgrade' }),
          pathElem({ address: 'timelock', gives: 'act' }),
          pathElem({ address: 'proxy' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vault', gives: 'upgrade' }),
          pathElem({ address: 'timelock', gives: 'act' }),
          pathElem({ address: 'proxy', gives: 'act' }),
          pathElem({ address: 'actorA' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vault', gives: 'upgrade' }),
          pathElem({ address: 'timelock', gives: 'act' }),
          pathElem({ address: 'proxy', gives: 'act' }),
          pathElem({ address: 'actorB' }),
        ],
      },
    ])
  })

  it('two actors, one contract, one multisig with members and module, threshold is one', () => {
    const graph: Node<string>[] = [
      node('vault', [edge('interact', 'msig')]),
      node(
        'msig',
        [
          edge('member', 'actorA'),
          edge('member', 'actorB'),
          edge('act', 'module'),
        ],
        { threshold: 1 },
      ),
      node('module'),
      node('actorA'),
      node('actorB'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'msig', gives: 'member' }),
          pathElem({ address: 'actorA' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'msig', gives: 'member' }),
          pathElem({ address: 'actorB' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'msig', gives: 'act' }),
          pathElem({ address: 'module' }),
        ],
      },
    ])
  })

  it('two actors, one contract, one multisig with members and module, threshold greater than one', () => {
    const graph: Node<string>[] = [
      node('vault', [edge('interact', 'msig')]),
      node(
        'msig',
        [
          edge('member', 'actorA'),
          edge('member', 'actorB'),
          edge('act', 'module'),
        ],
        { threshold: 2 },
      ),
      node('module'),
      node('actorA'),
      node('actorB'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'msig' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'msig', gives: 'act' }),
          pathElem({ address: 'module' }),
        ],
      },
    ])
  })

  it('three actors, two contracts, one multisig with members, threshold greater than one with delay', () => {
    const graph: Node<string>[] = [
      node('vault', [edge('interact', 'msig')]),
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
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'msig' }),
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
      node('vault', [edge('interact', 'msig')]),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'msig' }),
        ],
      },
    ])
  })

  it('three actors, two contracts, one multisig with members, threshold one and delay', () => {
    const graph: Node<string>[] = [
      node('vault', [edge('interact', 'msig')]),
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
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'msig', gives: 'member', delay: 10 }),
          pathElem({ address: 'actorA' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'msig', gives: 'member', delay: 10 }),
          pathElem({ address: 'actorB' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'msig', gives: 'member', delay: 10 }),
          pathElem({ address: 'actorC' }),
        ],
      },
    ])
  })

  it('three actors, two contracts, one multisig with members, threshold one', () => {
    const graph: Node<string>[] = [
      node('vault', [edge('interact', 'msig')]),
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
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'msig', gives: 'member' }),
          pathElem({ address: 'actorA' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'msig', gives: 'member' }),
          pathElem({ address: 'actorB' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'msig', gives: 'member' }),
          pathElem({ address: 'actorC' }),
        ],
      },
    ])
  })

  it('three actors, one contract, shared ownership of a single contract with proxy', () => {
    const graph: Node<string>[] = [
      node('vault', [edge('interact', 'proxy')]),
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
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'proxy', gives: 'act' }),
          pathElem({ address: 'actorA' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'proxy', gives: 'act' }),
          pathElem({ address: 'actorB' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'proxy', gives: 'act' }),
          pathElem({ address: 'actorC' }),
        ],
      },
    ])
  })

  it('three actors, one contract, shared ownership of a single contract', () => {
    const graph: Node<string>[] = [
      node('vault', [
        edge('interact', 'actorA'),
        edge('interact', 'actorB'),
        edge('interact', 'actorC'),
      ]),
      node('actorA'),
      node('actorB'),
      node('actorC'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'actorA' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'actorB' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'actorC' }),
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
        path: [
          pathElem({ address: 'vaultA', gives: 'upgrade' }),
          pathElem({ address: 'proxy', gives: 'act' }),
          pathElem({ address: 'actor' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vaultB', gives: 'upgrade' }),
          pathElem({ address: 'proxy', gives: 'act' }),
          pathElem({ address: 'actor' }),
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
        path: [
          pathElem({ address: 'vaultA', gives: 'upgrade' }),
          pathElem({ address: 'proxyA', gives: 'act' }),
          pathElem({ address: 'actor' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vaultB', gives: 'upgrade' }),
          pathElem({ address: 'proxyB', gives: 'act' }),
          pathElem({ address: 'actor' }),
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
        path: [
          pathElem({ address: 'vault', gives: 'upgrade' }),
          pathElem({ address: 'proxy', gives: 'act' }),
          pathElem({ address: 'timelockB', gives: 'act', delay: 69 }),
          pathElem({ address: 'timelockA', gives: 'act', delay: 420 }),
          pathElem({ address: 'actor' }),
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
        path: [
          pathElem({
            address: 'vault',
            gives: 'upgrade',
            delay: 69,
          }),
          pathElem({ address: 'ownerActor' }),
        ],
      },
      {
        path: [
          pathElem({
            address: 'vault',
            gives: 'upgrade',
            delay: 420,
          }),
          pathElem({ address: 'adminActor' }),
        ],
      },
    ])
  })

  it('single actor, three contracts, proxy with act and timelock with delay', () => {
    const graph: Node<string>[] = [
      node('vault', [edge('interact', 'timelock'), edge('interact', 'actorB')]),
      node('timelock', [edge('act', 'actorA', { delay: 42069 })]),
      node('actorA'),
      node('actorB'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'timelock', gives: 'act', delay: 42069 }),
          pathElem({ address: 'actorA' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'actorB' }),
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
        path: [
          pathElem({ address: 'vault', gives: 'upgrade' }),
          pathElem({ address: 'proxy', gives: 'act' }),
          pathElem({ address: 'timelock', gives: 'act', delay: 42069 }),
          pathElem({ address: 'actor' }),
        ],
      },
    ])
  })

  it('two actors, two contracts, proxy with act and single configure', () => {
    const graph: Node<string>[] = [
      node('vault', [edge('upgrade', 'proxy'), edge('interact', 'actorA')]),
      node('proxy', [edge('act', 'actorB')]),
      node('actorA'),
      node('actorB'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        path: [
          pathElem({ address: 'vault', gives: 'upgrade' }),
          pathElem({ address: 'proxy', gives: 'act' }),
          pathElem({ address: 'actorB' }),
        ],
      },
      {
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'actorA' }),
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
        path: [
          pathElem({ address: 'vault', gives: 'upgrade' }),
          pathElem({ address: 'proxy', gives: 'act' }),
          pathElem({ address: 'actor' }),
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
        path: [
          pathElem({ address: 'vault', gives: 'upgrade' }),
          pathElem({ address: 'actor' }),
        ],
      },
    ])
  })

  it('single actor, single contract, no proxy', () => {
    const graph: Node<string>[] = [
      node('vault', [edge('interact', 'actor')]),
      node('actor'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        path: [
          pathElem({ address: 'vault', gives: 'interact' }),
          pathElem({ address: 'actor' }),
        ],
      },
    ])
  })

  it('empty graph returns an empty result', () => {
    const graph: Node<string>[] = []
    expect(resolvePermissions(graph)).toEqualUnsorted([])
  })

  it('correctly handles permission descriptions', () => {
    const graph: Node<string>[] = [
      node('vault', [
        edge('upgrade', 'proxy', { description: 'can steal funds from vault' }),
      ]),
      node('proxy', [
        edge('act', 'actor', { description: 'can act on behalf of proxy' }),
      ]),
      node('actor'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        path: [
          pathElem({
            address: 'vault',
            gives: 'upgrade',
            description: 'can steal funds from vault',
          }),
          pathElem({
            address: 'proxy',
            gives: 'act',
            description: 'can act on behalf of proxy',
          }),
          pathElem({
            address: 'actor',
          }),
        ],
      },
    ])
  })

  it('handles condition properly', () => {
    const graph: Node<string>[] = [
      node('vault', [
        edge('upgrade', 'proxy', { description: 'can steal funds from vault' }),
      ]),
      node('proxy', [
        edge('act', 'actor', {
          description: 'can act on behalf of proxy',
          condition: 'day is Sunday',
          delay: 3600,
        }),
      ]),
      node('actor'),
    ]

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        path: [
          pathElem({
            address: 'vault',
            gives: 'upgrade',
            description: 'can steal funds from vault',
          }),
          pathElem({
            address: 'proxy',
            gives: 'act',
            description: 'can act on behalf of proxy',
            condition: 'day is Sunday',
            delay: 3600,
          }),
          pathElem({
            address: 'actor',
          }),
        ],
      },
    ])
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
    canActIndependently: undefined,
    ...options,
  }
}

function edge(
  permission: Permission,
  toNode: string,
  options?: Partial<Edge<string>>,
): Edge<string> {
  return { permission, toNode, delay: 0, description: undefined, ...options }
}

function pathElem<T>(elem: Partial<PathElement<T>>): PathElement<T> {
  if (elem.address === undefined) {
    throw new Error('Address is required')
  }
  return {
    address: elem.address,
    delay: elem.delay ?? 0,
    gives: elem.gives,
    description: elem.description,
    condition: elem.condition,
  }
}
