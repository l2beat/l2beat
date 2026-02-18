import { useState } from 'react'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { cn } from '~/utils/cn'
import { FlowsWidget } from '../FlowsWidget'
import { TopProtocolsByTransfers } from './TopProtocolsByTransfers'
import { TopProtocolsByVolume } from './TopProtocolsByVolume'

type View = 'paths' | 'volume' | 'transfers'

export function MobileCarouselWidget({
  interopChains,
  flows,
  topProtocols,
  isLoading,
}: {
  interopChains: InteropChainWithIcon[]
  flows: InteropDashboardData['flows'] | undefined
  topProtocols: InteropDashboardData['topProtocols'] | undefined
  isLoading: boolean
}) {
  const [view, setView] = useState<View>('paths')

  return (
    <div className="relative max-md:mx-4 max-md:mb-4 max-md:min-h-[213px] min-[1600px]:hidden">
      <div
        className={cn(
          'flex h-full gap-5 transition-transform duration-300 ease-in-out',
          view === 'paths' && 'translate-x-0',
          view === 'volume' &&
            '-translate-x-[calc(100%+1.25rem)] min-md:-translate-x-0',
          view === 'transfers' &&
            '-translate-x-[calc(200%+2.5rem)] min-md:-translate-x-[calc(100%+1.25rem)]',
        )}
      >
        {/* Paths widget - only visible below md */}
        <div className="min-w-full flex-shrink-0 min-md:hidden">
          <FlowsWidget
            interopChains={interopChains}
            flows={flows}
            isLoading={isLoading}
            className="max-md:pb-8!"
          />
        </div>
        <div className="min-w-full flex-shrink-0">
          <TopProtocolsByVolume
            topProtocols={topProtocols}
            isLoading={isLoading}
          />
        </div>
        <div className="min-w-full flex-shrink-0">
          <TopProtocolsByTransfers
            topProtocols={topProtocols}
            isLoading={isLoading}
          />
        </div>
      </div>
      <div className="-translate-x-1/2 absolute bottom-3 left-1/2 z-20 flex">
        {/* Paths dot - only visible below md */}
        <DotElement
          onClick={() => setView('paths')}
          wrapperClassName="min-md:hidden"
          dotClassName={view === 'paths' ? 'bg-brand' : 'bg-secondary'}
        />
        <DotElement
          onClick={() => setView('volume')}
          dotClassName={cn(
            view === 'volume' ? 'bg-brand' : 'bg-secondary',
            // When paths is selected but hidden on large screens, highlight volume
            view === 'paths' && 'min-md:bg-brand',
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
