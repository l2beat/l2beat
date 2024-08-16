import React from 'react'
import { CustomLink } from '../../link/custom-link'
import { Callout } from '../../callout'
import InfoIcon from '~/icons/info.svg'

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
            <CustomLink href="https://twitter.com/l2beat">Twitter</CustomLink>{' '}
            to stay updated on the latest news regarding this and other
            projects.
          </p>
        </>
      }
    />
  )
}
