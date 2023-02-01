import React from 'react'

import { ArrowRightIcon } from '../icons'

export function Banner() {
  return (
    <a
      className="text-center bg-pink-900 text-white text-xs font-medium px-4 py-1.5 flex items-center justify-center"
      href="https://l2beat.notion.site/We-are-hiring-Work-at-L2BEAT-e4e637265ae94c5db7dfa2de336b940f"
      target="_blank"
    >
      We are hiring!
      <span className="underline ml-2">Join L2BEAT</span>
      <ArrowRightIcon className="fill-white w-3 h-3 ml-0.5" />
    </a>
  )
}
