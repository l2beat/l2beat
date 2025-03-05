'use client'
import { useEffect } from 'react'
import { useEventListener } from '~/hooks/use-event-listener'

export function ProjectSectionHighlighter() {
  const handleHashChange = () => {
    const hash = window.location.hash
    if (hash) {
      document.querySelectorAll('[data-highlighted]').forEach((el) => {
        el.removeAttribute('data-highlighted')
      })

      const element = document.querySelector(hash)

      if (element) {
        element.setAttribute('data-highlighted', 'true')
        setTimeout(() => {
          element.removeAttribute('data-highlighted')
        }, 3000)
      }
    }
  }
  useEffect(() => {
    handleHashChange()
  }, [])
  useEventListener('hashchange', handleHashChange)

  return null
}
