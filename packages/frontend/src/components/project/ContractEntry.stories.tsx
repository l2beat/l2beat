import { Meta, StoryObj } from '@storybook/react'

import { ContractEntry, ContractEntryProps } from './ContractEntry'

const meta: Meta<typeof ContractEntry> = {
  component: ContractEntry,
}
export default meta
type Story = StoryObj<ContractEntryProps>

const CONTRACT = '0x65432133f54e0E8A33A975908C5BA1c14e5BbbDf'
const IMPLEMENTATION = '0x99932133f54e0E8A33A975908C5BA1c14e5BbbDf'
const ADMIN = '0x12345633f54e0E8A33A975908C5BA1c14e5BbbDf'
const VERIFICATION_STATUS = {
  [CONTRACT.toString()]: false,
  [ADMIN.toString()]: false,
  [IMPLEMENTATION.toString()]: true,
}

const REFERENCES = [
  {
    href: '#',
    text: 'Sequencer - Optimism Documentation',
  },
]

export const SingleAddress: Story = {
  args: {
    contract: {
      name: 'Contract',
      addresses: [CONTRACT],
      description:
        'This is a smart contract responsible for X in the system Y.',
      links: [
        {
          name: 'Implementation',
          href: `https://etherscan.io/address/${IMPLEMENTATION}`,
          address: IMPLEMENTATION,
          isAdmin: false,
        },
        {
          name: 'Admin',
          href: `https://etherscan.io/address/${ADMIN}`,
          address: ADMIN,
          isAdmin: true,
        },
      ],
      references: REFERENCES,
    },
    verificationStatus: {
      projects: {},
      contracts: VERIFICATION_STATUS,
    },
  },
}

export const UpgradeDetails: Story = {
  args: {
    contract: {
      name: 'Contract',
      addresses: [CONTRACT],
      description:
        'This is a smart contract responsible for X in the system Y.',
      links: [
        {
          name: 'Implementation',
          href: `https://etherscan.io/address/${IMPLEMENTATION}`,
          address: IMPLEMENTATION,
          isAdmin: false,
        },
        {
          name: 'Admin',
          href: `https://etherscan.io/address/${ADMIN}`,
          address: ADMIN,
          isAdmin: true,
        },
      ],
      upgradeableBy: 'Tom and Jerry',
      upgradeDelay: '1 day',
      upgradeConsiderations:
        'Upgrading this contract requires the deployer to be dancing.',
    },
    verificationStatus: {
      projects: {},
      contracts: VERIFICATION_STATUS,
    },
  },
}

export const MultipleAddresses: Story = {
  args: {
    contract: {
      name: 'Contract',
      addresses: [CONTRACT, ADMIN, IMPLEMENTATION],
      description:
        'This is a smart contract responsible for X in the system Y.',
      links: [],
    },
    verificationStatus: {
      projects: {},
      contracts: VERIFICATION_STATUS,
    },
  },
}
