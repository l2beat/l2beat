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
  permissionsByChain: Record<
    string,
    { roles: TechnologyContract[]; actors: TechnologyContract[] }
  >
  daSolution?: DaSolutionWith<{
    permissions: TechnologyContract[]
  }>
  permissionedEntities?: { name: string; href: string; key?: string }[]
}

export function PermissionsSection({
  permissionsByChain,
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
      <div className="my-4">
        {Object.entries(permissionsByChain).map(([chain, permissions]) => {
          return (
            <div key={chain}>
              <div className="flex items-baseline gap-3">
                <h3 className="whitespace-pre text-2xl font-bold">{chain}</h3>
                <div className="w-full border-b-2 border-divider" />
              </div>
              {permissions.roles.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-xl font-bold">Roles:</h4>
                  {permissions.roles.map((permission) => (
                    <ContractEntry
                      key={technologyContractKey(permission)}
                      contract={permission}
                      className="my-4"
                      type="permission"
                    />
                  ))}
                </div>
              )}
              {permissions.actors.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-xl font-bold">Actors:</h4>
                  {permissions.actors.map((permission) => (
                    <ContractEntry
                      key={technologyContractKey(permission)}
                      contract={permission}
                      className="my-4"
                      type="permission"
                    />
                  ))}
                </div>
              )}
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
