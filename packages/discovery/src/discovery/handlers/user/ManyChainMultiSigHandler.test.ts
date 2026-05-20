import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import type { IProvider } from '../../provider/IProvider'
import { ManyChainMultiSigHandler } from './ManyChainMultiSigHandler'

describe(ManyChainMultiSigHandler.name, () => {
  function rightPad32(values: number[]): number[] {
    const out = [...values]
    while (out.length < 32) out.push(0)
    return out
  }

  function addr(short: string): string {
    return EthereumAddress(short).toString()
  }

  function makeProvider(config: {
    signers: { addr: string; index: number; group: number }[]
    groupQuorums: number[]
    groupParents: number[]
  }) {
    return mockObject<IProvider>({
      chain: 'ethereum',
      callMethod: async () => config as never,
    })
  }

  it('returns root-only summary when there are no sub-groups', async () => {
    const a = addr('0x0000000000000000000000000000000000000001')
    const b = addr('0x0000000000000000000000000000000000000002')

    const provider = makeProvider({
      signers: [
        { addr: a, index: 0, group: 0 },
        { addr: b, index: 1, group: 0 },
      ],
      groupQuorums: rightPad32([2]),
      groupParents: rightPad32([0]),
    })

    const handler = new ManyChainMultiSigHandler('mcms', {
      type: 'manyChainMultiSig',
    })

    const result = await handler.execute(
      provider,
      ChainSpecificAddress.random(),
    )

    expect(result.value).toEqual({
      summary: 'Root: 2-of-2, signers=2',
      summaryRoot: 'Root: 2-of-2, signers=2',
      summaryGroups: '',
      rootQuorum: 2,
      minSigs: 2,
      allMembers: [
        ChainSpecificAddress.fromLong('ethereum', a).toString(),
        ChainSpecificAddress.fromLong('ethereum', b).toString(),
      ],
      signerGroups: {
        root: {
          quorum: 2,
          parent: 0,
          childGroups: [],
          members: [
            ChainSpecificAddress.fromLong('ethereum', a).toString(),
            ChainSpecificAddress.fromLong('ethereum', b).toString(),
          ],
        },
      },
    })
  })

  it('decodes a 2-of-4 tree where each child group is 2-of-N', async () => {
    const g1a = addr('0x000000000000000000000000000000000000A001')
    const g1b = addr('0x000000000000000000000000000000000000A002')
    const g2a = addr('0x000000000000000000000000000000000000B001')
    const g2b = addr('0x000000000000000000000000000000000000B002')
    const g3a = addr('0x000000000000000000000000000000000000C001')
    const g3b = addr('0x000000000000000000000000000000000000C002')
    const g4a = addr('0x000000000000000000000000000000000000D001')
    const g4b = addr('0x000000000000000000000000000000000000D002')

    const signers = [
      { addr: g1a, index: 0, group: 1 },
      { addr: g1b, index: 1, group: 1 },
      { addr: g2a, index: 2, group: 2 },
      { addr: g2b, index: 3, group: 2 },
      { addr: g3a, index: 4, group: 3 },
      { addr: g3b, index: 5, group: 3 },
      { addr: g4a, index: 6, group: 4 },
      { addr: g4b, index: 7, group: 4 },
    ]
    const provider = makeProvider({
      signers,
      groupQuorums: rightPad32([2, 2, 2, 2, 2]),
      groupParents: rightPad32([0, 0, 0, 0, 0]),
    })

    const handler = new ManyChainMultiSigHandler('mcms', {
      type: 'manyChainMultiSig',
    })
    const result = await handler.execute(
      provider,
      ChainSpecificAddress.random(),
    )

    const v = result.value as {
      summary: string
      rootQuorum: number
      signerGroups: Record<
        string,
        {
          quorum: number
          parent: number
          childGroups: number[]
          members: string[]
        }
      >
    }

    expect(v.summary).toEqual(
      'Root: 2-of-4, childGroups=(1,2,3,4) | Group 1: 2-of-2, parent=0, signers=2 | Group 2: 2-of-2, parent=0, signers=2 | Group 3: 2-of-2, parent=0, signers=2 | Group 4: 2-of-2, parent=0, signers=2',
    )
    expect(v.rootQuorum).toEqual(2)
    expect(Object.keys(v.signerGroups)).toEqual([
      'root',
      'group1',
      'group2',
      'group3',
      'group4',
    ])
    expect(v.signerGroups['root']).toEqual({
      quorum: 2,
      parent: 0,
      childGroups: [1, 2, 3, 4],
      members: [],
    })
    expect(v.signerGroups['group1']?.members.length).toEqual(2)
    // minSigs: root picks 2 cheapest of 4 child groups; each child group needs
    // 2 of 2 sigs → cheapest two cost 2 each → total = 4.
    const v2 = result.value as { minSigs: number; allMembers: string[] }
    expect(v2.minSigs).toEqual(4)
    expect(v2.allMembers.length).toEqual(8)
  })

  it('drops disabled groups (quorum=0) and ignores padding', async () => {
    const a = addr('0x0000000000000000000000000000000000000001')
    const provider = makeProvider({
      signers: [{ addr: a, index: 0, group: 0 }],
      // group 0 active, group 1 disabled, the rest is padding
      groupQuorums: rightPad32([1, 0]),
      groupParents: rightPad32([0, 0]),
    })

    const handler = new ManyChainMultiSigHandler('mcms', {
      type: 'manyChainMultiSig',
    })
    const result = await handler.execute(
      provider,
      ChainSpecificAddress.random(),
    )

    const v = result.value as { signerGroups: Record<string, unknown> }
    expect(Object.keys(v.signerGroups)).toEqual(['root'])
  })

  it('renders a two-level tree with mixed signer and sub-group children', async () => {
    const direct = addr('0x0000000000000000000000000000000000000001')
    const leaf2a = addr('0x0000000000000000000000000000000000000020')
    const leaf2b = addr('0x0000000000000000000000000000000000000021')

    const provider = makeProvider({
      signers: [
        { addr: direct, index: 0, group: 0 },
        { addr: leaf2a, index: 1, group: 2 },
        { addr: leaf2b, index: 2, group: 2 },
      ],
      // root requires 2 of {direct signer, group 2 success}; group 2 is 1-of-2
      groupQuorums: rightPad32([2, 0, 1]),
      groupParents: rightPad32([0, 0, 0]),
    })

    const handler = new ManyChainMultiSigHandler('mcms', {
      type: 'manyChainMultiSig',
    })
    const result = await handler.execute(
      provider,
      ChainSpecificAddress.random(),
    )

    const v = result.value as {
      summary: string
      signerGroups: Record<
        string,
        { quorum: number; childGroups: number[]; members: string[] }
      >
    }
    expect(v.summary).toEqual(
      'Root: 2-of-2, childGroups=(2), signers=1 | Group 2: 1-of-2, parent=0, signers=2',
    )
    expect(v.signerGroups['root']?.childGroups).toEqual([2])
    expect(v.signerGroups['root']?.members.length).toEqual(1)
  })

  it('passes ignoreRelative through to the result', async () => {
    const a = addr('0x0000000000000000000000000000000000000001')
    const provider = makeProvider({
      signers: [{ addr: a, index: 0, group: 0 }],
      groupQuorums: rightPad32([1]),
      groupParents: rightPad32([0]),
    })

    const handler = new ManyChainMultiSigHandler('mcms', {
      type: 'manyChainMultiSig',
      ignoreRelative: true,
    })
    const result = await handler.execute(
      provider,
      ChainSpecificAddress.random(),
    )
    expect(result.ignoreRelative).toEqual(true)
  })
})
