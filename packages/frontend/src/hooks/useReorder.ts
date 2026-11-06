import { type RefObject, useLayoutEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { EASE_OUT_QUINT } from '~/utils/easing'

const REORDER_MS = 600
/** A new row has nowhere to slide from, so it fades in */
const ENTER_MS = 300

/** FLIP-animates rows marked with `data-flip-key` when `order` changes */
export function useReorder(
  containerRef: RefObject<HTMLElement | null>,
  order: string,
) {
  const tops = useRef(new Map<string, number>())
  const reducedMotion = usePrefersReducedMotion()
  // biome-ignore lint/correctness/useExhaustiveDependencies: `order` is what moves the rows
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return
    const next = new Map<string, number>()
    const rows = container.querySelectorAll<HTMLElement>('[data-flip-key]')
    for (const row of rows) {
      const key = row.dataset.flipKey
      if (key === undefined) continue
      // within the container, so scrolling the page between updates moves nothing
      const top = row.offsetTop
      next.set(key, top)
      const was = tops.current.get(key)
      if (reducedMotion || tops.current.size === 0) continue
      if (was === undefined) {
        row.animate([{ opacity: 0 }, {}], {
          duration: ENTER_MS,
          easing: EASE_OUT_QUINT,
        })
      } else if (was !== top) {
        row.animate(
          [{ transform: `translateY(${was - top}px)` }, { transform: 'none' }],
          { duration: REORDER_MS, easing: EASE_OUT_QUINT },
        )
      }
    }
    tops.current = next
  }, [containerRef, order, reducedMotion])
}
