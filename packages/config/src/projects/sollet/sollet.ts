import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { BRIDGE_RISK_VIEW } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('sollet')

export const sollet: Bridge = {
  type: 'bridge',
  id: ProjectId('sollet'),
  addedAt: UnixTime(1662628329), // 2022-09-08T09:12:09Z
  archivedAt: UnixTime(1677196800), // 2023-02-24T00:00:00.000Z,
  display: {
    name: 'Sollet',
    slug: 'sollet',
    warning:
      'Sollet Bridge becomes deprecated on Oct 31, 2022. Users are encouraged to use Wormhole instead.',
    description:
      'Externally Validated bridge to Solana that is now being phased out - users are encouraged to use Wormhole instead.',
    category: 'Single-chain',
    links: {
      websites: ['https://sollet.io/'],
      socialMedia: ['https://projectserum.medium.com/'],
      explorers: ['https://solscan.io/'],
      repositories: ['https://github.com/project-serum/spl-token-wallet'],
    },
  },
  config: {
    associatedTokens: ['SRM'],
    escrows: [
      {
        address: EthereumAddress('0xeae57ce9cc1984F202e15e038B964bb8bdF7229a'),
        sinceTimestamp: UnixTime(1599794859),
        tokens: ['SRM', 'ETH', 'ALEPH', 'USDT', 'USDC', 'UNI', 'KEEP', 'LINK'],
        chain: 'ethereum',
      },
    ],
  },
  technology: {
    destination: ['Solana'],
    principleOfOperation: {
      name: 'Principle of Operation',
      isIncomplete: true,
      description:
        'Sollet Bridge becomes deprecated on Oct 31, 2022. Users are encouraged to use Wormhole instead. Bridge contract supports withdrawals of assets locked on Ethereum but requests need to be signed by the contract owner (EOA account).',
      references: [
        {
          title: 'Deprecating Sollet Bridge',
          url: 'https://projectserum.medium.com/deprecating-sollet-bridge-5a092fbd5dda',
        },
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: "contract owner doesn't sign withdrawal requests.",
        },
        {
          category: 'Funds can be frozen if',
          text: 'contract owner pauses the bridge.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'contract owner withdraws funds belonging to depositors.',
        },
      ],
    },
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: 'Withdrawals need to be signed by an EOA account.',
      sentiment: 'bad',
    },
    destinationToken: {
      ...BRIDGE_RISK_VIEW.WRAPPED,
      description:
        BRIDGE_RISK_VIEW.WRAPPED.description +
        ' Sollet Bridge and its wrapped asset are deprecated in favor of assets bridged via Wormhole.',
    },
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails('SplTokenSwap', 'Sollet Bridge Contract.'),
      ],
    },
    risks: [],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getPermissionDetails(
          'Sollet Bridge Owner (EOA)',
          discovery.getPermissionedAccounts('SplTokenSwap', 'owner'),
          'Can withdraw funds from the bridge',
        ),
      ],
    },
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
