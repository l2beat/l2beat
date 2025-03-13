'use client'

import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'
import { useRecategorisationPreviewContext } from './recategorisation-preview/recategorisation-preview-provider'
import { RecategorisationPreviewSwitch } from './recategorisation-preview/recategorisation-preview-switch'
import { SearchBarButton } from './search-bar/search-bar-button'

interface Props {
  children: ReactNode
  className?: string
  withDescription?: boolean
}

export function MainPageHeader({
  children,
  className,
  withDescription,
}: Props) {
  const { isScalingMainPage } = useRecategorisationPreviewContext()
  return (
    <header
      className={cn(
        'ml-2 flex items-center justify-between py-5 max-lg:hidden',
        withDescription && 'pb-4',
        className,
      )}
    >
      <div className="flex flex-col justify-center">
        <h1 className="text-[26px] font-bold">{children}</h1>
      </div>
      <div className="flex items-center gap-5">
        {isScalingMainPage && <RecategorisationPreviewSwitch />}
        <SearchBarButton />
      </div>
    </header>
  )
}
