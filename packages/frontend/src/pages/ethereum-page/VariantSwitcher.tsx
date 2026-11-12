import { useSimulateReorg } from './live/EthereumHeadContext'
import { VARIANTS, type VariantId } from './variants/registry'

/** Prototype only: hops between variants and drives the simulated chain */
export function VariantSwitcher({
  current,
  speed,
}: {
  current: VariantId
  speed: number
}) {
  const reorg = useSimulateReorg()
  return (
    <div className="fixed inset-x-2 bottom-2 z-[60] mx-auto flex max-w-fit items-center gap-1 overflow-x-auto whitespace-nowrap rounded-xl border border-divider bg-surface-primary/95 p-1.5 text-xs shadow-lg backdrop-blur max-md:mr-16 md:bottom-4">
      <span className="px-2 font-bold text-secondary uppercase tracking-wide max-md:hidden">
        Prototype
      </span>
      {VARIANTS.map((v) => (
        <a
          key={v.id}
          href={toHref(v.id, speed)}
          title={v.pitch}
          data-active={v.id === current}
          className="rounded-lg px-2.5 py-1.5 font-medium text-secondary data-[active=true]:bg-brand data-[active=true]:text-white"
        >
          {v.name}
        </a>
      ))}
      <span className="mx-1 h-5 w-px bg-divider" />
      {[1, 3].map((s) => (
        <a
          key={s}
          href={toHref(current, s)}
          data-active={s === speed}
          className="rounded-lg px-2 py-1.5 font-mono text-secondary data-[active=true]:bg-surface-tertiary data-[active=true]:text-primary"
        >
          {s}×
        </a>
      ))}
      <button
        type="button"
        onClick={reorg}
        className="rounded-lg px-2 py-1.5 font-medium text-secondary hover:text-primary"
      >
        ⟲ Reorg
      </button>
    </div>
  )
}

function toHref(variant: VariantId, speed: number) {
  const params = new URLSearchParams({ variant })
  if (speed !== 1) params.set('speed', String(speed))
  return `/ethereum?${params}`
}
