import {
  ManuallyVerifiedContracts,
  VerificationStatus,
} from '@l2beat/shared-pure'
import React from 'react'

import { ContractEntry, TechnologyContract } from './ContractEntry'
import { ProjectDetailsSection } from './ProjectDetailsSection'
import { ReferenceList, TechnologyReference } from './ReferenceList'
import { RiskList, TechnologyRisk } from './RiskList'
import { ProjectSectionId } from './sectionId'
import { TechnologyIncompleteShort } from './TechnologyIncomplete'
import { UnderReviewCallout } from './UnderReviewCallout'

export interface ContractsSectionProps {
  id: ProjectSectionId
  title: string
  contracts: TechnologyContract[]
  escrows: TechnologyContract[]
  risks: TechnologyRisk[]
  references: TechnologyReference[]
  architectureImage?: string
  isIncomplete?: boolean
  isUnderReview?: boolean
  verificationStatus: VerificationStatus
  manuallyVerifiedContracts: ManuallyVerifiedContracts
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
    <ProjectDetailsSection title={props.title} id={props.id}>
      {props.isUnderReview ? <UnderReviewCallout className="mb-4" /> : null}
      {props.isIncomplete && <TechnologyIncompleteShort />}
      {props.architectureImage && (
        <figure className="mt-4 mb-8 text-center">
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
          <h3 className="md:text-md font-bold">
            The system consists of the following smart contracts:
          </h3>
          <div className="mt-4 mb-4">
            {props.contracts.map((contract, i) => (
              <React.Fragment key={i}>
                <ContractEntry
                  contract={contract}
                  verificationStatus={props.verificationStatus}
                  manuallyVerifiedContracts={props.manuallyVerifiedContracts}
                  className="mt-4 mb-4"
                />
              </React.Fragment>
            ))}
          </div>
        </>
      )}
      {/* @todo: this "if" can be dropped when all escrows will migrate to new form */}
      {props.escrows.length > 0 && (
        <>
          <h3 className="md:text-md font-bold">
            Value Locked is calculated based on these smart contracts and
            tokens:
          </h3>
          <div className="mt-4 mb-4">
            {props.escrows.map((contract, i) => (
              <React.Fragment key={i}>
                <ContractEntry
                  contract={contract}
                  verificationStatus={props.verificationStatus}
                  manuallyVerifiedContracts={props.manuallyVerifiedContracts}
                  className="mt-4 mb-4"
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
