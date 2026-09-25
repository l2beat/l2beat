import partition from 'lodash/partition'
import { DiscoUiBanner } from '../../DiscoUiBanner'
import type { TechnologyContract } from '../ContractEntry'
import {
  ContractEntry,
  ContractsWithImpactfulChanges,
  technologyContractKey,
} from '../ContractEntry'
import { ChainNameHeader } from '../contracts/ContractsSection'
import { PermissionedEntityEntry } from '../PermissionedEntityEntry'
import { ProjectSection } from '../ProjectSection'
import { Subsection, SubsectionHeading } from '../Subsection'
import type { ProjectSectionProps } from '../types'

export interface PermissionsSectionProps extends ProjectSectionProps {
  permissionsByChain: Record<
    string,
    { roles: TechnologyContract[]; actors: TechnologyContract[] }
  >
  permissionedEntities?: { name: string; href: string; key?: string }[]
  discoUi?: {
    href: string
    images: { desktop: string; mobile: string }
  }
}

export function PermissionsSection({
  permissionsByChain,
  permissionedEntities,
  discoUi,
  ...sectionProps
}: PermissionsSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      {discoUi && <DiscoUiBanner href={discoUi.href} images={discoUi.images} />}
      {permissionedEntities && permissionedEntities.length > 0 && (
        <SubsectionHeading className="mt-4 font-bold">
          The DA committee has the following members:
        </SubsectionHeading>
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
              <Subsection title={<ChainNameHeader>{chain}</ChainNameHeader>}>
                {permissions.roles.length > 0 && (
                  <div className="mt-3">
                    <Subsection
                      title={
                        <SubsectionHeading className="text-heading-18">
                          Roles:
                        </SubsectionHeading>
                      }
                    >
                      {unchangedRoles.map((permission) => (
                        <ContractEntry
                          key={technologyContractKey(permission)}
                          contract={permission}
                          className="my-4"
                        />
                      ))}
                      {changedRoles.length > 0 && (
                        <ContractsWithImpactfulChanges
                          contracts={changedRoles}
                          type="permissions"
                        />
                      )}
                    </Subsection>
                  </div>
                )}
                {permissions.actors.length > 0 && (
                  <div className="mt-3">
                    <Subsection
                      title={
                        <SubsectionHeading className="text-heading-18">
                          Actors:
                        </SubsectionHeading>
                      }
                    >
                      {unchangedActors.map((permission) => (
                        <ContractEntry
                          key={technologyContractKey(permission)}
                          contract={permission}
                          className="my-4"
                          expandableAddresses={permission.addresses.length > 1}
                        />
                      ))}
                      {changedActors.length > 0 && (
                        <ContractsWithImpactfulChanges
                          contracts={changedActors}
                          type="permissions"
                          expandableAddresses
                        />
                      )}
                    </Subsection>
                  </div>
                )}
              </Subsection>
            </div>
          )
        })}
      </div>
    </ProjectSection>
  )
}
