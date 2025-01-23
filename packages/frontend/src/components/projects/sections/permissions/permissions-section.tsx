import type { DaSolutionWith } from '~/server/features/scaling/project/get-scaling-project-da-solution'
import {
  ContractEntry,
  type TechnologyContract,
  technologyContractKey,
} from '../contract-entry'
import { PermissionedEntityEntry } from '../permissioned-entity-entry'
import { ProjectSection } from '../project-section'
import type { ProjectSectionProps } from '../types'

export interface PermissionsSectionProps extends ProjectSectionProps {
  permissions: TechnologyContract[]
  nativePermissions: Record<string, TechnologyContract[]>
  daSolution?: DaSolutionWith<{
    permissions: TechnologyContract[]
  }>
  permissionedEntities?: { name: string; href: string; key?: string }[]
}

export function PermissionsSection({
  permissions,
  nativePermissions,
  permissionedEntities,
  daSolution,
  ...sectionProps
}: PermissionsSectionProps) {
  return (
    <ProjectSection {...sectionProps} includeChildrenIfUnderReview>
      {permissionedEntities && (
        <h3 className="mt-4 font-bold">
          The committee has the following members:
        </h3>
      )}
      {permissionedEntities?.map((entity, i) => (
        <PermissionedEntityEntry key={i} entity={entity} className="my-2" />
      ))}
      <h3 className="mt-4 font-bold">
        The system uses the following set of permissioned addresses:
      </h3>
      <div className="my-4">
        {permissions.map((permission) => (
          <ContractEntry
            key={technologyContractKey(permission)}
            contract={permission}
            className="my-4"
            type="permission"
          />
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
      {daSolution?.permissions && (
        <h3 className="mt-4 font-bold">
          The project uses {daSolution.layerName} with the{' '}
          {daSolution.bridgeName} DA Bridge that consist of the following
          permissions on the {daSolution.hostChain}:
        </h3>
      )}
      {daSolution?.permissions?.map((permission) => (
        <ContractEntry
          key={technologyContractKey(permission)}
          contract={permission}
          className="my-4"
          type="permission"
        />
      ))}
    </ProjectSection>
  )
}
