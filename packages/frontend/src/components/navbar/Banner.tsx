import React from 'react'

import { ArrowRightIcon } from '../icons'

export function Banner() {
  return (
    <a
      className="flex items-center justify-center bg-blue-800 px-4 py-1.5 text-center text-xs font-medium text-white"
      href="https://www.tally.xyz/profile/l2beatcom.eth?governanceId=eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
      target="_blank"
    >
      We're striving to become an Arbitrum DAO delegate.{' '}
      <span className="ml-2 underline">Checkout our application!</span>
      <ArrowRightIcon className="ml-0.5 h-3 w-3 fill-white" />
    </a>
  )
}
