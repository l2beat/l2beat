'use client'
import { useCallback, useEffect } from 'react'
import { useIsClient } from '~/hooks/use-is-client'

export function TableRowHighlighter() {
  const isClient = useIsClient()
  const handleHighlightChange = useCallback(() => {
    if (!isClient) return
    const params = new URLSearchParams(window.location.search)
    const highlight = params.get('highlight')
    document.querySelectorAll('[data-hash-highlighted]').forEach((el) => {
      el.removeAttribute('data-hash-highlighted')
    })

    if (highlight) {
      const element = document.getElementById(highlight)

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.setAttribute('data-hash-highlighted', 'true')
        setTimeout(() => {
          element.removeAttribute('data-hash-highlighted')
        }, 5000)
      }
    }
  }, [isClient])

  useEffect(() => {
    handleHighlightChange()
  }, [handleHighlightChange])

  return null
}
