import { TechnologyContract, TechnologyRisk } from '../props'
import { EtherscanLink } from './EtherscanLink'
import { RiskList } from './RiskList'
import { Section } from './Section'

interface Props {
  contracts: TechnologyContract[]
  risks: TechnologyRisk[]
}

export function ContractsSection({ contracts, risks }: Props) {
  return (
    <Section title="Smart Contracts">
      <ul className="ContractsSection-Contracts">
        {contracts.map((contract, i) => (
          <li key={i}>
            <div>
              <span className="ContractsSection-Name">{contract.name}</span>
            </div>
            (<EtherscanLink address={contract.address} />)
          </li>
        ))}
      </ul>
      <RiskList risks={risks} />
    </Section>
  )
}
