import cx from 'classnames'
import React from 'react'

import { ShieldIcon } from '../icons'
import { OutLink } from '../OutLink'
import { Section } from './Section'

export interface DescriptionSectionProps {
  editLink: string
  issueLink: string
  description: string
  warning?: string
  isVerified?: boolean
}

export function DescriptionSection(props: DescriptionSectionProps) {
  return (
    <Section title="Description" id="description" className="md:!mt-6">
      {props.isVerified === false && (
        <div
          className={cx(
            'flex gap-3 mt-4 first:mt-0 md:mt-6 p-4',
            'bg-red-600 bg-opacity-20 rounded-lg',
          )}
        >
          <ShieldIcon className="fill-red-700 dark:fill-red-300" />
          <p>{'This project includes unverified contracts'}</p>
        </div>
      )}

      {props.warning && (
        <div
          className={cx(
            'flex gap-3 mt-4 first:mt-0 md:mt-6 p-4',
            'bg-yellow-300 bg-opacity-20 rounded-lg',
          )}
        >
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
