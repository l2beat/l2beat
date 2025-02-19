import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { CONTRACTS } from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer3 } from '../../types'
import { Badge } from '../badges'
import { AnytrustDAC } from '../da-beat/templates/anytrust-template'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'

const discovery = new ProjectDiscovery('degen', 'base')

export const degen: Layer3 = orbitStackL3({
  addedAt: new UnixTime(1712135735), // 2024-04-03T09:15:35Z
  discovery,
  additionalBadges: [
    Badge.DA.DAC,
    Badge.L3ParentChain.Base,
    Badge.RaaS.Alchemy,
  ],
  additionalPurposes: ['Social'],
  gasTokens: ['DEGEN'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'Degen Chain',
    slug: 'degen',
    description:
      'Degen Chain is an ultra-low-cost L3 for the Degen community built with Arbitrum Orbit, Base for settlement, and AnyTrust for data availability. DEGEN is the native gas token.',
    links: {
      websites: ['https://syndicate.io/blog/degen-chain'],
      apps: ['https://bridge.degen.tips/', 'https://degen.tips/'],
      documentation: ['https://docs.syndicate.io/get-started/introduction'],
      explorers: ['https://explorer.degen.tips/'],
      socialMedia: [
        'https://twitter.com/degentokenbase',
        'https://warpcast.com/~/channel/degen',
      ],
    },
  },
  blockNumberOpcodeTimeSeconds: 2, // block.number opcode on Base (Degen host chain) counts Base L2 block numbers that have 2 seconds block time (different to OP stack host chains that count the L1 blocks)
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://rpc.degen.tips',
    defaultCallsPerMinute: 5000,
    adjustCount: { type: 'SubtractOne' },
    startBlock: 1,
  },
  chainConfig: {
    name: 'degen',
    chainId: 666666666,
    explorerUrl: 'https://explorer.degen.tips',
    explorerApi: {
      url: 'https://explorer.degen.tips/api',
      type: 'blockscout',
    },
    minTimestampForTvl: new UnixTime(1710087539),
    multicallContracts: [
      {
        address: EthereumAddress('0x79035Dc4436bA9C95016D3bF6304e5bA78B1066A'),
        batchSize: 150,
        sinceBlock: 2279171,
        version: '3',
      },
    ],
  },
  bridge: discovery.getContract('ERC20Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  nonTemplateContractRisks: [
    {
      category: 'Funds can be stolen if',
      text: 'the security stack of the whitelisted LayerZero adapter changes or is compromised.',
      isCritical: true,
    },
    CONTRACTS.UPGRADE_NO_DELAY_RISK,
  ],
  associatedTokens: ['DEGEN'],
  milestones: [
    {
      title: 'Degen Chain halts for two days',
      date: '2024-05-13T00:00:00Z',
      url: 'https://x.com/degentokenbase/status/1789944238731297188',
      description:
        'Degen Chain halts for two days due to a chain misconfiguration.',
      type: 'incident',
    },
  ],
  customDa: AnytrustDAC({ discovery }),
})
