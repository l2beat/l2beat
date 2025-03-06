'use client'
import { useEffect } from 'react'
import { useEventListener } from '~/hooks/use-event-listener'

export function PrimaryCardHighlighter() {
  const handleHashChange = () => {
    const hash = window.location.hash
    if (!hash) return

    document
      .querySelectorAll(`.primary-card[data-highlighted]`)
      .forEach((el) => el.removeAttribute('data-highlighted'))

    const element = document.querySelector(hash)
    if (!element) return

    const parentPrimaryCard = Array.from(
      document.querySelectorAll('.primary-card'),
    ).find((card) => card !== element && card.contains(element))

    const toHighlight = parentPrimaryCard ?? element
    toHighlight.setAttribute('data-highlighted', 'true')

    setTimeout(() => {
      toHighlight.removeAttribute('data-highlighted')
    }, 3000)
  }

  useEffect(() => {
    handleHashChange()
  }, [])
  useEventListener('hashchange', handleHashChange)

  return null
}
