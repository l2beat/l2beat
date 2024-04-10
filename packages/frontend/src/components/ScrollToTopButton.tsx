import React from 'react'

import { ChevronUpIcon } from './icons'

interface Props {
  scrollOffset?: number
}

export function ScrollToTopButton(props: Props) {
  return (
    <button
      data-role="scroll-to-top-button"
      data-scroll-offset={props.scrollOffset}
      className="fixed -bottom-12 right-8 flex size-12 items-center justify-center rounded-lg bg-pink-900 transition-[bottom,background-color] ease-out hover:bg-fuchsia-700 data-[visible]:bottom-8 dark:bg-pink-200 dark:hover:bg-[#C164E3]"
    >
      <ChevronUpIcon className="fill-pure-white dark:fill-neutral-900" />
    </button>
  )
}
