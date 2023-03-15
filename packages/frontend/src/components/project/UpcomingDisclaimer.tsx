import cx from 'classnames'
import React from 'react'

import { InfoIcon } from '../icons'
import { OutLink } from '../OutLink'
import { Callout } from './Callout'

export interface UpcomingDisclaimerProps {
  className?: string
}

export function UpcomingDisclaimer({ className }: UpcomingDisclaimerProps) {
  return (
    <Callout
      className={cx('bg-blue-600 p-4', className)}
      icon={<InfoIcon className="mt-1 fill-blue-500" />}
      body={
        <>
          <p>
            This is an upcoming project. We are gathering data & conducting
            in-depth research.
          </p>
          <br />
          <p>
            Shortly the project will be added to the active projects list along
            detail information about risk, technology & other technical aspects.
          </p>
          <br />
          Follow us on{' '}
          <OutLink href={'#'} title="Twitter" className="text-link">
            Twitter
          </OutLink>{' '}
          to get news about the latest projects added.
        </>
      }
    />
  )
}
