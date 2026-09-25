import { useCallback, useEffect, useState } from 'react'
import {
  getViewportHeightOffset,
  isScrolledToBottom,
  isScrolledToTop,
  type Threshold,
} from './useCurrentSection'
import { useDevice } from './useDevice'
import { useEventListener } from './useEventListener'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

interface Options {
  threshold?: Threshold
  /**
   * Pages mount both the desktop and the mobile navigation and hide one with
   * CSS. The hidden one should not measure every section on each scroll.
   */
  enabled?: boolean
}

/**
 * Ids of every nav section the reader can currently see, in document order.
 * Unlike `useCurrentSection` this lets a navigation highlight several entries
 * at once, which is what actually happens on tall viewports with short
 * sections. A section counts as visible only when a meaningful part of it is
 * inside the viewport, so a sliver peeking in at an edge does not light up
 * its entry.
 */
export function useVisibleSections({
  threshold,
  enabled = true,
}: Options = {}): string[] {
  const { isMobile } = useDevice()
  const [visibleIds, setVisibleIds] = useState<string[]>([])

  const findVisibleSections = useCallback(() => {
    if (!enabled) return
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-role="nav-section"]'),
    )
    const minVisibleHeight = getViewportHeightOffset(threshold, isMobile)
    const visible = sections.filter((section) =>
      isMeaningfullyVisible(section, minVisibleHeight),
    )
    const firstSection = sections.at(0)
    const lastSection = sections.at(-1)
    if (isScrolledToTop() && firstSection) visible.unshift(firstSection)
    if (isScrolledToBottom() && lastSection) visible.push(lastSection)
    if (visible.length === 0) {
      const fallback = sections.findLast(
        (section) => section.getBoundingClientRect().top < minVisibleHeight,
      )
      if (fallback) visible.push(fallback)
    }

    const ids = Array.from(new Set(visible.map((section) => section.id)))
    setVisibleIds((previous) => (sameIds(previous, ids) ? previous : ids))
  }, [enabled, isMobile, threshold])

  useIsomorphicLayoutEffect(() => {
    findVisibleSections()
  }, [findVisibleSections])
  useEventListener('scroll', findVisibleSections)
  useEventListener('resize', findVisibleSections)
  useDocumentResize(findVisibleSections, enabled)

  return visibleIds
}

/**
 * Content that settles after hydration (images, lazy sections) moves later
 * sections without any scroll or resize event, so watch the document height.
 */
function useDocumentResize(onResize: () => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const observer = new ResizeObserver(onResize)
    observer.observe(document.documentElement)
    return () => observer.disconnect()
  }, [onResize, enabled])
}

/**
 * The threshold is a minimum visible amount, not a clipping line: a short
 * section sitting near the top of the viewport (e.g. right after clicking its
 * nav entry) is fully visible and must count.
 */
function isMeaningfullyVisible(section: HTMLElement, minVisibleHeight: number) {
  const rect = section.getBoundingClientRect()
  const visibleHeight =
    Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
  const requiredHeight = Math.min(rect.height, minVisibleHeight)
  return visibleHeight > 0 && visibleHeight >= requiredHeight
}

function sameIds(a: string[], b: string[]) {
  return a.length === b.length && a.every((id, i) => id === b[i])
}
