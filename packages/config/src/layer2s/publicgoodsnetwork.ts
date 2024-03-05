import { EthereumAddress, formatSeconds, UnixTime } from '@l2beat/shared-pure'

import { DERIVATION } from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { HARDCODED } from '../discovery/values/hardcoded'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from './common/liveness'
import { CELESTIA_DA_PROVIDER, opStack } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('publicgoodsnetwork')

const FINALIZATION_PERIOD_SECONDS = discovery.getContractValue<number>(
  'L2OutputOracle',
  'FINALIZATION_PERIOD_SECONDS',
)

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

export const publicgoodsnetwork: Layer2 = opStack({
  daProvider: CELESTIA_DA_PROVIDER,
  discovery,
  display: {
    name: 'Public Goods Network',
    shortName: 'PGN',
    slug: 'publicgoodsnetwork',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description:
      'Public Goods Network is an OP stack chain focused on funding public goods.',
    purposes: ['Universal'],
    links: {
      websites: ['https://publicgoods.network/'],
      apps: ['https://bridge.publicgoods.network/'],
      documentation: ['https://docs.publicgoods.network/'],
      explorers: [
        'https://explorer.publicgoods.network',
        'https://pgn.superscan.network',
      ],
      repositories: [
        'https://github.com/supermodularxyz/pgn-monorepo',
        'https://github.com/supermodularxyz/pgn-docs',
      ],
      socialMedia: ['https://twitter.com/pgn_eth'],
    },
    activityDataSource: 'Blockchain RPC',
    liveness: {
      warnings: {
        stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
      },
      explanation: `Public Goods Network is an Optimistic rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted within a tx batch on L1 that links to a previous finalized batch. If the previous batch is missing, transaction finalization can be delayed up to ${formatSeconds(
        HARDCODED.PUBLICGOODSNETWORK.SEQUENCING_WINDOW_SECONDS,
      )} or until it gets published. The state root gets finalized ${formatSeconds(
        FINALIZATION_PERIOD_SECONDS,
      )} after it has been posted.`,
    },
    finality: {
      finalizationPeriod: FINALIZATION_PERIOD_SECONDS,
    },
  },
  upgradeability,
  l1StandardBridgeEscrow: EthereumAddress(
    '0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b',
  ),
  rpcUrl: 'https://rpc.publicgoods.network',
  finality: {
    type: 'OPStack',
    lag: 0,
  },
  genesisTimestamp: new UnixTime(1689108083),
  l2OutputOracle: discovery.getContract('L2OutputOracle'),
  portal: discovery.getContract('OptimismPortal'),
  stateDerivation: DERIVATION.OPSTACK('PGN'),
  isNodeAvailable: true,
  milestones: [
    {
      name: 'Public Goods Network Launch',
      link: 'https://twitter.com/pgn_eth/status/1676972199423668228',
      date: '2023-07-06T00:00:00.00Z',
      description: 'The Public Goods Network is live on mainnet.',
    },
    {
      name: 'PGN switches to Celestia',
      link: 'https://x.com/conduitxyz/status/1750596065609572398',
      date: '2024-01-26T00:00:00.00Z',
    },
  ],
  knowledgeNuggets: [],
  roleOverrides: {
    batcherHash: 'Sequencer',
    PROPOSER: 'Proposer',
    GUARDIAN: 'Guardian',
    CHALLENGER: 'Challenger',
  },
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'PGNMultisig',
      'This address is the owner of the following contracts: SystemConfig, ProxyAdmin. It can upgrade the bridge implementation potentially gaining access to all funds, and change the sequencer, state root proposer or any other system component (unlimited upgrade power).',
    ),
    ...discovery.getMultisigPermission(
      'GuardianMultisig',
      'This address is the permissioned challenger of the system. It can delete non finalized roots without going through the fault proof process. It is also designated as a Guardian of the OptimismPortal, meaning it can halt withdrawals.',
    ),
  ],
  nonTemplateEscrows: [],
})
