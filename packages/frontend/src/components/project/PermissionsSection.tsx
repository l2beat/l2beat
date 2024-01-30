import { ScalingProjectReference } from '@l2beat/config'
import {
  ManuallyVerifiedContracts,
  VerificationStatus,
} from '@l2beat/shared-pure'
import React from 'react'

import { ContractEntry, TechnologyContract } from './ContractEntry'
import { ProjectDetailsSection } from './ProjectDetailsSection'
import { ProjectSectionId } from './sectionId'

export interface PermissionsSectionProps {
  id: ProjectSectionId
  title: string
  sectionOrder: number
  isUnderReview?: boolean
  permissions: TechnologyContract[]
  verificationStatus: VerificationStatus
  manuallyVerifiedContracts: ManuallyVerifiedContracts
  references?: ScalingProjectReference[]
}

export function PermissionsSection({
  id,
  title,
  sectionOrder,
  permissions,
  verificationStatus,
  manuallyVerifiedContracts,
  isUnderReview,
}: PermissionsSectionProps) {
  return (
    <ProjectDetailsSection
      title={title}
      id={id}
      isUnderReview={isUnderReview}
      sectionOrder={sectionOrder}
    >
      <h3 className="mt-4 font-bold">
        The system uses the following set of permissioned addresses:
      </h3>
      <div className="my-4">
        {permissions.map((permission, i) => (
          <ContractEntry
            key={i}
            contract={permission}
            verificationStatus={verificationStatus}
            manuallyVerifiedContracts={manuallyVerifiedContracts}
            className="my-4"
          />
        ))}
      </div>
    </ProjectDetailsSection>
  )
}
