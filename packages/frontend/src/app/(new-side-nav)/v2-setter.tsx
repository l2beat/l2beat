'use client'

import { useEffect } from 'react'

export function V2Setter() {
  useEffect(() => {
    document.documentElement.classList.add('v2')
  }, [])

  return null
}
