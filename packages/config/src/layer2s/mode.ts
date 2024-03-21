import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { DERIVATION } from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { opStack } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('mode')

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

const FINALIZATION_PERIOD_SECONDS: number = discovery.getContractValue<number>(
  'L2OutputOracle',
  'FINALIZATION_PERIOD_SECONDS',
)

export const mode: Layer2 = opStack({
  discovery,
  display: {
    name: 'Mode Network',
    slug: 'mode',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description:
      'Mode is an Optimistic Rollup based on the OP Stack. The L2 is focused on building new economic systems for financial applications to grow.',
    purposes: ['Universal'],
    links: {
      websites: ['https://mode.network/'],
      apps: [],
      documentation: ['https://docs.mode.network/'],
      explorers: ['https://modescan.io'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/modenetwork',
        'https://discord.gg/modenetworkofficial',
        'https://mode.mirror.xyz/',
        'https://t.me/ModeNetworkOfficial',
      ],
    },
    activityDataSource: 'Blockchain RPC',
    finality: {
      finalizationPeriod: FINALIZATION_PERIOD_SECONDS,
    },
  },
  associatedTokens: [],
  upgradeability,
  l1StandardBridgeEscrow: EthereumAddress(
    '0x735aDBbE72226BD52e818E7181953f42E3b0FF21',
  ),
  rpcUrl: 'https://mainnet.mode.network/',
  genesisTimestamp: new UnixTime(1700125343),

  l2OutputOracle: discovery.getContract('L2OutputOracle'),
  portal: discovery.getContract('OptimismPortal'),
  stateDerivation: DERIVATION.OPSTACK('MODE'),
  isNodeAvailable: true,
  milestones: [
    {
      name: 'Mode Network Mainnet Launch',
      link: 'https://twitter.com/modenetwork/status/1752760726907760933',
      date: '2024-01-31T00:00:00Z',
      description: 'Mode Network is live on mainnet.',
    },
  ],
  finality: {
    type: 'OPStack',
    lag: 0,
  },
  knowledgeNuggets: [],
  roleOverrides: {
    batcherHash: 'Sequencer',
    PROPOSER: 'Proposer',
    GUARDIAN: 'Guardian',
    CHALLENGER: 'Challenger',
  },
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'ModeMultisig',
      'This address is the owner of the following contracts: ProxyAdmin, SystemConfig. It is also designated as a Guardian of the OptimismPortal, meaning it can halt withdrawals. It can upgrade the bridge implementation potentially gaining access to all funds, and change the sequencer, state root proposer or any other system component (unlimited upgrade power).',
    ),
    ...discovery.getMultisigPermission(
      'ChallengerMultisig',
      'This address is the permissioned challenger of the system. It can delete non finalized roots without going through the fault proof process. It is also designated as the Guardian.',
    ),
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('L1ERC721Bridge', {
      description:
        'The L1ERC721Bridge contract is the main entry point to deposit ERC721 tokens from L1 to L2.',
      ...upgradeability,
    }),
  ],
  nonTemplateEscrows: [],
  chainConfig: {
    name: 'mode',
    chainId: 34443,
    explorerUrl: 'https://explorer.mode.network',
    explorerApi: {
      url: 'https://api.routescan.io/v2/network/mainnet/evm/34443/etherscan/api',
      type: 'etherscan',
    },
    // ~ Timestamp of block number 0 on Mode
    // The first full hour timestamp that will return the block number
    // https://explorer.mode.network/block/0
    minTimestampForTvl: UnixTime.fromDate(new Date('2023-11-16T22:46:23Z')),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 5022,
        version: '3',
      },
    ],
    coingeckoPlatform: 'mode',
  },
  usesBlobs: true,
})
