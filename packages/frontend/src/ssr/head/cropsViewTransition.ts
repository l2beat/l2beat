/**
 * Between home and any other page, the CROPS banner morphs: the sidebar's
 * small one grows into the home page's card, and shrinks back on the way
 * out. The sidebar's links slide by the banner's height, which home leaves
 * out. Pages are separate documents, so this is a cross-document view
 * transition: CSS opts every navigation in (`@view-transition` in
 * globals.css) and this script skips all but these.
 *
 * It runs inline in <head>: `pagereveal` fires before the first frame, too
 * early for the bundle.
 */
export function cropsViewTransition() {
  const TYPE = 'crops'
  const BANNER = 'crops-banner'
  const NAV = 'crops-nav-'
  const DURATION = 400
  // iOS-like: moves at once, settles long, so it holds up after the wait
  // for the page.
  const EASING = 'cubic-bezier(0.32, 0.72, 0, 1)'

  addEventListener('pageswap', (e) => {
    const transition = e.viewTransition
    if (!transition) return
    const el = banner()
    if (
      !el ||
      isHome(location.href) === isHome(e.activation?.entry.url) ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      transition.skipTransition()
      return
    }
    // Back from the bfcache, `finished` may never settle on this page.
    addEventListener('pageshow', name(transition, el), { once: true })
  })

  addEventListener('pagereveal', (e) => {
    const transition = e.viewTransition
    if (!transition) return
    const el = banner()
    const from = navigation.activation?.from?.url
    if (!el || !from || isHome(location.href) === isHome(from)) {
      transition.skipTransition()
      return
    }
    name(transition, el)
    transformOnly(transition)
  })

  const isHome = (url: string | null | undefined) =>
    !!url && new URL(url).pathname === '/'

  function inView(el: HTMLElement) {
    const r = el.getBoundingClientRect()
    return (
      r.width > 0 && r.bottom > 0 && r.top < innerHeight && r.left < innerWidth
    )
  }

  /** The mobile sheet has its own copies, hidden while it is closed. */
  function visible(selector: string) {
    return [...document.querySelectorAll<HTMLElement>(selector)].filter(inView)
  }

  /** The banner on this page, if it is in view. */
  function banner() {
    return visible(
      isHome(location.href)
        ? '[data-crops-banner="home"]'
        : '[data-crops-banner="mini"]',
    )[0]
  }

  function name(transition: ViewTransition, bannerEl: HTMLElement) {
    const named: HTMLElement[] = [bannerEl]
    bannerEl.style.viewTransitionName = BANNER
    // Only beside the page; in the mobile sheet the next page has it closed.
    if (matchMedia('(min-width: 1024px)').matches) {
      // Keyed by title: the pinned and recent lists come and go.
      for (const el of visible('[data-crops-nav]')) {
        el.style.viewTransitionName =
          // Lowercase: Chromium lowercases the name in a pseudo-element
          // selector passed to `animate()`, and names are case-sensitive,
          // so `crops-nav-Home` would never move.
          NAV +
          (el.dataset.cropsNav ?? '').toLowerCase().replace(/[^\w-]/g, '-')
        el.style.setProperty('view-transition-class', 'crops-nav')
        named.push(el)
      }
    }
    transition.types.add(TYPE)
    const clear = () => {
      for (const el of named) {
        el.style.viewTransitionName = ''
        el.style.removeProperty('view-transition-class')
      }
    }
    transition.finished.finally(clear)
    return clear
  }

  /**
   * The browser animates each group's width and height, which runs on the
   * main thread, busy with the page it is revealing, so it stutters. These
   * animate the transform alone, on the compositor: the group takes its
   * final size at once and a scale makes up the difference. The links only
   * move. The root stays put, so its size animation is dropped too.
   */
  function transformOnly(transition: ViewTransition) {
    transition.ready.then(() => {
      const root = document.documentElement
      for (const anim of document.getAnimations()) {
        const effect = anim.effect as KeyframeEffect | null
        const pseudo = effect?.pseudoElement
        const group = pseudo?.match(/^::view-transition-group\((.+)\)$/)?.[1]
        if (!effect || !pseudo || !group) continue
        if (group === 'root') {
          anim.cancel()
          continue
        }
        if (!group.startsWith('crops-')) continue
        const from = effect.getKeyframes()[0]
        anim.cancel()
        if (!from?.transform) continue
        const to = getComputedStyle(root, pseudo)
        const scale =
          group === BANNER
            ? ` scale(${Number.parseFloat(String(from.width)) / Number.parseFloat(to.width)}, ${Number.parseFloat(String(from.height)) / Number.parseFloat(to.height)})`
            : ''
        root.animate(
          [
            { transformOrigin: '0 0', transform: `${from.transform}${scale}` },
            { transformOrigin: '0 0', transform: to.transform },
          ],
          { pseudoElement: pseudo, duration: DURATION, easing: EASING },
        )
      }
    })
  }
}
