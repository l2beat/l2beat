import { ProjectId, UnixTime } from '@l2beat/types'

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
      'In July 2021 millions of dollars of user funds from the Multichain escrow addresses were taken out by validators to supply liquidity to Any tokens on various chains. \
      Multichain declares it as a shared liquidity managed by SMPC tool to promote the routing paths between chains and help reduce bridge fee for users.\
      As a result there is more tokens minted (e.g. DAI on Fantom) than there are tokens directly backing them in escrow.',
    description:
      'Multichain is an externally validated bridge. It uses a network of nodes running SMPC (Secure Multi Party Computation) protocol. It supports dozens of blockchains and thousands of tokens with both Token Bridge and Liquidity Network.',
    links: {
      websites: ['https://multichain.xyz/'],
      repositories: ['https://github.com/anyswap'],
      socialMedia: [
        'https://t.me/anyswap',
        'https://medium.com/multichainorg',
        'https://twitter.com/MultichainOrg',
      ],
    },
  },
  news: [
    {
      date: '2022-09-29',
      name: 'Go deep into Multichain Cross-chain Mechanism',
      link: 'https://multichainorg.medium.com/go-deep-into-multichain-cross-chain-mechanism-4a47836be250',
    },
    {
      date: '2022-04-11',
      name: 'anyCall, for your cross-chain Dapps',
      link: 'https://medium.com/multichainorg/anycall-for-your-cross-chain-dapps-ac0ece9140e9',
    },
    {
      date: '2022-09-28',
      name: 'Multichain fastMPC, a ground breaking improvement in decentralization',
      link: 'https://multichainorg.medium.com/fastmpc-mainnet-goes-live-running-in-a-decentralized-way-99f9fe2956b8',
    },
    {
      date: '2021-12-16',
      name: 'Anyswap to officially rebrand as Multichain',
      link: 'https://medium.com/multichainorg/anyswap-to-officially-rebrand-as-multichain-16ee7b961ffa',
    },
    {
      date: '2021-07-11',
      name: 'Anyswap Multichain Router V3 Exploit Statement',
      link: 'https://medium.com/multichainorg/anyswap-multichain-router-v3-exploit-statement-6833f1b7e6fb',
    },
    {
      date: '2021-06-04',
      name: 'Anyswap Multichain Router V3 Beta mainnet is Live!',
      link: 'https://medium.com/multichainorg/anyswap-multichain-router-v3-beta-mainnet-is-live-b41079f7335f',
    },
    {
      date: '2020-07-12',
      name: 'Introducing Anyswap — Fully Decentralized Cross Chain Swap Protocol',
      link: 'https://medium.com/multichainorg/introducing-anyswap-fully-decentralized-cross-chain-swap-protocol-82db1155b7a9',
    },
  ],
  config: {
    escrows: config.escrows.map((escrow) => ({
      address: escrow.address,
      sinceTimestamp: new UnixTime(escrow.sinceTimestamp),
      tokens: escrow.tokens,
    })),
  },
  technology: {
    category: 'Hybrid',
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
        address: '0x6b7a87899490EcE95443e979cA9485CBE7E71522',
        name: 'AnyswapV4Router',
        description: 'Multichain Liquidity Network Router V4.',
      },
      {
        address: '0xBa8Da9dcF11B50B03fd5284f164Ef5cdEF910705',
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
          address: '0x5e583b6a1686f7bc09a6bba66e852a7c80d36f00',
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
          address: '0x2A038e100F8B85DF21e4d44121bdBfE0c288A869 ',
          type: 'EOA',
        },
      ],
      name: 'Multichain MPC',
      description:
        'Account controlled by the MPC nodes. Can set minters for anyTokens. Can access liquidity in anyTokens.',
    },
  ],
}
