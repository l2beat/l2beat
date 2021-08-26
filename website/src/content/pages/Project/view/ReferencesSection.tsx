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
  if (items.length === 0) {
    return null
  }
  return (
    <Section title="References" id="references" className="ReferencesSection">
      <ol className="ReferencesSection-List">
        {items.map((item) => (
          <li id={`reference-${item.id}`}>
            <OutLink href={item.href}>{item.text}</OutLink>
          </li>
        ))}
      </ol>
    </Section>
  )
}
