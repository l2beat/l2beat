import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  NavigationList,
  SectionNavigationItem,
} from '../components/project/SectionNavigation'

export function configureSectionNavigation() {
  let previouslyHighlightedItem: HTMLAnchorElement | undefined
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

  renderNavigationList(sections, sectionNavigationList)
  const sectionNavigationListItems = sectionNavigationList.querySelectorAll('a')

  function highlightItem(item: HTMLAnchorElement) {
    previouslyHighlightedItem?.classList.toggle('opacity-60', true)
    item.classList.toggle('opacity-60', false)
    previouslyHighlightedItem = item
  }

  const handleShowingProjectTitle = () => {
    const navigationTopOffset = 32
    const navigationOffset = sectionNavigation.getBoundingClientRect().top

    if (navigationOffset === navigationTopOffset) {
      sectionNavigationHeader?.classList.toggle('hidden', false)
    } else {
      sectionNavigationHeader?.classList.toggle('hidden', true)
    }
  }

  const handleHighlightOnScroll = () => {
    const offsetRatio = 0.1

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

function renderNavigationList(
  sections: NodeListOf<HTMLElement>,
  target: Element,
) {
  const navigationListSections: SectionNavigationItem[] = []

  sections.forEach((section) => {
    const id = section.id
    const title = section.querySelector('h2')?.textContent
    if (!id || !title) return

    navigationListSections.push({ id, title })
  })

  target.innerHTML = renderToStaticMarkup(
    <NavigationList sections={navigationListSections} />,
  )
}
