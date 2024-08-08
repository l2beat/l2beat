import { expect } from 'earl'
import {
  Edge,
  Graph,
  Node,
  Permission,
  resolvePermissions,
} from './resolvePermissions'

describe(resolvePermissions.name, () => {
  it('op mainnet', () => {
    const graph: Graph<string> = {
      nodes: [
        node('contract1'),
        node('contract2'),
        node('l1Proxy'),
        node('l2Proxy'),
        node('l2Contract1'),
        node('l2Contract2'),
        node('guardian'),
        node('admins', { threshold: 2 }),
        node('foundationMsig'),
        node('securityCounil'),
      ],
      edges: [
        edge('configure', 0, 6, { delay: 7 }),
        edge('upgrade', 0, 2),
        edge('upgrade', 1, 2),
        edge('act', 2, 7),
        edge('act', 6, 8),
        edge('act', 6, 9),
        edge('upgrade', 4, 3),
        edge('upgrade', 5, 3),
        edge('act', 3, 2),
        edge('member', 7, 8),
        edge('member', 7, 9),
      ],
    }

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
    const graph: Graph<string> = {
      nodes: [
        node('verifier'),
        node('governance'),
        node('zkSync', { threshold: 2 }),
        node('upgradeGatekeeper'),
        node('zkSyncMsig'),
        node('actorA'),
        node('actorB'),
      ],
      edges: [
        edge('upgrade', 0, 3),
        edge('upgrade', 1, 3),
        edge('upgrade', 2, 3),
        edge('act', 3, 4, { delay: 21 }),
        edge('configure', 2, 2),
        edge('member', 2, 5),
        edge('member', 2, 6),
      ],
    }

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
    const graph: Graph<string> = {
      nodes: [
        node('actor'),
        node('timelockA'),
        node('timelockB'),
        node('proxy'),
        node('vault'),
      ],
      edges: [
        edge('configure', 4, 1),
        edge('act', 1, 0, { delay: 100 }),
        edge('upgrade', 4, 3),
        edge('act', 3, 2),
        edge('act', 2, 0, { delay: 100 }),
      ],
    }

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
    const graph: Graph<string> = {
      nodes: [
        node('actor'),
        node('timelockA'),
        node('timelockB'),
        node('proxy'),
        node('vault'),
      ],
      edges: [
        edge('configure', 4, 1),
        edge('act', 1, 0, { delay: 90 }),
        edge('upgrade', 4, 3),
        edge('act', 3, 2),
        edge('act', 2, 0, { delay: 100 }),
      ],
    }

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
    const graph: Graph<string> = {
      nodes: [
        node('actor'),
        node('timelockA'),
        node('timelockB'),
        node('proxy'),
        node('vault'),
      ],
      edges: [
        edge('configure', 4, 1),
        edge('act', 1, 0, { delay: 110 }),
        edge('upgrade', 4, 3),
        edge('act', 3, 2),
        edge('act', 2, 0, { delay: 100 }),
      ],
    }

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

  it('one actor, four contracts, two upgrades with same delay on different path', () => {
    const graph: Graph<string> = {
      nodes: [
        node('actor'),
        node('timelockA'),
        node('timelockB'),
        node('proxy'),
        node('vault'),
      ],
      edges: [
        edge('upgrade', 4, 1),
        edge('act', 1, 0, { delay: 100 }),
        edge('upgrade', 4, 3),
        edge('act', 3, 2),
        edge('act', 2, 0, { delay: 100 }),
      ],
    }

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
    const graph: Graph<string> = {
      nodes: [
        node('actor'),
        node('timelockA'),
        node('timelockB'),
        node('proxy'),
        node('vault'),
      ],
      edges: [
        edge('upgrade', 4, 1),
        edge('act', 1, 0, { delay: 110 }),
        edge('upgrade', 4, 3),
        edge('act', 3, 2),
        edge('act', 2, 0, { delay: 100 }),
      ],
    }

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
    const graph: Graph<string> = {
      nodes: [
        node('actor'),
        node('timelockA'),
        node('timelockB'),
        node('proxy'),
        node('vault'),
      ],
      edges: [
        edge('configure', 4, 1),
        edge('act', 1, 0, { delay: 10 }),
        edge('upgrade', 4, 3),
        edge('act', 3, 2),
        edge('act', 2, 0, { delay: 100 }),
      ],
    }

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
    const graph: Graph<string> = {
      nodes: [
        node('actorA'),
        node('actorB'),
        node('actorC'),
        node('msigM'),
        node('msigA'),
        node('msigB', { threshold: 2 }),
        node('vault'),
      ],
      edges: [
        edge('configure', 6, 3),
        edge('member', 3, 4),
        edge('member', 3, 5),
        edge('member', 4, 0),
        edge('member', 4, 1),
        edge('member', 5, 0),
        edge('member', 5, 1),
        edge('member', 5, 2),
      ],
    }

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
    const graph: Graph<string> = {
      nodes: [
        node('actorA'),
        node('actorB'),
        node('actorC'),
        node('msig', { threshold: 2, delay: 10 }),
        node('vault'),
      ],
      edges: [
        edge('configure', 4, 3),
        edge('member', 3, 0),
        edge('member', 3, 1),
        edge('member', 3, 2),
      ],
    }

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
    const graph: Graph<string> = {
      nodes: [
        node('actorA'),
        node('actorB'),
        node('actorC'),
        node('msig', { threshold: 2 }),
        node('vault'),
      ],
      edges: [
        edge('configure', 4, 3),
        edge('member', 3, 0),
        edge('member', 3, 1),
        edge('member', 3, 2),
      ],
    }

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
    const graph: Graph<string> = {
      nodes: [
        node('actorA'),
        node('actorB'),
        node('actorC'),
        node('msig', { threshold: 1, delay: 10 }),
        node('vault'),
      ],
      edges: [
        edge('configure', 4, 3),
        edge('member', 3, 0),
        edge('member', 3, 1),
        edge('member', 3, 2),
      ],
    }

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
    const graph: Graph<string> = {
      nodes: [
        node('actorA'),
        node('actorB'),
        node('actorC'),
        node('msig'),
        node('vault'),
      ],
      edges: [
        edge('configure', 4, 3),
        edge('member', 3, 0),
        edge('member', 3, 1),
        edge('member', 3, 2),
      ],
    }

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
    const graph: Graph<string> = {
      nodes: [
        node('actorA'),
        node('actorB'),
        node('actorC'),
        node('proxy'),
        node('vault'),
      ],
      edges: [
        edge('act', 3, 0),
        edge('act', 3, 1),
        edge('act', 3, 2),
        edge('configure', 4, 3),
      ],
    }

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
    const graph: Graph<string> = {
      nodes: [node('actorA'), node('actorB'), node('actorC'), node('vault')],
      edges: [
        edge('configure', 3, 0),
        edge('configure', 3, 1),
        edge('configure', 3, 2),
      ],
    }

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
    const graph: Graph<string> = {
      nodes: [node('actor'), node('proxy'), node('vaultA'), node('vaultB')],
      edges: [edge('upgrade', 2, 1), edge('upgrade', 3, 1), edge('act', 1, 0)],
    }

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
    const graph: Graph<string> = {
      nodes: [
        node('actor'),
        node('proxyA'),
        node('vaultA'),
        node('proxyB'),
        node('vaultB'),
      ],
      edges: [
        edge('upgrade', 2, 1),
        edge('act', 1, 0),
        edge('upgrade', 4, 3),
        edge('act', 3, 0),
      ],
    }

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
    const graph: Graph<string> = {
      nodes: [
        node('actor'),
        node('timelockA'),
        node('timelockB'),
        node('proxy'),
        node('vault'),
      ],
      edges: [
        edge('upgrade', 4, 3),
        edge('act', 3, 2),
        edge('act', 2, 1, { delay: 69 }),
        edge('act', 1, 0, { delay: 420 }),
      ],
    }

    expect(resolvePermissions(graph)).toEqual([
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
    const graph: Graph<string> = {
      nodes: [node('ownerActor'), node('adminActor'), node('vault')],
      edges: [
        edge('upgrade', 2, 0, { delay: 69 }),
        edge('upgrade', 2, 1, { delay: 420 }),
      ],
    }

    expect(resolvePermissions(graph)).toEqual([
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
    const graph: Graph<string> = {
      nodes: [node('actorA'), node('actorB'), node('timelock'), node('vault')],
      edges: [
        edge('act', 2, 0, { delay: 42069 }),
        edge('configure', 3, 2),
        {
          type: 'configure',
          fromNode: 3,
          toNode: 1,
          delay: 0,
        },
      ],
    }

    expect(resolvePermissions(graph)).toEqual([
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
    const graph: Graph<string> = {
      nodes: [node('actor'), node('timelock'), node('proxy'), node('vault')],
      edges: [
        edge('act', 1, 0, { delay: 42069 }),
        edge('act', 2, 1),
        edge('upgrade', 3, 2),
      ],
    }

    expect(resolvePermissions(graph)).toEqual([
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
    const graph: Graph<string> = {
      nodes: [node('actorA'), node('actorB'), node('proxy'), node('vault')],
      edges: [
        edge('act', 2, 1),
        edge('upgrade', 3, 2),
        edge('configure', 3, 0),
      ],
    }

    expect(resolvePermissions(graph)).toEqual([
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
    const graph: Graph<string> = {
      nodes: [node('actor'), node('proxy'), node('vault')],
      edges: [edge('act', 1, 0), edge('upgrade', 2, 1)],
    }

    expect(resolvePermissions(graph)).toEqual([
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
    const graph: Graph<string> = {
      nodes: [node('actor'), node('vault')],
      edges: [{ type: 'upgrade', fromNode: 1, toNode: 0, delay: 0 }],
    }

    expect(resolvePermissions(graph)).toEqual([
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
    const graph: Graph<string> = {
      nodes: [node('actor'), node('vault')],
      edges: [{ type: 'configure', fromNode: 1, toNode: 0, delay: 0 }],
    }

    expect(resolvePermissions(graph)).toEqual([
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
    const graph: Graph<string> = { nodes: [], edges: [] }
    expect(resolvePermissions(graph)).toEqual([])
  })
})

function node(address: string, options?: Partial<Node<string>>): Node<string> {
  return { address, delay: 0, threshold: 1, ...options }
}

function edge(
  type: Permission,
  fromNode: number,
  toNode: number,
  options?: Partial<Edge>,
): Edge {
  return { type, fromNode, toNode, delay: 0, ...options }
}
