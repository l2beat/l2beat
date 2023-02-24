import React from 'react'

import { OutLink } from '../OutLink'
import { Section } from './Section'
import { WarningBar } from './WarningBar'

export interface DescriptionSectionProps {
  editLink: string
  issueLink: string
  description: string
  warning?: string
  isVerified?: boolean
  isArchived?: boolean
}

export function DescriptionSection(props: DescriptionSectionProps) {
  return (
    <Section title="Description" id="description" className="!mt-0 md:!mt-6">
      {props.isVerified === false && (
        <WarningBar
          text="This project includes unverified contracts."
          color="red"
          isCritical={true}
          className="mt-4"
        />
      )}
      {props.isArchived && (
        <WarningBar
          text="This project is archived and no longer maintained."
          color="red"
          className="mt-4"
          isCritical={false}
        />
      )}
      {props.warning && (
        <WarningBar
          text={props.warning}
          color="yellow"
          isCritical={false}
          className="mt-4"
        />
      )}
      <p className="mt-4 text-gray-850 dark:text-gray-400">
        {props.description}
      </p>
      <p className="mt-4 text-gray-850 dark:text-gray-400">
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
