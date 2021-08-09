import { OutLink } from '../../../common'
import { EtherscanLink } from './EtherscanLink'
import { RiskList, TechnologyRisk } from './RiskList'
import { Section } from './Section'

export interface ContractsSectionProps {
  editLink: string
  issueLink: string
  contracts: TechnologyContract[]
  risks: TechnologyRisk[]
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
      <p>The system consists of the following smart contracts:</p>
      <ul className="ContractsSection-Contracts">
        {props.contracts.map((contract, i) => (
          <li key={i}>
            <div>
              <span className="ContractsSection-Name">{contract.name}</span>{' '}
              <ul className="ContractsSection-Links">
                <li>
                  <EtherscanLink address={contract.address} />
                </li>
                {contract.links.map((x, i) => (
                  <li key={i}>
                    <OutLink href={x.href}>{x.name}</OutLink>
                  </li>
                ))}
              </ul>
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
