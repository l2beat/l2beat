'use client'

import { useEffect, useState } from 'react'

export const useHash = () => {
  const [hash, setHash] = useState('')
  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash.replace('#', ''))
    }
    onHashChange()
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  return hash
}
