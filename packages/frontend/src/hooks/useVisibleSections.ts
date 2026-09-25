import { useCallback, useState } from 'react'
import {
  getViewportHeightOffset,
  isScrolledToBottom,
  isScrolledToTop,
  type Threshold,
} from './useCurrentSection'
import { useDevice } from './useDevice'
import { useEventListener } from './useEventListener'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

/**
 * Ids of every nav section the reader can currently see, in document order.
 * Unlike `useCurrentSection` this lets a navigation highlight several entries
 * at once, which is what actually happens on tall viewports with short
 * sections. A section counts as visible only when a meaningful part of it is
 * inside the reading band, so a sliver peeking in at the bottom edge does not
 * light up its entry.
 */
export function useVisibleSections(threshold?: Threshold): string[] {
  const { isMobile } = useDevice()
  const [visibleIds, setVisibleIds] = useState<string[]>([])

  const findVisibleSections = useCallback(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-role="nav-section"]'),
    )
    const readingBandTop = getViewportHeightOffset(threshold, isMobile)
    const visible = sections.filter((section) =>
      isMeaningfullyVisible(section, readingBandTop),
    )
    const firstSection = sections.at(0)
    const lastSection = sections.at(-1)
    if (isScrolledToTop() && firstSection) visible.unshift(firstSection)
    if (isScrolledToBottom() && lastSection) visible.push(lastSection)
    if (visible.length === 0) {
      const fallback = sections.findLast(
        (section) => section.getBoundingClientRect().top < readingBandTop,
      )
      if (fallback) visible.push(fallback)
    }

    const ids = Array.from(new Set(visible.map((section) => section.id)))
    setVisibleIds((previous) => (sameIds(previous, ids) ? previous : ids))
  }, [isMobile, threshold])

  useIsomorphicLayoutEffect(() => {
    findVisibleSections()
  }, [findVisibleSections])
  useEventListener('scroll', findVisibleSections)
  useEventListener('resize', findVisibleSections)

  return visibleIds
}

function isMeaningfullyVisible(section: HTMLElement, readingBandTop: number) {
  const rect = section.getBoundingClientRect()
  const visibleHeight =
    Math.min(rect.bottom, window.innerHeight) -
    Math.max(rect.top, readingBandTop)
  const requiredHeight = Math.min(rect.height, readingBandTop)
  return visibleHeight > 0 && visibleHeight >= requiredHeight
}

function sameIds(a: string[], b: string[]) {
  return a.length === b.length && a.every((id, i) => id === b[i])
}
