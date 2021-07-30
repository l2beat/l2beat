import { ProjectBridge } from '@l2beat/config'
import { ContractDescription } from '../props'
import { EtherscanLink } from './EtherscanLink'
import { Section } from './Section'

interface Props {
  contracts: ContractDescription[]
}

export function ContractsSection({ contracts }: Props) {
  return (
    <Section title="Smart Contracts">
      <ul className="ContractsSection-Contracts">
        {contracts.map((contract, i) => (
          <li key={i}>
            {contract.name} (<EtherscanLink address={contract.address} />)
          </li>
        ))}
      </ul>
    </Section>
  )
}
