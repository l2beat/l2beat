import { Layer2StateDerivation } from '@l2beat/config'
import React from 'react'

import { Markdown } from '../Markdown'
import { ProjectDetailsSection } from './ProjectDetailsSection'
import { SectionId } from './sectionId'

export interface StateDerivationSectionProps extends Layer2StateDerivation {
  id: SectionId
  title: string
}

export function StateDerivationSection(props: StateDerivationSectionProps) {
  return (
    <ProjectDetailsSection title={props.title} id={props.id}>
      <div className="flex flex-col gap-6">
        <Item title="Node software">{props.nodeSoftware}</Item>
        <Item title="Compression scheme">{props.compressionScheme}</Item>
        <Item title="Genesis state">{props.genesisState}</Item>
        <Item title="Data format">{props.dataFormat}</Item>
      </div>
    </ProjectDetailsSection>
  )
}

function Item(props: { title: string; children: string }) {
  return (
    <div>
      <span className="text-lg font-bold uppercase">{props.title}</span>
      <Markdown className="mt-2 text-lg leading-snug opacity-80">
        {props.children}
      </Markdown>
    </div>
  )
}
