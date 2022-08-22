import React from 'react'

import { OutLink } from '../../../components'
import { EtherscanLink } from './EtherscanLink'
import { RiskList, TechnologyRisk } from './RiskList'
import { Section } from './Section'

export interface ContractsSectionProps {
  editLink: string
  issueLink: string
  contracts: TechnologyContract[]
  risks: TechnologyRisk[]
  architectureImage?: string
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
  return (
    <Section
      title="Smart Contracts"
      id="contracts"
      className="ContractsSection"
      editLink={props.editLink}
      issueLink={props.issueLink}
    >
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
    </Section>
  )
}
