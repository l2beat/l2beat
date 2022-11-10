import { VerificationStatus } from '@l2beat/types'
import React from 'react'

import { ContractEntry, TechnologyContract } from './ContractEntry'
import { Section } from './Section'

export interface PermissionsSectionProps {
  permissions: TechnologyContract[]
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
        {permissions.map((permission, i) => (
          <ContractEntry
            key={i}
            contract={permission}
            verificationStatus={verificationStatus}
          />
        ))}
      </div>
    </Section>
  )
}
