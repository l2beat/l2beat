import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { formatSeconds } from '../utils/formatSeconds'
import { EXITS, makeBridgeCompatible, OPERATOR } from './common'
import { DATA_AVAILABILITY } from './common/dataAvailability'
import { FORCE_TRANSACTIONS } from './common/forceTransactions'
import { RISK_VIEW, STATE_ZKP_SN } from './common/riskView'
import { getStage } from './common/stages/getStage'
import { STATE_CORRECTNESS } from './common/stateCorrectness'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('scroll')

const timelockSlowDelay = discovery.getContractValue<number>(
  'TimelockSlow',
  'getMinDelay',
)
const timelockMidDelay = discovery.getContractValue<number>(
  'TimelockMid',
  'getMinDelay',
)
const timelockFastDelay = discovery.getContractValue<number>(
  'TimelockFast',
  'getMinDelay',
)

const upgradesScrollMultisig = {
  upgradableBy: ['ScrollMultisig'],
  upgradeDelay: 'None',
}

export const scroll: Layer2 = {
  type: 'layer2',
  id: ProjectId('scroll'),
  display: {
    name: 'Scroll',
    slug: 'scroll',
    description:
      'Scroll is rollup that extends Ethereum’s capabilities through zero knowledge tech and EVM compatibility.',
    purpose: 'Universal',
    category: 'ZK Rollup',
    links: {
      websites: ['https://scroll.io'],
      apps: [
        'https://scroll.io/bridge',
        'https://uniswap-showcase.sepolia.scroll.xyz/',
      ],
      documentation: ['https://docs.scroll.io/en/home/'],
      explorers: [
        'https://scrollscan.com/',
        'https://blockscout.scroll.io',
        'https://scroll.unifra.xyz/',
        'https://www.ondora.xyz/network/scroll',
      ],
      repositories: [
        'https://github.com/scroll-tech/scroll',
        'https://github.com/scroll-tech/scroll-prover',
        'https://github.com/scroll-tech/zkevm-circuits',
        'https://github.com/scroll-tech/zkevm-specs',
        'https://github.com/scroll-tech/scroll-zkevm',
        'https://github.com/scroll-tech/go-ethereum',
        'https://github.com/scroll-tech/frontends',
        'https://github.com/scroll-tech/scroll-contract-deploy-demo',
        'https://github.com/scroll-tech',
      ],
      socialMedia: [
        'https://discord.gg/scroll',
        'https://twitter.com/Scroll_ZKP',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeSourceAvailable: 'UnderReview',
    },
    stage1: {
      stateVerificationOnL1: true,
      fraudProofSystemAtLeast5Outsiders: null,
      usersHave7DaysToExit: false,
      usersCanExitWithoutCooperation: false,
      securityCouncilProperlySetUp: false,
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: false,
      fraudProofSystemIsPermissionless: null,
      delayWith30DExitWindow: false,
    },
  }),
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9'),
        tokens: '*',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367'),
        tokens: ['ETH'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xb2b10a289A229415a124EFDeF310C10cb004B6ff'),
        tokens: '*',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B'),
        tokens: ['USDC'],
      }),
    ],
    transactionApi: {
      type: 'rpc',
      startBlock: 1,
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      ...STATE_ZKP_SN,
      sources: [
        {
          contract: 'ScrollChain',
          references: [
            'https://etherscan.io/address/0x2e07f0fba71709bb5e1f045b02152e45b451d75f#code#F1#L319',
          ],
        },
      ],
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      sources: [
        {
          contract: 'ScrollChain',
          references: [
            'https://etherscan.io/address/0x2e07f0fba71709bb5e1f045b02152e45b451d75f#code#F1#L164',
          ],
        },
      ],
    },
    upgradeability: {
      ...RISK_VIEW.UPGRADABLE_YES,
      sources: [
        {
          contract: 'ScrollChain',
          references: [
            'https://etherscan.io/address/0xa13BAF47339d63B743e7Da8741db5456DAc1E556#code#F1#L154',
          ],
        },
      ],
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_NO_MECHANISM(),
      sources: [
        {
          contract: 'L1MessageQueue',
          references: [
            'https://etherscan.io/address/0xbc9d741501a20f962756c95bf906b4abffadcf8f#code#F1#L286',
          ],
        },
        {
          contract: 'L1MessageQueue',
          references: [
            'https://etherscan.io/address/0xbc9d741501a20f962756c95bf906b4abffadcf8f#code#F1#71',
          ],
        },
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
      sources: [
        {
          contract: 'ScrollChain',
          references: [
            'https://etherscan.io/address/0x2e07f0fba71709bb5e1f045b02152e45b451d75f#code#F1#L296',
          ],
        },
      ],
    },
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
  }),
  technology: {
    stateCorrectness: {
      ...STATE_CORRECTNESS.VALIDITY_PROOFS,
      references: [
        {
          text: 'ScrollChain.sol#L319 - Etherscan source code, verifyAggregateProof() call',
          href: 'https://etherscan.io/address/0x2e07f0fba71709bb5e1f045b02152e45b451d75f#code#F1#L319',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      references: [
        {
          text: 'ScrollChain.sol#L164 - Etherscan source code commitBatch() function',
          href: 'https://etherscan.io/address/0x2e07f0fba71709bb5e1f045b02152e45b451d75f#code#F1#L164',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [
        {
          text: 'ScrollChain.sol#L296 - Etherscan source code, finalizeBatchWithProof() function modifier',
          href: 'https://etherscan.io/address/0x2e07f0fba71709bb5e1f045b02152e45b451d75f#code#F1#L296',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
      references: [
        {
          text: 'L1MessageQueue.sol#L71 - Etherscan source code, skippedMessageBitmap mapping',
          href: 'https://etherscan.io/address/0xbc9d741501a20f962756c95bf906b4abffadcf8f#code#F1#L71',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('zk', 'no proof'),
        risks: [EXITS.OPERATOR_CENSORS_WITHDRAWAL],
        references: [
          {
            text: 'L1ETHGateway.sol#L70 - Etherscan source code, finalizeWithdrawETH function',
            href: 'https://etherscan.io/address/0x1fcbE079c4Bbab37406daB7Dfd35AcAe37D5C55d#code#L1#L70',
          },
        ],
      },
    ],
  },
  stateDerivation: {
    nodeSoftware:
      'The node software to reconstruct the state is available [here](https://github.com/scroll-tech/go-ethereum). Note that it uses the L2 p2p network to fetch blocks, and not the L1 network. The ability to check consistency with L1 data is [in the works](https://github.com/scroll-tech/go-ethereum/pull/515).',
    compressionScheme: 'The rollup does not use compression.',
    genesisState:
      'The genesis file can be found [here](https://scrollzkp.notion.site/genesis-json-f89ca24b123f462f98c8844d17bdbb74), which contains two prefunded addresses and five predeployed contracts.',
    dataFormat:
      'Blocks are grouped into chunks and chunks are grouped into batches. Chunk encoding format can be found [here](https://github.com/scroll-tech/scroll/blob/develop/contracts/src/libraries/codec/ChunkCodec.sol#L5), and batch encoding format can be found [here](https://github.com/scroll-tech/scroll/blob/develop/contracts/src/libraries/codec/BatchHeaderV0Codec.sol#L7).',
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('ScrollChain', {
        description:
          'The main contract of the Scroll chain. Allows to post transaction data and state roots, along with proofs. Sequencing and proposing are behind a whitelist. L1 -> L2 message processing on L2 is not enforced.',
        ...upgradesScrollMultisig,
      }),
      discovery.getContractDetails('L1ScrollMessenger', {
        description:
          'Contract used to send L1 -> L2 and relay messages from L2. It allows to replay failed messages and to drop skipped messages. L1 -> L2 messages sent using this contract pay for L2 gas on L1 and will have the aliased address of this contract as the sender.',
        ...upgradesScrollMultisig,
      }),
      discovery.getContractDetails('L1MessageQueue', {
        description:
          'Contains the array of queued L1 -> L2 messages, either appended using the L1ScrollMessenger or the EnforcedTxGateway. The latter contract, which would allow users to send L2 messages from L1 with their own address as the sender, is not enabled yet.',
      }),
      discovery.getContractDetails('L2GasPriceOracle', {
        description:
          'Contract used to relay the L2 basefee on L1 in a trusted way using a whitelist. It is also used to store and update values related to intrinsic gas cost calculations.',
        ...upgradesScrollMultisig,
      }),
      discovery.getContractDetails('Whitelist', {
        description:
          'Contract used to store whitelists for the L2GasPriceOracle contract.',
      }),
      discovery.getContractDetails('ScrollOwner', {
        description:
          'Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.',
      }),
      discovery.getContractDetails('TimelockSlow', {
        description: `${formatSeconds(
          timelockSlowDelay,
        )} timelock. Admin of the ScrollOwner contract, meaning it can assign and revoke roles. The ScrollMultisig can propose and cancel transactions, and the ExecutorMultisig can execute them.`,
      }),
      discovery.getContractDetails('TimelockMid', {
        description: `${formatSeconds(
          timelockMidDelay,
        )} timelock. Can update the verifier and manage the USDC gateway bridge. The ScrollMultisig can propose and cancel transactions, and the ExecutorMultisig can execute them.`,
      }),
      discovery.getContractDetails('TimelockFast', {
        description: `${formatSeconds(
          timelockFastDelay,
        )} timelock. Can add new sequencers and provers, update the gas oracle and permissions to update its values, the max gas limit, and gateways token mappings. The ScrollMultisig can propose and cancel transactions, and the ExecutorMultisig can execute them.`,
      }),
      discovery.getContractDetails('MultipleVersionRollupVerifier', {
        description:
          'Contract used to update the verifier and keep track of current and old versions.',
      }),
      discovery.getContractDetails('ZkEvmVerifierV1', {
        description:
          'Current verifier, used to prepare data for the PlonkVerifier.',
      }),
      discovery.getContractDetails('PlonkVerifier', {
        description: 'Plonk verifier used to verify the ZK proof.',
        references: [
          {
            text: 'evm_verifier.yul source code',
            href: 'https://circuit-release.s3.us-west-2.amazonaws.com/release-v0.9.5/evm_verifier.yul',
          },
        ],
      }),
      discovery.getContractDetails('L1ETHGateway', {
        description: 'Contract used to bridge ETH from L1 to L2.',
        ...upgradesScrollMultisig,
      }),
      discovery.getContractDetails('L1WETHGateway', {
        description: 'Contract used to bridge WETH from L1 to L2.',
        ...upgradesScrollMultisig,
      }),
      discovery.getContractDetails('L1StandardERC20Gateway', {
        description:
          'Contract used to bridge ERC20 tokens from L1 to L2. It uses a fixed token list.',
        ...upgradesScrollMultisig,
      }),
      discovery.getContractDetails('L1CustomERC20Gateway', {
        description:
          'Contract used to bridge ERC20 tokens from L1 to L2. It allows to change the token mappings.',
        ...upgradesScrollMultisig,
      }),
      discovery.getContractDetails('L1USDCGateway', {
        description: 'Contract used to bridge USDC tokens from L1 to L2.',
        ...upgradesScrollMultisig,
      }),
      discovery.getContractDetails('L1ERC721Gateway', {
        description: 'Contract used to bridge ERC721 tokens from L1 to L2.',
        ...upgradesScrollMultisig,
      }),
      discovery.getContractDetails('L1ERC1155Gateway', {
        description: 'Contract used to bridge ERC1155 tokens from L1 to L2.',
        ...upgradesScrollMultisig,
      }),
      discovery.getContractDetails('L1GatewayRouter', {
        description:
          'Main entry point for depositing ETH and ERC20 tokens, which are then forwarded to the correct gateway.',
        ...upgradesScrollMultisig,
      }),
      discovery.getContractDetails('FeeVaultMultisig', {
        description:
          'Multisig used to store fees collected from gateways to pay for L1 -> L2 message execution.',
      }),
      discovery.getContractDetails('EnforcedTxGateway', {
        description:
          'Contracts to force L1 -> L2 messages with the proper sender. Currently not enabled.',
        ...upgradesScrollMultisig,
      }),
    ],
    risks: [],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'ScrollMultisig',
      'Currently also designated as the Security Council. Can upgrade proxies and the verifier without delay and propose transactions within Timelocks. It can also revert non finalized batches, remove sequencers and provers and pause contracts.',
    ),
    ...discovery.getMultisigPermission(
      'ExecutorMultisig',
      'Can execute timelock transactions.',
    ),
    ...discovery.getMultisigPermission(
      'EmergencyMultisig',
      'Can revert batches, remove sequencers and provers, and pause contracts.',
    ),
    {
      name: 'Sequencers',
      accounts: discovery.getPermissionedAccounts('ScrollChain', 'sequencers'),
      description: 'Actors allowed to commit transaction batches.',
    },
    {
      name: 'Proposers',
      accounts: discovery.getPermissionedAccounts('ScrollChain', 'provers'),
      description:
        'Actors allowed to prove transaction batches and publish state root updates.',
    },
  ],
  milestones: [
    {
      name: 'Scroll official launch',
      link: 'https://x.com/Scroll_ZKP/status/1714286874020528554',
      date: '2023-10-17T00:00:00.00Z',
      description: 'Scroll announces its official launch.',
    },
    {
      name: 'Scroll Alpha testnet launch',
      link: 'https://scroll.io/blog/alphaTestnet',
      date: '2023-02-27T00:00:00.00Z',
      description: 'Scroll launches its Alpha testnet on Goerli.',
    },
  ],
}
