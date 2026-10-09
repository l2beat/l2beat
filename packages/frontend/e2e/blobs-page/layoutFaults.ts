import type { Page } from 'playwright/test'

/**
 * What is laid out wrong on the blobs page as it stands, in words a failed
 * test can show, or nothing. It looks for the faults a screen size brings:
 *
 * - the page scrolls sideways, or something sticks out past the screen's
 *   edge where nothing clips it;
 * - a label, a status or a heading meant to be one line wraps onto two;
 * - things laid out side by side run into each other.
 *
 * Only what is shown counts. Scrolling containers, as the posters table's,
 * may hold more than fits, and what an `overflow` box clips is not seen.
 */
export function findLayoutFaults(page: Page) {
  return page.evaluate(() => {
    const faults: string[] = []
    const screenWidth = document.documentElement.clientWidth

    const sideways = document.documentElement.scrollWidth - screenWidth
    if (sideways > 0) faults.push(`the page scrolls sideways by ${sideways}px`)

    // Pass 1: past the screen's edges, after what clips it
    const clipRight = new Map<Element, number>()
    const clipLeft = new Map<Element, number>()
    for (const element of document.body.querySelectorAll('*')) {
      const parent = element.parentElement
      let right = (parent && clipRight.get(parent)) ?? Number.POSITIVE_INFINITY
      let left = (parent && clipLeft.get(parent)) ?? Number.NEGATIVE_INFINITY
      const style = getComputedStyle(element)
      const rect = element.getBoundingClientRect()
      if (style.overflowX !== 'visible') {
        right = Math.min(right, rect.right)
        left = Math.max(left, rect.left)
      }
      clipRight.set(element, right)
      clipLeft.set(element, left)
      if (!isShown(element, rect)) continue
      const shownRight = Math.min(rect.right, right)
      const shownLeft = Math.max(rect.left, left)
      if (shownRight > screenWidth + 1 || shownLeft < -1) {
        faults.push(`${describe(element)} reaches past the screen's edge`)
      }
    }

    // Pass 2: one line where one line is meant
    const liveCard = document.querySelector('dl')?.closest('.primary-card')
    const pulseCaption = document.querySelector('[role=slider] + div')
    const legend = document.querySelector(
      '[role=img][aria-label$=projects] + div',
    )
    const oneLiners = [
      ...(liveCard?.querySelectorAll('dt, dd > span, [role=status]') ?? []),
      document.querySelector('[role=status]')?.nextElementSibling,
      pulseCaption?.firstElementChild,
      pulseCaption?.lastElementChild,
      ...(legend?.children ?? []),
      ...document.querySelectorAll('#live-posters thead th'),
      ...[
        ...document.querySelectorAll('.primary-card span, .primary-card h2'),
      ].filter((e) =>
        /^(L2s Value Secured|Data Posted|Ethereum)$/.test(e.textContent ?? ''),
      ),
      ...document.querySelectorAll('.primary-card ul > li > *'),
    ]
    for (const element of oneLiners) {
      if (!element || !isShown(element)) continue
      if (countLines(element) > 1) faults.push(`${describe(element)} wraps`)
    }

    // Pass 3: side by side without running into each other
    const groups = [
      liveCard?.querySelector('dl')?.children,
      pulseCaption?.children,
      legend?.children,
      ...[...document.querySelectorAll('.primary-card')].map(
        (card) => card.querySelector('ul')?.children,
      ),
      ...[
        ...document.querySelectorAll(
          '.primary-card .items-start.justify-between',
        ),
      ].map((header) => header.children),
    ]
    for (const group of groups) {
      const items = [...(group ?? [])].filter((e) => isShown(e))
      for (const [i, a] of items.entries()) {
        for (const b of items.slice(i + 1)) {
          if (overlap(a, b)) {
            faults.push(`${describe(a)} runs into ${describe(b)}`)
          }
        }
      }
    }

    return [...new Set(faults)]

    function isShown(element: Element, rect = element.getBoundingClientRect()) {
      if (rect.width === 0 || rect.height === 0) return false
      const style = getComputedStyle(element)
      return style.visibility !== 'hidden' && Number(style.opacity) > 0
    }

    /**
     * Lines of text the element is set in, from where its text's boxes sit.
     * Its box's height would not do: a table cell is taller than its line,
     * and a line set tighter than its font leaves boxes of two lines crossing,
     * so a box below the middle of the line above starts a new one. Text taken
     * out of the flow, as a "+5" rising over a label, is not in its lines
     */
    function countLines(element: Element) {
      const boxes: DOMRect[] = []
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
      for (let text = walker.nextNode(); text; text = walker.nextNode()) {
        if (!text.textContent?.trim() || isOutOfFlow(text, element)) continue
        const range = document.createRange()
        range.selectNodeContents(text)
        boxes.push(
          ...[...range.getClientRects()].filter((r) => r.width && r.height),
        )
      }
      boxes.sort((a, b) => a.top - b.top)
      let lines = 0
      let lineMiddle = Number.NEGATIVE_INFINITY
      for (const box of boxes) {
        if (box.top < lineMiddle) continue
        lines++
        lineMiddle = box.top + box.height / 2
      }
      return lines
    }

    function isOutOfFlow(node: Node, within: Element) {
      for (let e = node.parentElement; e && e !== within; e = e.parentElement) {
        const { position } = getComputedStyle(e)
        if (position === 'absolute' || position === 'fixed') return true
      }
      return false
    }

    function overlap(a: Element, b: Element) {
      const ra = a.getBoundingClientRect()
      const rb = b.getBoundingClientRect()
      const across = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left)
      const down = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top)
      return across > 1 && down > 1
    }

    function describe(element: Element) {
      const text = (element.textContent ?? '').trim().slice(0, 40)
      return `<${element.tagName.toLowerCase()}> "${text}"`
    }
  })
}
