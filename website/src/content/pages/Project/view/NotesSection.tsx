import { Pointer } from '@l2beat/config'
import { Pointers } from './Pointers'
import { Section } from './Section'

interface Props {
  notes: {
    /** Note text */
    text: string
    /** Relevant links */
    pointers?: Pointer[]
  }
}

export function NotesSection({ notes }: Props) {
  return (
    <Section title="Notes" id="notes">
      <p className="ProjectDetails-Text">{notes.text}</p>
      <Pointers className="ProjectDetails-Links" pointers={notes.pointers} />
    </Section>
  )
}
