import { ProjectId, UnixTime } from '@l2beat/common'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  SHARP_VERIFIER_CONTRACT,
  STATE_CORRECTNESS,
} from './common'
import { Project } from './types'

export const immutablex: Project = {
  name: 'Immutable X',
  slug: 'immutablex',
  id: ProjectId('immutablex'),
  bridges: [
    {
      address: '0x5FDCCA53617f4d2b9134B29090C87D01058e27e9',
      sinceTimestamp: new UnixTime(1615389188),
      tokens: ['ETH', 'IMX', 'USDC'],
    },
  ],
  associatedTokens: ['IMX'],
  details: {
    description:
      'Immutable X claims to be the first Layer 2 for NFTs on Ethereum. It promises zero gas fees, instant trades and scalability for games, applications, marketplaces, without compromise.',
    purpose: 'NFT, Exchange',
    links: {
      websites: ['https://www.immutable.com/'],
      apps: ['https://market.x.immutable.com/'],
      documentation: ['https://docs.starkware.co/starkex-docs-v2/'],
      explorers: ['https://immutascan.io/'],
      repositories: ['https://github.com/starkware-libs/starkex-contracts'],
      socialMedia: [
        'https://medium.com/@immutablex',
        'https://twitter.com/Immutable',
      ],
    },
    provider: 'StarkEx',
    riskView: {
      stateValidation: RISK_VIEW.STATE_ZKP_ST,
      dataAvailability: RISK_VIEW.DATA_EXTERNAL_DAC,
      upgradeability: RISK_VIEW.UPGRADE_DELAY('14 days'),
      sequencerFailure: RISK_VIEW.SEQUENCER_STARKEX_SPOT,
      validatorFailure: RISK_VIEW.VALIDATOR_ESCAPE_STARKEX_NFT,
    },
    technology: {
      category: {
        name: 'Validium',
        details: "Powered by StarkWare's StarkEx",
      },
      stateCorrectness: STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
      newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
      dataAvailability: DATA_AVAILABILITY.STARKEX_OFF_CHAIN,
      operator: OPERATOR.STARKEX_OPERATOR,
      forceTransactions: FORCE_TRANSACTIONS.STARKEX_SPOT_WITHDRAW,
      exitMechanisms: EXITS.STARKEX_NFT,
      contracts: {
        addresses: [
          {
            name: 'StarkExchange',
            address: '0x5FDCCA53617f4d2b9134B29090C87D01058e27e9',
            upgradeability: {
              type: 'StarkWare',
              implementation: '0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC',
              upgradeDelay: 1209600,
              isFinal: false,
            },
          },
          {
            name: 'Committee',
            description:
              'Data Availability Committee (DAC) contract verifing data availability claim from DAC Members (via multisig check).',
            address: '0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295',
          },
          SHARP_VERIFIER_CONTRACT,
        ],
        risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK('14 days')],
      },
    },
    news: [
      {
        date: '2021-08-19',
        name: 'Immutable X is Making NFTs Carbon Neutral on Ethereum',
        link: 'https://immutablex.medium.com/immutable-x-is-making-nfts-carbon-neutral-on-ethereum-620dd0be08ae',
      },
      {
        date: '2021-08-17',
        name: 'Immutable X Community AMA with James Ferguson — August 2021',
        link: 'https://immutablex.medium.com/immutable-x-community-ama-with-james-ferguson-august-2021-4e61b4e1c4d5',
      },
      {
        date: '2021-08-16',
        name: 'Important Announcement: IMX Alpha Rewards Update',
        link: 'https://immutablex.medium.com/important-announcement-imx-alpha-rewards-update-929f7bc89513',
      },
    ],
  },
}
