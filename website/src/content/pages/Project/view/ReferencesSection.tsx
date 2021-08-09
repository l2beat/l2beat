import { OutLink } from '../../../common'
import { Section } from './Section'

export interface ReferencesSectionProps {
  items: TechnologyReference[]
}

export interface TechnologyReference {
  id: number
  text: string
  href: string
}

export function ReferencesSection({ items }: ReferencesSectionProps) {
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
