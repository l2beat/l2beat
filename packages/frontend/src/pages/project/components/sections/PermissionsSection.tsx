import { ScalingProjectReference } from '@l2beat/config'
import {
  ManuallyVerifiedContracts,
  VerificationStatus,
} from '@l2beat/shared-pure'
import React from 'react'

import { ContractEntry, TechnologyContract } from './common/ContractEntry'
import { ProjectSection } from './common/ProjectSection'
import { ProjectSectionId } from './common/sectionId'

export interface PermissionsSectionProps {
  id: ProjectSectionId
  title: string
  projectType: 'L2' | 'L3'
  sectionOrder: number
  isUnderReview: boolean | undefined
  permissions: TechnologyContract[]
  nativePermissions: TechnologyContract[]
  verificationStatus: VerificationStatus
  manuallyVerifiedContracts: ManuallyVerifiedContracts
  references?: ScalingProjectReference[]
}

export function PermissionsSection({
  id,
  title,
  projectType,
  sectionOrder,
  permissions,
  nativePermissions,
  verificationStatus,
  manuallyVerifiedContracts,
  isUnderReview,
}: PermissionsSectionProps) {
  return (
    <ProjectSection
      title={title}
      id={id}
      isUnderReview={isUnderReview}
      sectionOrder={sectionOrder}
      includeChildrenIfUnderReview
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
        {nativePermissions.map((permission, i) => (
          <ContractEntry
            key={i}
            contract={permission}
            verificationStatus={verificationStatus}
            manuallyVerifiedContracts={manuallyVerifiedContracts}
            className="my-4"
            sourceBadge={projectType}
          />
        ))}
      </div>
    </ProjectSection>
  )
}
