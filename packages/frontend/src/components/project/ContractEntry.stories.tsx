import { Story } from '@storybook/react'
import React from 'react'

import { ContractEntry, ContractEntryProps } from './ContractEntry'

export default {
  title: 'Components/Project/ContractEntry',
}

function Template(props: ContractEntryProps) {
  return (
    <div className="p-4">
      <ContractEntry {...props} />
    </div>
  )
}

export const Contracts: Story<ContractEntryProps> = Template.bind({})
Contracts.args = {
  contract: {
    name: 'Contract',
    address: '0x65432133f54e0E8A33A975908C5BA1c14e5BbbDf',
    description: 'This is a smart contract responsible for X in the system Y.',
    links: [
      {
        name: 'Admin',
        href: 'https://etherscan.io/address/0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
        address: '0x12345633f54e0E8A33A975908C5BA1c14e5BbbDf',
      },
    ],
  },
  verificationStatus: {
    projects: {},
    contracts: {
      '0x12345633f54e0E8A33A975908C5BA1c14e5BbbDf': false,
      '0x65432133f54e0E8A33A975908C5BA1c14e5BbbDf': true,
    },
  },
}
