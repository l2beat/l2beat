import type { Meta, StoryObj } from '@storybook/react'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/highlightable-link-context'
import { ContractEntry } from './contract-entry'

const meta = {
  title: 'Components/Projects/Sections/Contract Entry',
  component: ContractEntry,
  decorators: [
    (Story) => (
      <HighlightableLinkContextProvider>
        <Story />
      </HighlightableLinkContextProvider>
    ),
  ],
} satisfies Meta<typeof ContractEntry>
export default meta
type Story = StoryObj<typeof meta>

const CONTRACT = {
  name: '0x6543…bbDf',
  address: '0x65432133f54e0E8A33A975908C5BA1c14e5BbbDf',
  verificationStatus: 'verified' as const,
  href: 'https://etherscan.io/address/0x65432133f54e0E8A33A975908C5BA1c14e5BbbDf',
  isAdmin: false,
}
const IMPLEMENTATION = {
  name: 'Implementation (upgradeable)',
  address: '0x99932133f54e0E8A33A975908C5BA1c14e5BbbDf',
  verificationStatus: 'verified' as const,
  href: 'https://etherscan.io/address/0x99932133f54e0E8A33A975908C5BA1c14e5BbbDf',
  isAdmin: false,
}
const ADMIN = {
  name: 'Admin',
  address: '0x12345633f54e0E8A33A975908C5BA1c14e5BbbDf',
  verificationStatus: 'verified' as const,
  href: 'https://etherscan.io/address/0x12345633f54e0E8A33A975908C5BA1c14e5BbbDf',
  isAdmin: true,
}

const REFERENCES = [
  {
    url: '#',
    title: 'Sequencer - Optimism Documentation',
  },
]

export const SingleAddress: Story = {
  args: {
    contract: {
      name: 'Contract',
      chain: 'ethereum',
      implementationChanged: false,
      highSeverityFieldChanged: false,
      addresses: [CONTRACT],
      description:
        'This is a smart contract responsible for X in the system Y.',
      references: REFERENCES,
    },
    type: 'contract',
  },
}

export const UpgradeDetails: Story = {
  args: {
    contract: {
      name: 'Contract',
      chain: 'ethereum',
      implementationChanged: false,
      highSeverityFieldChanged: false,
      addresses: [CONTRACT],
      description:
        'This is a smart contract responsible for X in the system Y.',
      upgradeableBy: ['Tom and Jerry'],
      upgradeDelay: '1 day',
      upgradeConsiderations:
        'Upgrading this contract requires the deployer to be dancing.',
      references: [],
    },
    type: 'contract',
  },
}

export const MultipleAddresses: Story = {
  args: {
    contract: {
      name: 'Contract',
      chain: 'ethereum',
      implementationChanged: false,
      highSeverityFieldChanged: false,
      addresses: [CONTRACT, IMPLEMENTATION, ADMIN],
      description:
        'This is a smart contract responsible for X in the system Y.',
      references: [],
    },
    type: 'contract',
  },
}

export const UnverifiedContract: Story = {
  args: {
    contract: {
      name: 'Contract',
      chain: 'ethereum',
      implementationChanged: false,
      highSeverityFieldChanged: false,
      addresses: [
        CONTRACT,
        { ...IMPLEMENTATION, verificationStatus: 'unverified' as const },
        ADMIN,
      ],
      description:
        'This is a smart contract responsible for X in the system Y.',
      references: [],
    },
    type: 'contract',
  },
}
