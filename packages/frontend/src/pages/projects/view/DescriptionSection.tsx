import React from 'react'

import { OutLink } from '../../../components'
import { ShieldWarnIcon } from '../../../components/icons'
import { Section } from './Section'

export interface DescriptionSectionProps {
  editLink: string
  issueLink: string
  description: string
  warning?: string
}

export function DescriptionSection(props: DescriptionSectionProps) {
  return (
    <Section
      title="Description"
      id="description"
      className="DescriptionSection"
    >
      {props.warning && (
        <div className="DescriptionSection-Warning">
          <ShieldWarnIcon />
          {props.warning}
        </div>
      )}
      <p className="DescriptionSection-Text">{props.description}</p>
      <p className="mt-4">
        If you find something wrong on this page you can{' '}
        <OutLink className="text-link underline" href={props.issueLink}>
          submit an issue
        </OutLink>
        {' or '}
        <OutLink className="text-link underline" href={props.editLink}>
          edit the information
        </OutLink>
        .
      </p>
    </Section>
  )
}
