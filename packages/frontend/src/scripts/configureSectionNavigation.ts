export function configureSectionNavigation() {
  const sectionNavigation = document.querySelector('#section-navigation')
  const sectionNavigationList = sectionNavigation?.querySelector(
    '#section-navigation-list',
  )
  const sectionNavigationHeader = sectionNavigation?.querySelector(
    '#section-navigation-header',
  )
  const sectionNavigationScrollToTopButton =
    sectionNavigationHeader?.querySelector(
      '#section-navigation-scroll-to-top-button',
    )
  const sections = document.querySelectorAll('section')

  if (
    !sectionNavigation ||
    !sectionNavigationList ||
    !sectionNavigationHeader ||
    !sectionNavigationScrollToTopButton
  )
    return

  // const sections: SectionNavigationItem[] = []

  // document.querySelectorAll<HTMLElement>('section').forEach((section) => {
  //   sections.push({
  //     id: section.querySelector('h2')?.id || '',
  //     title: section.querySelector('h2')?.textContent || '',
  //   })
  // })

  // const listItems = sections
  //   .map((section) => `<a href="#${section.id}">${section.title}</a>`)
  //   .join('')
  // sectionNavigationList.innerHTML = listItems

  const sectionNavigationListItems = sectionNavigationList.querySelectorAll('a')

  let previouslyHighlightedItem: HTMLAnchorElement | null = null

  const highlightItem = (item: HTMLAnchorElement) => {
    previouslyHighlightedItem?.classList.toggle('opacity-60', true)
    item.classList.toggle('opacity-60', false)
    previouslyHighlightedItem = item
  }

  const selectedSectionHref = window.location.hash
  if (selectedSectionHref) {
    sectionNavigationListItems.forEach((item) => {
      if (item.getAttribute('href') === selectedSectionHref) {
        highlightItem(item)
      }
    })
  }

  const handleShowingProjectTitle = () => {
    const navigationMargin = 32
    const navigationOffset = sectionNavigation.getBoundingClientRect().top

    if (navigationOffset === navigationMargin) {
      sectionNavigationHeader?.classList.toggle('hidden', false)
    } else {
      sectionNavigationHeader?.classList.toggle('hidden', true)
    }
  }

  const offsetRatio = 0.1
  const handleHighlightOnScroll = () => {
    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      const sectionBottom = sectionTop + sectionHeight
      const viewportHeight = window.innerHeight

      const scrollPos = window.pageYOffset + viewportHeight * offsetRatio
      const sectionId = section.id

      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        sectionNavigationListItems.forEach((item) => {
          if (item.getAttribute('href') === `#${sectionId}`) {
            highlightItem(item)
          }
        })
      }
    })
  }

  window.addEventListener('scroll', () => {
    handleShowingProjectTitle()
    handleHighlightOnScroll()
  })
  sectionNavigationListItems.forEach((item) => {
    item.addEventListener('click', () => highlightItem(item))
  })

  sectionNavigationScrollToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}
