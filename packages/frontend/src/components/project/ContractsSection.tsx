import React from 'react'

import { OutLink } from '../OutLink'
import { EtherscanLink } from './EtherscanLink'
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
}

export interface TechnologyContract {
  name: string
  address: string
  description?: string
  links: {
    name: string
    href: string
  }[]
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
            className="inline align-[unset] max-w-full dark:invert"
            src={props.architectureImage}
            alt="A diagram of the smart contract architecture"
          />
          <figcaption className="text-gray-500 dark:text-gray-600 text-xs">
            A diagram of the smart contract architecture
          </figcaption>
        </figure>
      )}
      <h3 className="font-bold md:text-md">
        The system consists of the following smart contracts:
      </h3>
      <ul className="list-disc my-4 pl-8 space-y-4">
        {props.contracts.map((contract, i) => (
          <li key={i}>
            <strong>{contract.name}</strong>{' '}
            <EtherscanLink
              address={contract.address}
              className="text-xs md:text-base"
            />
            {contract.links.map((x, i) => (
              <React.Fragment key={i}>
                {' '}
                <OutLink className="text-link underline" href={x.href}>
                  {x.name}
                </OutLink>
              </React.Fragment>
            ))}
            {contract.description && (
              <p className="text-gray-860 dark:text-gray-400">
                {contract.description}
              </p>
            )}
          </li>
        ))}
      </ul>
      {props.risks.length > 0 && (
        <>
          <p className="text-gray-860 dark:text-gray-400">
            The current deployment carries some associated risks:
          </p>
          <RiskList risks={props.risks} />
        </>
      )}
      <ReferenceList references={props.references} />
    </Section>
  )
}
