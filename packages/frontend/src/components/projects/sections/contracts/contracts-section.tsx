'use client'
import partition from 'lodash/partition'
import { type DiagramParams } from '~/utils/project/get-diagram-params'
import { ContractEntry, type TechnologyContract } from '../contract-entry'
import { ProjectSection } from '../project-section'
import { ReferenceList } from '../reference-list'
import { type Reference } from '../reference-list'
import { RiskList, type TechnologyRisk } from '../risk-list'
import { type ProjectSectionId } from '../types'
import { ContractsUpdated } from './contracts-updated'
import { TechnologyIncompleteNote } from './technology-incomplete-note'

export interface ContractsSectionProps {
  id: ProjectSectionId
  title: string
  sectionOrder: string
  nested?: boolean
  chainName: string
  contracts: TechnologyContract[]
  nativeContracts: Record<string, TechnologyContract[]>
  escrows: TechnologyContract[]
  risks: TechnologyRisk[]
  references: Reference[]
  diagram?: DiagramParams
  isIncomplete?: boolean
  isUnderReview?: boolean
}

export function ContractsSection(props: ContractsSectionProps) {
  if (
    props.contracts.length === 0 &&
    Object.keys(props.nativeContracts).length === 0 &&
    props.escrows.length === 0 &&
    props.risks.length === 0 &&
    !props.isUnderReview
  ) {
    return null
  }

  const [changedContracts, unchangedContracts] = partition(
    props.contracts,
    (c) => c.implementationHasChanged,
  )

  const paritionedNativeContracts = Object.fromEntries(
    Object.entries(props.nativeContracts).map(([chainName, contracts]) => {
      return [
        chainName,
        partition(contracts, (c) => c.implementationHasChanged),
      ]
    }),
  )

  const [changedEscrows, unchangedEscrows] = partition(
    props.escrows,
    (c) => c.implementationHasChanged,
  )
  const hasContractsImplementationChanged = props.contracts.some(
    (c) => c.implementationHasChanged,
  )

  return (
    <ProjectSection
      title={props.title}
      id={props.id}
      nested={props.nested}
      sectionOrder={props.sectionOrder}
      isUnderReview={props.isUnderReview}
      includeChildrenIfUnderReview
    >
      {hasContractsImplementationChanged && <ContractsUpdated />}
      {props.isIncomplete && <TechnologyIncompleteNote />}
      {props.diagram && (
        <figure className="mb-8 mt-4 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="inline max-w-full align-[unset] dark:invert"
            src={props.diagram.src}
            alt={props.diagram.caption}
          />
          <figcaption className="text-xs text-gray-500 dark:text-gray-600">
            {props.diagram.caption}
          </figcaption>
        </figure>
      )}
      {props.contracts.length > 0 && (
        <>
          <h3 className="font-bold">
            The system consists of the following smart contracts on the host
            chain ({props.chainName}):
          </h3>
          <div className="my-4">
            {unchangedContracts.map((contract) => (
              <ContractEntry
                key={`${contract.name}-${contract.chain}`}
                contract={contract}
                className="my-4"
                type="contract"
              />
            ))}
            {changedContracts.length > 0 && (
              <ImplementationHasChangedContracts contracts={changedContracts} />
            )}
          </div>
        </>
      )}
      {Object.keys(paritionedNativeContracts).length > 0 &&
        Object.entries(paritionedNativeContracts).map(
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
                      key={`${contract.name}-${contract.chain}`}
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
      {/* @todo: this "if" can be dropped when all escrows will migrate to new form */}
      {props.escrows.length > 0 && (
        <>
          <h3 className="font-bold">
            Value Locked is calculated based on these smart contracts and
            tokens:
          </h3>
          <div className="my-4">
            {unchangedEscrows.map((contract) => (
              <ContractEntry
                key={`${contract.name}-${contract.chain}-${contract.addresses
                  .map((a) => a.address)
                  .join('-')}`}
                contract={contract}
                className="my-4"
                type="contract"
              />
            ))}
            {changedEscrows.length > 0 && (
              <ImplementationHasChangedContracts contracts={changedEscrows} />
            )}
          </div>
        </>
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
          key={`${contract.name}-${contract.chain}`}
          contract={contract}
          className="my-4 p-0"
          type="contract"
        />
      ))}
    </div>
  )
}
