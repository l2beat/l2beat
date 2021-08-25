import { Heading, OutLink } from '../../../common'
import { InlineReferences } from './InlineReferences'
import { RiskList, TechnologyRisk } from './RiskList'
import { Section } from './Section'

export interface TechnologySectionProps {
  id: string
  title: string
  items: TechnologyChoice[]
}

export interface TechnologyChoice {
  id: string
  name: string
  editLink: string
  issueLink: string
  description: string
  isIncomplete: boolean
  referenceIds: number[]
  risks: TechnologyRisk[]
}

export function TechnologySection({
  id,
  title,
  items,
}: TechnologySectionProps) {
  return (
    <Section title={title} id={id} className="TechnologySection">
      {items.map((item, i) => (
        <div className="TechnologySection-Item" key={i}>
          <Heading
            level={3}
            id={item.id}
            title={item.name}
            links={[
              { name: 'Edit', href: item.editLink },
              { name: 'Issue', href: item.issueLink },
            ]}
          />
          {item.isIncomplete && (
            <div className="TechnologySection-Incomplete">
              <strong>Note:</strong> This section requires more research and
              might not present accurate information.
            </div>
          )}
          <p>
            {item.description}
            <InlineReferences
              ids={item.referenceIds}
              citationNeededLink={'#incomplete'}
            />
          </p>
          <RiskList risks={item.risks} />
        </div>
      ))}
    </Section>
  )
}
