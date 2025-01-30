'use client'

import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'
import { useRecategorisationPreviewContext } from './recategorisation-preview/recategorisation-preview-provider'
import { RecategorisationPreviewSwitch } from './recategorisation-preview/recategorisation-preview-switch'
import { SearchBarButton } from './search-bar/search-bar-button'

interface Props {
  children: ReactNode
  description?: string
  className?: string
}

export function MainPageHeader({ children, description, className }: Props) {
  const { isScalingMainPage } = useRecategorisationPreviewContext()
  return (
    <header
      className={cn(
        'ml-6 flex h-20 items-center justify-between max-lg:hidden',
        className,
      )}
    >
      <div className="flex flex-col justify-center">
        <h1
          className={cn(
            'font-bold',
            description ? 'text-2xl leading-none' : 'text-[26px]',
          )}
        >
          {children}
        </h1>
        {description && (
          <p className="mt-0.5 text-xs text-secondary">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-5">
        {isScalingMainPage && <RecategorisationPreviewSwitch />}
        <SearchBarButton />
      </div>
    </header>
  )
}
