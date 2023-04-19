import React from 'react'
import { HorizontalSeparator } from '../HorizontalSeparator'
import { SummaryIcon } from '../icons/projects/SummaryIcon'

interface SectionNavigationProps {
  title: string
  icon: string | undefined
  sections: SectionNavigationItem[]
}

export interface SectionNavigationItem {
  title: string
  id: string
}

export function SectionNavigation(props: SectionNavigationProps) {
  return (
    <div className="sticky top-8" id="section-navigation">
      <div id="section-navigation-header" className="hidden">
        <div className="flex flex-row items-center">
          {props.icon && (
            <img
              className="h-8 w-8"
              src={props.icon}
              alt={`${props.title} logo`}
            />
          )}
          <span className="ml-4 text-2xl font-bold">{props.title}</span>
          <div className="ml-auto" id="section-navigation-scroll-to-top-button">
            TOP
          </div>
        </div>
        <HorizontalSeparator className="my-4" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center gap-3">
          <SummaryIcon />
          Summary
        </div>
        <NavigationList sections={props.sections} />
      </div>
    </div>
  )
}

function NavigationList({ sections }: { sections: SectionNavigationItem[] }) {
  // bg-gradient-to-b from-purple-100 via-pink-100 to-red-200

  return (
    <div id="section-navigation-list" className="flex flex-col gap-3">
      {sections.map((section, i) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className="flex flex-row items-center opacity-60 hover:opacity-100"
        >
          <NavigationListIndex index={i + 1} />
          <span className="ml-3">{section.title}</span>
        </a>
      ))}
    </div>
  )
}

function NavigationListIndex(props: { index: number }) {
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-neutral-700 text-center text-xs font-bold">
      <span>{props.index}</span>
    </div>
  )
}
