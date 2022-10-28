import cx from 'classnames'
import React from 'react'

import { OutLink } from '../OutLink'

export interface TechnologyIncompleteProps {
  editLink: string
  twitterLink: string | undefined
}

export function TechnologyIncomplete(props: TechnologyIncompleteProps) {
  return (
    <div
      className="mt-8 p-2 bg-blue-450 bg-opacity-20 text-blue-700 dark:text-blue-300 rounded-lg"
      id="incomplete"
    >
      <strong>Note:</strong> This project&apos;s overview requires more research
      and might not present accurate information. If you want to contribute you
      can{' '}
      <OutLink className="text-link underline" href={props.editLink}>
        edit the information on Github
      </OutLink>
      .{' '}
      {props.twitterLink && (
        <>
          Alternatively you{' '}
          <OutLink className="text-link underline" href={props.twitterLink}>
            contact the project team on Twitter
          </OutLink>{' '}
          and encourage them to contribute a PR.
        </>
      )}
    </div>
  )
}

export function TechnologyIncompleteShort() {
  return (
    <div
      className={cx(
        'mt-2 py-1 px-2 text-xs md:text-base rounded-lg',
        'bg-blue-450 bg-opacity-20 text-blue-700 dark:text-blue-300',
      )}
    >
      <strong>Note:</strong> This section requires more research and might not
      present accurate information.
    </div>
  )
}
