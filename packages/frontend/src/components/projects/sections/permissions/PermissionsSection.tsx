import groupBy from 'lodash/groupBy'
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
import type { ProjectSectionProps } from '../types'

export interface PermissionsSectionProps extends ProjectSectionProps {
  permissionsByChain: Record<
    string,
    { roles: TechnologyContract[]; actors: TechnologyContract[] }
  >
  permissionedEntities?: { name: string; href: string; key?: string }[]
  discoUiHref?: string
}

// Helper function to determine if a contract represents an EOA
function isEOA(contract: TechnologyContract): boolean {
  // EOAs typically have short names (addresses) and no admin addresses
  // This is a heuristic based on the current data structure
  return (
    contract.admins.length === 0 &&
    contract.addresses.length === 1 &&
    contract.addresses[0]?.name.match(/^0x[a-fA-F0-9]{4}…[a-fA-F0-9]{4}$/) !==
      null
  )
}

// Helper function to group EOAs by description
function groupEOAsByDescription(contracts: TechnologyContract[]): {
  eoaGroups: Record<string, TechnologyContract[]>
  nonEOAs: TechnologyContract[]
} {
  const [eoas, nonEOAs] = partition(contracts, isEOA)
  const eoaGroups = groupBy(
    eoas,
    (contract) => contract.description || 'No description',
  )

  return { eoaGroups, nonEOAs }
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
              <ChainNameHeader>{chain}</ChainNameHeader>
              {permissions.roles.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-heading-18">Roles:</h4>
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
                </div>
              )}
              {permissions.actors.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-heading-18">Actors:</h4>
                  {(() => {
                    const { eoaGroups, nonEOAs } =
                      groupEOAsByDescription(unchangedActors)

                    return (
                      <>
                        {/* Render non-EOA actors first */}
                        {nonEOAs.map((permission) => (
                          <ContractEntry
                            key={technologyContractKey(permission)}
                            contract={permission}
                            className="my-4"
                          />
                        ))}

                        {/* Render EOAs grouped by description */}
                        {Object.entries(eoaGroups).map(
                          ([description, eoas]) => (
                            <div key={description} className="my-4">
                              {eoas.length > 1 && (
                                <h5 className="mb-2 font-semibold text-gray-700 text-paragraph-16 dark:text-gray-300">
                                  {description} ({eoas.length} addresses)
                                </h5>
                              )}
                              {eoas.map((eoa) => (
                                <ContractEntry
                                  key={technologyContractKey(eoa)}
                                  contract={eoa}
                                  className={
                                    eoas.length > 1 ? 'my-2 ml-4' : 'my-4'
                                  }
                                />
                              ))}
                            </div>
                          ),
                        )}
                      </>
                    )
                  })()}
                  {changedActors.length > 0 &&
                    (() => {
                      const {
                        eoaGroups: changedEoaGroups,
                        nonEOAs: changedNonEOAs,
                      } = groupEOAsByDescription(changedActors)

                      return (
                        <>
                          {/* Render impactful changes for non-EOAs */}
                          {changedNonEOAs.length > 0 && (
                            <ContractsWithImpactfulChanges
                              contracts={changedNonEOAs}
                              type="permissions"
                            />
                          )}

                          {/* Render impactful changes for EOAs grouped by description */}
                          {Object.entries(changedEoaGroups).map(
                            ([description, eoas]) => (
                              <div
                                key={`changed-${description}`}
                                className="mt-4"
                              >
                                {eoas.length > 1 && (
                                  <h5 className="mb-2 font-semibold text-gray-700 text-paragraph-16 dark:text-gray-300">
                                    {description} ({eoas.length} addresses) -
                                    Impactful Changes
                                  </h5>
                                )}
                                <ContractsWithImpactfulChanges
                                  contracts={eoas}
                                  type="permissions"
                                />
                              </div>
                            ),
                          )}
                        </>
                      )
                    })()}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </ProjectSection>
  )
}
