import { useEffect, useState } from 'react'
import { useEventCallback } from '~/hooks/useEventCallback'
import { useEventListener } from '~/hooks/useEventListener'

import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'

const DEFAULT_SCROLL_OFFSET = 600

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const manageVisibility = useEventCallback(() => {
    const isVisible = window.scrollY > DEFAULT_SCROLL_OFFSET

    if (isVisible) {
      setIsVisible(true)
      return
    }

    setIsVisible(false)
  })

  useEffect(() => {
    manageVisibility()
  }, [manageVisibility])
  useEventListener('scroll', manageVisibility)

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        '-bottom-12 fixed right-8 z-999 size-12 rounded-lg bg-brand transition-[bottom,background-color] ease-out hover:bg-fuchsia-700 group-data-[has-colors=true]/section-wrapper:bg-branding-primary group-data-[has-colors=true]/section-wrapper:hover:bg-branding-primary dark:hover:bg-purple-450',
        isVisible && 'bottom-8',
      )}
    >
      <ChevronIcon className="mx-auto rotate-180 fill-primary-invert" />
    </button>
  )
}
