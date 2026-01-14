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
      <div className="absolute right-[50%] bottom-3 flex gap-1">
        <div
          className={cn(
            'size-3 cursor-pointer rounded-xs',
            view === 'volume' ? 'bg-brand' : 'bg-secondary',
          )}
          onClick={() => setView('volume')}
        />
        <div
          className={cn(
            'size-3 cursor-pointer rounded-xs',
            view === 'transfers' ? 'bg-brand' : 'bg-secondary',
          )}
          onClick={() => setView('transfers')}
        />
      </div>
    </div>
  )
}
