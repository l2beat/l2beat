import type { UsedInProject } from '@l2beat/config'
import { ProjectDetailsRelatedProjectBanner } from '~/components/project-details-related-project-banner'
import {
  ContractEntry,
  type TechnologyContract,
  technologyContractKey,
} from '../contract-entry'
import { PermissionedEntityEntry } from '../permissioned-entity-entry'
import { ProjectSection } from '../project-section'
import type { ProjectSectionProps } from '../types'

export interface MultichainPermissionsSectionProps extends ProjectSectionProps {
  permissions: Record<string, TechnologyContract[]>
  permissionedEntities?: { name: string; href: string; key?: string }[]
  dacUsedIn?: UsedInProject
}

export function MultichainPermissionsSection({
  permissions,
  permissionedEntities,
  dacUsedIn,
  ...sectionProps
}: MultichainPermissionsSectionProps) {
  return (
    <ProjectSection {...sectionProps} includeChildrenIfUnderReview>
      {permissionedEntities && permissionedEntities.length > 0 && (
        <h3 className="mt-4 font-bold">
          The committee has the following members:
        </h3>
      )}
      {permissionedEntities?.map((entity, i) => (
        <PermissionedEntityEntry key={i} entity={entity} className="my-2" />
      ))}

      <div className="my-4">
        {Object.entries(permissions).map(([chainName, permissions]) => {
          if (permissions.length === 0) {
            return null
          }
          return (
            <div key={chainName}>
              <h3 className="font-bold">
                The system consists of the following permissions on {chainName}:
              </h3>
              {permissions.map((permission) => (
                <ContractEntry
                  key={technologyContractKey(permission)}
                  contract={permission}
                  className="my-4"
                  type="permission"
                />
              ))}
            </div>
          )
        })}
      </div>
      {dacUsedIn && (
        <ProjectDetailsRelatedProjectBanner
          text="Check all permissions for the scaling project here:"
          project={{ ...dacUsedIn, type: 'scaling' }}
        />
      )}
    </ProjectSection>
  )
}
