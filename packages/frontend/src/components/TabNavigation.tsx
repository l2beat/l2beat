import React, { ReactElement } from 'react'
import { renderToString } from 'react-dom/server'
import { HorizontalSeparator } from './HorizontalSeparator'

interface TabsProps {
  tabs: Tab[]
}

interface Tab {
  name: string
  content: ReactElement
}

export function TabNavigation({ tabs }: TabsProps) {
  return (
    <div className="TabNavigation">
      <div className="relative">
        <div className="TabNavigationTabsContainer space-x-8">
          {tabs.map((tab) => (
            <div
              className="TabNavigationTab group relative inline-block cursor-pointer py-3 px-1 text-base font-semibold"
              key={tab.name}
              data-content={renderToString(tab.content)}
            >
              {tab.name}
              <span className="absolute bottom-0 left-0 block h-1 w-full rounded-t-sm bg-gray-850 opacity-0 transition-all duration-300 group-hover:opacity-80" />
            </div>
          ))}
        </div>
        <span className="TabNavigationUnderline absolute bottom-0 block h-1 rounded-t-sm bg-pink-200 transition-all duration-300" />
      </div>
      <HorizontalSeparator className="mb-6" />
      <div className="TabNavigationContent"></div>
    </div>
  )
}
