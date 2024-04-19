import { ScalingProjectReference } from '@l2beat/config'
import {
  ManuallyVerifiedContracts,
  VerificationStatus,
} from '@l2beat/shared-pure'
import React from 'react'

import { Section } from './common/Section'
import { ProjectSectionId } from './common/sectionId'
import {
  ContractEntry,
  TechnologyContract,
} from './ContractsSection/ContractEntry'

export interface PermissionsSectionProps {
  id: ProjectSectionId
  title: string
  sectionOrder: number
  isUnderReview: boolean | undefined
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
    <Section
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
      </div>
    </Section>
  )
}
