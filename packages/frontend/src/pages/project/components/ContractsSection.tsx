import {
  ManuallyVerifiedContracts,
  VerificationStatus,
} from '@l2beat/shared-pure'
import partition from 'lodash/partition'
import React from 'react'

import {
  ContractEntry,
  TechnologyContract,
} from '../../../components/project/ContractEntry'
import { ContractsUpdated } from '../../../components/project/ContractsUpdated'
import {
  ReferenceList,
  TechnologyReference,
} from '../../../components/project/ReferenceList'
import { RiskList, TechnologyRisk } from '../../../components/project/RiskList'
import { ProjectSectionId } from '../../../components/project/sectionId'
import { TechnologyIncompleteShort } from '../../../components/project/TechnologyIncomplete'
import { Section } from './Section'

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

  const [changedContracts, unchangedContracts] = partition(
    props.contracts,
    (c) => c.implementationHasChanged,
  )
  const [changedEscrows, unchangedEscrows] = partition(
    props.escrows,
    (c) => c.implementationHasChanged,
  )
  const hasContractsImplementationChanged = props.contracts.some(
    (c) => c.implementationHasChanged,
  )

  return (
    <Section
      title={props.title}
      id={props.id}
      sectionOrder={props.sectionOrder}
      isUnderReview={props.isUnderReview}
      includeChildrenIfUnderReview
    >
      {hasContractsImplementationChanged && <ContractsUpdated />}
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
            {unchangedContracts.map((contract, i) => (
              <React.Fragment key={i}>
                <ContractEntry
                  contract={contract}
                  verificationStatus={props.verificationStatus}
                  manuallyVerifiedContracts={props.manuallyVerifiedContracts}
                  className="my-4"
                />
              </React.Fragment>
            ))}
            {changedContracts.length > 0 && (
              <ImplementationHasChangedContracts
                contracts={changedContracts}
                manuallyVerifiedContracts={props.manuallyVerifiedContracts}
                verificationStatus={props.verificationStatus}
              />
            )}
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
            {unchangedEscrows.map((contract, i) => (
              <React.Fragment key={i}>
                <ContractEntry
                  contract={contract}
                  verificationStatus={props.verificationStatus}
                  manuallyVerifiedContracts={props.manuallyVerifiedContracts}
                  className="my-4"
                />
              </React.Fragment>
            ))}
            {changedEscrows.length > 0 && (
              <ImplementationHasChangedContracts
                contracts={changedEscrows}
                manuallyVerifiedContracts={props.manuallyVerifiedContracts}
                verificationStatus={props.verificationStatus}
              />
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
    </Section>
  )
}

function ImplementationHasChangedContracts(props: {
  contracts: TechnologyContract[]
  verificationStatus: VerificationStatus
  manuallyVerifiedContracts: ManuallyVerifiedContracts
}) {
  return (
    <div className="rounded-lg border border-dashed border-yellow-200 px-4 py-3">
      <div className="flex w-full items-center rounded bg-yellow-700/20 p-4">
        There are implementation changes and part of the information might be
        outdated.
      </div>
      {props.contracts.map((contract, i) => (
        <React.Fragment key={i}>
          <ContractEntry
            contract={contract}
            verificationStatus={props.verificationStatus}
            manuallyVerifiedContracts={props.manuallyVerifiedContracts}
            className="my-4 p-0"
          />
        </React.Fragment>
      ))}
    </div>
  )
}
