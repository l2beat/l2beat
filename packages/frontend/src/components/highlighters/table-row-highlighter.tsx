'use client'
import { useCallback, useEffect } from 'react'
import { useIsClient } from '~/hooks/use-is-client'

export function TableRowHighlighter() {
  const isClient = useIsClient()
  const handleHighlightChange = useCallback(() => {
    if (!isClient) return
    const params = new URLSearchParams(window.location.search)
    const highlight = params.get('highlight')
    document.querySelectorAll('tr[data-highlighted]').forEach((el) => {
      el.removeAttribute('data-highlighted')
    })

    if (highlight) {
      const elements = document.querySelectorAll(`tr[data-slug="${highlight}"]`)

      elements.forEach((element) => {
        element.scrollIntoView({ block: 'center' })
        element.setAttribute('data-highlighted', 'true')
        setTimeout(() => {
          element.removeAttribute('data-highlighted')
        }, 4500)
      })
    }
  }, [isClient])

  useEffect(() => {
    handleHighlightChange()
  }, [handleHighlightChange])

  return null
}
