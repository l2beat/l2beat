'use client'
import { useEffect } from 'react'
import { useEventListener } from '~/hooks/use-event-listener'

export function ProjectSectionHighlighter() {
  const handleHashChange = () => {
    const hash = window.location.hash
    if (hash) {
      document.querySelectorAll('[data-hash-highlighted]').forEach((el) => {
        el.removeAttribute('data-hash-highlighted')
      })

      const element = document.querySelector(hash)

      if (element) {
        element.setAttribute('data-hash-highlighted', 'true')
        setTimeout(() => {
          element.removeAttribute('data-hash-highlighted')
        }, 5000)
      }
    }
  }
  useEffect(() => {
    handleHashChange()
  }, [])
  useEventListener('hashchange', handleHashChange)

  return null
}
