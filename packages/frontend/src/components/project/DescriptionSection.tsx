import React from 'react'

import { ShieldIcon } from '../icons'
import { OutLink } from '../OutLink'
import { Section } from './Section'

export interface DescriptionSectionProps {
  editLink: string
  issueLink: string
  description: string
  warning?: string
}

export function DescriptionSection(props: DescriptionSectionProps) {
  return (
    <Section title="Description" id="description" className="md:!mt-6">
      {props.warning && (
        <div className="DescriptionSection-Warning">
          <ShieldIcon className="fill-yellow-700 dark:fill-yellow-300" />
          {props.warning}
        </div>
      )}
      <p className="mt-4 text-gray-860 dark:text-gray-400">
        {props.description}
      </p>
      <p className="mt-4 text-gray-860 dark:text-gray-400">
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
