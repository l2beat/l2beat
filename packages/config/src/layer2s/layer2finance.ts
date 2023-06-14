import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  DATA_AVAILABILITY,
  EXITS,
  makeBridgeCompatible,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { Layer2 } from './types'

export const layer2finance: Layer2 = {
  type: 'layer2',
  id: ProjectId('layer2finance'),
  display: {
    name: 'Layer2.Finance',
    slug: 'layer2finance',
    warning:
      'Currently the TVL is calculated incorrectly, because it does not take assets locked in DeFi into account.',
    description:
      'Layer2.Finance aims to democratize access to DeFi protocols for everyone. Users can aggregate their DeFi usage and save on Ethereum fees.',
    purpose: 'DeFi aggregation',
    links: {
      websites: ['https://layer2.finance/'],
      apps: ['https://app.l2.finance/'],
      documentation: ['https://docs.l2.finance/'],
      explorers: [],
      repositories: [
        'https://github.com/celer-network/layer2-finance-contracts',
      ],
      socialMedia: [
        'https://discord.gg/uGx4fjQ',
        'https://t.me/celernetwork',
        'https://twitter.com/CelerNetwork',
      ],
    },
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0xf86FD6735f88d5b6aa709B357AD5Be22CEDf1A05'),
        sinceTimestamp: new UnixTime(1619011215),
        tokens: ['BUSD', 'DAI', 'USDC', 'USDT', 'WETH'],
      },
    ],
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_FP_1R,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    upgradeability: RISK_VIEW.UPGRADABLE_NO,
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
    destinationToken: RISK_VIEW.CANONICAL,
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    category: 'Optimistic Rollup',
    stateCorrectness: {
      ...STATE_CORRECTNESS.FRAUD_PROOFS,
      description:
        STATE_CORRECTNESS.FRAUD_PROOFS.description +
        ' Unfortunately in case of Layer2.Finance only some fraud proofs revert blocks and every successful fraud proof pauses the contract requiring the owner to unpause.',
      risks: [
        ...STATE_CORRECTNESS.FRAUD_PROOFS.risks,
        {
          category: 'Funds can be frozen if',
          text: 'the problematic fraud proof mechanism is exploited.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'Which L2 scaling paradigm is Layer2.Finance using - Layer2.Finance FAQ',
          href: 'https://docs.l2.finance/#/faq?id=which-l2-scaling-paradigm-is-layer2finance-using',
        },
        {
          text: 'RollupChain.sol#L441 - Layer2.Finance source code',
          href: 'https://github.com/celer-network/layer2-finance-contracts/blob/61ed0f17a15e8ba06778776ade1a82956a9de842/contracts/RollupChain.sol#L441',
        },
        {
          text: 'RollupChain.sol#L605 - Layer2.Finance source code',
          href: 'https://github.com/celer-network/layer2-finance-contracts/blob/61ed0f17a15e8ba06778776ade1a82956a9de842/contracts/RollupChain.sol#L605',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN,
      references: [
        {
          text: 'RollupChain.sol#L191 - Layer2.Finance source code',
          href: 'https://github.com/celer-network/layer2-finance-contracts/blob/61ed0f17a15e8ba06778776ade1a82956a9de842/contracts/RollupChain.sol#L191',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      risks: [
        ...OPERATOR.CENTRALIZED_OPERATOR.risks,
        {
          category: 'Funds can be frozen if',
          text: 'the sequencer halts its operations.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'RollupChain.sol#L191 - Layer2.Finance source code',
          href: 'https://github.com/celer-network/layer2-finance-contracts/blob/61ed0f17a15e8ba06778776ade1a82956a9de842/contracts/RollupChain.sol#L191',
        },
        {
          text: 'Layer2.finance - Celer Network blog',
          href: 'https://blog.celer.network/2021/02/18/layer2-finance-get-defi-mass-adoption-today-scaling-layer-1-defi-in-place-with-zero-migration/',
        },
      ],
    },
    forceTransactions: {
      name: 'There is no force transaction mechanism',
      description:
        'If the users find themselves censored they can do nothing to force the inclusion of their transactions.',
      risks: [
        {
          category: 'Users can be censored if',
          text: 'the sequencer refuses to include their transactions.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'RollupChain.sol#L191 - Layer2.Finance source code',
          href: 'https://github.com/celer-network/layer2-finance-contracts/blob/61ed0f17a15e8ba06778776ade1a82956a9de842/contracts/RollupChain.sol#L191',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('optimistic', 'no proof'),
        risks: [
          {
            category: 'Funds can be stolen if',
            text: "the operator does not include user's L2 withdrawal transactions.",
            isCritical: true,
          },
        ],
        references: [
          {
            text: 'RollupChain.sol#L191 - Layer2.Finance source code',
            href: 'https://github.com/celer-network/layer2-finance-contracts/blob/61ed0f17a15e8ba06778776ade1a82956a9de842/contracts/RollupChain.sol#L191',
          },
        ],
      },
    ],
  },
  contracts: {
    addresses: [
      {
        name: 'RollupChain',
        address: EthereumAddress('0xf86FD6735f88d5b6aa709B357AD5Be22CEDf1A05'),
      },
      {
        name: 'TransitionDisputer',
        address: EthereumAddress('0x5D3c0F4cA5EE99f8E8F59Ff9A5fAb04F6a7e007f'),
      },
      {
        name: 'Registry',
        address: EthereumAddress('0xFe81ab6930A30BdaE731fe7b6C6ABFbEAFc014a8'),
      },
    ],
    risks: [
      {
        category: 'Funds can be stolen if',
        text: 'the owner calls owner-only functions that pause the contract and drain funds.',
        isCritical: true,
      },
    ],
    references: [
      {
        text: 'RollupChain.sol#L460-L496 - Layer2.Finance source code',
        href: 'https://github.com/celer-network/layer2-finance-contracts/blob/61ed0f17a15e8ba06778776ade1a82956a9de842/contracts/RollupChain.sol#L460-L496',
      },
    ],
  },
}
