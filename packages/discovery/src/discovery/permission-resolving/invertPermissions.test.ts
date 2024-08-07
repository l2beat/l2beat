import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { invertGrantedPermissions } from './invertPermissions'
import { GrantedPermission } from './resolvePermissions'

describe(invertGrantedPermissions.name, () => {
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

    const input: GrantedPermission[] = [
      {
        type: 'configure',
        path: [
          { address: contract1, delay: 0 },
          { address: guardian, delay: 7 },
          { address: securityCounil, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: contract1, delay: 0 },
          { address: guardian, delay: 7 },
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
    ]

    expect(invertGrantedPermissions(input)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: securityCounil, delay: 0 },
          { address: guardian, delay: 7 },
          { address: contract1, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: foundationMsig, delay: 0 },
          { address: guardian, delay: 7 },
          { address: contract1, delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: admins, delay: 0 },
          { address: l1Proxy, delay: 0 },
          { address: contract1, delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: admins, delay: 0 },
          { address: l1Proxy, delay: 0 },
          { address: contract2, delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: admins, delay: 0 },
          { address: l1Proxy, delay: 0 },
          { address: l2Proxy, delay: 0 },
          { address: l2Contract1, delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: admins, delay: 0 },
          { address: l1Proxy, delay: 0 },
          { address: l2Proxy, delay: 0 },
          { address: l2Contract2, delay: 0 },
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
    const securityCouncil = EthereumAddress.random()

    const input: GrantedPermission[] = [
      {
        type: 'upgrade',
        path: [
          { address: verifier, delay: 0 },
          { address: upgradeGatekeeper, delay: 0 },
          { address: zkSyncMsig, delay: 21 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: governance, delay: 0 },
          { address: upgradeGatekeeper, delay: 0 },
          { address: zkSyncMsig, delay: 21 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: zkSync, delay: 0 },
          { address: upgradeGatekeeper, delay: 0 },
          { address: zkSyncMsig, delay: 21 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: zkSync, delay: 0 },
          { address: securityCouncil, delay: 0 },
        ],
      },
    ]

    expect(invertGrantedPermissions(input)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: zkSyncMsig, delay: 21 },
          { address: upgradeGatekeeper, delay: 0 },
          { address: verifier, delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: zkSyncMsig, delay: 21 },
          { address: upgradeGatekeeper, delay: 0 },
          { address: governance, delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: zkSyncMsig, delay: 21 },
          { address: upgradeGatekeeper, delay: 0 },
          { address: zkSync, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: securityCouncil, delay: 0 },
          { address: zkSync, delay: 0 },
        ],
      },
    ])
  })

  it('one actor, four contracts, two timelocks with same delays', () => {
    const actor = EthereumAddress.random()
    const timelockB = EthereumAddress.random()
    const proxy = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const input: GrantedPermission[] = [
      {
        type: 'upgrade',
        path: [
          { address: vault, delay: 0 },
          { address: proxy, delay: 0 },
          { address: timelockB, delay: 0 },
          { address: actor, delay: 100 },
        ],
      },
    ]

    expect(invertGrantedPermissions(input)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: actor, delay: 100 },
          { address: timelockB, delay: 0 },
          { address: proxy, delay: 0 },
          { address: vault, delay: 0 },
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

    const input: GrantedPermission[] = [
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: timelockA, delay: 0 },
          { address: actor, delay: 10 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: vault, delay: 0 },
          { address: proxy, delay: 0 },
          { address: timelockB, delay: 0 },
          { address: actor, delay: 100 },
        ],
      },
    ]

    expect(invertGrantedPermissions(input)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: actor, delay: 10 },
          { address: timelockA, delay: 0 },
          { address: vault, delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: actor, delay: 100 },
          { address: timelockB, delay: 0 },
          { address: proxy, delay: 0 },
          { address: vault, delay: 0 },
        ],
      },
    ])
  })

  it('three actors, four contracts, three multisig with members, mixed threshold', () => {
    const actorA = EthereumAddress.random()
    const actorB = EthereumAddress.random()
    const msigM = EthereumAddress.random()
    const msigA = EthereumAddress.random()
    const msigB = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const input: GrantedPermission[] = [
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
    ]

    expect(invertGrantedPermissions(input)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: msigB, delay: 0 },
          { address: msigM, delay: 0 },
          { address: vault, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: actorA, delay: 0 },
          { address: msigA, delay: 0 },
          { address: msigM, delay: 0 },
          { address: vault, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: actorB, delay: 0 },
          { address: msigA, delay: 0 },
          { address: msigM, delay: 0 },
          { address: vault, delay: 0 },
        ],
      },
    ])
  })

  it('three actors, two contracts, one multisig with members, threshold greater than one', () => {
    const msig = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const input: GrantedPermission[] = [
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: msig, delay: 0 },
        ],
      },
    ]

    expect(invertGrantedPermissions(input)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: msig, delay: 0 },
          { address: vault, delay: 0 },
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

    const input: GrantedPermission[] = [
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
    ]

    expect(invertGrantedPermissions(input)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: actorA, delay: 0 },
          { address: msig, delay: 0 },
          { address: vault, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: actorB, delay: 0 },
          { address: msig, delay: 0 },
          { address: vault, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: actorC, delay: 0 },
          { address: msig, delay: 0 },
          { address: vault, delay: 0 },
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

    const input: GrantedPermission[] = [
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
    ]

    expect(invertGrantedPermissions(input)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: actorA, delay: 0 },
          { address: proxy, delay: 0 },
          { address: vault, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: actorB, delay: 0 },
          { address: proxy, delay: 0 },
          { address: vault, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: actorC, delay: 0 },
          { address: proxy, delay: 0 },
          { address: vault, delay: 0 },
        ],
      },
    ])
  })

  it('three actors, one contract, shared ownership of a single contract', () => {
    const actorA = EthereumAddress.random()
    const actorB = EthereumAddress.random()
    const actorC = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const input: GrantedPermission[] = [
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
    ]

    expect(invertGrantedPermissions(input)).toEqualUnsorted([
      {
        type: 'configure',
        path: [
          { address: actorA, delay: 0 },
          { address: vault, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: actorB, delay: 0 },
          { address: vault, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: actorC, delay: 0 },
          { address: vault, delay: 0 },
        ],
      },
    ])
  })

  it('one actor, three contracts, shared ownership through proxy', () => {
    const actor = EthereumAddress.random()
    const proxy = EthereumAddress.random()
    const vaultA = EthereumAddress.random()
    const vaultB = EthereumAddress.random()

    const input: GrantedPermission[] = [
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
    ]

    expect(invertGrantedPermissions(input)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: actor, delay: 0 },
          { address: proxy, delay: 0 },
          { address: vaultA, delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: actor, delay: 0 },
          { address: proxy, delay: 0 },
          { address: vaultB, delay: 0 },
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

    const input: GrantedPermission[] = [
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
    ]

    expect(invertGrantedPermissions(input)).toEqualUnsorted([
      {
        type: 'upgrade',
        path: [
          { address: actor, delay: 0 },
          { address: proxyA, delay: 0 },
          { address: vaultA, delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: actor, delay: 0 },
          { address: proxyB, delay: 0 },
          { address: vaultB, delay: 0 },
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

    const input: GrantedPermission[] = [
      {
        type: 'upgrade',
        path: [
          { address: vault, delay: 0 },
          { address: proxy, delay: 0 },
          { address: timelockB, delay: 0 },
          { address: timelockA, delay: 69 },
          { address: actor, delay: 420 },
        ],
      },
    ]

    expect(invertGrantedPermissions(input)).toEqual([
      {
        type: 'upgrade',
        path: [
          { address: actor, delay: 420 },
          { address: timelockA, delay: 69 },
          { address: timelockB, delay: 0 },
          { address: proxy, delay: 0 },
          { address: vault, delay: 0 },
        ],
      },
    ])
  })

  it('two actors, one contract, two different delays', () => {
    const ownerActor = EthereumAddress.random()
    const adminActor = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const input: GrantedPermission[] = [
      {
        type: 'upgrade',
        path: [
          { address: vault, delay: 0 },
          { address: ownerActor, delay: 69 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: vault, delay: 0 },
          { address: adminActor, delay: 420 },
        ],
      },
    ]

    expect(invertGrantedPermissions(input)).toEqual([
      {
        type: 'upgrade',
        path: [
          { address: ownerActor, delay: 69 },
          { address: vault, delay: 0 },
        ],
      },
      {
        type: 'upgrade',
        path: [
          { address: adminActor, delay: 420 },
          { address: vault, delay: 0 },
        ],
      },
    ])
  })

  it('single actor, three contracts, proxy with act and timelock with delay', () => {
    const actorA = EthereumAddress.random()
    const actorB = EthereumAddress.random()
    const timelock = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const input: GrantedPermission[] = [
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: timelock, delay: 0 },
          { address: actorA, delay: 42069 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: actorB, delay: 0 },
        ],
      },
    ]

    expect(invertGrantedPermissions(input)).toEqual([
      {
        type: 'configure',
        path: [
          { address: actorA, delay: 42069 },
          { address: timelock, delay: 0 },
          { address: vault, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: actorB, delay: 0 },
          { address: vault, delay: 0 },
        ],
      },
    ])
  })

  it('single actor, three contracts, proxy with act and timelock with delay', () => {
    const actor = EthereumAddress.random()
    const timelock = EthereumAddress.random()
    const proxy = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const input: GrantedPermission[] = [
      {
        type: 'upgrade',
        path: [
          { address: vault, delay: 0 },
          { address: proxy, delay: 0 },
          { address: timelock, delay: 0 },
          { address: actor, delay: 42069 },
        ],
      },
    ]

    expect(invertGrantedPermissions(input)).toEqual([
      {
        type: 'upgrade',
        path: [
          { address: actor, delay: 42069 },
          { address: timelock, delay: 0 },
          { address: proxy, delay: 0 },
          { address: vault, delay: 0 },
        ],
      },
    ])
  })

  it('two actors, two contracts, proxy with act and single configure', () => {
    const actorA = EthereumAddress.random()
    const actorB = EthereumAddress.random()
    const proxy = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const input: GrantedPermission[] = [
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
    ]

    expect(invertGrantedPermissions(input)).toEqual([
      {
        type: 'upgrade',
        path: [
          { address: actorB, delay: 0 },
          { address: proxy, delay: 0 },
          { address: vault, delay: 0 },
        ],
      },
      {
        type: 'configure',
        path: [
          { address: actorA, delay: 0 },
          { address: vault, delay: 0 },
        ],
      },
    ])
  })

  it('single actor, two contracts, proxy and act', () => {
    const actor = EthereumAddress.random()
    const proxy = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const input: GrantedPermission[] = [
      {
        type: 'upgrade',
        path: [
          { address: vault, delay: 0 },
          { address: proxy, delay: 0 },
          { address: actor, delay: 0 },
        ],
      },
    ]

    expect(invertGrantedPermissions(input)).toEqual([
      {
        type: 'upgrade',
        path: [
          { address: actor, delay: 0 },
          { address: proxy, delay: 0 },
          { address: vault, delay: 0 },
        ],
      },
    ])
  })

  it('single actor, single contract, proxy', () => {
    const actor = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const input: GrantedPermission[] = [
      {
        type: 'upgrade',
        path: [
          { address: vault, delay: 0 },
          { address: actor, delay: 0 },
        ],
      },
    ]

    expect(invertGrantedPermissions(input)).toEqual([
      {
        type: 'upgrade',
        path: [
          { address: actor, delay: 0 },
          { address: vault, delay: 0 },
        ],
      },
    ])
  })

  it('single actor, single contract, no proxy', () => {
    const actor = EthereumAddress.random()
    const vault = EthereumAddress.random()

    const input: GrantedPermission[] = [
      {
        type: 'configure',
        path: [
          { address: vault, delay: 0 },
          { address: actor, delay: 0 },
        ],
      },
    ]

    expect(invertGrantedPermissions(input)).toEqual([
      {
        type: 'configure',
        path: [
          { address: actor, delay: 0 },
          { address: vault, delay: 0 },
        ],
      },
    ])
  })

  it('empty graph returns an empty result', () => {
    const input: GrantedPermission[] = []
    expect(invertGrantedPermissions(input)).toEqual([])
  })
})
