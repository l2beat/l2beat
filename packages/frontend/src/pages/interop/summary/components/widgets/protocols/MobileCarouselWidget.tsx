import type { InteropChain } from '@l2beat/config'
import { useState } from 'react'
import { cn } from '~/utils/cn'
import { TopPathsWidget } from '../TopPathsWidget'
import { TopProtocolsByTransfers } from './TopProtocolsByTransfers'
import { TopProtocolsByVolume } from './TopProtocolsByVolume'

type View = 'paths' | 'volume' | 'transfers'

export function MobileCarouselWidget({
  interopChains,
}: {
  interopChains: InteropChain[]
}) {
  const [view, setView] = useState<View>('paths')

  return (
    <div className="relative max-[1024px]:h-[232px] min-[1600px]:hidden min-[1024px]:h-[213px]">
      <div className="relative h-full">
        {/* Paths widget - only visible below 1024px */}
        <div
          className={cn(
            'absolute inset-x-0 top-0 h-full w-full transition-transform duration-300 ease-in-out min-[1024px]:hidden',
            view === 'paths' && 'translate-x-0',
            view === 'volume' && '-translate-x-[calc(100%+1.25rem)]',
            view === 'transfers' && '-translate-x-[calc(200%+2.5rem)]',
          )}
        >
          <TopPathsWidget interopChains={interopChains} />
        </div>
        <div
          className={cn(
            'absolute inset-x-0 top-0 h-full w-full transition-transform duration-300 ease-in-out',
            // On >= 1024px, volume becomes first position since paths is hidden
            // Disable transition to prevent animation during resize
            view === 'paths' &&
              'translate-x-[calc(100%+1.25rem)] min-[1024px]:translate-x-0 min-[1024px]:transition-none',
            view === 'volume' && 'translate-x-0',
            view === 'transfers' && '-translate-x-[calc(100%+1.25rem)]',
          )}
        >
          <TopProtocolsByVolume />
        </div>
        <div
          className={cn(
            'absolute inset-x-0 top-0 h-full w-full transition-transform duration-300 ease-in-out',
            // On >= 1024px, transfers becomes second position since paths is hidden
            // Disable transition to prevent animation during resize
            view === 'paths' &&
              'translate-x-[calc(200%+2.5rem)] min-[1024px]:translate-x-[calc(100%+1.25rem)] min-[1024px]:transition-none',
            view === 'volume' && 'translate-x-[calc(100%+1.25rem)]',
            view === 'transfers' && 'translate-x-0',
          )}
        >
          <TopProtocolsByTransfers />
        </div>
      </div>
      <div className="-translate-x-1/2 absolute bottom-4 left-1/2 z-20 flex">
        {/* Paths dot - only visible below 1024px */}
        <div
          className="flex size-4 cursor-pointer items-center justify-center min-[1024px]:hidden"
          onClick={() => setView('paths')}
        >
          <div
            className={cn(
              'size-2 rounded-xs',
              view === 'paths' ? 'bg-brand' : 'bg-secondary',
            )}
          />
        </div>
        <div
          className="flex size-4 cursor-pointer items-center justify-center"
          onClick={() => setView('volume')}
        >
          <div
            className={cn(
              'size-2 rounded-xs',
              view === 'volume' ? 'bg-brand' : 'bg-secondary',
              // When paths is selected but hidden on large screens, highlight volume
              view === 'paths' && 'min-[1024px]:bg-brand',
            )}
          />
        </div>
        <div
          className="flex size-4 cursor-pointer items-center justify-center"
          onClick={() => setView('transfers')}
        >
          <div
            className={cn(
              'size-2 rounded-xs',
              view === 'transfers' ? 'bg-brand' : 'bg-secondary',
            )}
          />
        </div>
      </div>
    </div>
  )
}
