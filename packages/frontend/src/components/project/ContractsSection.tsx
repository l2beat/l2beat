import {
  DiffStateProjectData,
  ManuallyVerifiedContracts,
  VerificationStatus,
} from '@l2beat/shared-pure'
import React from 'react'

import { ContractEntry, TechnologyContract } from './ContractEntry'
import { ContractsUpdated } from './ContractsUpdated'
import { ProjectDetailsSection } from './ProjectDetailsSection'
import { ReferenceList, TechnologyReference } from './ReferenceList'
import { RiskList, TechnologyRisk } from './RiskList'
import { ProjectSectionId } from './sectionId'
import { TechnologyIncompleteShort } from './TechnologyIncomplete'

export interface ContractsSectionProps {
  id: ProjectSectionId
  title: string
  sectionOrder: number
  contracts: TechnologyContract[]
  escrows: TechnologyContract[]
  risks: TechnologyRisk[]
  references: TechnologyReference[]
  architectureImage?: string
  isIncomplete?: boolean
  isUnderReview?: boolean
  verificationStatus: VerificationStatus
  manuallyVerifiedContracts: ManuallyVerifiedContracts
  diffState?: DiffStateProjectData
}

export function ContractsSection(props: ContractsSectionProps) {
  if (
    props.contracts.length === 0 &&
    props.escrows.length === 0 &&
    props.risks.length === 0 &&
    !props.isUnderReview
  ) {
    return null
  }

  return (
    <ProjectDetailsSection
      title={props.title}
      id={props.id}
      sectionOrder={props.sectionOrder}
      isUnderReview={props.isUnderReview}
      includeChildrenIfUnderReview
    >
      {props.diffState !== undefined && <ContractsUpdated />}
      {props.isIncomplete && <TechnologyIncompleteShort />}
      {props.architectureImage && (
        <figure className="mb-8 mt-4 text-center">
          <img
            className="inline max-w-full align-[unset] dark:invert"
            src={props.architectureImage}
            alt="A diagram of the smart contract architecture"
          />
          <figcaption className="text-xs text-gray-500 dark:text-gray-600">
            A diagram of the smart contract architecture
          </figcaption>
        </figure>
      )}
      {props.contracts.length > 0 && (
        <>
          <h3 className="font-bold">
            The system consists of the following smart contracts:
          </h3>
          <div className="my-4">
            {props.contracts.map((contract, i) => (
              <React.Fragment key={i}>
                <ContractEntry
                  contract={contract}
                  verificationStatus={props.verificationStatus}
                  diffState={props.diffState}
                  manuallyVerifiedContracts={props.manuallyVerifiedContracts}
                  className="my-4"
                />
              </React.Fragment>
            ))}
          </div>
        </>
      )}
      {/* @todo: this "if" can be dropped when all escrows will migrate to new form */}
      {props.escrows.length > 0 && (
        <>
          <h3 className="font-bold">
            Value Locked is calculated based on these smart contracts and
            tokens:
          </h3>
          <div className="my-4">
            {props.escrows.map((contract, i) => (
              <React.Fragment key={i}>
                <ContractEntry
                  contract={contract}
                  diffState={props.diffState}
                  verificationStatus={props.verificationStatus}
                  manuallyVerifiedContracts={props.manuallyVerifiedContracts}
                  className="my-4"
                />
              </React.Fragment>
            ))}
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
    </ProjectDetailsSection>
  )
}
