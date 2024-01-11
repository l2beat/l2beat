import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('aztec')

const upgradeDelay = 0
const escapeBlockLowerBound = discovery.getContractValue<number>(
  'RollupProcessor',
  'escapeBlockLowerBound',
)

function getRollupProviders() {
  // not getting this from the discovery, because it's the deployer
  // https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L88
  const deployer = '0xFcF75295f242C4E87203Abb5d7C9BbEda90a8895'
  const removedProviders = discovery.getContractValue<string[]>(
    'RollupProcessor',
    'removedRollupProviders',
  )

  const providers = discovery.getContractValue<string[]>(
    'RollupProcessor',
    'removedRollupProviders',
  )

  if (removedProviders.includes(deployer)) {
    return providers
  }

  return [...providers, deployer]
}

export const aztecV1: Layer2 = {
  isArchived: true,
  type: 'layer2',
  id: ProjectId('aztec'),
  display: {
    name: 'Zk.Money v1 (Aztec v1)',
    slug: 'aztecv1',
    warning:
      'EOL: Aztec team announced the intent to shut down the infrastructure for this rollup on Mar 13, 2023. The rollup is still active due to funds locked in, but is not accepting deposits.',
    description:
      'Aztec Connect is an open source layer 2 network that aims to enable affordable, private crypto payments via zero-knowledge proofs.',
    purposes: ['Private payments'],
    category: 'ZK Rollup',
    dataAvailabilityMode: 'StateDiffs',

    links: {
      websites: ['https://aztec.network/'],
      apps: ['https://old.zk.money'],
      documentation: ['https://developers.aztec.network/'],
      explorers: ['https://explorer.aztec.network/'],
      repositories: ['https://github.com/AztecProtocol/aztec-2-bug-bounty'],
      socialMedia: [
        'https://twitter.com/aztecnetwork',
        'https://medium.com/aztec-protocol',
        'https://t.me/aztecprotocol',
        'https://discord.gg/UDtJr9u',
        'https://plonk.cafe/',
      ],
    },
    activityDataSource: 'Explorer API',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba'),
        sinceTimestamp: new UnixTime(1614799636),
        tokens: ['ETH', 'DAI', 'renBTC', 'USDT'],
      },
    ],
    transactionApi: {
      type: 'aztec',
      url: 'https://api.aztec.network/falafel-mainnet',
      callsPerMinute: 3_000,
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN,
      sources: [
        {
          contract: 'RollupProcessor',
          references: [
            'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L395',
          ],
        },
        {
          contract: 'TurboVerifier',
          references: [
            'https://etherscan.io/address/0xd3a6D9De4cbC2CC7529361941e85b1c3269CcBb1#code#F1#L37',
          ],
        },
      ],
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      sources: [
        {
          contract: 'RollupProcessor',
          references: [
            'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L359',
          ],
        },
      ],
    },
    exitWindow: {
      ...RISK_VIEW.EXIT_WINDOW(upgradeDelay, escapeBlockLowerBound),
      description: '1/2 MSig can change Validator.',
      sources: [
        {
          contract: 'RollupProcessor',
          references: [
            'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L101',
          ],
        },
      ],
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE_ZK(),
      sources: [
        {
          contract: 'RollupProcessor',
          references: [
            'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L347',
            'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L168',
          ],
        },
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_SELF_PROPOSE_ZK,
      sources: [
        {
          contract: 'RollupProcessor',
          references: [
            'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L347',
            'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L168',
          ],
        },
      ],
    },
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
  }),
  stateDerivation: {
    nodeSoftware:
      'There are two ways to run a node and use the escape hatch: by running [falafel](https://github.com/AztecProtocol/aztec-2.0/tree/master/falafel), or by running the [SDK](https://developers.aztec.network/#/A%20Private%20Layer%202/zkAssets/emergencyWithdraw) in escape hatch mode and connecting to an [escape hatch server](https://github.com/AztecProtocol/aztec-v2-escape-hatch-server).',
    compressionScheme: 'No compression scheme is used.',
    genesisState: 'No genesis state is used.',
    dataFormat:
      'The data format used can be found [here](https://github.com/AztecProtocol/aztec-2.0/blob/master/blockchain/contracts/Decoder.sol)',
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: null,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: null,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: null,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink:
        'https://developers.aztec.network/#/A%20Private%20Layer%202/zkAssets/emergencyWithdraw',
    },
  ),
  technology: {
    stateCorrectness: {
      ...STATE_CORRECTNESS.VALIDITY_PROOFS,
      references: [
        {
          text: 'RollupProcessor.sol#L395 - Etherscan source code',
          href: 'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L395',
        },
      ],
    },
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
      references: [
        {
          text: 'TurboVerifier.sol#L37 - Etherscan source code',
          href: 'https://etherscan.io/address/0xd3a6D9De4cbC2CC7529361941e85b1c3269CcBb1#code#F1#L37',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN,
      references: [
        {
          text: 'RollupProcessor.sol#L359 - Etherscan source code',
          href: 'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L359',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      description:
        'Only specific addresses appointed by the owner are permitted to propose new blocks during regular rollup operation. Periodically a special window is open during which anyone can propose new blocks.',
      references: [
        {
          text: 'RollupProcessor.sol#L97 - Etherscan source code',
          href: 'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L97',
        },
        {
          text: 'RollupProcessor.sol#L369 - Etherscan source code',
          href: 'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L369',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.PROPOSE_OWN_BLOCKS,
      description:
        FORCE_TRANSACTIONS.PROPOSE_OWN_BLOCKS.description +
        ' Periodically the rollup opens a special window during which anyone can propose new blocks.',
      references: [
        {
          text: 'RollupProcessor.sol#L347 - Etherscan source code',
          href: 'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L347',
        },
        {
          text: 'RollupProcessor.sol#L168 - Etherscan source code',
          href: 'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L168',
        },
      ],
    },
    exitMechanisms: [
      {
        name: 'Regular withdraw',
        description:
          'The user initiates the withdrawal by submitting a transaction on L2. When the block containing that transaction is proven on L1 the assets are automatically withdrawn to the user.',
        risks: [],
        references: [
          {
            text: 'RollupProcessor.sol#LL396 - Etherscan source code',
            href: 'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L396',
          },
        ],
      },
    ],
    additionalPrivacy: {
      name: 'Payments are private',
      description:
        'Balances and identities for all tokens on the Aztec rollup are encrypted. Each transaction is encoded as a zkSNARK, protecting user data.',
      risks: [],
      references: [
        {
          text: 'Fast Privacy, Now - Aztec Medium Blog',
          href: 'https://medium.com/aztec-protocol/aztec-zkrollup-layer-2-privacy-1978e90ee3b6#3b25',
        },
      ],
    },
  },
  contracts: {
    addresses: [
      discovery.getContractDetails(
        'RollupProcessor',
        'Main Rollup contract responsible for deposits, withdrawals and accepting transaction batches alongside a ZK proof.',
      ),
      discovery.getContractDetails(
        'AztecFeeDistributor',
        'Contract responsible for distributing fees and reimbursing gas to Rollup Providers.',
      ),
      discovery.getContractDetails('TurboVerifier', {
        description: 'Turbo Plonk zkSNARK Verifier.',
        upgradableBy: ['Aztec Multisig'],
        upgradeDelay: 'No delay',
        upgradeConsiderations:
          'Verifier field in RollupProcessor can be changed with no delay.',
      }),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'Aztec Multisig',
      'Owner of RollupProcessor and AztecFeeDistributor contracts. Can add or delete rollup providers. Can change the verifier contract.',
    ),
    {
      name: 'Rollup Providers',
      description:
        'Addresses that can propose new blocks during regular rollup operation.',
      accounts: getRollupProviders().map((account) =>
        discovery.formatPermissionedAccount(account),
      ),
    },
  ],
  milestones: [
    {
      name: 'Aztec 2.0',
      date: '2021-03-15T00:00:00Z',
      link: 'https://medium.com/aztec-protocol/launching-aztec-2-0-rollup-ac7db8012f4b',
      description:
        'Private Rollup is live on mainnet, allowing user to access DeFi.',
    },
  ],
}
