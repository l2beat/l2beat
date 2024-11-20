import {
  ChainId,
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  STATE_ZKP_SN,
  TECHNOLOGY_DATA_AVAILABILITY,
  addSentimentToDataAvailability,
} from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('scroll')

const upgradeMorphMultisig = {
  upgradableBy: ['MorphMultisig'],
  upgradeDelay: 'No delay',
}

const isEnforcedTxGatewayPaused = discovery.getContractValue<boolean>(
  'EnforcedTxGateway',
  'paused',
)

const challengeWindow = discovery.getContractValue<number>(
  'MorphRollup',
  'finalizationPeriodSeconds',
)

const challengeBond = discovery.getContractValue<number>(
  'L1Staking',
  'challengeBond',
)

const stakingValue =
  (discovery.getContractValue<number>('L1Staking', 'stakingValue') / 10) ^ 18

const proofWindow = discovery.getContractValue<number>(
  'MorphRollup',
  'proofWindow',
)

export const morph: Layer2 = {
  type: 'layer2',
  id: ProjectId('morph'),
  createdAt: new UnixTime(1702295992), // 2023-12-11T11:59:52Z
  display: {
    name: 'Morph',
    slug: 'morph',
    description:
      'Morph is an EVM compatible rollup. It operates as an optimistic rollup with ZK fault proofs.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://morphl2.io'],
      apps: ['https://bridge-holesky.morphl2.io'],
      documentation: ['https://docs.morphl2.io'],
      explorers: ['https://explorer-holesky.morphl2.io'],
      repositories: ['https://github.com/morph-l2'],
      socialMedia: [
        'https://twitter.com/MorphL2',
        'https://t.me/MorphL2official',
        'https://medium.com/@morphlayer2',
        'https://discord.com/invite/L2Morph',
        'https://youtube.com/@morphofficiall2',
      ],
    },
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
      fraudProofSystemAtLeast5Outsiders: false,
      usersHave7DaysToExit: false,
      usersCanExitWithoutCooperation: false,
      securityCouncilProperlySetUp: false,
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: false,
      fraudProofSystemIsPermissionless: false,
      delayWith30DExitWindow: false,
    },
  }),
  config: {
    escrows: [
      {
        address: EthereumAddress('0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304'),
        sinceTimestamp: new UnixTime(1729307111),
        tokens: ['ETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8'),
        sinceTimestamp: new UnixTime(1729307651),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xA534BAdd09b4C62B7B1C32C41dF310AA17b52ef1'),
        sinceTimestamp: new UnixTime(1729307783),
        tokens: '*',
        source: 'external',
        bridgedUsing: {
          bridges: [
            {
              name: 'Canonically (external escrow)',
            },
          ],
        },
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xc9045350712A1DCC3A74Eca18Bc985424Bbe7535'),
        sinceTimestamp: new UnixTime(1729308239),
        tokens: ['USDC'],
        source: 'external',
        bridgedUsing: {
          bridges: [
            {
              name: 'Canonically (external escrow)',
            },
          ],
        },
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x2C8314f5AADa5D7a9D32eeFebFc43aCCAbe1b289'),
        sinceTimestamp: new UnixTime(1729308239),
        tokens: ['USDC'],
        source: 'external',
        bridgedUsing: {
          bridges: [
            {
              name: 'Canonically (external escrow)',
            },
          ],
        },
        chain: 'ethereum',
      },
    ],
    dataAvailability: [
      addSentimentToDataAvailability({
        layers: [DA_LAYERS.ETH_BLOBS_OR_CALLLDATA],
        bridge: DA_BRIDGES.ENSHRINED,
        mode: DA_MODES.TRANSACTION_DATA_COMPRESSED, // TODO: check
      }),
    ],
    riskView: {
      stateValidation: {
        ...STATE_ZKP_SN,
        sources: [
          {
            contract: 'ScrollChain',
            references: [
              'https://etherscan.io/address/0x9bB163401E8C72573854c4Cd968aFA7A7b02D25f#code',
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
              'https://etherscan.io/address/0x9bB163401E8C72573854c4Cd968aFA7A7b02D25f#code',
            ],
          },
        ],
      },
      exitWindow: {
        ...RISK_VIEW.EXIT_WINDOW(upgradeDelay, 0),
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
              'https://etherscan.io/address/0x137CC585F607EDeBBc3CA6360AffCFeab507B374#code',
            ],
          },
          {
            contract: 'EnforcedTxGateway',
            references: [
              'https://etherscan.io/address/0x642af405bF64660665B37977449C9C536B806318#code',
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
              'https://etherscan.io/address/0x9bB163401E8C72573854c4Cd968aFA7A7b02D25f#code',
            ],
          },
        ],
      },
      validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
      destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    },
    technology: {
      newCryptography: {
        ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
      },
      stateCorrectness: {
        name: '1 round fault proof system',
        description: `Morph uses an one round fault proof system where whitelisted Challengers, if they find a faulty state root within the ${formatSeconds(challengeWindow)} challenge window, \
          they can post ${formatSeconds(challengeBond)} WEI bond and request a Zk proof of the state transition. After the challenge, during ${formatSeconds(proofWindow)} proving window a ZK proof must be \
          delivered, otherwise state root is considered invalid and the root proposer bond, which is set currently to ${formatSeconds(stakingValue)} ETH is slashed. The zkEVM used is SP1 from Succinct.\
          If the valid proof is delivered, the Challenger looses the challenge bond.`,
        references: [
          {
            text: 'Rollup.sol - Etherscan source code, commitBatch(), challengeState(), proveState() functions',
            href: 'https://etherscan.io/address/0x073403e147a8e607b80985fe458c0b527287278f#code#F1#L204',
          },
        ],
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'whitelisted challenger does not post a challenge of an incorrect state root.',
          },
        ],
      },
      dataAvailability: {
        ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA,
        references: [
          {
            text: 'Rollup.sol - Etherscan source code commitBatch() and commitBatchWithBlobProof() functions',
            href: 'https://etherscan.io/address/0x073403e147a8e607b80985fe458c0b527287278#code',
          },
        ],
      },
      operator: {
        name: 'Morph uses decentralised sequencer network',
        description: `The system uses a decentralised sequencer/proposer network. At the moment all sequencers are run by Morph and - from the point of Ethereum - they don't need \
        to reach consensus on a block as any one of them can propose a block with an L2 state root on Ethereum. There is a plan to use tendermint with BLS signatures to verify \
        consensus after Petra upgrade.`,
        references: [
          {
            text: 'L1Staking.sol - Etherscan source code, verifySignature() function',
            href: 'https://etherscan.io/address/0xDb0734109051DaAB5c32E45e9a5ad0548B2df714#code',
          },
        ],
        risks: [],
      },
      forceTransactions: {
        ...FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
        references: [
          {
            text: 'EnforcedTxGateway.sol - Etherscan source code',
            href: 'https://etherscan.io/address/0x642af405bF64660665B37977449C9C536B806318#code',
          },
          {
            text: 'EnforcedTxGateway is paused - Etherscan proxy contract',
            href: 'https://etherscan.io/address/0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d#readProxyContract#F7',
          },
        ],
      },
      exitMechanisms: [
        {
          ...EXITS.REGULAR('zk', 'no proof'),
          risks: [EXITS.OPERATOR_CENSORS_WITHDRAWAL],
          references: [
            {
              text: 'L1ETHGateway.sol - Etherscan source code, finalizeWithdrawETH function',
              href: 'https://etherscan.io/address/0x546E0bF31FB6e7babD493452e4e6999191367B42#code',
            },
          ],
        },
      ],
    },
    stateDerivation: {
      nodeSoftware:
        'The node software to reconstruct the state is available [here](https://github.com/scroll-tech/go-ethereum). Note that it uses the L2 p2p network to fetch blocks, and not the L1 network. The consistency with L1 data can be checked by running the [scroll-geth node](https://github.com/scroll-tech/go-ethereum) with the `--rollup.verify` flag.',
      compressionScheme:
        'Data batches are compressed using the [zlib](https://github.com/madler/zlib) algorithm with best compression level.',
      genesisState:
        'The genesis file can be found [here](https://scrollzkp.notion.site/genesis-json-f89ca24b123f462f98c8844d17bdbb74), which contains two prefunded addresses and five predeployed contracts.',
      dataFormat:
        'Blocks are grouped into chunks and chunks are grouped into batches. Chunk encoding format can be found [here](https://github.com/scroll-tech/scroll-contracts/blob/main/src/libraries/codec/ChunkCodecV0.sol#L5), and batch encoding format can be found [here](https://github.com/scroll-tech/scroll-contracts/blob/main/src/libraries/codec/BatchHeaderV0Codec.sol#L7).',
    },
    stateValidation: {
      description:
        'Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract.',
      categories: [
        {
          title: 'Prover Architecture',
          description:
            'The prover code can be found [here](https://github.com/scroll-tech/zkevm-circuits/tree/develop/prover).',
        },
        {
          title: 'ZK Circuits',
          description:
            'Scroll circuits are based on the Halo2 proof system and are designed to replicate the behavior of the EVM. The source code of the base circuits can be found [here](https://github.com/scroll-tech/zkevm-circuits/tree/v0.10.5/zkevm-circuits) while the code for the aggregation circuits can be found [here](https://github.com/scroll-tech/zkevm-circuits/tree/v0.10.5/aggregator).',
        },
        {
          title: 'Verification Keys Generation',
          description:
            'SNARK verification keys can be generated and checked against Ethereum verifier contract using [this guide](https://github.com/scroll-tech/scroll-prover#verifier-contract). The system requires a trusted setup.',
        },
      ],
      proofVerification: {
        shortDescription: 'Scroll is a ZK-EVM rollup on Ethereum.',
        aggregation: true,
        requiredTools: [
          {
            name: 'Custom tool',
            version: 'v0.10.3',
            link: 'https://github.com/scroll-tech/scroll-prover/tree/v0.10.3?tab=readme-ov-file#verifier-contract',
          },
        ],
        verifiers: [
          {
            name: 'PlonkVerifierV0',
            description:
              'Scroll verifier using calldata for DA. Corresponds to version v0.9.5 of the circuits.',
            verified: 'no',
            contractAddress: EthereumAddress(
              '0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1',
            ),
            chainId: ChainId.ETHEREUM,
            subVerifiers: [
              {
                name: 'Aggregation circuit',
                ...PROOFS.HALO2KZG('Powers of Tau 26'),
                link: 'https://github.com/scroll-tech/zkevm-circuits/tree/v0.9.5/aggregator',
              },
              {
                name: 'Main circuit',
                ...PROOFS.HALO2KZG('Powers of Tau 26'),
                link: 'https://github.com/scroll-tech/zkevm-circuits/tree/v0.9.5/zkevm-circuits',
              },
            ],
          },
          {
            name: 'PlonkVerifierV1',
            description:
              'Scroll verifier using blobs for DA. Corresponds to version v0.10.3 of the circuits.',
            verified: 'no',
            contractAddress: EthereumAddress(
              '0x2293cd12e8564e8219d314b075867c2f66ac6941',
            ),
            chainId: ChainId.ETHEREUM,
            subVerifiers: [
              {
                name: 'Aggregation circuit',
                ...PROOFS.HALO2KZG('Powers of Tau 26'),
                link: 'https://github.com/scroll-tech/zkevm-circuits/tree/v0.10.3/aggregator',
              },
              {
                name: 'Main circuit',
                ...PROOFS.HALO2KZG('Powers of Tau 26'),
                link: 'https://github.com/scroll-tech/zkevm-circuits/tree/v0.10.3/zkevm-circuits',
              },
            ],
          },
          {
            name: 'PlonkVerifierV1-1',
            description:
              'Scroll verifier using blobs for DA. Corresponds to version v0.11.4 of the circuits (Curie upgrade).',
            verified: 'no',
            contractAddress: EthereumAddress(
              '0x03a72B00D036C479105fF98A1953b15d9c510110',
            ),
            chainId: ChainId.ETHEREUM,
            subVerifiers: [
              {
                name: 'Aggregation circuit',
                ...PROOFS.HALO2KZG('Powers of Tau 26'),
                link: 'https://github.com/scroll-tech/zkevm-circuits/tree/v0.11.4/aggregator',
              },
              {
                name: 'Main verifier',
                ...PROOFS.HALO2KZG('Powers of Tau 26'),
                link: 'https://github.com/scroll-tech/zkevm-circuits/tree/v0.11.4/zkevm-circuits',
              },
            ],
          },
          {
            name: 'PlonkVerifierV2',
            description:
              'Scroll verifier proving bundles (group of batches). Corresponds to version v0.12.0 of the circuits (Darwin upgrade).',
            verified: 'no',
            contractAddress: EthereumAddress(
              '0x8759E83b6570A0bA46c3CE7eB359F354F816c9a9',
            ),
            chainId: ChainId.ETHEREUM,
            subVerifiers: [
              {
                name: 'Aggregation circuit',
                ...PROOFS.HALO2KZG('Powers of Tau 26'),
                link: 'https://github.com/scroll-tech/zkevm-circuits/tree/v0.12.0/aggregator',
              },
              {
                name: 'Main verifier',
                ...PROOFS.HALO2KZG('Powers of Tau 26'),
                link: 'https://github.com/scroll-tech/zkevm-circuits/tree/v0.12.0/zkevm-circuits',
              },
            ],
          },
          {
            name: 'PlonkVerifierV2-1',
            description:
              'Scroll verifier proving bundles (group of batches). Corresponds to version v0.13.0 of the circuits (Darwin v2 upgrade).',
            verified: 'no',
            contractAddress: EthereumAddress(
              '0x8c1b52757b5c571ADcB5572E992679d4D48e30f7',
            ),
            chainId: ChainId.ETHEREUM,
            subVerifiers: [
              {
                name: 'Aggregation circuit',
                ...PROOFS.HALO2KZG('Powers of Tau 26'),
                link: 'https://github.com/scroll-tech/zkevm-circuits/tree/v0.13.0/aggregator',
              },
              {
                name: 'Main verifier',
                ...PROOFS.HALO2KZG('Powers of Tau 26'),
                link: 'https://github.com/scroll-tech/zkevm-circuits/tree/v0.13.0/zkevm-circuits',
              },
            ],
          },
        ],
      },
    },
    contracts: {
      addresses: [
        discovery.getContractDetails('MorphRollup', {
          description:
            'The main contract of the Morph chain. Allows to post transaction data and state roots, implements challenge mechanism along with proofs. Sequencing and proposing are behind a whitelist.',
          ...upgradeMorphMultisig,
        }),
        discovery.getContractDetails('L1Staking', {
          description:
            'Contract keeping track of stakers which act as sequencers/proposes. It is responsible for stakers registering and withdrawals and for verifying BLS signatures\
            of stakers (currently not implemented).',
          ...upgradeMorphMultisig,
        }),
        discovery.getContractDetails('L1CrossDomainMessenger', {
          description:
            'Contract used to send L1 -> L2 and relay messages from L2. It allows to replay failed messages and to drop skipped messages. L1 -> L2 messages sent using this contract pay for L2 gas on L1 and will have the aliased address of this contract as the sender.',
          ...upgradeMorphMultisig,
        }),
        discovery.getContractDetails('L1MessageQueueWithGasPriceOracle', {
          description:
            'Contains the array of queued L1 -> L2 messages, either appended using the L1ScrollMessenger or the EnforcedTxGateway. The latter contract, which would allow users to send L2 messages from L1 with their own address as the sender, is not enabled yet.',
          ...upgradeMorphMultisig,
        }),
        discovery.getContractDetails('Whitelist', {
          description:
            'Contract implementing a generic whitelist. Currently used to define the actor that can relay the L2 basefee on L1.',
        }),
        discovery.getContractDetails('MultipleVersionRollupVerifier', {
          description:
            'Contract used to update the verifier and keep track of current and old versions.',
        }),
        discovery.getContractDetails('ZkEvmVerifierV1', {
          description:
            'Current verifier using calldata for DA, used to prepare data for the PlonkVerifierV0.', // TODO: check
        }),
        discovery.getContractDetails('L1ETHGateway', {
          description: 'Contract used to bridge ETH from L1 to L2.',
          ...upgradeMorphMultisig,
        }),
        discovery.getContractDetails('L1StandardERC20Gateway', {
          description:
            'Contract used to bridge ERC20 tokens from L1 to L2. It uses a fixed token list.',
          ...upgradeMorphMultisig,
        }),
        discovery.getContractDetails('L1GatewayRouter', {
          description:
            'Main entry point for depositing ETH and ERC20 tokens, which are then forwarded to the correct gateway.',
          ...upgradeMorphMultisig,
        }),
        discovery.getContractDetails('EnforcedTxGateway', {
          description:
            'Contracts to force L1 -> L2 messages with the proper sender.',
          ...upgradeMorphMultisig,
          pausable: {
            paused: isEnforcedTxGatewayPaused,
            pausableBy: ['ScrollOwner'],
          },
        }),
      ],
      risks: [],
    },
    permissions: [
      ...discovery.getMultisigPermission(
        'MorphAdminMSig',
        'Can upgrade proxies and the verifier without delay. It can also revert non finalized batches, remove sequencers and provers and pause contracts.',
      ),
      {
        name: 'Sequencers',
        accounts: discovery.getPermissionedAccounts(
          'L1Staking',
          'getActiveStakers',
        ),
        description:
          'Actors allowed to commit transaction batches and propose state roots.',
      },
      {
        name: 'Challengers',
        accounts: discovery.getPermissionedAccounts(
          'MorphRollup',
          'challengers',
        ),
        description: 'Actors allowed to challenge proposed state roots.',
      },
    ],
  },
}
