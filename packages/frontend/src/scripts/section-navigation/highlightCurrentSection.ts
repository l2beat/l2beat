interface HighlightCurrentSectionOpts {
  navigationList: Element
  summary: HTMLAnchorElement
  sections: NodeListOf<HTMLElement>
  onHighlight: (item: HTMLAnchorElement) => void
}

let previouslyHighlightedItem: Element | null = null

export function highlightCurrentSection({
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
    const lastSectionNavigationItem =
      navigationList.querySelector<HTMLAnchorElement>(
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
      const sectionNavigationItem =
        navigationList.querySelector<HTMLAnchorElement>(
          `a[href="#${section.id}"]`,
        )

      if (
        !sectionNavigationItem ||
        previouslyHighlightedItem === sectionNavigationItem
      )
        return

      onHighlight(sectionNavigationItem)
      previouslyHighlightedItem = sectionNavigationItem
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
