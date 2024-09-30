'use client'

import { useEffect } from 'react'

export function V2Setter() {
  useEffect(() => {
    document.documentElement.classList.add('v2')

    return () => {
      document.documentElement.classList.remove('v2')
    }
  }, [])

  return null
}
