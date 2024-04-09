import React from 'react'

import { ChevronUpIcon } from './icons'

interface Props {
  scrollOffset?: number
}

export function ScrollToTopButton(props: Props) {
  return (
    <a
      href="#"
      data-role="scroll-to-top-button"
      data-scroll-offset={props.scrollOffset}
      className="fixed -bottom-12 right-8 rounded-full bg-pink-100 p-4 transition-[bottom] ease-out data-[visible]:bottom-8"
    >
      <ChevronUpIcon />
    </a>
  )
}
