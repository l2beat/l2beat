import { useState } from 'react'
import { cn } from '~/utils/cn'
import { TopProtocolsByTransfers } from './TopProtocolsByTransfers'
import { TopProtocolsByVolume } from './TopProtocolsByVolume'

export function CombinedProtocolsWidget() {
  const [view, setView] = useState<'volume' | 'transfers'>('volume')
  return (
    <div className="relative xl:hidden">
      {view === 'volume' ? (
        <TopProtocolsByVolume />
      ) : (
        <TopProtocolsByTransfers />
      )}
      <div className="absolute right-[50%] bottom-2 flex">
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
