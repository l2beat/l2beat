import { EtherscanLink } from './EtherscanLink'
import { Section } from './Section'

export interface BridgesSectionProps {
  bridges: BridgeDetails[]
}

export interface BridgeDetails {
  address: string
  tokens: string[]
}

export function BridgesSection({ bridges }: BridgesSectionProps) {
  return (
    <Section title="Tracked bridges" id="bridges">
      <ul className="ProjectDetails-Links">
        {bridges.map((bridge, i) => (
          <li key={i}>
            <EtherscanLink address={bridge.address} /> -{' '}
            {bridge.tokens.join(', ')}
          </li>
        ))}
      </ul>
    </Section>
  )
}
