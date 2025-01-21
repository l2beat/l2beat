'use client'

import { type ReactNode } from 'react'
import { useRecategorisationPreviewContext } from '~/providers/recategorisation-preview-provider'
import { cn } from '~/utils/cn'
import { Switch } from './core/switch'
import { SearchBarButton } from './search-bar/search-bar-button'

interface Props {
  children: ReactNode
  description?: string
  className?: string
}

export function MainPageHeader({ children, description, className }: Props) {
  const { checked, setChecked } = useRecategorisationPreviewContext()
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
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">
            Preview Recategorisation
          </span>
          <Switch
            checked={checked}
            onCheckedChange={(checked) => setChecked(!!checked)}
          />
        </div>
        <SearchBarButton />
      </div>
    </header>
  )
}
