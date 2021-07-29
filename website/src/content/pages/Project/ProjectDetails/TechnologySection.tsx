import { ShieldBadIcon } from '../../../common/icons'
import { TechnologyChoice } from '../props'
import { EditLinks } from './EditLinks'
import { References } from './References'
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
          {item.risks.map((risk, i) => (
            <p className="TechnologySection-Risk" key={i}>
              <ShieldBadIcon />
              {risk.text}
              <References ids={risk.referenceIds} />
            </p>
          ))}
        </div>
      ))}
    </Section>
  )
}
