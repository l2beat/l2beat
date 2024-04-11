import { isMobile } from './isMobile'

interface Threshold {
  desktop?: number
  mobile?: number
}

interface HighlightCurrentSectionOpts {
  navigationList: Element
  sections: HTMLElement[]
  onHighlight: (item: HTMLAnchorElement) => void
  topItem?: HTMLAnchorElement
  projectNavigationItemQuerySelector?: (sectionId: string) => string
  threshold?: Threshold
}

const DEFAULT_THRESHOLD = 0.15

export function highlightCurrentSection({
  navigationList,
  sections,
  onHighlight,
  topItem,
  projectNavigationItemQuerySelector,
  threshold,
}: HighlightCurrentSectionOpts) {
  const desktopThreshold = threshold?.desktop ?? DEFAULT_THRESHOLD
  const mobileThreshold = threshold?.mobile ?? DEFAULT_THRESHOLD
  const thresholdValue = isMobile() ? mobileThreshold : desktopThreshold

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

    const scrollPos = window.scrollY + viewportHeight * thresholdValue
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
