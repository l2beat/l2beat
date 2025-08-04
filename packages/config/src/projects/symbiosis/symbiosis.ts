import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BRIDGE_RISK_VIEW } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('symbiosis')

export const symbiosis: Bridge = {
  type: 'bridge',
  id: ProjectId('symbiosis'),
  addedAt: UnixTime(1688541556), // 2023-07-05T07:19:16Z
  display: {
    name: 'Symbiosis',
    slug: 'symbiosis',
    category: 'Hybrid',
    description:
      'Symbiosis is a cross-chain AMM DEX externally validated my an MPC relayers network.',
    links: {
      websites: [
        'https://symbiosis.finance/',
        'https://app.symbiosis.finance/swap',
      ],
      repositories: ['https://github.com/symbiosis-finance'],
      socialMedia: [
        'https://t.me/symbiosis_finance',
        'https://medium.com/@symbiosis_fi',
        'https://twitter.com/symbiosis_fi',
      ],
      documentation: ['https://docs.symbiosis.finance'],
    },
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        '2/3 of the MPC group (the Symbiosis relayers network) is required to create a cross-chain message with the MPC signature.',
      sentiment: 'bad',
    },
    destinationToken: BRIDGE_RISK_VIEW.CANONICAL_OR_WRAPPED,
  },
  technology: {
    destination: [
      'Ethereum',
      'BNB Chain',
      'Avalanche',
      'Polygon',
      'Telos',
      'Kava',
      'Boba Ethereum',
      'Boba BNB',
      'ZkSync',
      'Arbitrum One',
      'Optimism',
      'Arbitrum Nova',
      'Polygon zkEVM',
    ],
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Symbiosis uses an MPC relayer network to facilitate cross-chain transfers. An AMM on BOBA BNB is used to perform swaps.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Transfers are externally verified',
      description:
        'Requests are watched by a relayer network that, utilizing MPC, signs off swaps and token minting.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'MPC nodes decide to censor certain transactions.',

          _ignoreTextFormatting: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'MPC nodes decide to maliciously takeover them or there is an external exploit which will result in signing malicious transaction.',

          _ignoreTextFormatting: true,
        },
        {
          category: 'Funds can be lost if',
          text: 'MPC nodes lose their private keys.',

          _ignoreTextFormatting: true,
        },
      ],
    },
    destinationToken: {
      name: 'Destination tokens',
      description:
        'Received tokens can be wrapped tokens or native tokens depending on the destination network.',
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'destination token contract is maliciously upgraded or not securely implemented.',
        },
      ],
      references: [],
    },
  },
  config: {
    escrows: [
      {
        address: ChainSpecificAddress.address(
          discovery.getContract('Portal').address,
        ), // Portal v2
        sinceTimestamp: UnixTime(1668373200),
        tokens: '*',
        chain: 'ethereum',
      },
    ],
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails(
          'MetaRouter',
          'An upgradeable contract to process funds by provided route.',
        ),
        discovery.getContractDetails(
          'Bridge',
          'A contract that generates Oracle requests for the Symbiosis relayers network.',
        ),
        discovery.getContractDetails(
          'Portal',
          'A contract that stores "bridged" liquidity.',
        ),
      ],
    },
    risks: [],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.contractAsPermissioned(
          discovery.getContract('Multisig'),
          'This multisig can upgrade the BridgeV2 and Portal contracts.',
        ),
      ],
    },
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
