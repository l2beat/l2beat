import React from 'react'

import { ArrowRightIcon } from '../icons'

export function Banner() {
  return (
    <a
      className="flex items-center justify-center bg-blue-800 px-4 py-1.5 text-center text-xs font-medium text-white"
      href="https://forum.arbitrum.foundation/t/delegate-application-template/31/934"
      target="_blank"
    >
      We're striving to become an Arbitrum DAO delegate.{' '}
      <span className="ml-2 underline">Checkout our application!</span>
      <ArrowRightIcon className="ml-0.5 h-3 w-3 fill-white" />
    </a>
  )
}
