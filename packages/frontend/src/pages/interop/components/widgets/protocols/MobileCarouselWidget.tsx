import { useState } from 'react'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { cn } from '~/utils/cn'
import { TopPathsWidget } from '../TopPathsWidget'
import { TopProtocolsByTransfers } from './TopProtocolsByTransfers'
import { TopProtocolsByVolume } from './TopProtocolsByVolume'

type View = 'paths' | 'volume' | 'transfers'

export function MobileCarouselWidget({
  interopChains,
  data,
  isLoading,
}: {
  interopChains: InteropChainWithIcon[]
  data: InteropDashboardData | undefined
  isLoading: boolean
}) {
  const [view, setView] = useState<View>('paths')

  return (
    <div className="relative max-md:mx-4 max-md:mb-4 max-md:h-[220px] md:max-[1024px]:h-[232px] min-[1600px]:hidden min-[1024px]:h-[213px]">
      <div className="relative h-full">
        {/* Paths widget - only visible below 1024px */}
        <WidgetWrapper
          className={cn(
            'min-[1024px]:hidden',
            view === 'paths' && 'translate-x-0',
            view === 'volume' && '-translate-x-[calc(100%+1.25rem)]',
            view === 'transfers' && '-translate-x-[calc(200%+2.5rem)]',
          )}
        >
          <TopPathsWidget
            interopChains={interopChains}
            data={data}
            isLoading={isLoading}
          />
        </WidgetWrapper>
        <WidgetWrapper
          className={cn(
            // On >= 1024px, volume becomes first position since paths is hidden
            // Disable transition to prevent animation during resize
            view === 'paths' &&
              'translate-x-[calc(100%+1.25rem)] min-[1024px]:translate-x-0 min-[1024px]:transition-none',
            view === 'volume' && 'translate-x-0',
            view === 'transfers' && '-translate-x-[calc(100%+1.25rem)]',
          )}
        >
          <TopProtocolsByVolume data={data} isLoading={isLoading} />
        </WidgetWrapper>
        <WidgetWrapper
          className={cn(
            // On >= 1024px, transfers becomes second position since paths is hidden
            // Disable transition to prevent animation during resize
            view === 'paths' &&
              'translate-x-[calc(200%+2.5rem)] min-[1024px]:translate-x-[calc(100%+1.25rem)] min-[1024px]:transition-none',
            view === 'volume' && 'translate-x-[calc(100%+1.25rem)]',
            view === 'transfers' && 'translate-x-0',
          )}
        >
          <TopProtocolsByTransfers data={data} isLoading={isLoading} />
        </WidgetWrapper>
      </div>
      <div className="-translate-x-1/2 absolute bottom-3 left-1/2 z-20 flex">
        {/* Paths dot - only visible below 1024px */}
        <DotElement
          onClick={() => setView('paths')}
          wrapperClassName="min-[1024px]:hidden"
          dotClassName={view === 'paths' ? 'bg-brand' : 'bg-secondary'}
        />
        <DotElement
          onClick={() => setView('volume')}
          dotClassName={cn(
            view === 'volume' ? 'bg-brand' : 'bg-secondary',
            // When paths is selected but hidden on large screens, highlight volume
            view === 'paths' && 'min-[1024px]:bg-brand',
          )}
        />
        <DotElement
          onClick={() => setView('transfers')}
          dotClassName={view === 'transfers' ? 'bg-brand' : 'bg-secondary'}
        />
      </div>
    </div>
  )
}

function WidgetWrapper({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'absolute inset-x-0 top-0 h-full w-full transition-transform duration-300 ease-in-out',
        className,
      )}
    >
      {children}
    </div>
  )
}

function DotElement({
  onClick,
  wrapperClassName,
  dotClassName,
}: {
  onClick: () => void
  wrapperClassName?: string
  dotClassName?: string
}) {
  return (
    <div
      className={cn(
        'flex size-4 cursor-pointer items-center justify-center',
        wrapperClassName,
      )}
      onClick={onClick}
    >
      <div className={cn('size-2 rounded-xs', dotClassName)} />
    </div>
  )
}
