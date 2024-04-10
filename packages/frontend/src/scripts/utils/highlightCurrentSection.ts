interface HighlightCurrentSectionOpts {
  navigationList: Element
  sections: HTMLElement[]
  onHighlight: (item: HTMLAnchorElement) => void
  topItem?: HTMLAnchorElement
  projectNavigationItemQuerySelector?: (sectionId: string) => string
}

const OFFSET_RATIO = 0.15

export function highlightCurrentSection({
  navigationList,
  sections,
  onHighlight,
  topItem,
  projectNavigationItemQuerySelector,
}: HighlightCurrentSectionOpts) {
  function getItemSelector(sectionId: string) {
    return (
      projectNavigationItemQuerySelector?.(sectionId) ??
      `a[href="#${sectionId}"]`
    )
  }

  if (isScrolledToTop() && topItem) {
    onHighlight(topItem)
    return
  }

  if (isScrolledToBottom()) {
    const lastSection = sections[sections.length - 1]
    const lastProjectNavigationItem =
      navigationList.querySelector<HTMLAnchorElement>(
        getItemSelector(lastSection.id),
      )
    if (!lastProjectNavigationItem) return
    onHighlight(lastProjectNavigationItem)
    return
  }

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionBottom = sectionTop + sectionHeight
    const viewportHeight = window.innerHeight

    const scrollPos = window.scrollY + viewportHeight * OFFSET_RATIO
    const isCurrentSection =
      scrollPos >= sectionTop && scrollPos < sectionBottom

    if (isCurrentSection) {
      const projectNavigationItem =
        navigationList.querySelector<HTMLAnchorElement>(
          getItemSelector(section.id),
        )

      if (!projectNavigationItem) {
        return
      }
      onHighlight(projectNavigationItem)
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
