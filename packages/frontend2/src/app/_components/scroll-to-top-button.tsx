'use client'
import React, { useEffect, useState } from 'react'

import ChevronIcon from '~/icons/chevron.svg'
import { cn } from '~/utils/cn'

const DEFAULT_SCROLL_OFFSET = 600

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    window.addEventListener('scroll', () => {
      const isVisible = window.scrollY > DEFAULT_SCROLL_OFFSET

      if (isVisible) {
        setIsVisible(true)
        return
      }

      setIsVisible(false)
    })
  }, [])

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        'fixed -bottom-12 right-8 size-12 rounded-lg bg-pink-900 transition-[bottom,background-color] ease-out hover:bg-fuchsia-700 dark:bg-pink-200 dark:hover:bg-purple-450',
        isVisible && 'bottom-8',
      )}
    >
      <ChevronIcon className="mx-auto fill-pure-white dark:fill-neutral-900 rotate-180" />
    </button>
  )
}
