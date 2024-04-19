import { ScalingProjectStateDerivation } from '@l2beat/config'
import React from 'react'

import { Markdown } from '../../../../components/Markdown'
import { Section } from './common/Section'
import { ProjectSectionId } from './common/sectionId'

export interface StateDerivationSectionProps
  extends ScalingProjectStateDerivation {
  id: ProjectSectionId
  title: string
  sectionOrder: number
  isUnderReview: boolean | undefined
}

export function StateDerivationSection(props: StateDerivationSectionProps) {
  return (
    <Section
      title={props.title}
      id={props.id}
      sectionOrder={props.sectionOrder}
      isUnderReview={props.isUnderReview}
    >
      <div className="flex flex-col gap-6">
        <Item title="Node software">{props.nodeSoftware}</Item>
        {props.compressionScheme && (
          <Item title="Compression scheme">{props.compressionScheme}</Item>
        )}
        <Item title="Genesis state">{props.genesisState}</Item>
        <Item title="Data format">{props.dataFormat}</Item>
      </div>
    </Section>
  )
}

function Item(props: { title: string; children: string }) {
  return (
    <div>
      <span className="text-lg font-bold uppercase md:text-xl">
        {props.title}
      </span>
      <Markdown className="mt-2 leading-snug text-gray-850 dark:text-gray-400 md:text-lg">
        {props.children}
      </Markdown>
    </div>
  )
}
