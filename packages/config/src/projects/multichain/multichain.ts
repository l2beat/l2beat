import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { BRIDGE_RISK_VIEW } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import config from './multichain-config.json'

const discovery = new ProjectDiscovery('multichain')

export const multichain: Bridge = {
  type: 'bridge',
  id: ProjectId('multichain'),
  addedAt: UnixTime(1662628329), // 2022-09-08T09:12:09Z
  display: {
    name: 'Multichain',
    slug: 'multichain',
    warning:
      "THE BRIDGE IS NOT SAFE FOR USE. The Multichain's team urges everyone to refrain from using the bridge as it is under investigation by Chinese law enforcement authorities. [**<u>For more information, please visit this thread.</u>**](https://twitter.com/multichainorg/status/1679768407628185600)",
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
      sinceTimestamp: UnixTime(escrow.sinceTimestamp),
      tokens: escrow.tokens,
      chain: 'ethereum',
    })),
  },
  technology: {
    destination: config.destinations,
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Multichain (formerly AnySwap) is a Hybrid Bridge that, depending on a token, can act as a Token Bridge or as a Liquidity Network.\
        It uses multiple escrows on a source chain (one per each destination) in addition to tokenized Liquidity Pools (anyToken contracts) - one anyToken contract per token.\
        It uses an onchain Router that, depending on the token/destination will choose either TokenBridge or Liquidity Network to bridge assets.',
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

          _ignoreTextFormatting: true,
        },
        {
          category: 'Users can be censored if',
          text: 'MPC nodes decide to censor certain transactions.',

          _ignoreTextFormatting: true,
        },
        {
          category: 'Funds can be lost if',
          text: 'MPC nodes lose the private key.',

          _ignoreTextFormatting: true,
        },
        {
          category: 'Funds can be frozen if',
          text: 'MPC nodes decide to stop processing transfers.',

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
    destinationToken: {
      ...BRIDGE_RISK_VIEW.CANONICAL_OR_WRAPPED,
      description:
        BRIDGE_RISK_VIEW.CANONICAL_OR_WRAPPED.description +
        ' Depending on the router configuration either Multichain tokens or Any tokens are minted.',
    },
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails(
          'AnyswapV4Router',
          'Multichain Liquidity Network Router V4.',
        ),
        discovery.getContractDetails(
          'AnyswapV6Router',
          'Multichain Liquidity Network Router V6.',
        ),
      ],
    },
    risks: [],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getPermissionDetails(
          'Multichain "Liquidity Tool"',
          discovery.formatPermissionedAccounts([
            ChainSpecificAddress(
              'eth:0x5E583B6a1686f7Bc09A6bBa66E852A7C80d36F00',
            ),
          ]),
          'Privileged account that received funds from Ethereum source escrow without corresponding burn on the destination chain. These funds were bridged to different chains and used to supply liquidity for various anyTokens. Users have to trust this account that it never tries to redeem held anyTokens for the underlying canonical token.',
        ),
        discovery.getPermissionDetails(
          'Multichain MPC',
          discovery.formatPermissionedAccounts([
            ChainSpecificAddress(
              'eth:0x2A038e100F8B85DF21e4d44121bdBfE0c288A869',
            ),
          ]),
          'Account controlled by the MPC nodes. Can set minters for anyTokens. Can access liquidity in anyTokens.',
        ),
      ],
    },
  },
  milestones: [
    {
      title: 'Anyswap rebrands to Multichain',
      date: '2021-12-16T00:00:00Z',
      url: 'https://medium.com/multichainorg/anyswap-to-officially-rebrand-as-multichain-16ee7b961ffa',
      type: 'general',
    },
    {
      title: 'Contracts hacked for $3M',
      date: '2022-01-18T00:00:00Z',
      description:
        'Multiple critical vulnerabilities were found in the contracts.',
      url: 'https://medium.com/multichainorg/multichain-contract-vulnerability-post-mortem-d37bfab237c8',
      type: 'incident',
    },
    {
      title: 'anyCall was introduced',
      date: '2022-04-11T00:00:00Z',
      description:
        'This is the generic cross-chain mechanism that Multichain uses.',
      url: 'https://medium.com/multichainorg/anycall-for-your-cross-chain-dapps-ac0ece9140e9',
      type: 'general',
    },
    {
      title: 'fastMPC was introduced',
      date: '2022-09-21T00:00:00Z',
      description:
        'It is an upgrade of the network that is used to check cross chain messages.',
      url: 'https://multichainorg.medium.com/fastmpc-mainnet-goes-live-running-in-a-decentralized-way-99f9fe2956b8',
      type: 'general',
    },
    {
      title: 'Contracts hacked for $130M',
      date: '2023-07-07T00:00:00Z',
      url: 'https://blockworks.co/news/multichain-anyswap-exploit',
      type: 'incident',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
}
