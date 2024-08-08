import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { Graph, resolvePermissions } from './resolvePermissions'

describe(resolvePermissions.name, () => {
  it('op mainnet', () => {
    const contract1 = EthereumAddress.random()
    const contract2 = EthereumAddress.random()
    const l1Proxy = EthereumAddress.random()
    const l2Proxy = EthereumAddress.random()
    const l2Contract1 = EthereumAddress.random()
    const l2Contract2 = EthereumAddress.random()
    const guardian = EthereumAddress.random()
    const admins = EthereumAddress.random()
    const foundationMsig = EthereumAddress.random()
    const securityCounil = EthereumAddress.random()

    const graph: Graph = {
      nodes: [
        { address: contract1, threshold: 1 },
        { address: contract2, threshold: 1 },
        { address: l1Proxy, threshold: 1 },
        { address: l2Proxy, threshold: 1 },
        { address: l2Contract1, threshold: 1 },
        { address: l2Contract2, threshold: 1 },
        { address: guardian, threshold: 1 },
        { address: admins, threshold: 2 },
        { address: foundationMsig, threshold: 1 },
        { address: securityCounil, threshold: 1 },
      ],
      edges: [
        { type: 'configure', fromNode: 0, toNode: 6, delay: 7 },
        { type: 'upgrade', fromNode: 0, toNode: 2, delay: 0 },
        { type: 'upgrade', fromNode: 1, toNode: 2, delay: 0 },
        { type: 'act', fromNode: 2, toNode: 7, delay: 0 },
        { type: 'act', fromNode: 6, toNode: 8, delay: 0 },
        { type: 'act', fromNode: 6, toNode: 9, delay: 0 },
        { type: 'upgrade', fromNode: 4, toNode: 3, delay: 0 },
        { type: 'upgrade', fromNode: 5, toNode: 3, delay: 0 },
        { type: 'act', fromNode: 3, toNode: 2, delay: 0 },
        { type: 'member', fromNode: 7, toNode: 8, delay: 0 },
        { type: 'member', fromNode: 7, toNode: 9, delay: 0 },
      ],
    }

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: contract1, delay: 7 },
          { address: guardian, delay: 0 },
          { address: securityCounil, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: contract1, delay: 7 },
          { address: guardian, delay: 0 },
          { address: foundationMsig, delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: contract1, delay: 0 },
          { address: l1Proxy, delay: 0 },
          { address: admins, delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: contract2, delay: 0 },
          { address: l1Proxy, delay: 0 },
          { address: admins, delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: l2Contract1, delay: 0 },
          { address: l2Proxy, delay: 0 },
          { address: l1Proxy, delay: 0 },
          { address: admins, delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: l2Contract2, delay: 0 },
          { address: l2Proxy, delay: 0 },
          { address: l1Proxy, delay: 0 },
          { address: admins, delay: 0 },
        ],
      },
    ])
  })

  it('zksync lite', () => {
    const verifier = EthereumAddress.random()
    const governance = EthereumAddress.random()
    const zkSync = EthereumAddress.random()
    const upgradeGatekeeper = EthereumAddress.random()
    const zkSyncMsig = EthereumAddress.random()
    const actorA = EthereumAddress.random()
    const actorB = EthereumAddress.random()

    const graph: Graph = {
      nodes: [
        { address: verifier, threshold: 1 },
        { address: governance, threshold: 1 },
        { address: zkSync, threshold: 2 },
        { address: upgradeGatekeeper, threshold: 1 },
        { address: zkSyncMsig, threshold: 1 },
        { address: actorA, threshold: 1 },
        { address: actorB, threshold: 1 },
      ],
      edges: [
        { type: 'upgrade', fromNode: 0, toNode: 3, delay: 0 },
        { type: 'upgrade', fromNode: 1, toNode: 3, delay: 0 },
        { type: 'upgrade', fromNode: 2, toNode: 3, delay: 0 },
        { type: 'act', fromNode: 3, toNode: 4, delay: 21 },
        { type: 'configure', fromNode: 2, toNode: 2, delay: 0 },
        { type: 'member', fromNode: 2, toNode: 5, delay: 0 },
        { type: 'member', fromNode: 2, toNode: 6, delay: 0 },
      ],
    }

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: verifier, delay: 0 },
          { address: upgradeGatekeeper, delay: 21 },
          { address: zkSyncMsig, delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: governance, delay: 0 },
          { address: upgradeGatekeeper, delay: 21 },
          { address: zkSyncMsig, delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: zkSync, delay: 0 },
          { address: upgradeGatekeeper, delay: 21 },
          { address: zkSyncMsig, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: zkSync, delay: 0 }, // contract
          { address: zkSync, delay: 0 }, // embedded security council
        ],
      },
    ])
  })

  it('one actor, four contracts, two timelocks with same delays', () => {
    const actor = EthereumAddress.random()
    const timelockA = EthereumAddress.random()
    const timelockB = EthereumAddress.random()
    const proxy = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const graph: Graph = {
      nodes: [
        { address: actor, threshold: 1 },
        { address: timelockA, threshold: 1 },
        { address: timelockB, threshold: 1 },
        { address: proxy, threshold: 1 },
        { address: vault, threshold: 1 },
      ],
      edges: [
        { type: 'configure', fromNode: 4, toNode: 1, delay: 0 },
        { type: 'act', fromNode: 1, toNode: 0, delay: 100 },
        { type: 'upgrade', fromNode: 4, toNode: 3, delay: 0 },
        { type: 'act', fromNode: 3, toNode: 2, delay: 0 },
        { type: 'act', fromNode: 2, toNode: 0, delay: 100 },
      ],
    }

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: vault, delay: 0 },
          { address: proxy, delay: 0 },
          { address: timelockB, delay: 100 },
          { address: actor, delay: 0 },
        ],
      },
    ])
  })

  it('one actor, four contracts, configure shorter delay than upgrade', () => {
    const actor = EthereumAddress.random()
    const timelockA = EthereumAddress.random()
    const timelockB = EthereumAddress.random()
    const proxy = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const graph: Graph = {
      nodes: [
        { address: actor, threshold: 1 },
        { address: timelockA, threshold: 1 },
        { address: timelockB, threshold: 1 },
        { address: proxy, threshold: 1 },
        { address: vault, threshold: 1 },
      ],
      edges: [
        { type: 'configure', fromNode: 4, toNode: 1, delay: 0 },
        { type: 'act', fromNode: 1, toNode: 0, delay: 90 },
        { type: 'upgrade', fromNode: 4, toNode: 3, delay: 0 },
        { type: 'act', fromNode: 3, toNode: 2, delay: 0 },
        { type: 'act', fromNode: 2, toNode: 0, delay: 100 },
      ],
    }

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: vault, delay: 0 },
          { address: proxy, delay: 0 },
          { address: timelockB, delay: 100 },
          { address: actor, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: timelockA, delay: 90 },
          { address: actor, delay: 0 },
        ],
      },
    ])
  })

  it('one actor, four contracts, configure longer delay than upgrade', () => {
    const actor = EthereumAddress.random()
    const timelockA = EthereumAddress.random()
    const timelockB = EthereumAddress.random()
    const proxy = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const graph: Graph = {
      nodes: [
        { address: actor, threshold: 1 },
        { address: timelockA, threshold: 1 },
        { address: timelockB, threshold: 1 },
        { address: proxy, threshold: 1 },
        { address: vault, threshold: 1 },
      ],
      edges: [
        { type: 'configure', fromNode: 4, toNode: 1, delay: 0 },
        { type: 'act', fromNode: 1, toNode: 0, delay: 110 },
        { type: 'upgrade', fromNode: 4, toNode: 3, delay: 0 },
        { type: 'act', fromNode: 3, toNode: 2, delay: 0 },
        { type: 'act', fromNode: 2, toNode: 0, delay: 100 },
      ],
    }

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: vault, delay: 0 },
          { address: proxy, delay: 0 },
          { address: timelockB, delay: 100 },
          { address: actor, delay: 0 },
        ],
      },
    ])
  })

  it('one actor, four contracts, two upgrades with same delay on different path', () => {
    const actor = EthereumAddress.random()
    const timelockA = EthereumAddress.random()
    const timelockB = EthereumAddress.random()
    const proxy = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const graph: Graph = {
      nodes: [
        { address: actor, threshold: 1 },
        { address: timelockA, threshold: 1 },
        { address: timelockB, threshold: 1 },
        { address: proxy, threshold: 1 },
        { address: vault, threshold: 1 },
      ],
      edges: [
        { type: 'upgrade', fromNode: 4, toNode: 1, delay: 0 },
        { type: 'act', fromNode: 1, toNode: 0, delay: 100 },
        { type: 'upgrade', fromNode: 4, toNode: 3, delay: 0 },
        { type: 'act', fromNode: 3, toNode: 2, delay: 0 },
        { type: 'act', fromNode: 2, toNode: 0, delay: 100 },
      ],
    }

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: vault, delay: 0 },
          { address: proxy, delay: 0 },
          { address: timelockB, delay: 100 },
          { address: actor, delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: vault, delay: 0 },
          { address: timelockA, delay: 100 },
          { address: actor, delay: 0 },
        ],
      },
    ])
  })

  it('one actor, four contracts, two upgrades with different delay on different path', () => {
    const actor = EthereumAddress.random()
    const timelockA = EthereumAddress.random()
    const timelockB = EthereumAddress.random()
    const proxy = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const graph: Graph = {
      nodes: [
        { address: actor, threshold: 1 },
        { address: timelockA, threshold: 1 },
        { address: timelockB, threshold: 1 },
        { address: proxy, threshold: 1 },
        { address: vault, threshold: 1 },
      ],
      edges: [
        { type: 'upgrade', fromNode: 4, toNode: 1, delay: 0 },
        { type: 'act', fromNode: 1, toNode: 0, delay: 110 },
        { type: 'upgrade', fromNode: 4, toNode: 3, delay: 0 },
        { type: 'act', fromNode: 3, toNode: 2, delay: 0 },
        { type: 'act', fromNode: 2, toNode: 0, delay: 100 },
      ],
    }

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: vault, delay: 0 },
          { address: proxy, delay: 0 },
          { address: timelockB, delay: 100 },
          { address: actor, delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: vault, delay: 0 },
          { address: timelockA, delay: 110 },
          { address: actor, delay: 0 },
        ],
      },
    ])
  })

  it('one actor, four contracts, two timelocks with different delays', () => {
    const actor = EthereumAddress.random()
    const timelockA = EthereumAddress.random()
    const timelockB = EthereumAddress.random()
    const proxy = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const graph: Graph = {
      nodes: [
        { address: actor, threshold: 1 },
        { address: timelockA, threshold: 1 },
        { address: timelockB, threshold: 1 },
        { address: proxy, threshold: 1 },
        { address: vault, threshold: 1 },
      ],
      edges: [
        { type: 'configure', fromNode: 4, toNode: 1, delay: 0 },
        { type: 'act', fromNode: 1, toNode: 0, delay: 10 },
        { type: 'upgrade', fromNode: 4, toNode: 3, delay: 0 },
        { type: 'act', fromNode: 3, toNode: 2, delay: 0 },
        { type: 'act', fromNode: 2, toNode: 0, delay: 100 },
      ],
    }

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: timelockA, delay: 10 },
          { address: actor, delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: vault, delay: 0 },
          { address: proxy, delay: 0 },
          { address: timelockB, delay: 100 },
          { address: actor, delay: 0 },
        ],
      },
    ])
  })

  it('three actors, four contracts, three multisigs with members, mixed threshold', () => {
    const actorA = EthereumAddress.random()
    const actorB = EthereumAddress.random()
    const actorC = EthereumAddress.random()
    const msigM = EthereumAddress.random()
    const msigA = EthereumAddress.random()
    const msigB = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const graph: Graph = {
      nodes: [
        { address: actorA, threshold: 1 },
        { address: actorB, threshold: 1 },
        { address: actorC, threshold: 1 },
        { address: msigM, threshold: 1 },
        { address: msigA, threshold: 1 },
        { address: msigB, threshold: 2 },
        { address: vault, threshold: 1 },
      ],
      edges: [
          { type: 'configure', fromNode: 6, toNode: 3, delay: 0 },
          { type: 'member', fromNode: 3, toNode: 4, delay: 0 },
          { type: 'member', fromNode: 3, toNode: 5, delay: 0 },
          { type: 'member', fromNode: 4, toNode: 0, delay: 0 },
          { type: 'member', fromNode: 4, toNode: 1, delay: 0 },
          { type: 'member', fromNode: 5, toNode: 0, delay: 0 },
          { type: 'member', fromNode: 5, toNode: 1, delay: 0 },
          { type: 'member', fromNode: 5, toNode: 2, delay: 0 },
      ],
    }

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: msigM, delay: 0 },
          { address: msigB, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: msigM, delay: 0 },
          { address: msigA, delay: 0 },
          { address: actorA, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: msigM, delay: 0 },
          { address: msigA, delay: 0 },
          { address: actorB, delay: 0 },
        ],
      },
    ])
  })

  it('three actors, two contracts, one multisig with members, threshold greater than one with delay', () => {
    const actorA = EthereumAddress.random()
    const actorB = EthereumAddress.random()
    const actorC = EthereumAddress.random()
    const msig = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const graph: Graph = {
      nodes: [
        { address: actorA, threshold: 1 },
        { address: actorB, threshold: 1 },
        { address: actorC, threshold: 1 },
        { address: msig, threshold: 2, delay: 10 },
        { address: vault, threshold: 1 },
      ],
      edges: [
          { type: 'configure', fromNode: 4, toNode: 3, delay: 0 },
          { type: 'member', fromNode: 3, toNode: 0, delay: 0 },
          { type: 'member', fromNode: 3, toNode: 1, delay: 0 },
          { type: 'member', fromNode: 3, toNode: 2, delay: 0 },
      ],
    }

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: msig, delay: 10 },
        ],
      },
    ])
  })

  it('three actors, two contracts, one multisig with members, threshold greater than one', () => {
    const actorA = EthereumAddress.random()
    const actorB = EthereumAddress.random()
    const actorC = EthereumAddress.random()
    const msig = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const graph: Graph = {
      nodes: [
        { address: actorA, threshold: 1 },
        { address: actorB, threshold: 1 },
        { address: actorC, threshold: 1 },
        { address: msig, threshold: 2 },
        { address: vault, threshold: 1 },
      ],
      edges: [
          { type: 'configure', fromNode: 4, toNode: 3, delay: 0 },
          { type: 'member', fromNode: 3, toNode: 0, delay: 0 },
          { type: 'member', fromNode: 3, toNode: 1, delay: 0 },
          { type: 'member', fromNode: 3, toNode: 2, delay: 0 },
      ],
    }

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: msig, delay: 0 },
        ],
      },
    ])
  })

  it('three actors, two contracts, one multisig with members, threshold one and delay', () => {
    const actorA = EthereumAddress.random()
    const actorB = EthereumAddress.random()
    const actorC = EthereumAddress.random()
    const msig = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const graph: Graph = {
      nodes: [
        { address: actorA, threshold: 1 },
        { address: actorB, threshold: 1 },
        { address: actorC, threshold: 1 },
        { address: msig, threshold: 1, delay: 10 },
        { address: vault, threshold: 1 },
      ],
      edges: [
          { type: 'configure', fromNode: 4, toNode: 3, delay: 0 },
          { type: 'member', fromNode: 3, toNode: 0, delay: 0 },
          { type: 'member', fromNode: 3, toNode: 1, delay: 0 },
          { type: 'member', fromNode: 3, toNode: 2, delay: 0 }
      ],
    }

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: msig, delay: 10 },
          { address: actorA, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: msig, delay: 10 },
          { address: actorB, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: msig, delay: 10 },
          { address: actorC, delay: 0 },
        ],
      },
    ])
  })

  it('three actors, two contracts, one multisig with members, threshold one', () => {
    const actorA = EthereumAddress.random()
    const actorB = EthereumAddress.random()
    const actorC = EthereumAddress.random()
    const msig = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const graph: Graph = {
      nodes: [
        { address: actorA, threshold: 1 },
        { address: actorB, threshold: 1 },
        { address: actorC, threshold: 1 },
        { address: msig, threshold: 1 },
        { address: vault, threshold: 1 },
      ],
      edges: [
          { type: 'configure', fromNode: 4, toNode: 3, delay: 0 },
          { type: 'member', fromNode: 3, toNode: 0, delay: 0 },
          { type: 'member', fromNode: 3, toNode: 1, delay: 0 },
          { type: 'member', fromNode: 3, toNode: 2, delay: 0 }
      ],
    }

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: msig, delay: 0 },
          { address: actorA, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: msig, delay: 0 },
          { address: actorB, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: msig, delay: 0 },
          { address: actorC, delay: 0 },
        ],
      },
    ])
  })

  it('three actors, one contract, shared ownership of a single contract with proxy', () => {
    const actorA = EthereumAddress.random()
    const actorB = EthereumAddress.random()
    const actorC = EthereumAddress.random()
    const proxy = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const graph: Graph = {
      nodes: [
        { address: actorA, threshold: 1 },
        { address: actorB, threshold: 1 },
        { address: actorC, threshold: 1 },
        { address: proxy, threshold: 1 },
        { address: vault, threshold: 1 },
      ],
      edges: [
        { type: 'act', fromNode: 3, toNode: 0, delay: 0 },
        { type: 'act', fromNode: 3, toNode: 1, delay: 0 },
        { type: 'act', fromNode: 3, toNode: 2, delay: 0 },
        { type: 'configure', fromNode: 4, toNode: 3, delay: 0 },
      ],
    }

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: proxy, delay: 0 },
          { address: actorA, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: proxy, delay: 0 },
          { address: actorB, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: proxy, delay: 0 },
          { address: actorC, delay: 0 },
        ],
      },
    ])
  })

  it('three actors, one contract, shared ownership of a single contract', () => {
    const actorA = EthereumAddress.random()
    const actorB = EthereumAddress.random()
    const actorC = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const graph: Graph = {
      nodes: [
        { address: actorA, threshold: 1 },
        { address: actorB, threshold: 1 },
        { address: actorC, threshold: 1 },
        { address: vault, threshold: 1 },
      ],
      edges: [
        { type: 'configure', fromNode: 3, toNode: 0, delay: 0 },
        { type: 'configure', fromNode: 3, toNode: 1, delay: 0 },
        { type: 'configure', fromNode: 3, toNode: 2, delay: 0 },
      ],
    }

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: actorA, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: actorB, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: actorC, delay: 0 },
        ],
      },
    ])
  })

  it('one actor, three contracts, shared ownership through proxy', () => {
    const actor = EthereumAddress.random()
    const proxy = EthereumAddress.random()
    const vaultA = EthereumAddress.random()
    const vaultB = EthereumAddress.random()

    const graph: Graph = {
      nodes: [
        { address: actor, threshold: 1 },
        { address: proxy, threshold: 1 },
        { address: vaultA, threshold: 1 },
        { address: vaultB, threshold: 1 },
      ],
      edges: [
        { type: 'upgrade', fromNode: 2, toNode: 1, delay: 0 },
        { type: 'upgrade', fromNode: 3, toNode: 1, delay: 0 },
        { type: 'act', fromNode: 1, toNode: 0, delay: 0 },
      ],
    }

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: vaultA, delay: 0 },
          { address: proxy, delay: 0 },
          { address: actor, delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: vaultB, delay: 0 },
          { address: proxy, delay: 0 },
          { address: actor, delay: 0 },
        ],
      },
    ])
  })

  it('one actor, four contracts, shared ownership', () => {
    const actor = EthereumAddress.random()
    const proxyA = EthereumAddress.random()
    const proxyB = EthereumAddress.random()
    const vaultA = EthereumAddress.random()
    const vaultB = EthereumAddress.random()

    const graph: Graph = {
      nodes: [
        { address: actor, threshold: 1 },
        { address: proxyA, threshold: 1 },
        { address: vaultA, threshold: 1 },
        { address: proxyB, threshold: 1 },
        { address: vaultB, threshold: 1 },
      ],
      edges: [
        { type: 'upgrade', fromNode: 2, toNode: 1, delay: 0 },
        { type: 'act', fromNode: 1, toNode: 0, delay: 0 },
        { type: 'upgrade', fromNode: 4, toNode: 3, delay: 0 },
        { type: 'act', fromNode: 3, toNode: 0, delay: 0 },
      ],
    }

    expect(resolvePermissions(graph)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: vaultA, delay: 0 },
          { address: proxyA, delay: 0 },
          { address: actor, delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: vaultB, delay: 0 },
          { address: proxyB, delay: 0 },
          { address: actor, delay: 0 },
        ],
      },
    ])
  })

  it('one actor, four contracts, stacking delays', () => {
    const actor = EthereumAddress.random()
    const timelockA = EthereumAddress.random()
    const timelockB = EthereumAddress.random()
    const proxy = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const graph: Graph = {
      nodes: [
        { address: actor, threshold: 1 },
        { address: timelockA, threshold: 1 },
        { address: timelockB, threshold: 1 },
        { address: proxy, threshold: 1 },
        { address: vault, threshold: 1 },
      ],
      edges: [
        { type: 'upgrade', fromNode: 4, toNode: 3, delay: 0 },
        { type: 'act', fromNode: 3, toNode: 2, delay: 0 },
        { type: 'act', fromNode: 2, toNode: 1, delay: 69 },
        { type: 'act', fromNode: 1, toNode: 0, delay: 420 },
      ],
    }

    expect(resolvePermissions(graph)).toEqual([
      {
        type: 'upgrade',
        path: [
          { address: vault, delay: 0 },
          { address: proxy, delay: 0 },
          { address: timelockB, delay: 69 },
          { address: timelockA, delay: 420 },
          { address: actor, delay: 0 },
        ],
      },
    ])
  })

  it('two actors, one contract, two different delays', () => {
    const ownerActor = EthereumAddress.random()
    const adminActor = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const graph: Graph = {
      nodes: [
        { address: ownerActor, threshold: 1 },
        { address: adminActor, threshold: 1 },
        { address: vault, threshold: 1 },
      ],
      edges: [
        { type: 'upgrade', fromNode: 2, toNode: 0, delay: 69 },
        { type: 'upgrade', fromNode: 2, toNode: 1, delay: 420 },
      ],
    }

    expect(resolvePermissions(graph)).toEqual([
      {
        type: 'upgrade',
        path: [
          { address: vault, delay: 69 },
          { address: ownerActor, delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: vault, delay: 420 },
          { address: adminActor, delay: 0 },
        ],
      },
    ])
  })

  it('single actor, three contracts, proxy with act and timelock with delay', () => {
    const actorA = EthereumAddress.random()
    const actorB = EthereumAddress.random()
    const timelock = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const graph: Graph = {
      nodes: [
        { address: actorA, threshold: 1 },
        { address: actorB, threshold: 1 },
        { address: timelock, threshold: 1 },
        { address: vault, threshold: 1 },
      ],
      edges: [
        { type: 'act', fromNode: 2, toNode: 0, delay: 42069 },
        { type: 'configure', fromNode: 3, toNode: 2, delay: 0 },
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
          { address: vault, delay: 0 },
          { address: timelock, delay: 42069 },
          { address: actorA, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: actorB, delay: 0 },
        ],
      },
    ])
  })

  it('single actor, three contracts, proxy with act and timelock with delay', () => {
    const actor = EthereumAddress.random()
    const timelock = EthereumAddress.random()
    const proxy = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const graph: Graph = {
      nodes: [
        { address: actor, threshold: 1 },
        { address: timelock, threshold: 1 },
        { address: proxy, threshold: 1 },
        { address: vault, threshold: 1 },
      ],
      edges: [
        { type: 'act', fromNode: 1, toNode: 0, delay: 42069 },
        { type: 'act', fromNode: 2, toNode: 1, delay: 0 },
        { type: 'upgrade', fromNode: 3, toNode: 2, delay: 0 },
      ],
    }

    expect(resolvePermissions(graph)).toEqual([
      {
        type: 'upgrade',
        path: [
          { address: vault, delay: 0 },
          { address: proxy, delay: 0 },
          { address: timelock, delay: 42069 },
          { address: actor, delay: 0 },
        ],
      },
    ])
  })

  it('two actors, two contracts, proxy with act and single configure', () => {
    const actorA = EthereumAddress.random()
    const actorB = EthereumAddress.random()
    const proxy = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const graph: Graph = {
      nodes: [
        { address: actorA, threshold: 1 },
        { address: actorB, threshold: 1 },
        { address: proxy, threshold: 1 },
        { address: vault, threshold: 1 },
      ],
      edges: [
        { type: 'act', fromNode: 2, toNode: 1, delay: 0 },
        { type: 'upgrade', fromNode: 3, toNode: 2, delay: 0 },
        { type: 'configure', fromNode: 3, toNode: 0, delay: 0 },
      ],
    }

    expect(resolvePermissions(graph)).toEqual([
      {
        type: 'upgrade',
        path: [
          { address: vault, delay: 0 },
          { address: proxy, delay: 0 },
          { address: actorB, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: actorA, delay: 0 },
        ],
      },
    ])
  })

  it('single actor, two contracts, proxy and act', () => {
    const actor = EthereumAddress.random()
    const proxy = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const graph: Graph = {
      nodes: [
        { address: actor, threshold: 1 },
        { address: proxy, threshold: 1 },
        { address: vault, threshold: 1 },
      ],
      edges: [
        { type: 'act', fromNode: 1, toNode: 0, delay: 0 },
        { type: 'upgrade', fromNode: 2, toNode: 1, delay: 0 },
      ],
    }

    expect(resolvePermissions(graph)).toEqual([
      {
        type: 'upgrade',
        path: [
          { address: vault, delay: 0 },
          { address: proxy, delay: 0 },
          { address: actor, delay: 0 },
        ],
      },
    ])
  })

  it('single actor, single contract, proxy', () => {
    const actor = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const graph: Graph = {
      nodes: [
        { address: actor, threshold: 1 },
        { address: vault, threshold: 1 },
      ],
      edges: [{ type: 'upgrade', fromNode: 1, toNode: 0, delay: 0 }],
    }

    expect(resolvePermissions(graph)).toEqual([
      {
        type: 'upgrade',
        path: [
          { address: vault, delay: 0 },
          { address: actor, delay: 0 },
        ],
      },
    ])
  })

  it('single actor, single contract, no proxy', () => {
    const actor = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const graph: Graph = {
      nodes: [
        { address: actor, threshold: 1 },
        { address: vault, threshold: 1 },
      ],
      edges: [{ type: 'configure', fromNode: 1, toNode: 0, delay: 0 }],
    }

    expect(resolvePermissions(graph)).toEqual([
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: actor, delay: 0 },
        ],
      },
    ])
  })

  it('empty graph returns an empty result', () => {
    const graph: Graph = { nodes: [], edges: [] }
    expect(resolvePermissions(graph)).toEqual([])
  })
})
