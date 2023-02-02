import { VerificationStatus } from '@l2beat/types'
import React from 'react'

import { ContractEntry, TechnologyContract } from './ContractEntry'
import { ReferenceList, TechnologyReference } from './ReferenceList'
import { RiskList, TechnologyRisk } from './RiskList'
import { Section } from './Section'
import { TechnologyIncompleteShort } from './TechnologyIncomplete'

export interface ContractsSectionProps {
  contracts: TechnologyContract[]
  risks: TechnologyRisk[]
  references: TechnologyReference[]
  architectureImage?: string
  isIncomplete?: boolean
  verificationStatus: VerificationStatus
}

export function ContractsSection(props: ContractsSectionProps) {
  if (props.contracts.length === 0) {
    return null
  }

  return (
    <Section title="Smart Contracts" id="contracts">
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
      <h3 className="md:text-md font-bold">
        The system consists of the following smart contracts:
      </h3>
      <div className="mt-4 mb-4">
        {props.contracts.map((contract, i) => (
          <React.Fragment key={i}>
            <ContractEntry
              contract={contract}
              verificationStatus={props.verificationStatus}
              className="mt-4 mb-4"
            />
          </React.Fragment>
        ))}
      </div>
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
