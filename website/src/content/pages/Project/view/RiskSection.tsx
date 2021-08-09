import { ShieldBadIcon } from '../../../common/icons'
import { RiskProps } from '../props'
import { Section } from './Section'

export function RiskSection({ riskGroups }: RiskProps) {
  return (
    <Section title="Risks">
      {riskGroups.map((group, i) => (
        <div className="RiskSection-Group" key={i}>
          <p className="RiskSection-Title">
            <ShieldBadIcon /> {group.name}&hellip;
          </p>
          <ol className="RiskSection-Risks" start={group.start}>
            {group.items.map((item, i) => (
              <li className="RiskSection-Risk" key={i}>
                <a href={`#${item.referencedId}`}>{item.text}</a>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </Section>
  )
}
