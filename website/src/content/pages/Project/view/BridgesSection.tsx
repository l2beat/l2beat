import { ProjectBridge } from '@l2beat/config'
import { EtherscanLink } from './EtherscanLink'
import { Section } from './Section'

interface Props {
  bridges: ProjectBridge[]
}

export function BridgesSection({ bridges }: Props) {
  return (
    <Section title="Tracked bridges">
      <ul className="ProjectDetails-Links">
        {bridges.map((bridge, i) => (
          <li key={i}>
            <EtherscanLink address={bridge.address} /> -{' '}
            {bridge.tokens.map((t: string) => t).join(', ')}
          </li>
        ))}
      </ul>
    </Section>
  )
}
