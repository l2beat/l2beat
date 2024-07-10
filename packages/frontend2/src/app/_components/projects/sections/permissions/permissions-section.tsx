import React from 'react'
import { ProjectSection } from '../project-section'
import { type ProjectSectionId } from '../types'
import { ContractEntry, type TechnologyContract } from './contract-entry.'

export interface PermissionsSectionProps {
  id: ProjectSectionId
  title: string
  sectionOrder: number
  isUnderReview: boolean | undefined
  permissions: TechnologyContract[]
  nativePermissions: Record<string, TechnologyContract[]>
}

export function PermissionsSection({
  id,
  title,
  sectionOrder,
  permissions,
  nativePermissions,
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
          <ContractEntry key={i} contract={permission} className="my-4" />
        ))}
        {nativePermissions !== undefined &&
          Object.entries(nativePermissions).map(([chainName, permissions]) => {
            if (permissions.length === 0) {
              return null
            }
            return (
              <div key={chainName}>
                <h3 className="font-bold">
                  The system consists of the following permissions on{' '}
                  {chainName}:
                </h3>
                {permissions.map((permission, i) => (
                  <ContractEntry
                    key={i}
                    contract={permission}
                    className="my-4"
                  />
                ))}
              </div>
            )
          })}
      </div>
    </ProjectSection>
  )
}
