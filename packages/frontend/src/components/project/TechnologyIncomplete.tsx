import React from 'react'

import { cn } from '../../utils/cn'
import { Link } from '../Link'

export interface TechnologyIncompleteProps {
  editLink: string
  twitterLink: string | undefined
}

export function TechnologyIncomplete(props: TechnologyIncompleteProps) {
  return (
    <div
      className="mt-8 rounded-lg bg-blue-450/20 p-2 leading-snug text-blue-700 dark:text-blue-300"
      id="incomplete"
    >
      <strong>Note:</strong> This project&apos;s overview requires more research
      and might not present accurate information. If you want to contribute you
      can <Link href={props.editLink}>edit the information on Github</Link>.{' '}
      {props.twitterLink && (
        <>
          Alternatively you{' '}
          <Link href={props.twitterLink}>
            contact the project team on Twitter
          </Link>{' '}
          and encourage them to contribute a PR.
        </>
      )}
    </div>
  )
}

export function TechnologyIncompleteShort() {
  return (
    <div
      className={cn(
        'my-2 rounded-lg px-2 py-1 text-xs md:text-base',
        'bg-blue-450/20 text-blue-700 dark:text-blue-300',
      )}
    >
      <strong>Note:</strong> This section requires more research and might not
      present accurate information.
    </div>
  )
}
