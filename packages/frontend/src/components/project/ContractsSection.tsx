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
        <figure className="ContractsSection-Architecture">
          <img
            className="inline align-[unset]"
            src={props.architectureImage}
            alt="A diagram of the smart contract architecture"
          />
          <figcaption className="text-gray-500 dark:text-gray-600">
            A diagram of the smart contract architecture
          </figcaption>
        </figure>
      )}
      <h3 className="font-bold md:text-md">
        The system consists of the following smart contracts:
      </h3>
      <ul className="ContractsSection-Contracts">
        {props.contracts.map((contract, i) => (
          <li key={i}>
            <div className="ContractsSection-Contract">
              <span className="ContractsSection-Name">{contract.name}</span>{' '}
              <EtherscanLink address={contract.address} />
              {contract.links.map((x, i) => (
                <React.Fragment key={i}>
                  {' '}
                  <OutLink className="text-link underline" href={x.href}>
                    {x.name}
                  </OutLink>
                </React.Fragment>
              ))}
            </div>
            {contract.description && (
              <p className="ContractsSection-Description">
                {contract.description}
              </p>
            )}
          </li>
        ))}
      </ul>
      {props.risks.length > 0 && (
        <>
          <p>The current deployment carries some associated risks:</p>
          <RiskList risks={props.risks} />
        </>
      )}
      <ReferenceList references={props.references} />
    </Section>
  )
}
