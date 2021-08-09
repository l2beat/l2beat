import { TechnologyChoice } from '../props'
import { EditLinks } from './EditLinks'
import { References } from './References'
import { RiskList } from './RiskList'
import { Section } from './Section'

interface Props {
  title: string
  items: TechnologyChoice[]
}

export function TechnologySection({ title, items }: Props) {
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
