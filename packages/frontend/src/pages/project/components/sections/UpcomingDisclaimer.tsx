import React from 'react'

import { Callout } from '../../../../components/Callout'
import { InfoIcon } from '../../../../components/icons'
import { Link } from '../../../../components/Link'

export function UpcomingDisclaimer() {
  return (
    <Callout
      className="-mx-4 rounded-none bg-blue-600/20 p-4 md:mx-0 md:mt-16 md:rounded-lg"
      icon={<InfoIcon className="mt-1 fill-blue-500" />}
      body={
        <>
          <p className="mb-4 leading-snug">
            This project is currently in development. Once live, it will be
            listed along with comprehensive information about the risks and the
            technology.
          </p>

          <p className="leading-snug">
            Follow us on{' '}
            <Link href={'https://twitter.com/l2beat'} title="Twitter">
              Twitter
            </Link>{' '}
            to stay updated on the latest news regarding this and other
            projects.
          </p>
        </>
      }
    />
  )
}
