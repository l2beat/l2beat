import {
  AssetId,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { opStack } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('lyra')

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

const TOKENS: Omit<Token, 'chainId'>[] = [
  {
    id: AssetId.USDC_ON_LYRA,
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    iconUrl:
      'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389',
    address: EthereumAddress('0x6879287835A86F50f784313dBEd5E5cCC5bb8481'),
    coingeckoId: CoingeckoId('usd-coin'),
    sinceTimestamp: new UnixTime(1700221999),
    category: 'stablecoin',
    type: 'EBV',
    formula: 'totalSupply',
    bridgedUsing: {
      bridge: 'Socket',
    },
  },
]

export const lyra: Layer2 = opStack({
  discovery,
  tokenList: TOKENS.map((t) => ({ ...t, chainId: ChainId.LYRA })),
  display: {
    name: 'Lyra',
    slug: 'lyra',
    description:
      'Lyra Chain is an L2 scaling solution built using OP Stack specially for Lyra protocol - a settlement protocol for spot, perpetuals, and options trading.',
    purposes: ['Exchange'],
    category: 'Optimistic Rollup',
    dataAvailabilityMode: 'TxData',
    provider: 'OP Stack',
    links: {
      websites: ['https://lyra.finance/'],
      apps: ['https://lyra.finance/portfolio'],
      documentation: ['https://docs.lyra.finance/docs/introduction'],
      explorers: ['https://explorer.lyra.finance/'],
      repositories: ['https://github.com/lyra-finance/v2-core'],
      socialMedia: [
        'https://twitter.com/lyrafinance',
        'https://discord.gg/Lyra',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  upgradeability,
  l1StandardBridgeEscrow: EthereumAddress(
    '0x61E44dC0dae6888B5a301887732217d5725B0bFf',
  ),
  apiUrl: 'https://rpc.lyra.finance',
  sequencerAddress: EthereumAddress(
    discovery.getContractValue('SystemConfig', 'batcherHash'),
  ),
  inboxAddress: EthereumAddress('0x5f7f7f6DB967F0ef10BdA0678964DBA185d16c50'),
  genesisTimestamp: new UnixTime(1700022479),
  l2OutputOracle: discovery.getContract('L2OutputOracle'),
  portal: discovery.getContract('OptimismPortal'),
  // stateDerivation: DERIVATION.OPSTACK('LYRA'),
  milestones: [
    {
      name: 'Lyra V2 live on mainnet',
      link: 'https://x.com/lyrafinance/status/1735516929341980748',
      date: '2023-12-15T00:00:00Z',
      description: 'Lyra V2 launches on Mainnet.',
    },
  ],
  knowledgeNuggets: [],
  roleOverrides: {
    batcherHash: 'Sequencer',
    PROPOSER: 'Proposer',
    GUARDIAN: 'Guardian',
    CHALLENGER: 'Challenger',
  },
  nonTemplatePermissions: [
    // TODO: check whether the description is correct
    ...discovery.getMultisigPermission(
      'LyraMultisig',
      'This address is the owner of the following contracts: ProxyAdmin, SystemConfig. It can upgrade the bridge implementation potentially gaining access to all funds, and change the sequencer, state root proposer or any other system component (unlimited upgrade power).',
    ),
    ...discovery.getMultisigPermission(
      'ChallengerMultisig',
      'This address is the permissioned challenger of the system. It can delete non finalized roots without going through the fault proof process. It is also designated as a Guardian of the OptimismPortal, meaning it can halt withdrawals.',
    ),
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('L1ERC721Bridge', {
      description:
        'The L1ERC721Bridge contract is the main entry point to deposit ERC721 tokens from L1 to L2.',
      ...upgradeability,
    }),
  ],
})
