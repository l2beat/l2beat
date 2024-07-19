import { assert, EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { EXITS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('thebinaryholdings')

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

const optimismPortalImplementation =
  discovery.get$Implementations('OptimismPortal')[0]
const l2OutputOracleImplementation =
  discovery.get$Implementations('L2OutputOracle')[0]

assert(optimismPortalImplementation, 'OptimismPortal implementation not found')
assert(l2OutputOracleImplementation, 'L2OutputOracle implementation not found')

export const thebinaryholdings: Layer2 = opStackL2({
  discovery,
  display: {
    name: 'The Binary Holdings',
    slug: 'thebinaryholdings',
    architectureImage: 'thebinaryholdings',
    description:
      'The Binary Holdings (TBH) provides Web3 infrastructure for telecommunication companies in emerging economies across Southeast Asia, serving over 40 million users. Our native utility token, $BNRY, facilitates network gas and all transactions within the TBH ecosystem.',
    purposes: ['Universal', 'DeFi'],
    links: {
      websites: [
        'https://thebinaryholdings.com',
      ],
      apps: ['https://thebinaryholdings.com/bridge'],
      documentation: [
        'https://docs.thebinaryholdings.com',
        'https://www.bnrytoken.com/files/BNRY_Whitepaper_v.1.4.pdf',
        'https://www.bnrytoken.com/files/BNRY_Litepaper_V.1.0.pdf'
    ],
      explorers: [
        'https://bnrytoken.com/',
        'https://scan-to-earn.vercel.app',
        'https://hacknative.com',
        'https://network.thebinaryholdings.com/',
        ],
      repositories: [],
      socialMedia: [
        'https://twitter.com/thebinaryhldgs',
        'https://t.me/tbhofficialchat',
        'https://discord.gg/Xcgnv5Fq',
        'https://www.youtube.com/@TheBinaryHoldings',
        'https://medium.com/@thebinaryholdings',
        'https://www.linkedin.com/company/the-binary-holdings/'
      ],
    },
    activityDataSource: 'Blockchain RPC',
    tvlWarning: {
      content: 'The TVL does account for rehypothecated tokens.',
      sentiment: 'bad',
    },
  },
  nonTemplateTechnology: {
    exitMechanisms: [
      {
        ...EXITS.REGULAR_YIELDING(
          'optimistic',
          discovery.getContractValue<number>(
            'L2OutputOracle',
            'FINALIZATION_PERIOD_SECONDS',
          ),
        ),
        references: [
          {
            text: 'OptimismPortal.sol - Etherscan source code, proveWithdrawalTransaction function',
            href: `https://etherscan.io/address/${optimismPortalImplementation.toString()}#code`,
          },
          {
            text: 'OptimismPortal.sol - Etherscan source code, finalizeWithdrawalTransaction function',
            href: `https://etherscan.io/address/${optimismPortalImplementation.toString()}#code`,
          },
          {
            text: 'L2OutputOracle.sol - Etherscan source code, PROPOSER check',
            href: `https://etherscan.io/address/${l2OutputOracleImplementation.toString()}#code`,
          },
        ],
        risks: [EXITS.RISK_REHYPOTHECATED_ASSETS, EXITS.RISK_LACK_OF_LIQUIDITY],
      },
      {
        ...EXITS.FORCED('all-withdrawals'),
        references: [
          {
            text: 'Forced withdrawal from an OP Stack blockchain',
            href: 'https://stack.optimism.io/docs/security/forced-withdrawal/',
          },
        ],
      },
    ],
  },
  upgradeability,
  rpcUrl: 'https://rpc.testnet.thebinaryholdings.com/',
  chainConfig: {
    name: 'thebinaryholdings',
    coingeckoPlatform: 'thebinaryholdings',
    chainId: 81458,
    explorerUrl: 'https://explorer.sepolia.thebinaryholdings.com',
    // explorerApi: {
    //   url: 'https://api.binaryscan.io/api',
    //   type: 'etherscan',
    // },
    minTimestampForTvl: UnixTime.fromDate(new Date('2024-02-24T21:23:35Z')),
    // multicallContracts: [
    //   {
    //     address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
    //     batchSize: 150,
    //     sinceBlock: 88189,
    //     version: '3',
    //   },
    // ],
  },
  finality: {
    type: 'OPStack',
    lag: 0,
    stateUpdate: 'disabled',
  },
  genesisTimestamp: new UnixTime(1708766753),
  isNodeAvailable: true,
  usesBlobs: true,
  associatedTokens: ['BNRY'],
  nodeSourceLink: 'https://github.com/The-Binary-Holdings',
  
})
