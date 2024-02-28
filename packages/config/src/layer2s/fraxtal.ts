import { EthereumAddress, formatSeconds, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { HARDCODED } from '../discovery/values/hardcoded'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from './common/liveness'
import { opStack } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('fraxtal')

const FINALIZATION_PERIOD_SECONDS = discovery.getContractValue<number>(
  'L2OutputOracle',
  'FINALIZATION_PERIOD_SECONDS',
)

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

export const fraxtal: Layer2 = opStack({
  discovery,
  display: {
    name: 'Fraxtal',
    slug: 'fraxtal',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description:
      'Fraxtal is an EVM equivalent rollup utilizing the OP stack as its smart contract platform and execution environment.',
    purposes: ['Universal', 'DeFi'],
    links: {
      websites: ['https://frax.com/'],
      apps: ['https://app.frax.finance/'],
      documentation: ['https://docs.frax.com/'],
      explorers: ['https://fraxscan.com/'],
      repositories: ['https://github.com/FraxFinance'],
      socialMedia: [
        'https://discord.com/invite/UJVtDTFRaA',
        'https://twitter.com/fraxfinance',
        'https://t.me/fraxfinance',
      ],
    },
    activityDataSource: 'Blockchain RPC',
    liveness: {
      warnings: {
        stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
      },
      explanation: `Fraxtal is an Optimistic rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted within a tx batch on L1 that links to a previous finalized batch. If the previous batch is missing, transaction finalization can be delayed up to ${formatSeconds(
        HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
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
    '0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2',
  ),
  rpcUrl: 'https://rpc.frax.com',
  finality: {
    type: 'OPStack',
    lag: 0,
  },
  genesisTimestamp: new UnixTime(1706811599),
  l2OutputOracle: discovery.getContract('L2OutputOracle'),
  portal: discovery.getContract('OptimismPortal'),
  isNodeAvailable: true,
  milestones: [],
  knowledgeNuggets: [],
  roleOverrides: {
    batcherHash: 'Sequencer',
    PROPOSER: 'Proposer',
    GUARDIAN: 'Guardian',
    CHALLENGER: 'Challenger',
  },
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'FraxtalMultisig',
      'This address is the owner of the following contracts: ProxyAdmin, SystemConfig. It is also designated as a Guardian of the FraxchainPortal, meaning it can halt withdrawals. It can upgrade the bridge implementation potentially gaining access to all funds, and change the sequencer, state root proposer or any other system component (unlimited upgrade power). This address is also the permissioned challenger of the system. It can delete non finalized roots without going through the fault proof process.',
    ),
    ...discovery.getMultisigPermission(
      'frxETHMultisig',
      'This address is the owner of the gas token contract frxETH, and the frxETHMinter contract. It can pause and unpause ETH deposits, and change how much ETH is withheld from each submit() transaction.',
    ),
    ...discovery.getMultisigPermission(
      'TimelockMultisig',
      'This address is the owner of the timelock smart contract. It can queue, cancel, and execute transactions in the timelock (e.g., adding and removing frxETH whitelisted minters).',
    ),
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('L1ERC721Bridge', {
      description:
        'The L1ERC721Bridge contract is the main entry point to deposit ERC721 tokens from L1 to L2.',
      ...upgradeability,
    }),
    discovery.getContractDetails('frxETH', {
      description:
        'Fraxtal uses Frax Ether (frxETH) as the designated gas token, allowing users to utilize frxETH to pay for blockspace.',
      ...upgradeability,
    }),
    discovery.getContractDetails('frxETHMinter', {
      description:
        'Authorized minter contract for frxETH, accepts user-supplied ETH and converts it to frxETH.',
      ...upgradeability,
    }),
    discovery.getContractDetails('sfrxETH', {
      description:
        'Vault token contract (ERC-4626) for staked frxETH. The smart contract receives frxETH tokens and mints sfrxETH tokens.',
      ...upgradeability,
    }),
    discovery.getContractDetails('Timelock', {
      description:
        'Allows for time-delayed execution of transactions in the FrxETH smart contract, such as adding and removing whitelisted minters.',
      ...upgradeability,
    }),
  ],
  nonTemplateEscrows: [],
})
