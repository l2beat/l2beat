import React from 'react'
import { SectionNavigationItem } from './DesktopSectionNavigation'

export function MobileSectionNavigation() {
  return (
    <div
      id="mobile-section-navigation"
      className="scroll overflow-x-auto bg-[#000000]"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        scrollbarColor: 'transparent transparent',
      }}
    >
      <div id="mobile-section-navigation-list"></div>
    </div>
  )
}

export function MobileNavigationList({
  sections,
}: {
  sections: SectionNavigationItem[]
}) {
  return (
    <div className="flex flex-row items-center gap-3">
      {sections.map((section) => {
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="whitespace-nowrap p-4 text-xs"
          >
            {section.title}
          </a>
        )
      })}
    </div>
  )
}
