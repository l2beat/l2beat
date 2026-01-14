import { useState } from 'react'
import { cn } from '~/utils/cn'
import { TopProtocolsByTransfers } from './TopProtocolsByTransfers'
import { TopProtocolsByVolume } from './TopProtocolsByVolume'

export function CombinedProtocolsWidget() {
  const [view, setView] = useState<'volume' | 'transfers'>('volume')
  return (
    <div className="relative overflow-hidden xl:hidden">
      <div className="relative h-full">
        {/* Animated widgets - both always in DOM */}
        <div
          className={cn(
            'absolute inset-x-0 top-0 h-full w-full transition-transform duration-300 ease-in-out',
            view === 'volume'
              ? 'translate-x-0'
              : '-translate-x-[calc(100%+1rem)]',
            view === 'volume' ? 'z-10' : 'z-0',
          )}
        >
          <TopProtocolsByVolume />
        </div>
        <div
          className={cn(
            'absolute inset-x-0 top-0 h-full w-full transition-transform duration-300 ease-in-out',
            view === 'transfers'
              ? 'translate-x-0'
              : 'translate-x-[calc(100%+1rem)]',
            view === 'transfers' ? 'z-10' : 'z-0',
          )}
        >
          <TopProtocolsByTransfers />
        </div>
      </div>
      <div className={cn('absolute right-[50%] bottom-2 flex', 'z-20')}>
        <div
          className="flex size-4 cursor-pointer items-center justify-center"
          onClick={() => setView('volume')}
        >
          <div
            className={cn(
              'size-2 rounded-xs',
              view === 'volume' ? 'bg-brand' : 'bg-secondary',
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
