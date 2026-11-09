import { useEffect, useRef, useState } from 'react'
import { useEventCallback } from '~/hooks/useEventCallback'
import { useEventListener } from '~/hooks/useEventListener'

import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'

const DEFAULT_SCROLL_OFFSET = 600

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  // Phones have no gutter for the button, so it covers the text column; it
  // shows there only while scrolling back up, not while reading down.
  const [isScrollingUp, setIsScrollingUp] = useState(false)
  const lastScrollY = useRef(0)

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const manageVisibility = useEventCallback(() => {
    setIsVisible(window.scrollY > DEFAULT_SCROLL_OFFSET)
    if (window.scrollY !== lastScrollY.current) {
      setIsScrollingUp(window.scrollY < lastScrollY.current)
    }
    lastScrollY.current = window.scrollY
  })

  useEffect(() => {
    manageVisibility()
  }, [manageVisibility])
  useEventListener('scroll', manageVisibility)

  return (
    <button
      aria-label="Scroll to top"
      onClick={scrollToTop}
      className={cn(
        '-bottom-12 fixed right-4 z-999 size-10 rounded-lg bg-brand transition-[bottom,filter] ease-out hover:brightness-90 md:right-8 md:size-12',
        isVisible && 'bottom-4 md:bottom-8',
        isVisible && !isScrollingUp && 'max-md:-bottom-12',
      )}
    >
      <ChevronIcon className="mx-auto rotate-180 fill-primary-invert" />
    </button>
  )
}
