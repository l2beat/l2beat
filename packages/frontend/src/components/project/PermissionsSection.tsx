import { ProjectPermission } from '@l2beat/config'
import { VerificationStatus } from '@l2beat/types'
import React from 'react'

import { ContractEntry, TechnologyContract } from './ContractEntry'
import { Section } from './Section'

export interface PermissionsSectionProps {
  permissions: ProjectPermission[]
  verificationStatus: VerificationStatus
}

export function PermissionsSection({
  permissions,
  verificationStatus,
}: PermissionsSectionProps) {
  return (
    <Section title="Permissioned Addresses" id="permissionedAddresses">
      <h3 className="mt-4 font-bold md:text-md">
        The system uses the following set of permissioned addresses:
      </h3>
      <div className="flex flex-wrap gap-4 my-4">
        {permissions.map(toContract).map((contract, i) => (
          <React.Fragment key={i}>
            <ContractEntry
              contract={contract}
              verificationStatus={verificationStatus}
            />
          </React.Fragment>
        ))}
      </div>
    </Section>
  )
}

function toContract(permission: ProjectPermission): TechnologyContract {
  const links = permission.accounts.slice(1).map((account) => ({
    name: `${account.address.slice(0, 6)}…${account.address.slice(38, 42)}`,
    address: account.address,
    href: `https://etherscan.io/address/${account.address}#code`,
  }))

  return {
    name: permission.name,
    address: permission.accounts[0]?.address,
    description: permission.description,
    links,
  }
}
