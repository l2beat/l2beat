import React from 'react'

import { OutLink } from '../OutLink'
import { EtherscanLink } from './EtherscanLink'
import { ReferenceList, TechnologyReference } from './ReferenceList'
import { RiskList, TechnologyRisk } from './RiskList'
import { Section } from './Section'

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
    <Section
      title="Smart Contracts"
      id="contracts"
      className="ContractsSection"
    >
      {props.isIncomplete && (
        <div className="TechnologySection-Incomplete">
          <strong>Note:</strong> This section requires more research and might
          not present accurate information.
        </div>
      )}
      {props.architectureImage && (
        <figure className="ContractsSection-Architecture">
          <img
            className="inline align-[unset]"
            src={props.architectureImage}
            alt="A diagram of the smart contract architecture"
          />
          <figcaption>A diagram of the smart contract architecture</figcaption>
        </figure>
      )}
      <p>The system consists of the following smart contracts:</p>
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
              <div className="ContractsSection-Description">
                {contract.description}
              </div>
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
