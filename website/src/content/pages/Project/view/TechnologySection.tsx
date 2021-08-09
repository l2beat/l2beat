import { EditLinks } from './EditLinks'
import { References } from './References'
import { RiskList, TechnologyRisk } from './RiskList'
import { Section } from './Section'

export interface TechnologySectionProps {
  title: string
  items: TechnologyChoice[]
}

export interface TechnologyChoice {
  id: string
  name: string
  editLink: string
  issueLink: string
  description: string
  referenceIds: number[]
  risks: TechnologyRisk[]
}

export function TechnologySection({ title, items }: TechnologySectionProps) {
  return (
    <Section title={title}>
      {items.map((item, i) => (
        <div className="TechnologySection-Item" key={i}>
          <h3 id={item.id} className="TechnologySection-Title">
            {item.name}
            <EditLinks editLink={item.editLink} issueLink={item.issueLink} />
          </h3>
          <p>
            {item.description}
            <References ids={item.referenceIds} />
          </p>
          <RiskList risks={item.risks} />
        </div>
      ))}
    </Section>
  )
}
