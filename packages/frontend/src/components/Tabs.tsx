import React, { ReactNode } from 'react'

import { cn } from '../utils/cn'
import { HorizontalSeparator } from './HorizontalSeparator'
import { OverflowWrapper } from './OverflowWrapper'

interface TabsProps {
  items: Tab[]
}

interface Tab {
  id: string
  name: string
  content: ReactNode
  icon?: ReactNode
  itemsCount?: number
  shortName?: string
}

export function Tabs({ items }: TabsProps) {
  return (
    <div data-role="tabs">
      <OverflowWrapper
        childrenClassName="relative flex gap-x-2 md:gap-x-8"
        data-tabs-role="tabs-items-container"
      >
        {items.map((tab) => (
          <a
            className="group relative flex items-center justify-center gap-1.5 px-4 py-3 font-semibold outline-none transition-colors"
            data-role="tabs-item"
            key={tab.id}
            id={tab.id}
            href={`#${tab.id}`}
          >
            {tab.icon && <span className="hidden md:inline">{tab.icon}</span>}
            <span className="hidden whitespace-nowrap text-base md:inline">
              {tab.name}
            </span>
            <span className="inline whitespace-nowrap text-xs md:hidden">
              {tab.shortName ?? tab.name}
            </span>
            {tab.itemsCount && (
              <span
                data-role="tabs-item-count-badge"
                className="flex items-center justify-center rounded-full bg-purple-100 px-1.5 py-0.5 text-2xs tabular-nums leading-none text-white md:text-xs"
              >
                {tab.itemsCount}
              </span>
            )}
            <span className="absolute bottom-0 left-0 block h-1 w-full rounded-t-sm bg-gray-700 opacity-0 transition-all duration-300 group-hover:opacity-80" />
          </a>
        ))}
        <span
          data-role="tabs-underline"
          className="absolute bottom-0 block h-1 rounded-t-sm bg-pink-900 transition-all duration-300 dark:bg-pink-200"
        />
      </OverflowWrapper>
      <HorizontalSeparator className="mb-3 md:mb-6" />
      {items.map((tab, i) => (
        <div
          className={cn(i !== 0 && 'hidden')}
          data-role="tabs-content"
          id={tab.id}
          key={tab.id}
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}
