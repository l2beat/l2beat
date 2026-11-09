/**
 * The page-to-page transitions. Pages are separate documents, so these are
 * cross-document view transitions: CSS opts every navigation in
 * (`@view-transition`, set beside this script in Head.tsx): the sidebar's
 * sections slide to their places on the page opened, e.g. when another
 * group opens, and its highlight slides to the item opened, turning the
 * labels it passes; on phones the tab underline slides along its row. The
 * rest of the page swaps at once.
 *
 * The old page decides whether to run it and leaves that in sessionStorage
 * for the new one, which cannot tell how it was reached. The sidebar's
 * scroll goes along the same way, transition or not.
 *
 * A step that throws skips the transition and undoes what the script set
 * (see `safely`), so a bug here costs the motion, never the page.
 *
 * It runs inline in <head>: `pagereveal` fires before the first frame, too
 * early for the bundle.
 */
export function pageTransitions() {
  const RUN_KEY = 'page-transitions'
  const SCROLL_KEY = 'page-transitions-sidebar-scroll'
  const KEYBOARD_KEY = 'page-transitions-keyboard'
  const TABS_KEY = 'page-transitions-tab-scroll'
  /** The sidebar list's fade at its edges (ScrollWithGradient). */
  const FADE = 56
  /** How far glyphs may reach past a label's box, e.g. descenders. */
  const INK = 6
  const root = document.documentElement
  /** Short: the sidebar moves a short way, often. */
  const DURATION = 250
  // iOS-like: moves at once, settles long, so it holds up after the wait
  // for the page.
  const EASING = 'cubic-bezier(0.32, 0.72, 0, 1)'
  /** The sidebar's labels on the page opened, each with its turned copy. */
  const labels: { label: HTMLElement; ink: HTMLElement }[] = []
  /** Settles when the page's arrival transition, if any, has finished. */
  let arrival: Promise<unknown> = Promise.resolve()
  /** How much each phone tab row scrolled between the pages, by row. */
  const tabShift = new Map<string, { by: number; min: number }>()

  // A page left from the keyboard swaps at once, as keyboard actions do.
  let keyboard = false
  addEventListener('keydown', () => (keyboard = true), true)
  addEventListener('pointerdown', () => (keyboard = false), true)

  addEventListener('pageswap', (e) =>
    safely(e.viewTransition, () => {
      const list = sidebar()
      store(SCROLL_KEY, list ? `${list.scrollTop} ${list.clientHeight}` : '')
      store(KEYBOARD_KEY, keyboard ? '1' : '')
      store(
        TABS_KEY,
        visible('[data-tab-line]')
          .map((line) => `${line.dataset.tabLine}:${tabRow(line)?.scrollLeft}`)
          .join(' '),
      )
      const transition = e.viewTransition
      if (!transition) return
      const runs =
        !!e.activation?.entry.url &&
        !keyboard &&
        !matchMedia('(prefers-reduced-motion: reduce)').matches
      const clear = runs ? name(transition, false) : null
      store(RUN_KEY, clear ? '1' : '')
      if (!clear) {
        skip(transition)
        return
      }
      // Back from the bfcache, `finished` may never settle on this page.
      addEventListener('pageshow', clear, { once: true })
    }),
  )

  addEventListener('pagereveal', (e) =>
    safely(e.viewTransition, () => {
      // Reached from the keyboard, the page's own motion skips too
      // (withPinTransition's visit).
      if (store(KEYBOARD_KEY, ''))
        root.setAttribute('data-keyboard-arrival', '')
      // Before the capture, so the sidebar and tabs are where they will stay.
      restoreSidebarScroll()
      const tabScroll = new Map(
        store(TABS_KEY, '')
          .split(' ')
          .map((entry) => entry.split(':') as [string, string]),
      )
      for (const line of visible('[data-tab-line]')) {
        line.parentElement?.scrollIntoView({
          block: 'nearest',
          inline: 'center',
        })
        // The underline sets out from where its tab now is, scrolled with the
        // row, rather than from where it was on the screen.
        const before = Number(tabScroll.get(line.dataset.tabLine ?? ''))
        const row = tabRow(line)
        if (row && !Number.isNaN(before)) {
          tabShift.set(`tab-line-${line.dataset.tabLine}`, {
            by: before - row.scrollLeft,
            // Set out at most from just past the row's left edge: from
            // further off, it would cross the row in a frame or two.
            min: row.getBoundingClientRect().left,
          })
        }
      }
      const transition = e.viewTransition
      const runs = store(RUN_KEY, '')
      if (!transition) return
      if (!runs || !name(transition, true)) {
        skip(transition)
        return
      }
      // Marks the page while it arrives, for motion of its own to wait on
      // (withPinTransition's visit).
      root.setAttribute('data-page-transition', '')
      arrival = transition.finished.finally(() =>
        root.removeAttribute('data-page-transition'),
      )
      transformOnly(transition)
    }),
  )

  /**
   * Runs `step`. If it throws, skips the transition and undoes what the
   * script has set on the page, then reports the error as uncaught.
   */
  function safely(
    transition: ViewTransition | null | undefined,
    step: () => void,
  ) {
    try {
      step()
    } catch (error) {
      if (transition) skip(transition)
      reset()
      setTimeout(() => {
        throw error
      })
    }
  }

  /**
   * Skips `transition`. Its `ready` then rejects, which nothing else
   * awaits: handled here, it isn't reported as an uncaught error.
   */
  function skip(transition: ViewTransition) {
    transition.ready.catch(() => {})
    transition.skipTransition()
  }

  /** Clears every name, copy, mark and size the script may have set. */
  function reset() {
    root.classList.remove('nav-arriving')
    root.removeAttribute('data-page-transition')
    for (const { ink } of labels.splice(0)) ink.remove()
    for (const el of document.querySelectorAll<HTMLElement>(
      '[data-nav-group], [data-nav-highlight], [data-nav-label], [data-tab-line]',
    )) {
      el.style.viewTransitionName = ''
      el.style.removeProperty('view-transition-class')
    }
    const list = sidebar()
    if (list) list.style.maxHeight = ''
  }

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
   * Scrolls and sizes the sidebar as the page left had it, as one page
   * would, then brings the page's own item into view if that left it out.
   */
  function restoreSidebarScroll() {
    const [scroll, kept] = store(SCROLL_KEY, '').split(' ').map(Number)
    const list = sidebar()
    if (!list) return
    // The What's new card under the list comes in only once the page
    // hydrates, and the list gives it room by getting shorter. Until then
    // the list keeps its height from the page left, so the sections
    // captured in it don't draw over the card's place, and the page's own
    // item is brought into view only once.
    if (kept && kept < list.clientHeight) {
      list.style.maxHeight = `${kept}px`
      const column = list.parentElement
      const neighbours = () =>
        [...(column?.children ?? [])].filter((el) => el !== list)
      // What the list's neighbours take, e.g. the card once it is added or
      // its image has loaded.
      const taken = () =>
        neighbours().reduce((sum, el) => sum + el.clientHeight, 0)
      const before = taken()
      const release = () => {
        added.disconnect()
        resized.disconnect()
        list.style.maxHeight = ''
      }
      // Not before any arrival transition ends: resized mid-way, the list
      // would scroll under the sections being animated.
      const check = () => {
        for (const el of neighbours()) resized.observe(el)
        if (taken() > before) arrival.then(release)
      }
      const added = new MutationObserver(check)
      const resized = new ResizeObserver(check)
      if (column) added.observe(column, { childList: true, subtree: true })
      check()
      setTimeout(() => arrival.then(release), 5000)
    }
    if (scroll) list.scrollTop = scroll
    keepActiveInView(list)
    // A card that comes in anyway, e.g. after a page without it: keep the
    // item clear of it again.
    let height = list.clientHeight
    // After any arrival transition, as a scroll the eye can follow: scrolled
    // mid-way, the list would move under the sections being animated from
    // where they were captured.
    const resized = new ResizeObserver(() => {
      if (list.clientHeight < height) {
        arrival.then(() => keepActiveInView(list, 'smooth'))
      }
      height = list.clientHeight
    })
    resized.observe(list)
    setTimeout(() => resized.disconnect(), 5000)
  }

  /** Brings the page's own item into the list's view, clear of its fades. */
  function keepActiveInView(
    list: HTMLElement,
    behavior: ScrollBehavior = 'instant',
  ) {
    // The highlight, or the page's own link; a group's header is active
    // too, but sits above it.
    const active =
      list.querySelector<HTMLElement>('[data-nav-highlight]') ??
      list.querySelector<HTMLElement>('a[data-active="true"]')
    if (!active) return
    const box = active.getBoundingClientRect()
    const view = list.getBoundingClientRect()
    // Clear of the list's fading edges, so the highlight lands in full colour.
    const by =
      box.top < view.top + FADE
        ? box.top - view.top - FADE
        : Math.max(box.bottom - view.bottom + FADE, 0)
    if (by) list.scrollBy({ top: by, behavior })
  }

  /**
   * Names the elements to move on this page. Returns a function that
   * clears them, or null when this page has none in view.
   */
  function name(transition: ViewTransition, arriving: boolean) {
    const named = new Map<HTMLElement, string>()
    const classes = new Map<HTMLElement, string>()
    // Every section of the sidebar's list, also those it has scrolled out
    // of view, which the other page may show: transformOnly clips each to
    // the list as it moves, or it would be drawn over the sidebar's header
    // and the card under the list.
    const list = sidebar()
    const inList = (el: HTMLElement) => !!list && within(el, list)
    const overlapping = (el: HTMLElement) => !!list && overlaps(el, list)
    const groups = [
      ...(list?.querySelectorAll<HTMLElement>('[data-nav-group]') ?? []),
    ].filter((group) => group.getClientRects().length > 0)
    for (const group of groups) {
      named.set(group, `nav-group-${slug(group.dataset.navGroup ?? '')}`)
      classes.set(group, 'nav-group')
    }
    const highlight = visible('[data-nav-highlight]').filter(overlapping)[0]
    if (highlight) {
      named.set(highlight, 'nav-highlight')
      if (arriving) addInk(named, classes, inList)
    }
    for (const line of visible('[data-tab-line]')) {
      named.set(line, `tab-line-${line.dataset.tabLine}`)
    }
    if (named.size === 0) return null
    for (const [el, value] of named) el.style.viewTransitionName = value
    for (const [el, value] of classes) {
      el.style.setProperty('view-transition-class', value)
    }
    transition.types.add('nav')
    const clear = () => {
      root.classList.remove('nav-arriving')
      // Emptied too: a page back from the bfcache arrives again.
      for (const { ink } of labels.splice(0)) ink.remove()
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
    // Every box read before the first copy goes in, so each append does not
    // force a layout for the next read.
    const measured = visible('[data-nav-label]')
      .filter(inList)
      .flatMap((label) => {
        const key = slug(label.textContent ?? '')
        if (!key || used.has(key)) return []
        used.add(key)
        const box = label.getBoundingClientRect()
        const font = getComputedStyle(label)
        return [
          { label, key, box, font: font.font, spacing: font.letterSpacing },
        ]
      })
    for (const { label, key, box, font, spacing } of measured) {
      // Outside React's root, which has yet to hydrate: a node added in a
      // label would fail the hydration.
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
        font,
        letterSpacing: spacing,
        color: 'var(--color-primary-invert)',
        whiteSpace: 'nowrap',
        overflow: 'clip',
        overflowClipMargin: `${INK}px`,
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
      () =>
        safely(transition, () => {
          const list = sidebar()?.getBoundingClientRect()
          /**
           * Keeps a group moving from `from` to `to` (its tops) inside the
           * list, as two clips: they follow the same eased progress as its
           * transform, so they hold all the way.
           */
          const clipToList = (from: number, to: number, height: number) =>
            list
              ? [from, to].map(
                  (top) =>
                    `inset(${list.top - top}px -${INK * 4}px ${top + height - list.bottom}px -${INK * 4}px)`,
                )
              : ['none', 'none']
          const moves = new Map<string, { x: number; y: number }>()
          let highlight: [DOMRect, DOMRect] | undefined
          /** Sections that shut, from where to where. */
          const shut: [DOMRect, DOMRect][] = []
          for (const anim of document.getAnimations()) {
            const effect = anim.effect as KeyframeEffect | null
            const pseudo = effect?.pseudoElement
            const group = pseudo?.match(
              /^::view-transition-group\((.+)\)$/,
            )?.[1]
            if (!effect || !pseudo || !group) continue
            if (group === 'root') {
              anim.cancel()
              continue
            }
            if (!/^(nav-|tab-line-)/.test(group)) {
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
              drawSection(group, start.height, end.height)
              if (start.height > end.height + 0.5) shut.push([start, end])
            }
            const begin = new DOMMatrix(String(from.transform))
            const shift = tabShift.get(group)
            if (shift) {
              begin.e = Math.max(begin.e + shift.by, shift.min - start.width)
            }
            if (group === 'nav-highlight') highlight = [start, end]
            const stretch = group.startsWith('tab-line-')
            const scale = stretch
              ? ` scale(${start.width / end.width}, ${start.height / end.height})`
              : ''
            const [clipFrom, clipTo] = /^nav-(group-|highlight)/.test(group)
              ? clipToList(start.y, end.y, end.height)
              : ['none', 'none']
            root.animate(
              [
                {
                  transformOrigin: '0 0',
                  transform: `${begin}${scale}`,
                  clipPath: clipFrom,
                },
                {
                  transformOrigin: '0 0',
                  transform: to.transform,
                  clipPath: clipTo,
                },
              ],
              {
                pseudoElement: pseudo,
                duration: DURATION,
                easing: EASING,
                // Held clipped while anything else still moves.
                fill: 'both',
              },
            )
          }
          for (const { label, ink } of labels) {
            const move = sectionMove(label, moves)
            if (!move.x && !move.y) continue
            for (const el of [label, ink]) {
              const pseudo = `::view-transition-group(${el.style.viewTransitionName})`
              const style = getComputedStyle(root, pseudo)
              const to = style.transform
              const start = new DOMMatrix(to)
              start.e += move.x
              start.f += move.y
              const [clipFrom, clipTo] = clipToList(
                start.f,
                new DOMMatrix(to).f,
                px(style.height),
              )
              root.animate(
                [
                  { transform: start.toString(), clipPath: clipFrom },
                  { transform: to, clipPath: clipTo },
                ],
                {
                  pseudoElement: pseudo,
                  duration: DURATION,
                  easing: EASING,
                  fill: 'both',
                },
              )
            }
          }
          if (highlight) clipLabels(highlight[0], highlight[1], moves)
          else shutHighlight(shut)
        }),
      // Skipped, e.g. when the page took too long: nothing to set up.
      () => {},
    )
  }

  /**
   * A section's header swaps at once; its sub-links shut or open like a
   * drawer, in step with the sections below sliding up or down, instead of
   * vanishing and leaving the others to cross an empty gap.
   */
  function drawSection(group: string, before: number, after: number) {
    const timing = {
      duration: DURATION,
      easing: EASING,
      fill: 'both' as const,
    }
    const old = `::view-transition-old(${group})`
    if (before > after + 0.5) {
      // Shutting: the old sub-links, below the new header, close upwards.
      root.animate(
        [
          { clipPath: `inset(${after}px 0 0 0)` },
          { clipPath: `inset(${after}px 0 ${before - after}px 0)` },
        ],
        { ...timing, pseudoElement: old },
      )
      return
    }
    root.animate([{ opacity: 0 }, { opacity: 0 }], {
      ...timing,
      pseudoElement: old,
    })
    if (after > before + 0.5) {
      // Opening: the new sub-links come out below the header.
      root.animate(
        [
          { clipPath: `inset(0 0 ${after - before}px 0)` },
          { clipPath: 'inset(0)' },
        ],
        { ...timing, pseudoElement: `::view-transition-new(${group})` },
      )
    }
  }

  /**
   * With no highlight on the page opened, the page left's goes with its
   * section's sub-links: it moves with the section and is cut by the same
   * closing edge, so its label never shows white on the bare list.
   */
  function shutHighlight(shut: [DOMRect, DOMRect][]) {
    const pseudo = '::view-transition-group(nav-highlight)'
    const style = getComputedStyle(root, pseudo)
    if (style.transform === 'none' || !px(style.width)) return
    const box = rect(style.transform, style.width, style.height)
    const section = shut.find(
      ([from]) => from.top <= box.top && box.bottom <= from.bottom,
    )
    if (!section) return
    const [from, to] = section
    // How far the closing edge has cut into the highlight, by progress: in
    // step with the highlight's own move, it is linear.
    const cutAt = (progress: number) =>
      box.bottom +
      lerp(0, to.y - from.y, progress) -
      lerp(from.bottom, to.bottom, progress)
    const at = (cut: number) => {
      const start = cutAt(0)
      const rate = cutAt(1) - start
      return rate > 0 ? Math.min(Math.max((cut - start) / rate, 0), 1) : 1
    }
    const clip = (cut: number) =>
      `inset(0 0 ${Math.min(Math.max(cut, 0), box.height)}px 0)`
    // Whole until the edge reaches it, then cut in step, and gone at once
    // when what is left can no longer hold its label: a sliver would read
    // as an underline on the header above.
    const reached = at(0)
    const gone = Math.max(at(box.height * 0.6), reached)
    const timing = {
      duration: DURATION,
      easing: EASING,
      fill: 'both' as const,
    }
    root.animate(
      [
        { offset: 0, opacity: 1, clipPath: clip(cutAt(0)) },
        { offset: reached, opacity: 1, clipPath: clip(cutAt(reached)) },
        { offset: gone, opacity: 1, clipPath: clip(cutAt(gone)) },
        { offset: gone, opacity: 0, clipPath: clip(cutAt(gone)) },
        { offset: 1, opacity: 0, clipPath: clip(cutAt(gone)) },
      ],
      { ...timing, pseudoElement: '::view-transition-old(nav-highlight)' },
    )
    const start = new DOMMatrix(style.transform)
    const end = new DOMMatrix(style.transform)
    end.f += to.y - from.y
    root.animate(
      [{ transform: start.toString() }, { transform: end.toString() }],
      {
        ...timing,
        pseudoElement: pseudo,
      },
    )
  }

  /** The scrolling row a phone tab underline sits in. */
  function tabRow(line: HTMLElement) {
    return line.closest<HTMLElement>('[data-role="overflow-wrapper-content"]')
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
        // A few px past the box, so descenders and the like are not cut.
        const top = span(y - boxY, end.height)
        const left = span(x - boxX, end.width)
        const bottom = Math.max(top, span(y + h - boxY, end.height))
        const right = Math.max(left, span(x + w - boxX, end.width))
        if (bottom > top && right > left) touched = true
        covered.push({
          offset,
          clipPath: `inset(${top}px ${end.width - right}px ${end.height - bottom}px ${left}px)`,
        })
        // Everything else, so each pixel shows one capture: two would
        // fringe the turned glyphs with the usual colour.
        uncovered.push({
          offset,
          clipPath: `polygon(evenodd, -${INK}px -${INK}px, calc(100% + ${INK}px) -${INK}px, calc(100% + ${INK}px) calc(100% + ${INK}px), -${INK}px calc(100% + ${INK}px), -${INK}px -${INK}px, ${left}px ${top}px, ${right}px ${top}px, ${right}px ${bottom}px, ${left}px ${bottom}px, ${left}px ${top}px)`,
        })
      }
      if (!touched) continue
      for (const [keyframes, el] of [
        [covered, ink],
        [uncovered, label],
      ] as const) {
        root.animate(keyframes, {
          pseudoElement: `::view-transition-new(${el.style.viewTransitionName})`,
          duration: DURATION,
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

  /** Within the box, give or take the glyphs' overhang. */
  function span(value: number, max: number) {
    return Math.min(Math.max(value, -INK), max + INK)
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

  function inView(el: HTMLElement) {
    const r = el.getBoundingClientRect()
    return (
      r.width > 0 && r.bottom > 0 && r.top < innerHeight && r.left < innerWidth
    )
  }

  /** Wholly inside `box`'s visible area, top to bottom. */
  function overlaps(el: HTMLElement, box: HTMLElement) {
    const r = el.getBoundingClientRect()
    const b = box.getBoundingClientRect()
    return r.bottom > b.top && r.top < b.bottom
  }

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
