import { CheckIcon } from '~/icons/Check'
import type { ProtocolDisplayable } from '~/server/features/scaling/interop/types'
import { cn } from '~/utils/cn'
import { useInteropFlows } from './utils/InteropFlowsContext'

export function FlowsCanonicalBridgeButton({
  allProtocols,
  canonicalProtocolId,
}: {
  allProtocols: (ProtocolDisplayable & {
    id: string
  })[]
  canonicalProtocolId: string
}) {
  const { selectedProtocols, selectAllProtocols, setSelectedProtocols } =
    useInteropFlows()

  const canonicalProtocol = allProtocols.find(
    (p) => p.id === canonicalProtocolId,
  )
  if (!canonicalProtocol) return null

  const onlyCanonicalSelected =
    selectedProtocols.length === 1 &&
    selectedProtocols[0] === canonicalProtocolId

  return (
    <button
      type="button"
      onClick={() => {
        if (onlyCanonicalSelected) {
          selectAllProtocols()
          return
        }
        setSelectedProtocols([canonicalProtocolId])
        if (typeof window !== 'undefined') {
          window.location.hash = 'interop-flows'
        }
      }}
      role="checkbox"
      aria-checked={onlyCanonicalSelected}
      className={cn(
        'flex h-9.5 shrink-0 items-center gap-2 rounded-lg border py-2 pr-4 pl-2 font-bold text-sm leading-none transition-colors max-md:w-full max-md:justify-center',
        onlyCanonicalSelected
          ? 'border-brand text-brand'
          : 'border-divider bg-surface-primary! hover:bg-surface-secondary',
      )}
    >
      <span
        className={cn(
          'flex size-4 shrink-0 items-center justify-center rounded border transition-colors',
          onlyCanonicalSelected
            ? 'border-brand bg-brand'
            : 'border-2 border-surface-tertiary',
        )}
      >
        {onlyCanonicalSelected && (
          <CheckIcon className="size-3 stroke-[2px] stroke-surface-primary!" />
        )}
      </span>
      {canonicalProtocol.iconUrl && (
        <img
          src={canonicalProtocol.iconUrl}
          alt=""
          className="size-5 rounded-full bg-white"
        />
      )}
      Canonical bridge only
    </button>
  )
}
