import React from 'react'

import { TechnologyContract } from './ContractEntry'
import { PermissionsSection as PermissionsSectionComponent } from './PermissionsSection'

export default {
  title: 'Components/Project/PermissionsSection',
}

const permissions: TechnologyContract[] = [
  {
    name: 'Optimism MultiSig',
    addresses: ['0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A'],
    description:
      'This address is the owner of the following contracts: OVM_L1CrossDomainMessenger, L1StandardBridge, LibAddressManager. This allows it to censor messages or pause message bridge altogether, upgrade bridge implementation potentially gaining access to all funds stored in a bridge and change the sequencer, state root proposer or any other system component (unlimited upgrade power).',
    links: [],
    references: [
      {
        href: '#',
        text: 'Optimism MultiSig',
      },
    ],
  },
  {
    name: 'MultiSig participants',
    addresses: ['0x3041BA32f451F5850c147805F5521AC206421623'],
    description:
      'These addresses are the participants of the 2/3 Optimism MultiSig.',
    links: [
      {
        name: '0x3bC4…0AC1',
        address: '0x3bC453E5b3c941D1baD8F25E512772a50eE20AC1',
        href: 'https://etherscan.io/address/0x3bC453E5b3c941D1baD8F25E512772a50eE20AC1#code',
        isAdmin: false,
      },
      {
        name: '0x4D01…6d15',
        address: '0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15',
        href: 'https://etherscan.io/address/0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15#code',
        isAdmin: false,
      },
    ],
    references: [
      {
        href: '#',
        text: 'Optimism Multisig participants',
      },
    ],
  },
]

export function PermissionsSection() {
  return (
    <div className="p-4 leading-normal">
      <PermissionsSectionComponent
        id="permissions"
        title="Permissions"
        permissions={permissions}
        verificationStatus={{
          projects: {},
          contracts: {
            '0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A': true,
            '0x3041BA32f451F5850c147805F5521AC206421623': true,
            '0x3bC453E5b3c941D1baD8F25E512772a50eE20AC1': false,
            '0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15': true,
          },
        }}
      />
    </div>
  )
}
