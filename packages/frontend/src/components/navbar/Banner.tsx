import React from 'react'

import { ArrowRightIcon } from '../icons'

export function Banner() {
  return (
    <a
      className="flex items-center justify-center bg-pink-900 px-4 py-1.5 text-center text-xs font-medium text-white"
      href="https://l2beat.notion.site/We-are-hiring-Work-at-L2BEAT-e4e637265ae94c5db7dfa2de336b940f"
      target="_blank"
    >
      We are hiring!
      <span className="ml-2 underline">Join L2BEAT</span>
      <ArrowRightIcon className="ml-0.5 h-3 w-3 fill-white" />
    </a>
  )
}
