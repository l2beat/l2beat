'use client'
import { useCallback, useEffect } from 'react'
import { useIsClient } from '~/hooks/use-is-client'

export function TableRowHighlighter() {
  const isClient = useIsClient()
  const handleHighlightChange = useCallback(() => {
    if (!isClient) return
    const params = new URLSearchParams(window.location.search)
    const highlight = params.get('highlight')
    document.querySelectorAll('[data-highlighted]').forEach((el) => {
      el.removeAttribute('data-highlighted')
    })

    if (highlight) {
      const elements = document.querySelectorAll(`[data-slug="${highlight}"]`)

      elements.forEach((element) => {
        element.scrollIntoView({ block: 'center' })
        element.setAttribute('data-highlighted', 'true')
        setTimeout(() => {
          element.removeAttribute('data-highlighted')
        }, 5000)
      })
    }
  }, [isClient])

  useEffect(() => {
    handleHighlightChange()
  }, [handleHighlightChange])

  return null
}
