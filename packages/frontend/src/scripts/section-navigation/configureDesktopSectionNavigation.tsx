import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  DesktopNavigationList,
  SectionNavigationItem,
} from '../../components/project/section-navigation/DesktopSectionNavigation'

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
  const sections = document.querySelectorAll('section')

  if (!sectionNavigation || !sectionNavigationList || !sectionNavigationHeader)
    return

  let previouslyHighlightedItem: HTMLAnchorElement | undefined
  const sectionNavigationScrollToTopButton =
    sectionNavigationHeader?.querySelector(
      '#desktop-section-navigation-scroll-to-top-button',
    )

  renderNavigationList(sections, sectionNavigationList)
  const sectionNavigationListItems = sectionNavigationList.querySelectorAll('a')

  function highlightItem(item: HTMLAnchorElement | undefined) {
    previouslyHighlightedItem?.classList.toggle('opacity-60', true)
    item?.classList.toggle('opacity-60', false)
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
    const offsetRatio = 0.2

    if (isScrolledToTop()) {
      highlightItem(undefined)
    }

    if (isScrolledToBottom()) {
      const lastSection = sectionNavigationListItems.length - 1
      highlightItem(sectionNavigationListItems[lastSection])
      return
    }

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

  sectionNavigationScrollToTopButton?.addEventListener('click', () => {
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
    <DesktopNavigationList sections={navigationListSections} />,
  )
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
