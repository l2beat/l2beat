import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('sollet')

export const sollet: Bridge = {
  type: 'bridge',
  id: ProjectId('sollet'),
  isArchived: true,
  display: {
    name: 'Sollet',
    slug: 'sollet',
    warning:
      'Sollet Bridge becomes deprecated on Oct 31, 2022. Users are encouraged to use Wormhole instead.',
    description:
      'Externally Validated bridge to Solana that is now being phased out - users are encouraged to use Wormhole instead.',
    category: 'Token Bridge',
    links: {
      websites: ['https://www.sollet.io/'],
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
        sinceTimestamp: new UnixTime(1599794859),
        tokens: ['SRM', 'ETH', 'ALEPH', 'USDT', 'USDC', 'UNI', 'KEEP', 'LINK'],
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
          text: 'Deprecating Sollet Bridge',
          href: 'https://projectserum.medium.com/deprecating-sollet-bridge-5a092fbd5dda',
        },
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: "contract owner doesn't sign withdrawal requests.",
          isCritical: true,
        },
        {
          category: 'Funds can be frozen if',
          text: 'contract owner pauses the bridge.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'contract owner withdraws funds belonging to depositors.',
          isCritical: true,
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
    sourceUpgradeability: RISK_VIEW.UPGRADABLE_NO,
    destinationToken: {
      ...RISK_VIEW.WRAPPED,
      description:
        RISK_VIEW.WRAPPED.description +
        ' Sollet Bridge and its wrapped asset are deprecated in favor of assets bridged via Wormhole.',
    },
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('SplTokenSwap', 'Sollet Bridge Contract.'),
    ],
    risks: [],
  },
  permissions: [
    {
      accounts: [discovery.getPermissionedAccount('SplTokenSwap', 'owner')],
      name: 'Sollet Bridge Owner (EOA)',
      description: 'Can withdraw funds from the bridge',
    },
  ],
}
