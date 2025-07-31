import {
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  FORCE_TRANSACTIONS,
  RISK_VIEW,
  SOA,
  STATE_VALIDATION,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('aztec')

function getRollupProviders() {
  // not getting this from the discovery, because it's the deployer
  // https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L88
  const deployer = 'eth:0xFcF75295f242C4E87203Abb5d7C9BbEda90a8895'
  const removedProviders = discovery.getContractValue<string[]>(
    'RollupProcessor',
    'removedRollupProviders',
  )

  const providers = discovery.getContractValue<string[]>(
    'RollupProcessor',
    'rollupProviders',
  )

  if (removedProviders.includes(deployer)) {
    return providers
  }

  return [...providers, deployer]
}

const escapeBlockUpperBound = 4800 // in blocks, immutable
const escapeBlockLowerBound = 4560 // in blocks, immutable
const assumedBlockTime = 12 // in seconds

export const aztec: ScalingProject = {
  type: 'layer2',
  id: ProjectId('aztec'),
  addedAt: UnixTime(1623153328), // 2021-06-08T11:55:28Z
  capability: 'appchain',
  display: {
    name: 'Zk.Money v1 (Aztec v1)',
    shortName: 'Zk.Money v1',
    slug: 'aztecv1',
    warning:
      'EOL: Ownership of the rollup contract is irrevocably renounced and Aztec is not running a rollup processor (operator). Users or third parties have to [run the rollup system by themselves](https://github.com/AztecProtocol/aztec-v2-ejector/) to withdraw or transact.',
    description:
      'Zk.Money v1 (Aztec v1, or sometimes called Aztec 2.0) is an open source layer 2 network that aims to enable affordable, private crypto payments via zero-knowledge proofs.',
    purposes: ['Payments', 'Privacy'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://aztec.network/'],
      bridges: ['https://old.zk.money'],
      repositories: ['https://github.com/AztecProtocol/aztec-2-bug-bounty'],
      socialMedia: [
        'https://twitter.com/aztecnetwork',
        'https://medium.com/aztec-protocol',
        'https://discord.gg/UDtJr9u',
        'https://plonk.cafe/',
      ],
    },
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba'),
        chain: 'ethereum',
        sinceTimestamp: UnixTime(1614799636),
        tokens: ['ETH', 'DAI', 'renBTC', 'USDT'],
      },
    ],
    trackedTxs: [
      {
        uses: [
          {
            type: 'liveness',
            subtype: 'stateUpdates',
          },
          {
            type: 'l2costs',
            subtype: 'stateUpdates',
          },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba',
          ),
          selector: '0x06011a46',
          functionSignature:
            'function processRollup(bytes proofData, bytes signatures, bytes viewingKeys, bytes providerSignature, address provider, address feeReceiver, uint256 feeLimit)',
          sinceTimestamp: UnixTime(1614799636),
        },
      },
      {
        uses: [
          {
            type: 'liveness',
            subtype: 'stateUpdates',
          },
          {
            type: 'l2costs',
            subtype: 'stateUpdates',
          },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba',
          ),
          selector: '0xd1c65264',
          functionSignature:
            'function escapeHatch(bytes proofData, bytes signatures, bytes viewingKeys)',
          sinceTimestamp: UnixTime(1614799636),
        },
      },
    ],
    liveness: {
      duplicateData: {
        from: 'stateUpdates',
        to: 'proofSubmissions',
      },
    },
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.STATE_DIFFS,
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_ZKP_SN,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW_NON_UPGRADABLE,
    sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE_ZK(),
    proposerFailure: RISK_VIEW.PROPOSER_SELF_PROPOSE_ZK,
  },
  stateDerivation: {
    nodeSoftware:
      'There are three ways to run a node and use the escape hatch: By running the [Aztec v2 Ejector](https://github.com/AztecProtocol/aztec-v2-ejector/) during the escape hatch window, 2) by running [falafel](https://github.com/AztecProtocol/aztec-2.0/tree/master/falafel), 3) by running the [SDK](https://developers.aztec.network/#/A%20Private%20Layer%202/zkAssets/emergencyWithdraw) in escape hatch mode and connecting to an [escape hatch server](https://github.com/AztecProtocol/aztec-v2-escape-hatch-server). The two latter methods are no longer recommended by the Aztec team.',
    compressionScheme: 'No compression scheme is used.',
    genesisState: 'No genesis state is used.',
    dataFormat:
      'The data format used can be found [here](https://github.com/AztecProtocol/aztec-2.0/blob/master/blockchain/contracts/Decoder.sol).',
  },
  scopeOfAssessment: {
    inScope: [SOA.l1Contracts, SOA.gasToken],
    notInScope: [
      SOA.specToSourceCode,
      SOA.nonGasTokens,
      SOA.derivationSpec,
      SOA.sourceCodeToVerificationKeys,
      SOA.trustedSetup,
    ],
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: null,
      },
      stage1: {
        principle: true,
        usersHave7DaysToExit: true,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: null,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: null,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: {
          satisfied: true,
          message:
            'Users can exit through the escape hatch mechanism and the rollup contract is immutable.',
          mode: 'replace',
        },
      },
    },
    {
      rollupNodeLink:
        'https://developers.aztec.network/#/A%20Private%20Layer%202/zkAssets/emergencyWithdraw',
      additionalConsiderations: {
        short:
          'Aztec v2 is a private rollup that allows users to transfer assets privately. Arbitrary smart contracts are not supported.',
        long: 'Aztec v2 is a private rollup that allows users to transfer assets privately. Arbitrary smart contracts are not supported.',
      },
    },
  ),
  stateValidation: {
    categories: [
      {
        ...STATE_VALIDATION.VALIDITY_PROOFS,
        references: [
          {
            title: 'RollupProcessor.sol#L395 - Etherscan source code',
            url: 'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L395',
          },
        ],
      },
    ],
  },
  technology: {
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CALLDATA,
      references: [
        {
          title: 'RollupProcessor.sol#L359 - Etherscan source code',
          url: 'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L359',
        },
      ],
    },
    operator: {
      name: 'No regular operators',
      risks: [],
      description:
        'Only specific addresses appointed by the owner are permitted to propose new blocks during regular rollup operations. Since EOL, these operators are not regularly processing the rollup anymore.',
      references: [
        {
          title: 'RollupProcessor.sol#L97 - Etherscan source code',
          url: 'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L97',
        },
        {
          title: 'RollupProcessor.sol#L369 - Etherscan source code',
          url: 'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L369',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.PROPOSE_OWN_BLOCKS,
      description:
        FORCE_TRANSACTIONS.PROPOSE_OWN_BLOCKS.description +
        `The private key of one of the permissioned operators is public (first Anvil address), therefore anyone can in principle resume regular operations. No funds need to be deposited to that address since submitting signatures is enough. Every ${formatSeconds(escapeBlockUpperBound * assumedBlockTime)} a special ${formatSeconds((escapeBlockUpperBound - escapeBlockLowerBound) * assumedBlockTime)} window (escape hatch) is open during which any address can propose new blocks.`,
      references: [
        {
          title: 'Anvil - a local testnet node toolchain',
          url: 'https://book.getfoundry.sh/anvil/',
        },
        {
          title: 'RollupProcessor.sol#L347 - Etherscan source code',
          url: 'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L347',
        },
        {
          title: 'RollupProcessor.sol#L168 - Etherscan source code',
          url: 'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L168',
        },
      ],
    },
    exitMechanisms: [
      {
        name: 'Regular withdraw (deprecated)',
        description:
          'The user initiates the withdrawal by submitting a transaction on L2. When the block containing that transaction is proven on L1 the assets are automatically withdrawn to the user.',
        risks: [],
        references: [
          {
            title: 'RollupProcessor.sol#LL396 - Etherscan source code',
            url: 'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L396',
          },
        ],
      },
      {
        name: 'EOL: Manual withdrawal using Aztec v2 Ejector',
        description:
          'EOL: Ownership of the rollup contract is irrevocably renounced and operators are not processing the rollup. Assets in the escrow can be manually withdrawn with the [Aztec v2 Ejector](https://github.com/AztecProtocol/aztec-v2-ejector/).',
        risks: [],
        references: [
          {
            title:
              'Aztec v2 Ejector - Codespace template for running the Aztec v2 rollup.',
            url: 'https://github.com/AztecProtocol/aztec-v2-ejector/',
          },
        ],
      },
    ],
    otherConsiderations: [
      {
        name: 'Payments are private',
        description:
          'Balances and identities for all tokens on the Aztec rollup are encrypted. Each transaction is encoded as a zkSNARK, protecting user data.',
        risks: [],
        references: [
          {
            title: 'Fast Privacy, Now - Aztec Medium Blog',
            url: 'https://medium.com/aztec-protocol/aztec-zkrollup-layer-2-privacy-1978e90ee3b6#3b25',
          },
        ],
      },
    ],
  },
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getPermissionDetails(
          'Rollup Providers',
          discovery.formatPermissionedAccounts(getRollupProviders()),
          `Addresses that can propose new blocks during regular rollup operation. Since the private key of one of them is public (first Anvil address), anyone can in principle resume regular operations. Every ${formatSeconds(escapeBlockUpperBound * assumedBlockTime)} a special ${formatSeconds((escapeBlockUpperBound - escapeBlockLowerBound) * assumedBlockTime)} window (escape hatch) is open during which anyone can propose new blocks.`,
        ),
        discovery.getMultisigPermission(
          'Aztec Multisig',
          "Can update parameters related to the reimbursement of gas to permissioned rollup providers. It doesn't affect the escape hatch mechanism, but it can halt regular operations by setting a reimbursement constant that is too high.",
        ),
      ],
    },
  },
  milestones: [
    {
      title: 'Aztec operator sunset',
      date: '2023-07-08T00:00:00Z',
      url: 'https://github.com/AztecProtocol/aztec-v2-ejector/',
      description:
        'Aztec stops their rollup operators. Users now have to run the Rollup manually.',
      type: 'general',
    },
    {
      title: 'Aztec 2.0',
      date: '2021-03-15T00:00:00Z',
      url: 'https://medium.com/aztec-protocol/launching-aztec-2-0-rollup-ac7db8012f4b',
      description:
        'Private Rollup is live on mainnet, allowing user to access DeFi.',
      type: 'general',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
}
