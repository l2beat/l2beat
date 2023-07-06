import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { assert } from 'console'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import {
  CONTRACTS,
  DATA_AVAILABILITY,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('aztecconnect')

function getAccessControl() {
  const accessControl = discovery.getContractValue<
    Record<string, { adminRole: string; members: string[] } | undefined>
  >('RollupProcessorV2', 'accessControl')

  const check = (contract: string, role: string) => {
    assert(Object.hasOwn(accessControl, role))
    assert(
      accessControl[role]?.members.length === 1,
      `${role} has more than one member. Add this member to the permissions section.`,
    )
    assert(
      accessControl[role]?.members[0] ===
        discovery.getContract(contract).address.toString(),
      `${contract} may not have role:${role} anymore. Update the permissions section.`,
    )
  }

  check('Aztec Multisig', 'DEFAULT_ADMIN_ROLE')
  check('Emergency Multisig', 'EMERGENCY_ROLE')
  check('Resume Multisig', 'RESUME_ROLE')
  check('Lister Multisig', 'LISTER_ROLE')

  return [
    ...discovery.getMultisigPermission(
      'Aztec Multisig',
      'Owner of ProxyAdmin contract, which is used to upgrade RollupProcessorV2. OWNER_ROLE on RollupProcessorV2: can enable capped deposit/withdrawals, can add rollupProviders (sequencers), can change delay before escape hatch, can change the verifier contract with no delay, can change defiBridgeProxy',
    ),
    ...discovery.getMultisigPermission(
      'Emergency Multisig',
      'EMERGENCY_ROLE on RollupProcessorV2: Can pause the rollup.',
    ),
    ...discovery.getMultisigPermission(
      'Resume Multisig',
      'RESUME_ROLE on RollupProcessorV2: Can resume the rollup.',
    ),
    ...discovery.getMultisigPermission(
      'Lister Multisig',
      "LISTER_ROLE on RollupProcessorV2: Can add new tokens and bridges to the rollup. Can't remove tokens or bridges.",
    ),
  ]
}

export const aztecconnect: Layer2 = {
  type: 'layer2',
  id: ProjectId('aztecconnect'),
  display: {
    name: 'Aztec Connect',
    slug: 'aztecconnect',
    warning:
      'EOL: Aztec team announced they are going to shut down the rollup infrastructure on March 21st, 2024.',
    description:
      'Aztec Connect is an open source layer 2 network that aims to bring scalability and privacy to Ethereum. It strives to enable affordable, private crypto payments via zero-knowledge proofs. Additionally it allows to deposit funds into a variety of DeFi Protocols such as LiDo, Element.Fi, etc.',
    purpose: 'Private DeFi',
    category: 'ZK Rollup',
    links: {
      websites: ['https://aztec.network/'],
      apps: ['https://zk.money'],
      documentation: ['https://developers.aztec.network/'],
      explorers: ['https://aztec-connect-prod-explorer.aztec.network/'],
      repositories: ['https://github.com/AztecProtocol/aztec-connect'],
      socialMedia: [
        'https://twitter.com/aztecnetwork',
        'https://medium.com/aztec-protocol',
        'https://t.me/aztecprotocol',
        'https://discord.gg/UDtJr9u',
      ],
    },
    activityDataSource: 'Explorer API',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455'),
        sinceTimestamp: new UnixTime(1654587783),
        tokens: ['ETH', 'DAI', 'wstETH'],
      },
    ],
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN,

      sources: [
        {
          contract: 'RollupProcessorV2',
          references: [
            'https://etherscan.io/address/0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09#code#F1#L706',
            'https://etherscan.io/address/0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09#code#F1#L1041',
            'https://etherscan.io/address/0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09#code#F1#L1054',
            'https://etherscan.io/address/0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09#code#F1#L1135',
          ],
        },
        {
          contract: 'Verifier28x32',
          references: [
            'https://etherscan.io/address/0xB656f4219f565b93DF57D531B574E17FE0F25939#code#F3#L150',
          ],
        },
      ],
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      sources: [
        {
          contract: 'RollupProcessorV2',
          references: [
            'https://etherscan.io/address/0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09#code#F1#L686',
          ],
        },
      ],
    },
    upgradeability: RISK_VIEW.UPGRADABLE_YES,
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE_ZK(),
      sources: [
        {
          contract: 'RollupProcessorV2',
          references: [
            'https://etherscan.io/address/0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09#code#F1#L697',
          ],
        },
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_SELF_PROPOSE_ZK,
      sources: [
        {
          contract: 'RollupProcessorV2',
          references: [
            'https://etherscan.io/address/0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09#code#F1#L697',
          ],
        },
      ],
    },
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
  }),
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeOpenSource: 'UnderReview',
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
  }),
  technology: {
    stateCorrectness: {
      ...STATE_CORRECTNESS.VALIDITY_PROOFS,
      references: [
        {
          text: 'RollupProcessorV2.sol#L706 - Etherscan source code',
          href: 'https://etherscan.io/address/0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09#code#F1#L706',
        },
      ],
    },
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
      references: [
        {
          text: 'Verifier28x32.sol#L150 - Etherscan source code',
          href: 'https://etherscan.io/address/0xB656f4219f565b93DF57D531B574E17FE0F25939#code#F3#L150',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN,
      references: [
        {
          text: 'RollupProcessorV2.sol#L686 - Etherscan source code',
          href: 'https://etherscan.io/address/0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09#code#F1#L686',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      description:
        'Only specific addresses appointed by the owner are permitted to propose new blocks during regular rollup operation. Periodically a special window is open during which anyone can propose new blocks.',
      references: [
        {
          text: 'RollupProcessorV2.sol#L692 - Etherscan source code',
          href: 'https://etherscan.io/address/0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09#code#F1#L692',
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
          text: 'RollupProcessorV2.sol#L697 - Etherscan source code',
          href: 'https://etherscan.io/address/0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09#code#F1#L697',
        },
        {
          text: 'RollupProcessorV2.sol#L697 - Etherscan source code',
          href: 'https://etherscan.io/address/0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09#code#F1#L1491',
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
            text: 'RollupProcessorV2.sol#L1042 - Etherscan source code',
            href: 'https://etherscan.io/address/0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09#code#F1#L1042',
          },
          {
            text: 'RollupProcessorV2.sol#L1206 - Etherscan source code',
            href: 'https://etherscan.io/address/0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09#code#F1#L1206',
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
      discovery.getContractDetails('RollupProcessorV2', {
        description:
          'Main Rollup contract responsible for deposits, withdrawals and accepting transaction batches alongside zkProof.',
        pausable: {
          paused: discovery.getContractValue('RollupProcessorV2', 'paused'),
          pausableBy: ['Emergency Multisig'],
        },
        upgradeDelay: 'No delay',
        upgradableBy: ['Aztec Multisig'],
      }),
      // rollupBeneficiary is encoded in proofData. Can be set arbitrarily for each rollup.
      // https://etherscan.io/address/0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09#code#F1#L704
      {
        address: EthereumAddress('0x4cf32670a53657596E641DFCC6d40f01e4d64927'),
        description:
          'Contract responsible for distributing fees and reimbursing gas to Rollup Providers.',
        name: 'AztecFeeDistributor',
      },
      discovery.getContractDetails(
        'DefiBridgeProxy',
        'Bridge Connector to various DeFi Bridges.',
      ),
      discovery.getContractDetails('Verifier28x32', {
        description:
          'Standard Plonk zkSNARK Verifier. It can be upgraded by the owner with no delay.',
        upgradeDelay: 'No delay',
        upgradableBy: ['Aztec Multisig'],
        upgradeConsiderations:
          'The verifier can be changed in the RollupProcessor contract with no delay.',
      }),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    ...getAccessControl(),
    {
      name: 'Rollup Providers',
      description:
        'Actors allowed to call the processRollup function on the RollupProcessorvV2 contract.',
      accounts: discovery
        .getContractValue<string[]>('RollupProcessorV2', 'rollupProviders')
        .map((account) => discovery.formatPermissionedAccount(account)),
    },
  ],
  milestones: [
    {
      name: 'Mainnet Launch',
      date: '2022-07-07T00:00:00Z',
      link: 'https://medium.com/aztec-protocol/aztec-network-launches-first-ever-private-defi-solution-for-ethereum-e5ec7624d430',
      description:
        'Aztec Connect is live on mainnet, enabling private DeFi on Ethereum.',
    },
    {
      name: 'Introducing Noir',
      date: '2022-10-06T00:00:00Z',
      link: 'https://medium.com/aztec-protocol/introducing-noir-the-universal-language-of-zero-knowledge-ff43f38d86d9',
      description:
        'Noir - programming language for zero-knowledge proofs, has been introduced.',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'Explaining the Aztec Network',
      url: 'https://medium.com/aztec-protocol/explaining-the-network-in-aztec-network-166862b3ef7d',
      thumbnail: NUGGETS.THUMBNAILS.AZTEC_01,
    },
    {
      title: 'Economics of Aztec zkRollup',
      url: 'https://medium.com/aztec-protocol/privacy-for-pennies-scaling-aztecs-zkrollup-9f2b36615cc6',
      thumbnail: NUGGETS.THUMBNAILS.AZTEC_02,
    },
    {
      title: 'Understanding PLONK',
      url: 'https://vitalik.ca/general/2019/09/22/plonk.html',
      thumbnail: NUGGETS.THUMBNAILS.VITALIK_01,
    },
  ],
}
