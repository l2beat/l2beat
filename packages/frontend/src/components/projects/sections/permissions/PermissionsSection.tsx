import partition from 'lodash/partition'
import { DiscoUiBanner } from '../../DiscoUiBanner'
import type { TechnologyContract } from '../ContractEntry'
import {
  ContractEntry,
  ContractsWithImpactfulChanges,
  technologyContractKey,
} from '../ContractEntry'
import { PermissionedEntityEntry } from '../PermissionedEntityEntry'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface PermissionsSectionProps extends ProjectSectionProps {
  permissionsByChain: Record<
    string,
    { roles: TechnologyContract[]; actors: TechnologyContract[] }
  >
  permissionedEntities?: { name: string; href: string; key?: string }[]
  discoUiHref?: string
}

export function PermissionsSection({
  permissionsByChain,
  permissionedEntities,
  discoUiHref,
  ...sectionProps
}: PermissionsSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      {discoUiHref && <DiscoUiBanner href={discoUiHref} />}
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
          const [changedRoles, unchangedRoles] = partition(
            permissions.roles,
            (contract) => contract.impactfulChange,
          )
          const [changedActors, unchangedActors] = partition(
            permissions.actors,
            (contract) => contract.impactfulChange,
          )
          return (
            <div key={chain} className="mt-8">
              <div className="flex items-baseline gap-3">
                <h3 className="whitespace-pre font-bold text-2xl">{chain}</h3>
                <div className="w-full border-divider border-b-2" />
              </div>
              {permissions.roles.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-bold text-xl">Roles:</h4>
                  {unchangedRoles.map((permission) => (
                    <ContractEntry
                      key={technologyContractKey(permission)}
                      contract={permission}
                      className="my-4"
                    />
                  ))}
                  {changedRoles.length > 0 && (
                    <ContractsWithImpactfulChanges contracts={changedRoles} />
                  )}
                </div>
              )}
              {permissions.actors.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-bold text-xl">Actors:</h4>
                  {unchangedActors.map((permission) => (
                    <ContractEntry
                      key={technologyContractKey(permission)}
                      contract={permission}
                      className="my-4"
                    />
                  ))}
                  {changedActors.length > 0 && (
                    <ContractsWithImpactfulChanges contracts={changedActors} />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </ProjectSection>
  )
}
