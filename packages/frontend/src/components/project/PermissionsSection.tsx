import { ProjectReference } from '@l2beat/config'
import { VerificationStatus } from '@l2beat/shared-pure'
import React from 'react'

import { ContractEntry, TechnologyContract } from './ContractEntry'
import { ProjectDetailsSection } from './ProjectDetailsSection'
import { SectionId } from './sectionId'

export interface PermissionsSectionProps {
  id: SectionId
  title: string
  isUnderReview?: boolean
  permissions: TechnologyContract[]
  verificationStatus: VerificationStatus
  references?: ProjectReference[]
}

export function PermissionsSection({
  id,
  title,
  permissions,
  verificationStatus,
  isUnderReview,
}: PermissionsSectionProps) {
  return (
    <ProjectDetailsSection title={title} id={id} isUnderReview={isUnderReview}>
      <h3 className="md:text-md mt-4 font-bold">
        The system uses the following set of permissioned addresses:
      </h3>
      <div className="mt-4 mb-4">
        {permissions.map((permission, i) => (
          <ContractEntry
            key={i}
            contract={permission}
            verificationStatus={verificationStatus}
            className="mt-4 mb-4"
          />
        ))}
      </div>
    </ProjectDetailsSection>
  )
}
