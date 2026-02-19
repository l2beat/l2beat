import { useState } from 'react'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { cn } from '~/utils/cn'
import { TopProtocolsByTransfers } from './TopProtocolsByTransfers'
import { TopProtocolsByVolume } from './TopProtocolsByVolume'

type View = 'volume' | 'transfers'

export function MobileCarouselWidget({
  topProtocols,
  isLoading,
}: {
  interopChains: InteropChainWithIcon[]
  flows: InteropDashboardData['flows'] | undefined
  topProtocols: InteropDashboardData['topProtocols'] | undefined
  isLoading: boolean
}) {
  const [view, setView] = useState<View>('volume')

  return (
    <div className="relative max-md:min-h-[213px] max-md:border-divider max-md:border-b min-[1600px]:hidden">
      <div
        className={cn(
          'flex h-full gap-5 transition-transform duration-300 ease-in-out',
          view === 'volume' && 'translate-x-0',
          view === 'transfers' && '-translate-x-[calc(100%+1.25rem)]',
        )}
      >
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
        <DotElement
          onClick={() => setView('volume')}
          dotClassName={view === 'volume' ? 'bg-brand' : 'bg-secondary'}
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
