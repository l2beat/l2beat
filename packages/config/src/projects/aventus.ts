import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { Project } from './types'

export const aventus: Project = {
  name: 'Aventus',
  slug: 'Aventus',
  bridges: [
    {
      address: '0x1Af691Cf6d6944C53e42dAAC8395e63F46186E68',
      sinceBlock: 11821956,  
      tokens: ['AVT', 'PIP', 'VOW', 'vGBP', 'vZAR', 'vDKK', 'vEUR', 'vINR', 'vUSD', 'vZWL'] 
    },
    {
      address: '0x73fe91d082b3604b8261de321086333e78ab1112', 
      sinceBlock: 11821788,
      tokens: ['AVT', 'PIP', 'VOW', 'vGBP', 'vZAR', 'vDKK', 'vEUR', 'vINR', 'vUSD', 'vZWL'] 
    }
  ],
  details: {
    description:
      'The customisable layer-2 blockchain network that lets you build on Ethereum at scale to process transactions at 100x the speed and 1% of the cost.',
    purpose: 'Universal',
    links: {
      websites: ['https://www.aventus.io/'],
      apps: [],
      documentation: [
        'https://github.com/AventusProtocolFoundation/docs/blob/master/resources/Aventus%20Whitepaper%202021.pdf',
        'https://aventus-network-services.github.io/avn-gateway-docs/',
      ],
      explorers: ['https://explorer.aventus.io/#/'],
      repositories: [
        'https://github.com/AventusProtocolFoundation',
        'https://github.com/Aventus-Network-Services',
      ],
      socialMedia: [
        'https://t.me/Aventus_Official',
        'https://twitter.com/aventusnetwork',
        'https://www.linkedin.com/company/aventusnetwork/',
        'https://www.youtube.com/channel/UC2OQltKgxlRwnmUZIoNRXag',
        'https://medium.com/aventus',
        'https://www.reddit.com/r/Aventus/',
      ],
    },
    riskView: {
      stateValidation: RISK_VIEW.STATE_FP,  
      dataAvailability: RISK_VIEW.DATA_ON_CHAIN,  
      upgradeability: RISK_VIEW.UPGRADABLE_YES,
      validatorFailure: RISK_VIEW.VALIDATOR_ESCAPE_U,
      sequencerFailure: RISK_VIEW.SEQUENCER_TRANSACT_L1
    },
    technology: {
      category: {
        name: 'Summary',
        details: "A summary is generated every day. In that summary, all the fee-paying transactions that occurred in the L2 are included and a Merkle Tree is created with them. This Merkle Tree is signed off by all the validators, with Ethereum keys. These signatures and the Merkle Tree root are sent to a contract on Ethereum and the root is registered there. If the root already exists, this registration reverts. If there are no transactions in this period of time, the root is not registered on Ethereum. All the transactions that occur on T2 are included in a proof that is written to Ethereum at most one day after their execution.",
      },
      stateCorrectness: STATE_CORRECTNESS.FRAUD_PROOFS, 
      dataAvailability: {
        ...DATA_AVAILABILITY.GENERIC_OFF_CHAIN,
      },
      operator: OPERATOR.CENTRALIZED_OPERATOR,
      forceTransactions: FORCE_TRANSACTIONS.STARKEX_PERPETUAL_WITHDRAW,
      exitMechanisms: [
        {
          name: 'Lowering',
          description:
            'The user can initiate a withdrawal by submitting a transaction on L2. When the block containing the transaction is validated on L2 and proven on L1, the assets can be withdrawn on L1 by the user.',
          risks: [],
          references: [
            {
              text: 'Lowering tokens from the Aventus Network to Ethereum - Documentation',
              href: 'https://github.com/Aventus-Network-Services/documentation/blob/main/avn-ui/avn-ui-lower.md',
            }
          ]
        }
      ],
      contracts: {
        addresses: [
          {
            address: '0xAa0304f6E2426119BbE10870DF3edb867D5Ec101',
            name: 'Storage',
            description: ''
          },
          {
            address: '0x46eaD2891ecf9c7444cB9197D4FAacC7F54C593C',
            name: ' Validator Manager',
            description: ''
          },
          {
            address: '0x1Af691Cf6d6944C53e42dAAC8395e63F46186E68',
            name: 'Scaling Manager',
            description: ''
          },
          {
            address: '0x73fe91d082b3604b8261De321086333E78AB1112',
            name: 'Treasury',
            description: ''
          },
          {
            address: '0x0d88eD6E74bbFD96B831231638b66C05571e824F',
            name: 'AVT ERC20 Token',
            description: ''
          }
        ],
        risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
      },
    },
    news: [
      {
        date: '2021-12-09',
        name: 'Aventus Token (AVT) Launches on Bittrex Global',
        link: 'https://www.securities.io/aventus-token-avt-launches-on-bittrex-global/',
      },
      {
        date: '2021-10-27',
        name: 'Доходность в 500% и выше. Токены с лучшими за неделю результатами',
        link: 'https://e-cryptonews.com/aventus-nft-upgrades-layer-2-solutions/',
      },
      {
        date: '2021-09-14',
        name: 'Aventus Network switches on NFT support following fundamental upgrades to platform',
        link: 'https://www.finyear.com/Aventus-Network-switches-on-NFT-support-following-fundamental-upgrades-to-platform_a45304.html',
      },
      {
        date: '2021-08-10',
        name: 'Gaming Social Network Fruitlab Selects Aventus Network’s Blockchain Technology',
        link: 'https://e-cryptonews.com/gaming-social-network-fruitlab-selects-aventus-networks-blockchain-technology/',
      },
      {
        date: '2021-04-15',
        name: 'Live Nation France launches TixTo.Me with FanDragon and Aventus Network',
        link: 'https://www.mgbmag.fr/2021/04/15/communique-live-nation-france-lance-tixto-me-avec-fandragon-et-aventus-network/',
      },
      {
        date: '2021-02-02',
        name: 'The MainNet Aventus Network (AvN) Is Now Officially Live',
        link: 'https://medium.com/aventus/the-main-net-aventus-network-avn-is-now-officially-live-419a7a2c4d2c'
      },
      {
        date: '2021-02-02',
        name: 'Aventus\' Validator Registration More Than 25% Full In First 24 Hours',
        link: 'https://medium.com/aventus/aventus-validator-registration-more-than-25-full-in-first-24-hours-5b223738c452'
      }
    ],
  },
}
