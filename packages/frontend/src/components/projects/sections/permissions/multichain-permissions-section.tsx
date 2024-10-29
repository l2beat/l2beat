import { type UsedInProject } from '@l2beat/config/build/src/projects/other/da-beat/types/UsedInProject'
import { ContractEntry, type TechnologyContract } from '../contract-entry'
import { PermissionedEntityEntry } from '../permissioned-entity-entry'
import { ProjectSection } from '../project-section'
import { type ProjectSectionProps } from '../types'
import { ProjectDetailsRelatedProjectBanner } from '~/components/project-details-related-project-banner'

export interface MultichainPermissionsSectionProps extends ProjectSectionProps {
  permissions: Record<string, TechnologyContract[]>
  permissionedEntities?: { name: string; href: string }[]
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
      {permissionedEntities && (
        <h3 className="mt-4 font-bold">The DAC has the following members:</h3>
      )}
      {permissionedEntities?.map((entity) => (
        <PermissionedEntityEntry
          key={entity.href}
          {...entity}
          className="my-2"
        />
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
              {permissions.map((permission, i) => (
                <ContractEntry
                  key={i}
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
