export function configureDesktopSectionNavigation() {
  const sectionNavigation = document.querySelector(
    '#desktop-section-navigation',
  )
  const sectionNavigationList = sectionNavigation?.querySelector(
    '#desktop-section-navigation-list',
  )
  const sectionNavigationHeader = sectionNavigation?.querySelector(
    '#desktop-section-navigation-header',
  )
  const sectionNavigationSummary = sectionNavigation?.querySelector(
    '#desktop-section-navigation-summary',
  )
  const sections = document.querySelectorAll('section')

  if (
    !sectionNavigation ||
    !sectionNavigationList ||
    !sectionNavigationHeader ||
    !sectionNavigationSummary
  )
    return

  let previouslyHighlightedItem: HTMLAnchorElement | Element | undefined

  const highlightItem = (item: HTMLAnchorElement | Element) => {
    previouslyHighlightedItem?.classList.toggle('opacity-60', true)
    item.classList.toggle('opacity-60', false)
    previouslyHighlightedItem = item
  }

  highlightCurrentSection({
    navigationList: sectionNavigationList,
    summary: sectionNavigationSummary,
    sections,
    onHighlight: highlightItem,
  })

  const handleShowingProjectTitle = () => {
    const navigationTopOffset = 32
    const navigationOffset = sectionNavigation.getBoundingClientRect().top

    if (navigationOffset === navigationTopOffset) {
      sectionNavigationHeader?.classList.toggle('hidden', false)
    } else {
      sectionNavigationHeader?.classList.toggle('hidden', true)
    }
  }

  window.addEventListener('scroll', () => {
    handleShowingProjectTitle()
    highlightCurrentSection({
      navigationList: sectionNavigationList,
      summary: sectionNavigationSummary,
      sections,
      onHighlight: highlightItem,
    })
  })

  sectionNavigationSummary.addEventListener('click', () => {
    window.scrollTo({ top: 0 })
  })
}

interface HighlightCurrentSectionOpts {
  navigationList: Element
  summary: Element
  sections: NodeListOf<HTMLElement>
  onHighlight: (item: HTMLAnchorElement | Element) => void
}

function highlightCurrentSection({
  navigationList,
  summary,
  sections,
  onHighlight,
}: HighlightCurrentSectionOpts) {
  const offsetRatio = 0.15

  if (isScrolledToTop()) {
    onHighlight(summary)
    return
  }

  if (isScrolledToBottom()) {
    const lastSection = sections[sections.length - 1]
    const lastSectionNavigationItem = navigationList.querySelector(
      `a[href="#${lastSection.id}"]`,
    )
    if (!lastSectionNavigationItem) return
    onHighlight(lastSectionNavigationItem)
    return
  }

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionBottom = sectionTop + sectionHeight
    const viewportHeight = window.innerHeight

    const scrollPos = window.pageYOffset + viewportHeight * offsetRatio
    const isCurrentSection =
      scrollPos >= sectionTop && scrollPos < sectionBottom

    if (isCurrentSection) {
      const sectionNavigationItem = navigationList.querySelector(
        `a[href="#${section.id}"]`,
      )
      if (!sectionNavigationItem) return
      onHighlight(sectionNavigationItem)
    }
  })
}

function isScrolledToBottom() {
  const scrollHeight = document.documentElement.scrollHeight
  const scrollTop = document.documentElement.scrollTop
  const clientHeight = document.documentElement.clientHeight
  const scrolledToBottom = scrollTop + clientHeight >= scrollHeight
  return scrolledToBottom
}

function isScrolledToTop() {
  const scrollTop = document.documentElement.scrollTop
  return scrollTop === 0
}
