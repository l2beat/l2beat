import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { DA_BRIDGES, DA_LAYERS } from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'
import type { Layer2 } from './types'

const discovery = new ProjectDiscovery('mantle')

const committeeMembers = discovery.getContractValue<number>(
  'BLSRegistry',
  'numOperators',
)

const threshold =
  discovery.getContractValue<number>(
    'DataLayrServiceManager',
    'quorumThresholdBasisPoints',
  ) / 1000 // Quorum threshold is in basis points, but stake is equal for all members (100k MNT)

export const mantle: Layer2 = opStackL2({
  createdAt: new UnixTime(1680782525), // 2023-04-06T12:02:05Z
  additionalBadges: [Badge.DA.CustomDA],
  daProvider: {
    layer: DA_LAYERS.MANTLE_DA,
    bridge: DA_BRIDGES.STAKED_OPERATORS({
      requiredSignatures: threshold,
      membersCount: committeeMembers,
    }),
    riskView: {
      value: 'External',
      description:
        'Proof construction and state derivation rely fully on data that is NOT published on chain. Mantle DA contracts are forked from EigenDA with significant modifications, most importantly removal of slashing conditions. DA fraud proof mechanism is not live yet.',
      sentiment: 'bad',
    },
    technology: {
      name: 'Data is not stored on chain',
      description:
        'The transaction data is not recorded on the Ethereum main chain. The sequencer posts the transactions data batch root, and then propagates the data to off-chain permissioned nodes to sign. It subsequently posts the nodes signatures on chain to verify they belong to the specified members of the quorum, and that the minimum stake threshold is met.',
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the external data becomes unavailable.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'DataLayrServiceManager.sol#L389 - Etherscan source code, confirmDataStore function',
          href: 'https://etherscan.io/address/0xab42127980a3bff124e6465e097a5fc97228827e#code#F1#L389',
        },
        {
          text: 'DataLayrServiceManager.sol#L404 - Etherscan source code, signature verification check ',
          href: 'https://etherscan.io/address/0xab42127980a3bff124e6465e097a5fc97228827e#code#F1#L404',
        },
      ],
    },
  },
  associatedTokens: ['MNT'],
  nonTemplateExcludedTokens: ['SolvBTC', 'SolvBTC.BBN', 'FBTC'],
  discovery,
  display: {
    reasonsForBeingOther: [
      REASON_FOR_BEING_OTHER.NO_PROOFS,
      REASON_FOR_BEING_OTHER.SMALL_DAC,
    ],
    name: 'Mantle',
    slug: 'mantle',
    architectureImage: 'mantle',
    description:
      'Mantle is an under development EVM compatible Optimium, based on the OP Stack.',
    links: {
      websites: ['https://mantle.xyz/'],
      apps: ['https://bridge.mantle.xyz'],
      documentation: ['https://docs-v2.mantle.xyz/'],
      explorers: ['https://explorer.mantle.xyz/', 'https://mantlescan.info'],
      repositories: ['https://github.com/mantlenetworkio'],
      socialMedia: [
        'https://discord.gg/0xMantle',
        'https://twitter.com/0xMantle',
        'https://medium.com/0xmantle',
        'https://t.me/mantlenetwork',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://rpc.mantle.xyz',
  genesisTimestamp: new UnixTime(1688428800),
  chainConfig: {
    name: 'mantle',
    chainId: 5000,
    explorerUrl: 'https://explorer.mantle.xyz/',
    explorerApi: {
      url: 'https://api.routescan.io/v2/network/mainnet/evm/5000/etherscan/api',
      type: 'etherscan',
    },
    minTimestampForTvl: new UnixTime(1688314886),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 304717,
        version: '3',
      },
    ],
    coingeckoPlatform: 'mantle',
  },
  discoveryDrivenData: true,
  milestones: [
    {
      name: 'Mainnet launch',
      link: 'https://www.mantle.xyz/blog/announcements/mantle-network-mainnet-alpha',
      date: '2023-07-14T00:00:00.00Z',
      description: 'Mantle is live on mainnet.',
      type: 'general',
    },
    {
      name: 'Mainnet v2 Tectonic Upgrade',
      link: 'https://www.mantle.xyz/blog/announcements/mantle-completes-mainnet-v2-tectonic-upgrade',
      date: '2024-03-15T00:00:00.00Z',
      description: 'Mantle completes Mainnet v2 Tectonic Upgrade.',
      type: 'general',
    },
    {
      name: 'MNT token migration begins',
      link: 'https://www.mantle.xyz/blog/announcements/bit-to-mnt-user-guide',
      date: '2023-07-11T00:00:00.00Z',
      description: 'User can exchange their BIT tokens to MNT tokens.',
      type: 'general',
    },
  ],
  nonTemplateOptimismPortalEscrowTokens: ['MNT'],
})
