'use client'

import { InfoIcon } from '~/icons/info'
import { cn } from '~/utils/cn'
import { useRecategorisationPreviewContext } from './recategorisation-preview/recategorisation-preview-provider'
import { RecategorisationPreviewSwitch } from './recategorisation-preview/recategorisation-preview-switch'
import { SearchBarButton } from './search-bar/search-bar-button'
import { ShowMoreText } from './show-more-text'

interface Props {
  children: React.ReactElement | string
  className?: string
  description?: React.ReactElement | string
  warning?: React.ReactElement | string
}

export function MainPageHeader({
  children,
  className,
  description,
  warning,
}: Props) {
  const { isScalingMainPage } = useRecategorisationPreviewContext()

  return (
    <div>
      <header
        className={cn(
          'ml-2 flex items-center justify-between py-5 max-lg:hidden',
          (!!description || !!warning) && 'pb-4',
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
      {(!!description || !!warning) && (
        <div className="flex flex-col pl-0 md:flex-col-reverse md:gap-2 md:pb-3 lg:pl-2">
          {warning && <Warning>{warning}</Warning>}
          {description && (
            <ShowMoreText
              pageTitle={typeof children === 'string' ? children : ''}
              textClassName="text-xs font-normal text-secondary"
              className={cn('px-4 pt-3 md:p-0', !warning && 'pt-4')}
            >
              {description}
            </ShowMoreText>
          )}
        </div>
      )}
    </div>
  )
}

interface WarningProps {
  children: React.ReactNode
  className?: string
}

function Warning({ children, className }: WarningProps) {
  return (
    <div
      className={cn(
        'flex items-start border-x-0 border-y border-yellow-700   bg-yellow-200 px-4 py-2 align-top text-[13px] font-medium leading-normal text-yellow-900 md:rounded-lg md:border-x md:px-6',
        className,
      )}
    >
      <div className="hidden size-5 items-center justify-center md:flex">
        <InfoIcon className="mr-2 inline size-4 shrink-0" variant="yellow" />
      </div>
      <span>{children}</span>
    </div>
  )
}
