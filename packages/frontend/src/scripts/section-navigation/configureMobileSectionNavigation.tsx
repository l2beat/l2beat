import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { SectionNavigationItem } from '../../components/project/section-navigation/DesktopSectionNavigation'
import { MobileNavigationList } from '../../components/project/section-navigation/MobileSectionNavigation'

export function configureMobileSectionNavigation() {
  const sectionNavigation = document.querySelector('#mobile-section-navigation')
  const sectionNavigationList = sectionNavigation?.querySelector(
    '#mobile-section-navigation-list',
  )

  const sections = document.querySelectorAll('section')

  if (!sectionNavigation || !sectionNavigationList || sections.length === 0) {
    return
  }
  let previouslyHighlightedItem: HTMLAnchorElement | undefined
  renderNavigationList(sections, sectionNavigationList)
  const sectionNavigationListItems = sectionNavigationList.querySelectorAll('a')

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
    handleHighlightOnScroll()
  })

  sectionNavigationListItems.forEach((item) => {
    item.addEventListener('click', () => {
      highlightItem(item)
    })
  })

  function highlightItem(item: HTMLAnchorElement) {
    previouslyHighlightedItem?.classList.remove(
      'border-b-2',
      'text-pink-200',
      'border-b-pink-200',
    )
    item.classList.add('border-b-2', 'text-pink-200', 'border-b-pink-200')
    previouslyHighlightedItem = item
  }
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
    <MobileNavigationList sections={navigationListSections} />,
  )
}
