import { OutLink } from '../../../common'
import { TechnologyReference } from '../props'
import { Section } from './Section'

interface Props {
  items: TechnologyReference[]
}

export function ReferencesSection({ items }: Props) {
  return (
    <Section title="References">
      <ol className="ReferencesSection">
        {items.map((item) => (
          <li id={`reference-${item.id}`}>
            <OutLink href={item.href}>{item.text}</OutLink>
          </li>
        ))}
      </ol>
    </Section>
  )
}
