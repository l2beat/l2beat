import { flushSync } from 'react-dom'

/**
 * Runs a React state change as a view transition of `type`: before and
 * after the change, `name` gives `view-transition-name`s to the elements
 * that should move, and each named in both states moves from its old place
 * to its new one; those named in one only fade there. CSS styles it under
 * `:active-view-transition-type(<type>)`.
 *
 * Without support for typed transitions (Chromium 125+, Safari 18.2+), or
 * with reduced motion, the change just happens.
 */
export function withViewTransition(
  type: string,
  name: () => HTMLElement[],
  update: () => void,
) {
  if (
    typeof document === 'undefined' ||
    !document.startViewTransition ||
    !('types' in ViewTransition.prototype) ||
    matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    update()
    return
  }
  const named = new Set(name())
  if (named.size === 0) {
    update()
    return
  }
  const transition = document.startViewTransition({
    update: () => {
      flushSync(update)
      clear(named)
      for (const el of name()) named.add(el)
    },
    types: [type],
  })
  // Also when the update threw: the names must not outlive the transition.
  transition.finished.then(
    () => clear(named),
    () => clear(named),
  )
}

function clear(elements: Iterable<HTMLElement>) {
  for (const el of elements) {
    el.style.viewTransitionName = ''
    el.style.removeProperty('view-transition-class')
  }
}

/**
 * Names each element in view that `selector` matches, by its `key`
 * attribute, under one `view-transition-class`.
 */
export function nameInView(
  selector: string,
  key: (el: HTMLElement) => string | undefined,
  className: string,
): HTMLElement[] {
  const named: HTMLElement[] = []
  const used = new Set<string>()
  for (const el of document.querySelectorAll<HTMLElement>(selector)) {
    const value = key(el)
    if (!value || !isInView(el)) continue
    const name = `${className}-${value.toLowerCase().replace(/[^\w-]/g, '-')}`
    if (used.has(name)) continue
    used.add(name)
    el.style.viewTransitionName = name
    el.style.setProperty('view-transition-class', className)
    named.push(el)
  }
  return named
}

function isInView(el: HTMLElement) {
  const r = el.getBoundingClientRect()
  return (
    r.width > 0 && r.bottom > 0 && r.top < innerHeight && r.left < innerWidth
  )
}
