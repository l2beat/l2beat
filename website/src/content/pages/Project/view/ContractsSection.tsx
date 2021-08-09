import { OutLink } from '../../../common'
import { TechnologyContract, TechnologyRisk } from '../props'
import { EtherscanLink } from './EtherscanLink'
import { RiskList } from './RiskList'
import { Section } from './Section'

interface Props {
  editLink: string
  issueLink: string
  contracts: TechnologyContract[]
  risks: TechnologyRisk[]
}

export function ContractsSection({
  contracts,
  risks,
  editLink,
  issueLink,
}: Props) {
  return (
    <Section
      title="Smart Contracts"
      id="contracts"
      className="ContractsSection"
      editLink={editLink}
      issueLink={issueLink}
    >
      <p>The system consists of the following smart contracts:</p>
      <ul className="ContractsSection-Contracts">
        {contracts.map((contract, i) => (
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
      {risks.length > 0 && (
        <>
          <p>The current deployment carries some associated risks:</p>
          <RiskList risks={risks} />
        </>
      )}
    </Section>
  )
}
