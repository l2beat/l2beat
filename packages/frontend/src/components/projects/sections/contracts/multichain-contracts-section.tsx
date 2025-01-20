'use client'
import { type UsedInProject } from '@l2beat/config'
import partition from 'lodash/partition'
import { DiagramImage } from '~/components/diagram-image'
import { ProjectDetailsRelatedProjectBanner } from '~/components/project-details-related-project-banner'
import { type DiagramParams } from '~/utils/project/get-diagram-params'
import {
  ContractEntry,
  type TechnologyContract,
  technologyContractKey,
} from '../contract-entry'
import { ProjectSection } from '../project-section'
import { ReferenceList } from '../reference-list'
import { type Reference } from '../reference-list'
import { RiskList, type TechnologyRisk } from '../risk-list'
import { type ProjectSectionId } from '../types'
import { ContractsUpdated } from './contracts-updated'
import { TechnologyIncompleteNote } from './technology-incomplete-note'

export interface MultiChainContractsSectionProps {
  id: ProjectSectionId
  title: string
  sectionOrder: string
  contracts: Record<string, TechnologyContract[]>
  risks: TechnologyRisk[]
  references: Reference[]
  diagram?: DiagramParams
  isIncomplete?: boolean
  isUnderReview?: boolean
  nested?: boolean
  dacUsedIn?: UsedInProject
}

export function MultiChainContractsSection(
  props: MultiChainContractsSectionProps,
) {
  const hasAnyContracts = Object.values(props.contracts).some(
    (contracts) => contracts.length > 0,
  )

  if (!hasAnyContracts && props.risks.length === 0 && !props.isUnderReview) {
    return null
  }

  const paritionedContracts = Object.fromEntries(
    Object.entries(props.contracts).map(([chainName, contracts]) => {
      return [chainName, partition(contracts, (c) => c.implementationChanged)]
    }),
  )

  const hasContractsImplementationChanged = Object.values(
    paritionedContracts,
  ).some(([changedContracts]) => changedContracts.length > 0)

  return (
    <ProjectSection
      title={props.title}
      id={props.id}
      sectionOrder={props.sectionOrder}
      isUnderReview={props.isUnderReview}
      includeChildrenIfUnderReview
      nested={props.nested}
    >
      {hasContractsImplementationChanged && <ContractsUpdated />}
      {props.isIncomplete && <TechnologyIncompleteNote />}
      {props.diagram && (
        <figure className="mb-8 mt-4 text-center">
          <DiagramImage diagram={props.diagram} />
          <figcaption className="text-xs text-secondary">
            {props.diagram.caption}
          </figcaption>
        </figure>
      )}

      {Object.entries(paritionedContracts).map(
        ([chainName, [changedContracts, unchangedContracts]]) => {
          return (
            <div key={chainName}>
              <h3 className="font-bold">
                The system consists of the following smart contracts on{' '}
                {chainName}:
              </h3>
              <div className="my-4">
                {unchangedContracts.map((contract) => (
                  <ContractEntry
                    key={technologyContractKey(contract)}
                    contract={contract}
                    className="my-4"
                    type="contract"
                  />
                ))}
                {changedContracts.length > 0 && (
                  <ImplementationHasChangedContracts
                    contracts={changedContracts}
                  />
                )}
              </div>
            </div>
          )
        },
      )}
      {props.risks.length > 0 && (
        <>
          <p className="text-gray-850 dark:text-gray-400">
            The current deployment carries some associated risks:
          </p>
          <RiskList risks={props.risks} />
        </>
      )}
      <ReferenceList references={props.references} />
      {props.dacUsedIn && (
        <ProjectDetailsRelatedProjectBanner
          text="Check all contracts for the scaling project here:"
          project={{ ...props.dacUsedIn, type: 'scaling' }}
        />
      )}
    </ProjectSection>
  )
}

function ImplementationHasChangedContracts(props: {
  contracts: TechnologyContract[]
}) {
  return (
    <div className="rounded-lg border border-dashed border-yellow-200 px-4 py-3">
      <div className="flex w-full items-center rounded bg-yellow-700/20 p-4">
        There are implementation changes and part of the information might be
        outdated.
      </div>
      {props.contracts.map((contract) => (
        <ContractEntry
          key={technologyContractKey(contract)}
          contract={contract}
          className="my-4 p-0"
          type="contract"
        />
      ))}
    </div>
  )
}
