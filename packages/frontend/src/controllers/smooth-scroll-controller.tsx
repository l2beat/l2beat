'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const SMOOTH_SCROLL_PAGES = ['/scaling/projects']

export default function SmoothScrollController() {
  const pathname = usePathname()

  useEffect(() => {
    const html = document.documentElement
    if (SMOOTH_SCROLL_PAGES.some((page) => pathname.startsWith(page))) {
      html.classList.add('scroll-smooth')
    } else {
      html.classList.remove('scroll-smooth')
    }

    return () => {
      html.classList.remove('scroll-smooth')
    }
  }, [pathname])

  return null
}
