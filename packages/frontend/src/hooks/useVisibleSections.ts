import { useEffect, useState } from 'react'
import {
  getViewportHeightOffset,
  isScrolledToBottom,
  isScrolledToTop,
  type Threshold,
} from './useCurrentSection'
import { useDevice } from './useDevice'

interface Options {
  threshold?: Threshold
  /**
   * Pages mount both the desktop and the mobile navigation and hide one with
   * CSS. The hidden one should not observe the sections at all.
   */
  enabled?: boolean
}

// Fine steps at the low end: for a tall section, the "meaningful part" rule
// resolves within a few percent of its height rather than a whole step.
const INTERSECTION_THRESHOLDS = [
  0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8,
  0.9, 1,
]

/**
 * Ids of every nav section the reader can currently see, in document order.
 * Unlike `useCurrentSection` this lets a navigation highlight several entries
 * at once, which is what actually happens on tall viewports with short
 * sections. A section counts as visible only when a meaningful part of it is
 * inside the viewport, so a sliver peeking in at an edge does not light up
 * its entry.
 *
 * Geometry comes from an IntersectionObserver rather than
 * `getBoundingClientRect`: sections live inside `content-visibility: auto`
 * wrappers (see LazyHydrate), and measuring a skipped section forces its
 * whole subtree to lay out. Doing that for every section on every scroll or
 * resize step multiplied the page's layout work by the section count.
 */
export function useVisibleSections({
  threshold,
  enabled = true,
}: Options = {}): string[] {
  const { isMobile } = useDevice()
  const [visibleIds, setVisibleIds] = useState<string[]>([])

  useEffect(() => {
    if (!enabled) return
    let sections: HTMLElement[] = []
    const geometry = new Map<Element, IntersectionObserverEntry>()

    const update = () => {
      const minVisibleHeight = getViewportHeightOffset(threshold, isMobile)
      const visible = sections.filter((section) => {
        const entry = geometry.get(section)
        return entry && isMeaningfullyVisible(entry, minVisibleHeight)
      })
      const firstSection = sections.at(0)
      const lastSection = sections.at(-1)
      if (isScrolledToTop() && firstSection) visible.unshift(firstSection)
      if (isScrolledToBottom() && lastSection) visible.push(lastSection)

      const ids = Array.from(new Set(visible.map((section) => section.id)))
      // Between two sections nothing may qualify for a moment; keep the last
      // answer rather than blanking the navigation.
      if (ids.length === 0) return
      setVisibleIds((previous) => (sameIds(previous, ids) ? previous : ids))
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) geometry.set(entry.target, entry)
        update()
      },
      { threshold: INTERSECTION_THRESHOLDS },
    )

    // LazyHydrate swaps the server-rendered section for React's copy when it
    // nears the viewport. A swapped-out node that was not intersecting never
    // produces another entry, so the swap is detected from DOM mutations
    // instead: a cheap `isConnected` sweep, then re-query and observe the
    // replacement, which carries the same id.
    function syncSections() {
      for (const section of sections) {
        if (section.isConnected) continue
        observer.unobserve(section)
        geometry.delete(section)
      }
      sections = Array.from(
        document.querySelectorAll<HTMLElement>('[data-role="nav-section"]'),
      )
      for (const section of sections) {
        if (!geometry.has(section)) observer.observe(section)
      }
    }
    const mutations = new MutationObserver(() => {
      if (sections.some((section) => !section.isConnected)) syncSections()
    })

    syncSections()
    mutations.observe(document.body, { childList: true, subtree: true })
    // The observer only fires on threshold crossings; the page-edge rules
    // depend on scroll position alone.
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      observer.disconnect()
      mutations.disconnect()
      window.removeEventListener('scroll', update)
    }
  }, [enabled, isMobile, threshold])

  return visibleIds
}

/**
 * The threshold is a minimum visible amount, not a clipping line: a short
 * section sitting near the top of the viewport (e.g. right after clicking its
 * nav entry) is fully visible and must count.
 */
function isMeaningfullyVisible(
  entry: IntersectionObserverEntry,
  minVisibleHeight: number,
) {
  const visibleHeight = entry.intersectionRect.height
  const requiredHeight = Math.min(
    entry.boundingClientRect.height,
    minVisibleHeight,
  )
  return (
    entry.isIntersecting && visibleHeight > 0 && visibleHeight >= requiredHeight
  )
}

function sameIds(a: string[], b: string[]) {
  return a.length === b.length && a.every((id, i) => id === b[i])
}
