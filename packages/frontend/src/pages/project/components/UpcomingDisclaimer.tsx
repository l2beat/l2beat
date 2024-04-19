import React from 'react'

import { InfoIcon } from '../../../components/icons'
import { Link } from '../../../components/Link'
import { Callout } from '../../../components/project/Callout'

export function UpcomingDisclaimer() {
  return (
    <Callout
      className="mt-6 bg-blue-600/20 p-4"
      icon={<InfoIcon className="mt-1 fill-blue-500" />}
      body={
        <>
          <p className="mb-4 leading-snug">
            This project is currently in the development phase and is yet to be
            launched on the Ethereum Mainnet.
          </p>
          <p className="mb-4 leading-snug">
            Once the deployment process is complete, it will be added to the
            list of active projects, along with comprehensive information
            regarding risk, technology, and other technical aspects.
          </p>
          <p className="leading-snug">
            Follow us on{' '}
            <Link href={'https://twitter.com/l2beat'} title="Twitter">
              Twitter
            </Link>{' '}
            to stay updated on the latest news regarding this and other Layer 2
            projects.
          </p>
        </>
      }
    />
  )
}
