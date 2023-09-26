import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { formatSeconds } from '../utils/formatSeconds'
import {
    CONTRACTS,
    DATA_AVAILABILITY,
    EXITS,
    FORCE_TRANSACTIONS,
    FRONTRUNNING_RISK,
    makeBridgeCompatible,
    RISK_VIEW,
    STATE_CORRECTNESS,
} from './common'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('mode')

export const mode: Layer2 = {
    type: 'layer2',
    id: ProjectId('mode'),
    display: {
        name: 'Mode Network',
        slug: 'mode',
        description:
            'Mode is the Ethereum L2 designed for builders and users to grow as the network grows. ',
        purpose: 'Universal',
        category: 'Optimistic Rollup',
        provider: 'OP Stack',
        links: {
            websites: ['https://www.mode.network/'],
            apps: [],
            documentation: ['https://docs.mode.network/'],
            explorers: ['https://sepolia.explorer.mode.network/'],
            repositories: [],
            socialMedia: [
                'https://twitter.com/modenetwork',
                'https://discord.gg/modenetwork',
                'https://mode.mirror.xyz/',
                'https://t.me/ModeNetworkOfficial'
            ],
        },
        activityDataSource: 'Blockchain RPC',
    },
    config: {
        escrows: [
            discovery.getEscrowDetails({
                address: EthereumAddress('0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319'),
                sinceTimestamp: new UnixTime(1691060675),
                tokens: '*',
            }),
        ],
        transactionApi: {
            type: 'rpc',
            startBlock: 1,
        },
    },
    riskView: makeBridgeCompatible({
        stateValidation: {
            ...RISK_VIEW.STATE_ZKP_SN,
            sources: [
                {
                    contract: 'zkEVM',
                    references: [
                        'https://etherscan.io/address/0xb32c3D0dDb0063FfB15E8a50b40cC62230D820B3#code#F1#L116',
                    ],
                },
            ],
        },
        dataAvailability: {
            ...RISK_VIEW.DATA_ON_CHAIN,
            description:
                RISK_VIEW.DATA_ON_CHAIN.description +
                ' Unlike most zk rollups, transaction data is posted instead of state diffs.',
            sources: [
                {
                    contract: 'zkEVM',
                    references: [
                        'https://etherscan.io/address/0xb32c3D0dDb0063FfB15E8a50b40cC62230D820B3#code#F1#L221',
                    ],
                },
            ],
        },
        upgradeability: RISK_VIEW.UPGRADABLE_YES,
        sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(),
        proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
        destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
        validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    }),
    stage: getStage({
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
            usersCanExitWithoutCooperation: false,
            securityCouncilProperlySetUp: [
                false,
                'Security Council members are not publicly known.',
            ],
        },
        stage2: {
            proofSystemOverriddenOnlyInCaseOfABug: false,
            fraudProofSystemIsPermissionless: null,
            delayWith30DExitWindow: false,
        },
    }),
    technology: {
        /** What state correctness mechanism is used in the layer2 */
        stateCorrectness: ProjectTechnologyChoice
  /** What is the new cryptography used in the layer2 */
  newCryptography?: ProjectTechnologyChoice
  /** What is the data availability choice for the layer2 */
  dataAvailability: ProjectTechnologyChoice
  /** What are the details about layer2 operator(s) */
  operator: ProjectTechnologyChoice
  /** What are the details about force transactions (censorship resistance) */
  forceTransactions: ProjectTechnologyChoice
  /** A description of the available exit mechanisms */
  exitMechanisms: ProjectTechnologyChoice[]
  /** What is solution to the mass exit problem */
  massExit?: ProjectTechnologyChoice
  /** What is the additional privacy offered */
  additionalPrivacy?: ProjectTechnologyChoice
  /** What are the smart contract capabilities */
  smartContracts?: ProjectTechnologyChoice
  /** How can the Layer2 be upgraded? */
  upgradeMechanism?: ProjectTechnologyChoice
  /** Is the technology section under review */
  isUnderReview?: boolean
    },

    permissions: [
        ...discovery.getMultisigPermission(
            'AdminMultisig',
            'Admin of the Linea rollup. It can upgrade core contracts, bridges, change the verifier address, and publish blocks by effectively overriding the proof system.',
        ),
        {
            accounts: operators,
            name: 'Operators',
            description:
                'The operators are allowed to prove blocks and post the corresponding transaction data.',
        },
    ],
    contracts: {
        addresses: [
            discovery.getContractDetails('zkEVM', {
                description:
                    'The main contract of the Linea zkEVM rollup. Contains state roots, the verifier addresses and manages messages between L1 and the L2.',
                ...upgradesTimelock,
                pausable: {
                    pausableBy: pausers,
                    paused: isPaused,
                },
                references: [
                    {
                        text: 'ZkEvmV2.sol#L275 - Etherscan source code, state injections: stateRoot and exitRoot are part of the validity proof input.',
                        href: 'https://etherscan.io/address/0xb32c3D0dDb0063FfB15E8a50b40cC62230D820B3#code#F1#L297',
                    },
                ],
            }),
            discovery.getContractDetails(
                'PlonkVerifierFull',
                'Plonk verifier contract used by the Linea zkEVM rollup.',
            ),
            discovery.getContractDetails(
                'PlonkVerifierFull2',
                'Plonk verifier contract used by the Linea zkEVM rollup.',
            ),
            discovery.getContractDetails(
                'PlonkVerifierFullLarge',
                'Plonk verifier contract used by the Linea zkEVM rollup.',
            ),
            discovery.getContractDetails('ERC20Bridge', {
                description: 'Contract used to bridge ERC20 tokens.',
                ...upgrades,
            }),
            discovery.getContractDetails('USDCBridge', {
                description: 'Contract used to bridge USDC tokens.',
                ...upgrades,
            }),
        ],
        risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK(timelockDelayString)],
    },
    milestones: [
        {
            name: 'Mode Testnet is Live',
            date: '2023-08-07',
            description:
                'Mode released testnet',
            link: 'https://mode.mirror.xyz/coXFPKoK6CvEXUQfTyTctL3dhr2lzg2TZbseqfYYKoQ',
        },

    ],
}