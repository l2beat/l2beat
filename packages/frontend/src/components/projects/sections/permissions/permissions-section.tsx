import { isEmpty } from 'lodash'
import type { DaSolutionWith } from '~/server/features/scaling/project/get-scaling-project-da-solution'
import type { TechnologyContract } from '../contract-entry'
import { ContractEntry, technologyContractKey } from '../contract-entry'
import { PermissionedEntityEntry } from '../permissioned-entity-entry'
import { ProjectSection } from '../project-section'
import type { ProjectSectionProps } from '../types'

export interface PermissionsSectionProps extends ProjectSectionProps {
  permissionsByChain: Record<
    string,
    { roles: TechnologyContract[]; actors: TechnologyContract[] }
  >
  daSolution?: DaSolutionWith<{
    permissions: { roles: TechnologyContract[]; actors: TechnologyContract[] }
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
    <ProjectSection {...sectionProps}>
      {permissionedEntities && permissionedEntities.length > 0 && (
        <h3 className="mt-4 font-bold">
          The DA committee has the following members:
        </h3>
      )}
      {permissionedEntities?.map((entity, i) => (
        <PermissionedEntityEntry key={i} entity={entity} className="my-2" />
      ))}
      <div>
        {Object.entries(permissionsByChain).map(([chain, permissions]) => {
          return (
            <div key={chain} className="mt-8">
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
      {daSolution &&
        (!isEmpty(daSolution.permissions.actors) ||
          !isEmpty(daSolution.permissions.roles)) && (
          <h3 className="mt-4 font-bold">
            The project uses {daSolution.layerName} with the{' '}
            {daSolution.bridgeName} DA Bridge that consist of the following
            permissions on the {daSolution.hostChain}:
          </h3>
        )}
      {daSolution?.permissions.roles?.map((permission) => (
        <ContractEntry
          key={technologyContractKey(permission)}
          contract={permission}
          className="my-4"
          type="permission"
        />
      ))}
      {daSolution?.permissions.actors?.map((permission) => (
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
