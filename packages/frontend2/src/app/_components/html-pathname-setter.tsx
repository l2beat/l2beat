'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function HtmlPathnameSetter() {
  const pathname = usePathname()

  useEffect(() => {
    document.documentElement.setAttribute('data-page', pathname)
  }, [pathname])

  return null
}
