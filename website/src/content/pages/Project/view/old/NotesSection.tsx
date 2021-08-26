import { Pointer } from '@l2beat/config'
import React from 'react'
import { Section } from '../Section'
import { Pointers } from './Pointers'

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
      <p className="Notes-Text">{notes.text}</p>
      <Pointers className="Notes-Links" pointers={notes.pointers} />
    </Section>
  )
}
