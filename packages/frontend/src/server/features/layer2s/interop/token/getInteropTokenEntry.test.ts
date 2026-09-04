import { Address32, assert } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getInteropTokenEntry } from './getInteropTokenEntry'
import type { InteropTokenOnchainDeployment } from './getInteropTokenOnchainDeployments'
import type { InteropTokenRelations } from './getInteropTokenRelations'

const NO_RELATIONS: InteropTokenRelations = {
  routes: [],
  pairStats: undefined,
}

describe(getInteropTokenEntry.name, () => {
  it('takes deployment stats from the pair stats', () => {
    const ethereum = deployment({ chain: 'ethereum', address: '0xe1' })
    const base = deployment({ chain: 'base', address: '0xb1' })
    const unsupported = deployment({
      chain: 'solana',
      address: 'So11111111111111111111111111111111111111112',
      isSupported: false,
    })
    const entry = getInteropTokenEntry(
      'circle-usdc',
      [],
      [],
      [],
      [unsupported, ethereum, base],
      {
        routes: [],
        pairStats: [
          {
            src: { chain: 'ethereum', address: Address32.from('0xe1') },
            dst: { chain: 'base', address: Address32.from('0xb1') },
            transferCount: 2,
            transfersWithDurationCount: 1,
            totalDurationSum: 30,
            volume: 100,
          },
          {
            src: { chain: 'base', address: Address32.from('0xb1') },
            transferCount: 1,
            transfersWithDurationCount: 1,
            totalDurationSum: 10,
            volume: 50,
          },
        ],
      },
    )

    const section = entry.sections.find(
      (section) => section.type === 'InteropTokenOnchainDeploymentsSection',
    )
    assert(section?.type === 'InteropTokenOnchainDeploymentsSection')
    expect(
      section.props.deployments.map((row) => [
        row.chain.name,
        row.volume,
        row.transferCount,
        row.avgDuration,
      ]),
    ).toEqualUnsorted([
      ['base', 150, 3, 20],
      ['ethereum', 100, 2, 30],
      ['solana', null, null, null],
    ])
  })

  it('includes the relations graph only when a relation exists', () => {
    const deployments = [
      deployment({ chain: 'ethereum', address: '0xe1' }),
      deployment({ chain: 'arbitrum', address: '0xa1' }),
    ]
    const section = (relations: InteropTokenRelations) => {
      const found = getInteropTokenEntry(
        'usdc',
        [],
        [],
        [],
        deployments,
        relations,
      ).sections.find((s) => s.type === 'InteropTokenOnchainDeploymentsSection')
      assert(found?.type === 'InteropTokenOnchainDeploymentsSection')
      return found.props.relationsGraph
    }

    expect(section(NO_RELATIONS)).toEqual(undefined)
    expect(
      section({
        routes: [
          {
            tokenAChain: 'arbitrum',
            tokenAAddress: '0xa1',
            tokenBChain: 'ethereum',
            tokenBAddress: '0xe1',
            plugin: 'cctp-v2',
            bridgeType: 'burnAndMint',
            lockedToken: null,
          },
        ],
        pairStats: undefined,
      })?.nodes.map((node) => node.deployments.length),
    ).toEqual([2])
  })
})

function deployment(
  override: Partial<InteropTokenOnchainDeployment> = {},
): InteropTokenOnchainDeployment {
  return {
    chain: 'base',
    address: '0x1234',
    symbol: 'USDC',
    mintingPlugins: [],
    isSupported: true,
    ...override,
  }
}
