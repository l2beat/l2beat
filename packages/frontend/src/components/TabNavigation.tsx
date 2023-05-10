import React, { ReactElement, ReactNode } from 'react'
import { renderToString } from 'react-dom/server'

import { HorizontalSeparator } from './HorizontalSeparator'

interface TabsProps {
  tabs: Tab[]
}

interface Tab {
  id: string
  name: string
  content: ReactElement
  icon?: ReactNode
}

export function TabNavigation({ tabs }: TabsProps) {
  return (
    <div className="TabNavigation">
      <div className="relative">
        <div className="TabNavigationTabsContainer flex space-x-8">
          {tabs.map((tab) => (
            <a
              className="TabNavigationTab group relative flex items-center py-3 px-1 text-base font-semibold"
              key={tab.id}
              href={`#${tab.id}`}
              data-content={renderToString(tab.content)}
            >
              {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
              <span>{tab.name}</span>
              <span className="absolute bottom-0 left-0 block h-1 w-full rounded-t-sm bg-gray-850 opacity-0 transition-all duration-300 group-hover:opacity-80" />
            </a>
          ))}
        </div>
        <span className="TabNavigationUnderline absolute bottom-0 block h-1 rounded-t-sm bg-pink-200 transition-all duration-300" />
      </div>
      <HorizontalSeparator className="mb-6" />
      <div className="TabNavigationContent" />
    </div>
  )
}
