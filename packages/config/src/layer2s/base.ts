import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { DERIVATION } from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { HARDCODED } from '../discovery/values/hardcoded'
import { formatSeconds } from '../utils/formatSeconds'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from './common/liveness'
import { opStack } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('base')

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

const challengePeriod: number = discovery.getContractValue<number>(
  'L2OutputOracle',
  'FINALIZATION_PERIOD_SECONDS',
)

export const base: Layer2 = opStack({
  discovery,
  display: {
    name: 'Base',
    slug: 'base',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description:
      'Base is an Optimistic Rollup that has been developed on the Ethereum network, utilizing OP Stack technology.',
    purposes: ['Universal'],
    links: {
      websites: ['https://base.org/'],
      apps: ['https://bridge.base.org/'],
      documentation: ['https://docs.base.org/', 'https://stack.optimism.io/'],
      explorers: [
        'https://basescan.org/',
        'https://base.superscan.network',
        'https://base.blockscout.com/',
        'https://base.l2scan.co/',
      ],
      repositories: ['https://github.com/base-org'],
      socialMedia: [
        'https://twitter.com/BuildOnBase',
        'https://discord.gg/buildonbase',
        'https://base.mirror.xyz/',
      ],
      rollupCodes: 'https://rollup.codes/base',
    },
    activityDataSource: 'Blockchain RPC',
    liveness: {
      warnings: {
        stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
      },
      explanation: `Base is an Optimistic rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted within a tx batch on L1 that links to a previous finalized batch. If the previous batch is missing, transaction finalization can be delayed up to ${formatSeconds(
        HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
      )} or until it gets published. The state root gets finalized ${formatSeconds(
        challengePeriod,
      )} after it has been posted.`,
    },
  },
  upgradeability,
  l1StandardBridgeEscrow: EthereumAddress(
    '0x3154Cf16ccdb4C6d922629664174b904d80F2C35',
  ),
  apiUrl: 'https://developer-access-mainnet.base.org',
  sequencerAddress: EthereumAddress(
    discovery.getContractValue('SystemConfig', 'batcherHash'),
  ),
  inboxAddress: EthereumAddress('0xFf00000000000000000000000000000000008453'),
  finality: {
    type: 'OPStack',
    lag: 0,
  },
  genesisTimestamp: new UnixTime(1686796655),
  l2OutputOracle: discovery.getContract('L2OutputOracle'),
  portal: discovery.getContract('OptimismPortal'),
  stateDerivation: DERIVATION.OPSTACK('BASE'),
  isNodeAvailable: true,
  milestones: [
    {
      name: 'Base Mainnet Launch',
      link: 'https://base.mirror.xyz/hwNwqXHVoLlO8s4DZppog4DfGvM34tigaDjOWuEJQfY',
      date: '2023-07-13T00:00:00.00Z',
      description: 'Base is live on mainnet.',
    },
  ],
  knowledgeNuggets: [],
  roleOverrides: {
    batcherHash: 'Sequencer',
    PROPOSER: 'Proposer',
    GUARDIAN: 'Guardian',
    CHALLENGER: 'Challenger',
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x9de443AdC5A411E83F1878Ef24C3F52C61571e72'),
      tokens: ['wstETH'],
      description:
        'wstETH Vault for custom wstETH Gateway. Fully controlled by Lido governance.',
    }),
  ],
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'AdminMultisig',
      'This address is the owner of the ProxyAdmin. It can upgrade the bridge implementation potentially gaining access to all funds.',
    ),
    ...discovery.getMultisigPermission(
      'GuardianMultisig',
      "Address designated as a Guardian of the OptimismPortal, meaning it can halt withdrawals. It's the owner of SystemConfig, which allows to update the sequencer address. Moreover, it can challenge state roots without going through the fault proof process.",
    ),
    ...discovery.getMultisigPermission(
      'BaseMultisig',
      "Core multisig of the Base team, it's a member of the AdminMultisig, meaning it can upgrade the bridge implementation potentially gaining access to all funds.",
    ),
    ...discovery.getMultisigPermission(
      'OptimismMultisig',
      "Core multisig of the Optimism team, it can challenge state roots without going through the fault proof process. It's also a member of the AdminMultisig, meaning it can upgrade the bridge implementation potentially gaining access to all funds.",
    ),
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('L1ERC721Bridge', {
      description:
        'The L1ERC721Bridge contract is the main entry point to deposit ERC721 tokens from L1 to L2.',
      ...upgradeability,
    }),
    discovery.getContractDetails('Challenger1of2', {
      description:
        "This contract is the permissioned challenger of the system. It can delete non finalized roots without going through the fault proof process. It is functionally equivalent to a 1/2 multisig where neither party can remove the other's permission to execute a Challenger call. It is controlled by the GuardianMultisig and the OptimismMultisig.",
    }),
  ],
  chainConfig: {
    devId: 'base',
    chainId: 8453,
    explorerUrl: 'https://basescan.org',
    explorerApi: {
      url: 'https://api.basescan.org/api',
      type: 'etherscan',
    },
    // ~ Timestamp of block number 0 on Base
    // https://basescan.org/block/0
    minTimestampForTvl: UnixTime.fromDate(new Date('2023-06-15T12:35:47Z')),
  },
})
