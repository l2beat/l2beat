import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { HARDCODED } from '../discovery/values/hardcoded'
import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  OPERATOR,
  subtractOne,
  TECHNOLOGY,
} from './common'
import { RISK_VIEW } from './common/riskView'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('kroma')

export const kroma: Layer2 = {
  isUnderReview: true,
  type: 'layer2',
  id: ProjectId('kroma'),
  display: {
    name: 'Kroma',
    slug: 'kroma',
    description:
      'Kroma aims to develop an universal ZK Rollup based on the Optimism Bedrock architecture. \
            Currently, Kroma operates as an Optimistic Rollup with ZK fault proofs, utilizing a zkEVM based on Scroll. \
            The goal of Kroma is to eventually transition to a ZK Rollup once the generation of ZK proofs becomes more cost-efficient and faster.',
    purpose: 'Universal',
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://kroma.network/'],
      apps: ['https://kroma.network/bridge/'],
      documentation: [
        'https://docs.kroma.network/',
        'https://github.com/kroma-network/kroma/tree/dev/specs',
      ],
      explorers: ['https://blockscout.kroma.network/'],
      repositories: ['https://github.com/kroma-network/'],
      socialMedia: [
        'https://discord.gg/kroma',
        'https://twitter.com/kroma_network',
        'https://medium.com/@kroma-network',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x31F648572b67e60Ec6eb8E197E1848CC5F5558de'),
        sinceTimestamp: new UnixTime(1693880555),
        tokens: ['ETH'],
        description: 'Main entry point for users depositing ETH.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x827962404D7104202C5aaa6b929115C8211d9596'),
        sinceTimestamp: new UnixTime(1693880555),
        tokens: '*',
        description:
          'Main entry point for users depositing ERC20 token that do not require custom gateway.',
      }),
    ],
    transactionApi: {
      type: 'rpc',
      startBlock: 1,
      url: 'https://api.kroma.network',
      callsPerMinute: 1500,
      assessCount: subtractOne,
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_FP_INT_ZK,
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      sources: [
        {
          contract: 'KromaPortal',
          references: [
            'https://etherscan.io/address/0x381F53695230BAF83a39D1a08304D233A35730Fa#code#F1#430',
          ],
        },
      ],
    },
    upgradeability: {
      ...RISK_VIEW.UPGRADABLE_YES,
      sources: [
        {
          contract: 'KromaPortal',
          references: [
            'https://etherscan.io/address/0x31F648572b67e60Ec6eb8E197E1848CC5F5558de',
          ],
        },
        {
          contract: 'UpgradeGovernor',
          references: [
            'https://etherscan.io/address/0x2a51e099CC7AF922CcDe7F3db909DC7b71B8D030#code#F1#95',
          ],
        },
      ],
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE(
        HARDCODED.KROMA.SEQUENCING_WINDOW_SECONDS,
      ),
      sources: [
        {
          contract: 'KromaPortal',
          references: [
            'https://etherscan.io/address/0x381F53695230BAF83a39D1a08304D233A35730Fa#code#F1#430',
          ],
        },
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_SELF_PROPOSE_ROOTS,
      sources: [
        {
          contract: 'L2OutputOracle',
          references: [
            'https://etherscan.io/address/0x14126FFa3889a026A79F0f99FaE80B3dc9E38095#code#F1#L197',
          ],
        },
      ],
    },
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeOpenSource: true,
    },
    stage1: {
      stateVerificationOnL1: true,
      fraudProofSystemAtLeast5Outsiders: 'UnderReview',
      usersHave7DaysToExit: false,
      usersCanExitWithoutCooperation: true,
      securityCouncilProperlySetUp: false,
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: false,
      fraudProofSystemIsPermissionless: true,
      delayWith30DExitWindow: false,
    },
  }),
  technology: {
    stateCorrectness: {
      name: 'Fraud Proofs ensure state correctness',
      description: 'Kroma uses an interactive fraud proof system to find a single block of disagreement, which is then zk proven. The zkEVM used is based on Scroll.',
      references: [
        {
          text: 'Colosseum.sol#L300 - Etherscan source code, createChallenge function',
          href: 'https://etherscan.io/address/0x7526F997ea040B3949415c3a44e708273863AA2b#code#F1#L300'
        },
        {
          text: 'Colosseum.sol#L378 - Etherscan source code, bisect function',
          href: 'https://etherscan.io/address/0x7526F997ea040B3949415c3a44e708273863AA2b#code#F1#L378'
        },
        {
          text: 'Colosseum.sol#L434 - Etherscan source code, proveFault function',
          href: 'https://etherscan.io/address/0x7526F997ea040B3949415c3a44e708273863AA2b#code#F1#L434'
        }
      ],
      risks: [
        {
          category: 'Withdrawals can be delayed if',
          text: 'the fraud proof system is under a delay attack.',
        }
      ]
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      references: [
        {
          text: 'Derivation: Batch Submission - Kroma specs',
          href: 'https://github.com/kroma-network/kroma/blob/dev/specs/derivation.md#batch-submission'
        },
        {
          text: 'BatchInbox - Etherscan address',
          href: 'https://etherscan.io/address/0xff00000000000000000000000000000000000255'
        },
        {
          text: 'KromaPortal.sol#L430 - Etherscan source code, depositTransaction function',
          href: 'https://etherscan.io/address/0x381F53695230BAF83a39D1a08304D233A35730Fa#code#F1#L430'
        }
      ]
    },
    operator: {
      ...OPERATOR.CENTRALIZED_SEQUENCER,
      references: [
        {
          text: 'SystemConfig - batcher address',
          href: 'https://etherscan.io/address/0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35#readProxyContract#F3'
        }
      ]
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
      references: [
        {
          text: 'Sequencing Window - Kroma specs',
          href: 'https://github.com/kroma-network/kroma/blob/dev/specs/glossary.md#proposing-window'
        },
        {
          text: 'KromaPortal.sol#430 - Etherscan source code, depositTransaction function',
          href: 'https://etherscan.io/address/0x381F53695230BAF83a39D1a08304D233A35730Fa#code#F1#L430'
        }
      ]
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('optimistic', 'merkle proof'),
        references: [
          {
            text: 'KromaPortal.sol#L241 - Etherscan source code, proveWithdrawalTransaction function',
            href: 'https://etherscan.io/address/0x381F53695230BAF83a39D1a08304D233A35730Fa#code#F1#L241'
          },
          {
            text: 'KromaPortal.sol#L324 - Etherscan source code, finalizeWithdrawalTransaction function',
            href: 'https://etherscan.io/address/0x381F53695230BAF83a39D1a08304D233A35730Fa#code#F1#L324'
          },
        ]
      }
    ],
    smartContracts: {
      name: 'EVM compatible smart contracts are supported',
      description:
        'OP stack chains are pursuing the EVM Equivalence model. No changes to smart contracts are required regardless of the language they are written in, i.e. anything deployed on L1 can be deployed on L2.',
      risks: [],
      references: [
        {
          text: 'Introducing EVM Equivalence',
          href: 'https://medium.com/ethereum-optimism/introducing-evm-equivalence-5c2021deb306',
        },
      ],
    },
  },
  permissions: [],
  contracts: CONTRACTS.UNDER_REVIEW,
}
