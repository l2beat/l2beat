import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { NUGGETS } from '../layer2s'
import { RISK_VIEW } from './common'
import * as config from './multichain-config.json'
import { Bridge } from './types'

export const multichain: Bridge = {
  type: 'bridge',
  id: ProjectId('multichain'),
  display: {
    name: 'Multichain',
    slug: 'multichain',
    warning:
      "THE BRIDGE IS NOT SAFE FOR USE. The Multichain's team urges everyone to refrain from using the bridge as it is under investigation by Chinese law enforcement authorities. For more information, please visit: https://twitter.com/multichainorg/status/1679768407628185600.",
    description:
      'Multichain is an externally validated bridge. It uses a network of nodes running SMPC (Secure Multi Party Computation) protocol. It supports dozens of blockchains and thousands of tokens with both Token Bridge and Liquidity Network.',
    category: 'Hybrid',
    links: {
      repositories: ['https://github.com/anyswap'],
      socialMedia: ['https://twitter.com/MultichainOrg'],
    },
  },
  config: {
    escrows: config.escrows.map((escrow) => ({
      address: EthereumAddress(escrow.address),
      sinceTimestamp: new UnixTime(escrow.sinceTimestamp),
      tokens: escrow.tokens,
    })),
  },
  technology: {
    destination: config.destinations,
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Multichain (formerly AnySwap) is a Hybrid Bridge that, depending on a token, can act as a Token Bridge or as a Liquidity Network.\
        It uses multiple escrows on a source chain (one per each destination) in addition to tokenized Liquidity Pools (anyToken contracts) - one anyToken contract per token.\
        It uses an on-chain Router that, depending on the token/destination will choose either TokenBridge or Liquidity Network to bridge assets.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Transfers are externally verified',
      description:
        'Outgoing transfers are being watched by external entities that - utilizing MPC (MultiParty Computation)  - sign off token minting (for Token Bride) or token swap\
        (for Liquidity Network). Incoming transfers work similarly - tokens burned on a source chain release tokens from escrow on a destination chain.',
      references: [],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'MPC nodes decide to maliciously takeover them or there is an external exploit which will result in signing malicious transaction.',
          isCritical: true,
          _ignoreTextFormatting: true,
        },
        {
          category: 'Users can be censored if',
          text: 'MPC nodes decide to censor certain transactions.',
          isCritical: true,
          _ignoreTextFormatting: true,
        },
        {
          category: 'Funds can be lost if',
          text: 'MPC nodes lose the private key.',
          isCritical: true,
          _ignoreTextFormatting: true,
        },
        {
          category: 'Funds can be frozen if',
          text: 'MPC nodes decide to stop processing transfers.',
          isCritical: true,
          _ignoreTextFormatting: true,
        },
      ],
    },
    destinationToken: {
      name: 'Destination tokens',
      description:
        'Type of the token received on the destination chain depends on the token. Users may receive wrapped Token, canonical Token or anyToken that can be considered to be an IOU for the canonical Token.',
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'destination token contract is maliciously upgraded or not securely implemented.',
          isCritical: true,
        },
      ],
      references: [],
    },
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: '2/3rd of MPC.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'No / EOA',
      description:
        'Depending on the router configuration escrow contracts are EOAs or Any tokens which cannot be upgraded.',
      sentiment: 'bad',
    },
    destinationToken: {
      ...RISK_VIEW.CANONICAL_OR_WRAPPED,
      description:
        RISK_VIEW.CANONICAL_OR_WRAPPED.description +
        ' Depending on the router configuration either Multichain tokens or Any tokens are minted.',
    },
  },
  contracts: {
    isIncomplete: true,
    addresses: [
      {
        address: EthereumAddress('0x6b7a87899490EcE95443e979cA9485CBE7E71522'),
        name: 'AnyswapV4Router',
        description: 'Multichain Liquidity Network Router V4.',
      },
      {
        address: EthereumAddress('0xBa8Da9dcF11B50B03fd5284f164Ef5cdEF910705'),
        name: 'AnyswapV6Router',
        description: 'Multichain Liquidity Network Router V6.',
      },
    ],
    risks: [],
  },
  permissions: [
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x5E583B6a1686f7Bc09A6bBa66E852A7C80d36F00',
          ),
          type: 'EOA',
        },
      ],
      name: 'Multichain "Liquidity Tool"',
      description:
        'Privileged account that received funds from Ethereum source escrow without corresponding burn on the destination chain. These funds were bridged to different chains and used to supply liquidity\
        for various anyTokens. Users have to trust this account that it never tries to redeem held anyTokens for the underlying canonical token.',
    },
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x2A038e100F8B85DF21e4d44121bdBfE0c288A869',
          ),
          type: 'EOA',
        },
      ],
      name: 'Multichain MPC',
      description:
        'Account controlled by the MPC nodes. Can set minters for anyTokens. Can access liquidity in anyTokens.',
    },
  ],
  milestones: [
    {
      name: 'Anyswap rebrands to Multichain',
      date: '2021-12-16T00:00:00Z',
      link: 'https://medium.com/multichainorg/anyswap-to-officially-rebrand-as-multichain-16ee7b961ffa',
    },
    {
      name: 'Contracts hacked for $3M',
      date: '2022-01-18T00:00:00Z',
      description:
        'Multiple critical vulnerabilities were found in the contracts.',
      link: 'https://medium.com/multichainorg/multichain-contract-vulnerability-post-mortem-d37bfab237c8',
    },
    {
      name: 'anyCall was introduced',
      date: '2022-04-11T00:00:00Z',
      description:
        'This is the generic cross-chain mechanism that Multichain uses.',
      link: 'https://medium.com/multichainorg/anycall-for-your-cross-chain-dapps-ac0ece9140e9',
    },
    {
      name: 'fastMPC was introduced',
      date: '2022-09-21T00:00:00Z',
      description:
        'It is an upgrade of the network that is used to check cross chain messages.',
      link: 'https://multichainorg.medium.com/fastmpc-mainnet-goes-live-running-in-a-decentralized-way-99f9fe2956b8',
    },
    {
      name: 'Contracts hacked for $130M',
      date: '2023-07-07T00:00:00Z',
      link: 'https://blockworks.co/news/multichain-anyswap-exploit',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'Multichain deep dive',
      url: 'https://li.fi/knowledge-hub/multichain-a-deep-dive/',
      thumbnail: NUGGETS.THUMBNAILS.LIFI_01,
    },
    {
      title: 'Multichain escrow problem',
      url: 'https://twitter.com/bkiepuszewski/status/1572537802512044034',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
    },
  ],
}
