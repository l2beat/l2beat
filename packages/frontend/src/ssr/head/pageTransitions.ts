/**
 * The page-to-page transitions. Pages are separate documents, so these are
 * cross-document view transitions: CSS opts every navigation in
 * (`@view-transition` in globals.css) and this script skips all but these
 * kinds:
 *
 * - `nav`: the sidebar's sections slide to their places on the page opened,
 *   e.g. when another group opens, and its highlight slides to the item
 *   opened, turning the labels it passes; on phones the tab underline
 *   slides along its row. The rest of the page swaps at once.
 * - `crops`: between home and any other page, the sidebar's small CROPS
 *   banner grows into the home page's card, and shrinks back on the way out.
 *
 * Several can run at once. The old page picks the kinds and leaves them in
 * sessionStorage for the new one, which cannot tell how it was reached. The
 * sidebar's scroll goes along the same way, transition or not.
 *
 * It runs inline in <head>: `pagereveal` fires before the first frame, too
 * early for the bundle.
 */
export function pageTransitions() {
  const KINDS_KEY = 'page-transitions'
  const SCROLL_KEY = 'page-transitions-sidebar-scroll'
  const root = document.documentElement
  const DURATION = 400
  /** For the sidebar, which moves a short way, often. */
  const NAV_DURATION = 250
  // iOS-like: moves at once, settles long, so it holds up after the wait
  // for the page.
  const EASING = 'cubic-bezier(0.32, 0.72, 0, 1)'
  /** The sidebar's labels on the page opened, each with its turned copy. */
  const labels: { label: HTMLElement; ink: HTMLElement }[] = []

  // A page left from the keyboard swaps at once, as keyboard actions do.
  let keyboard = false
  addEventListener('keydown', () => (keyboard = true), true)
  addEventListener('pointerdown', () => (keyboard = false), true)

  addEventListener('pageswap', (e) => {
    store(SCROLL_KEY, String(sidebar()?.scrollTop ?? ''))
    const transition = e.viewTransition
    if (!transition) return
    const to = e.activation?.entry.url
    const kinds: string[] = []
    if (
      to &&
      !keyboard &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      const from = location.href
      kinds.push('nav')
      if (isHome(from) !== isHome(to)) kinds.push('crops')
    }
    const clears = kinds.flatMap((kind) => {
      const clear = name(transition, kind, false)
      return clear ? [{ kind, clear }] : []
    })
    store(KINDS_KEY, clears.map((c) => c.kind).join(' '))
    if (clears.length === 0) {
      transition.skipTransition()
      return
    }
    // Back from the bfcache, `finished` may never settle on this page.
    addEventListener(
      'pageshow',
      () => {
        for (const { clear } of clears) clear()
      },
      { once: true },
    )
  })

  addEventListener('pagereveal', (e) => {
    // Before the capture, so the sidebar and tabs are where they will stay.
    restoreSidebarScroll()
    for (const line of visible('[data-tab-line]')) {
      line.parentElement?.scrollIntoView({ block: 'nearest', inline: 'center' })
    }
    const transition = e.viewTransition
    const kinds = store(KINDS_KEY, '').split(' ').filter(Boolean)
    if (!transition) return
    const named = kinds.filter((kind) => name(transition, kind, true))
    if (named.length === 0) {
      transition.skipTransition()
      return
    }
    // Marks the page while it arrives, for motion of its own to wait on
    // (withPinTransition's visit).
    root.setAttribute('data-page-transition', '')
    transition.finished.finally(() =>
      root.removeAttribute('data-page-transition'),
    )
    transformOnly(transition)
  })

  /** Stores `value` for the next page, returning the one stored before. */
  function store(key: string, value: string) {
    try {
      const previous = sessionStorage.getItem(key) ?? ''
      if (value) sessionStorage.setItem(key, value)
      else sessionStorage.removeItem(key)
      return previous
    } catch {
      return ''
    }
  }

  /** The sidebar's scrolling list, when the sidebar is shown. */
  function sidebar() {
    return visible('[data-sidebar-scroll]')[0]
  }

  /**
   * Scrolls the sidebar as the page left had it, as one page would, then
   * brings the page's own item into view if that left it out.
   */
  function restoreSidebarScroll() {
    const scroll = Number(store(SCROLL_KEY, ''))
    const list = sidebar()
    if (!list) return
    if (scroll) list.scrollTop = scroll
    // The highlight, or the page's own link; a group's header is active
    // too, but sits above it.
    const active =
      list.querySelector<HTMLElement>('[data-nav-highlight]') ??
      list.querySelector<HTMLElement>('a[data-active="true"]')
    if (!active) return
    const box = active.getBoundingClientRect()
    const view = list.getBoundingClientRect()
    if (box.top < view.top) list.scrollTop -= view.top - box.top + 16
    else if (box.bottom > view.bottom) {
      list.scrollTop += box.bottom - view.bottom + 16
    }
  }

  /**
   * Names the elements of `kind` on this page. Returns a function that
   * clears them, or null when this page has none in view.
   */
  function name(transition: ViewTransition, kind: string, arriving: boolean) {
    const named = new Map<HTMLElement, string>()
    const classes = new Map<HTMLElement, string>()
    if (kind === 'nav') {
      // Only what the sidebar's list shows: named, a part would be drawn
      // over the sidebar's header outside it.
      const list = sidebar()
      const inList = (el: HTMLElement) => !!list && within(el, list)
      for (const group of visible('[data-nav-group]').filter(inList)) {
        named.set(group, `nav-group-${slug(group.dataset.navGroup ?? '')}`)
        classes.set(group, 'nav-group')
      }
      const highlight = visible('[data-nav-highlight]').filter(inList)[0]
      if (highlight) {
        named.set(highlight, 'nav-highlight')
        if (arriving) addInk(named, classes, inList)
      }
      for (const line of visible('[data-tab-line]')) {
        named.set(line, `tab-line-${line.dataset.tabLine}`)
      }
    } else if (kind === 'crops') {
      const banner = visible(
        isHome(location.href)
          ? '[data-crops-banner="home"]'
          : '[data-crops-banner="mini"]',
      )[0]
      if (banner) named.set(banner, 'crops-banner')
    }
    if (named.size === 0) return null
    for (const [el, value] of named) el.style.viewTransitionName = value
    for (const [el, value] of classes) {
      el.style.setProperty('view-transition-class', value)
    }
    transition.types.add(kind)
    const clear = () => {
      root.classList.remove('nav-arriving')
      for (const { ink } of labels) ink.remove()
      for (const el of named.keys()) {
        el.style.viewTransitionName = ''
        el.style.removeProperty('view-transition-class')
      }
    }
    transition.finished.finally(clear)
    return clear
  }

  /**
   * On arrival, each sidebar label gets a copy in the highlight's colour
   * laid exactly over it, captured on its own and shown only where the
   * highlight is (see clipLabels). The page is not drawn during the
   * transition, only its captures, so the copies never show as such. They
   * are made here rather than drawn by the page left, which would show them
   * for a frame before it goes.
   */
  function addInk(
    named: Map<HTMLElement, string>,
    classes: Map<HTMLElement, string>,
    inList: (el: HTMLElement) => boolean,
  ) {
    const used = new Set<string>()
    for (const label of visible('[data-nav-label]').filter(inList)) {
      const key = slug(label.textContent ?? '')
      if (!key || used.has(key)) continue
      used.add(key)
      // Outside React's root, which has yet to hydrate: a node added in a
      // label would fail the hydration.
      const box = label.getBoundingClientRect()
      const font = getComputedStyle(label)
      const ink = document.createElement('span')
      ink.textContent = label.textContent
      ink.setAttribute('aria-hidden', 'true')
      Object.assign(ink.style, {
        position: 'fixed',
        left: `${box.x}px`,
        top: `${box.y}px`,
        width: `${box.width}px`,
        height: `${box.height}px`,
        lineHeight: `${box.height}px`,
        font: font.font,
        letterSpacing: font.letterSpacing,
        color: 'var(--color-primary-invert)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        pointerEvents: 'none',
      })
      document.body.append(ink)
      named.set(label, `nav-label-${key}`).set(ink, `nav-ink-${key}`)
      classes.set(label, 'nav-label').set(ink, 'nav-ink')
      labels.push({ label, ink })
    }
    root.classList.add('nav-arriving')
  }

  /**
   * The browser animates each group's width and height, which runs on the
   * main thread, busy with the page it is revealing, so it stutters. These
   * animate the transform alone, on the compositor: the group takes its
   * final size at once and a scale makes up the difference. Blocks of
   * colour stretch to their new shape; sections and the highlight only
   * move. The labels, captured on the page opened alone, move with
   * their section. The root stays put, so its size animation is dropped
   * too.
   */
  function transformOnly(transition: ViewTransition) {
    transition.ready.then(
      () => {
        const moves = new Map<string, { x: number; y: number }>()
        let highlight: [DOMRect, DOMRect] | undefined
        for (const anim of document.getAnimations()) {
          const effect = anim.effect as KeyframeEffect | null
          const pseudo = effect?.pseudoElement
          const group = pseudo?.match(/^::view-transition-group\((.+)\)$/)?.[1]
          if (!effect || !pseudo || !group) continue
          if (group === 'root') {
            anim.cancel()
            continue
          }
          if (!/^(nav-|crops-|tab-line-)/.test(group)) {
            continue
          }
          const from = effect.getKeyframes()[0]
          anim.cancel()
          if (!from?.transform) continue
          const to = getComputedStyle(root, pseudo)
          // The keyframes leave out a size that does not change.
          const start = rect(
            String(from.transform),
            from.width ?? to.width,
            from.height ?? to.height,
          )
          const end = rect(to.transform, to.width, to.height)
          if (group.startsWith('nav-group-')) {
            moves.set(group, { x: start.x - end.x, y: start.y - end.y })
          }
          if (group === 'nav-highlight') highlight = [start, end]
          const stretch = /^(crops-banner|tab-line-.+)$/.test(group)
          const scale = stretch
            ? ` scale(${start.width / end.width}, ${start.height / end.height})`
            : ''
          root.animate(
            [
              {
                transformOrigin: '0 0',
                transform: `${from.transform}${scale}`,
              },
              { transformOrigin: '0 0', transform: to.transform },
            ],
            {
              pseudoElement: pseudo,
              duration: duration(group),
              easing: EASING,
            },
          )
        }
        for (const { label, ink } of labels) {
          const move = sectionMove(label, moves)
          if (!move.x && !move.y) continue
          for (const el of [label, ink]) {
            const pseudo = `::view-transition-group(${el.style.viewTransitionName})`
            const to = getComputedStyle(root, pseudo).transform
            const start = new DOMMatrix(to)
            start.e += move.x
            start.f += move.y
            root.animate([{ transform: start.toString() }, { transform: to }], {
              pseudoElement: pseudo,
              duration: NAV_DURATION,
              easing: EASING,
            })
          }
        }
        if (highlight) clipLabels(highlight[0], highlight[1], moves)
        // Skipped, e.g. when the page took too long: nothing to set up.
      },
      () => {},
    )
  }

  function duration(group: string) {
    return /^(nav-|tab-)/.test(group) ? NAV_DURATION : DURATION
  }

  /** How far the label's section moves into place. */
  function sectionMove(
    label: HTMLElement,
    moves: Map<string, { x: number; y: number }>,
  ) {
    const section = label.closest<HTMLElement>('[data-nav-group]')
    return moves.get(section?.style.viewTransitionName ?? '') ?? { x: 0, y: 0 }
  }

  /**
   * Shows each label's copy in the highlight's colour only where the moving
   * highlight covers it, so a label it passes turns part by part and the
   * one it lands on ends fully turned, as the page opened draws it; the
   * usual copy shows everywhere else. The clips follow the highlight's path,
   * and the label's own, in steps, eased as both are.
   */
  function clipLabels(
    from: DOMRect,
    to: DOMRect,
    moves: Map<string, { x: number; y: number }>,
  ) {
    const STEPS = 24
    for (const { label, ink } of labels) {
      const end = label.getBoundingClientRect()
      const move = sectionMove(label, moves)
      const covered: Keyframe[] = []
      const uncovered: Keyframe[] = []
      let touched = false
      for (let i = 0; i <= STEPS; i++) {
        const offset = i / STEPS
        const x = lerp(from.x, to.x, offset)
        const y = lerp(from.y, to.y, offset)
        const w = lerp(from.width, to.width, offset)
        const h = lerp(from.height, to.height, offset)
        const boxX = end.x + move.x * (1 - offset)
        const boxY = end.y + move.y * (1 - offset)
        // The part of the label under the highlight, in the label's box.
        const top = clamp(y - boxY, end.height)
        const left = clamp(x - boxX, end.width)
        const bottom = Math.max(top, clamp(y + h - boxY, end.height))
        const right = Math.max(left, clamp(x + w - boxX, end.width))
        if (bottom > top && right > left) touched = true
        covered.push({
          offset,
          clipPath: `inset(${top}px ${end.width - right}px ${end.height - bottom}px ${left}px)`,
        })
        // Everything else, so each pixel shows one capture: two would
        // fringe the turned glyphs with the usual colour.
        uncovered.push({
          offset,
          clipPath: `polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${left}px ${top}px, ${right}px ${top}px, ${right}px ${bottom}px, ${left}px ${bottom}px, ${left}px ${top}px)`,
        })
      }
      if (!touched) continue
      for (const [keyframes, el] of [
        [covered, ink],
        [uncovered, label],
      ] as const) {
        root.animate(keyframes, {
          pseudoElement: `::view-transition-new(${el.style.viewTransitionName})`,
          duration: NAV_DURATION,
          easing: EASING,
          fill: 'both',
        })
      }
    }
  }

  function rect(transform: string, width: unknown, height: unknown) {
    const m = new DOMMatrix(transform)
    return new DOMRect(m.e, m.f, px(width), px(height))
  }

  function lerp(from: number, to: number, t: number) {
    return from + (to - from) * t
  }

  function clamp(value: number, max: number) {
    return Math.min(Math.max(value, 0), max)
  }

  /**
   * A name part from text. Lowercase, as Chromium lowercases the name in a
   * pseudo-element selector passed to `animate()`, and names are
   * case-sensitive: `Home` would never match.
   */
  function slug(text: string) {
    return text
      .trim()
      .toLowerCase()
      .replace(/[^\w-]/g, '-')
  }

  function px(value: unknown) {
    return Number.parseFloat(String(value))
  }

  function path(url: string) {
    return new URL(url).pathname
  }

  function isHome(url: string | null | undefined) {
    return !!url && path(url) === '/'
  }

  function inView(el: HTMLElement) {
    const r = el.getBoundingClientRect()
    return (
      r.width > 0 && r.bottom > 0 && r.top < innerHeight && r.left < innerWidth
    )
  }

  /** Wholly inside `box`'s visible area, top to bottom. */
  function within(el: HTMLElement, box: HTMLElement) {
    const r = el.getBoundingClientRect()
    const b = box.getBoundingClientRect()
    return r.top >= b.top && r.bottom <= b.bottom
  }

  /** The mobile sheet has its own copies, hidden while it is closed. */
  function visible(selector: string) {
    return [...document.querySelectorAll<HTMLElement>(selector)].filter(inView)
  }
}
