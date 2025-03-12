'use client'
import partition from 'lodash/partition'
import { DiagramImage } from '~/components/diagram-image'
import type { DaSolutionWith } from '~/server/features/scaling/project/get-scaling-da-solution'
import type { DiagramParams } from '~/utils/project/get-diagram-params'
import type { TechnologyContract } from '../contract-entry'
import { ContractEntry, technologyContractKey } from '../contract-entry'
import { ProjectSection } from '../project-section'
import type { TechnologyRisk } from '../risk-list'
import { RiskList } from '../risk-list'
import type { ProjectSectionId } from '../types'
import { ContractsUpdated } from './contracts-updated'

export interface ContractsSectionProps {
  id: ProjectSectionId
  title: string
  sectionOrder: string
  nested?: boolean
  contracts: Record<string, TechnologyContract[]>
  daSolution?: DaSolutionWith<{
    contracts: TechnologyContract[]
  }>
  escrows: TechnologyContract[]
  risks: TechnologyRisk[]
  diagram?: DiagramParams
  isUnderReview?: boolean
}

export function ContractsSection(props: ContractsSectionProps) {
  if (
    Object.keys(props.contracts).length === 0 &&
    props.daSolution?.contracts.length === 0 &&
    props.escrows.length === 0 &&
    props.risks.length === 0 &&
    !props.isUnderReview
  ) {
    return null
  }

  const partitionedContracts = Object.fromEntries(
    Object.entries(props.contracts).map(([chainName, contracts]) => {
      return [chainName, partition(contracts, (c) => c.impactfulChange)]
    }),
  )

  const [changedEscrows, unchangedEscrows] = partition(
    props.escrows,
    (c) => c.impactfulChange,
  )
  const hasContractsChanged = Object.values(props.contracts).some((p) =>
    p.some((c) => !!c.impactfulChange),
  )

  return (
    <ProjectSection
      title={props.title}
      id={props.id}
      nested={props.nested}
      sectionOrder={props.sectionOrder}
      isUnderReview={props.isUnderReview}
    >
      {hasContractsChanged && <ContractsUpdated />}
      {props.diagram && (
        <figure className="mb-8 mt-4 text-center">
          <DiagramImage diagram={props.diagram} />
          <figcaption className="text-xs text-secondary">
            {props.diagram.caption}
          </figcaption>
        </figure>
      )}
      {Object.keys(partitionedContracts).length > 0 &&
        Object.entries(partitionedContracts).map(
          ([chainName, [changedContracts, unchangedContracts]]) => {
            return (
              <div key={chainName} className="mt-8">
                <ChainNameHeader>{chainName}</ChainNameHeader>
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
                    <ContractsWithImpactfulChanges
                      contracts={changedContracts}
                    />
                  )}
                </div>
              </div>
            )
          },
        )}
      {props.daSolution && props.daSolution.contracts.length > 0 && (
        <>
          <h3 className="font-bold">
            The project uses {props.daSolution.layerName} with the{' '}
            {props.daSolution.bridgeName} DA Bridge that consist of the
            following contracts on the {props.daSolution.hostChainName}:
          </h3>
          <div className="my-4">
            {props.daSolution.contracts.map((contract) => (
              <ContractEntry
                key={technologyContractKey(contract)}
                contract={contract}
                className="my-4"
                type="contract"
              />
            ))}
          </div>
        </>
      )}
      {/* @todo: this "if" can be dropped when all escrows will migrate to new form */}
      {props.escrows.length > 0 && (
        <>
          <h3 className="font-bold">
            Value Secured is calculated based on these smart contracts and
            tokens:
          </h3>
          <div className="my-4">
            {unchangedEscrows.map((contract) => (
              <ContractEntry
                key={technologyContractKey(contract)}
                contract={contract}
                className="my-4"
                type="contract"
              />
            ))}
            {changedEscrows.length > 0 && (
              <ContractsWithImpactfulChanges contracts={changedEscrows} />
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
    </ProjectSection>
  )
}

function ChainNameHeader(props: { children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3">
      <h3 className="whitespace-pre text-2xl font-bold">{props.children}</h3>
      <div className="w-full border-b-2 border-divider" />
    </div>
  )
}

function ContractsWithImpactfulChanges(props: {
  contracts: TechnologyContract[]
}) {
  return (
    <div className="rounded-lg border border-dashed border-yellow-200 px-4 py-3">
      <div className="flex w-full items-center rounded bg-yellow-700/20 p-4">
        There are impactful changes to the following contracts, and part of the
        information might be outdated.
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
