import partition from 'lodash/partition'
import { DiagramImage } from '~/components/DiagramImage'
import { env } from '~/env'
import type { DiagramParams } from '~/utils/project/getDiagramParams'
import { DiscoUiBanner } from '../../DiscoUiBanner'
import type { TechnologyContract } from '../ContractEntry'
import {
  ContractEntry,
  ContractsWithImpactfulChanges,
  technologyContractKey,
} from '../ContractEntry'
import { ProjectSection } from '../ProjectSection'
import type { StateValidationZkProgramHashData } from '../program-hashes/ProgramHashesSection'
import { ZkProgramHashesTable } from '../program-hashes/table/ZkProgramHashesTable'
import type { TechnologyRisk } from '../RiskList'
import { RiskList } from '../RiskList'
import type { ProjectSectionId } from '../types'
import { ContractsUpdated } from './ContractsUpdated'

export interface ContractsSectionProps {
  id: ProjectSectionId
  title: string
  sectionOrder: string
  nested?: boolean
  contracts: Record<string, TechnologyContract[]>
  escrows: TechnologyContract[]
  risks: TechnologyRisk[]
  diagram?: DiagramParams
  isUnderReview?: boolean
  discoUiHref?: string
  zkProgramHashes?: StateValidationZkProgramHashData[]
}

export function ContractsSection(props: ContractsSectionProps) {
  if (
    Object.keys(props.contracts).length === 0 &&
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
      {props.discoUiHref && <DiscoUiBanner href={props.discoUiHref} />}
      {hasContractsChanged && <ContractsUpdated />}
      {props.diagram && (
        <figure className="mt-4 mb-8 text-center">
          <DiagramImage diagram={props.diagram} />
          <figcaption className="text-secondary text-xs">
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
                    />
                  ))}
                  {changedContracts.length > 0 && (
                    <ContractsWithImpactfulChanges
                      contracts={changedContracts}
                      type="contracts"
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
          <h3 className="text-heading-20">
            Value Secured is calculated based on these smart contracts and
            tokens:
          </h3>
          <div className="my-4">
            {unchangedEscrows.map((contract) => (
              <ContractEntry
                key={technologyContractKey(contract)}
                contract={contract}
                className="my-4"
              />
            ))}
            {changedEscrows.length > 0 && (
              <ContractsWithImpactfulChanges
                contracts={changedEscrows}
                type="contracts"
              />
            )}
          </div>
        </>
      )}
      {props.risks.length > 0 && (
        <>
          <p className="text-paragraph-15 md:text-paragraph-16">
            The current deployment carries some associated risks:
          </p>
          <RiskList risks={props.risks} />
        </>
      )}
      {env.CLIENT_SIDE_PROGRAM_HASHES &&
        props.zkProgramHashes &&
        props.zkProgramHashes.length > 0 && (
          <div className="mt-4 space-y-2 md:mt-6">
            <div className="flex items-baseline gap-3">
              <h3 className="whitespace-pre text-heading-20">Program Hashes</h3>
              <div className="w-full border-divider border-b-2" />
            </div>
            <ZkProgramHashesTable entries={props.zkProgramHashes} />
          </div>
        )}
    </ProjectSection>
  )
}

export function ChainNameHeader(props: { children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3">
      <h3 className="whitespace-pre text-heading-20">{props.children}</h3>
      <div className="w-full border-divider border-b-2" />
    </div>
  )
}
