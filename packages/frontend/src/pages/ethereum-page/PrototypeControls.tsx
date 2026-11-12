import { useSimulateReorg } from './live/EthereumHeadContext'

/** Prototype only: drives the simulated chain, so reviewers can see a reorg on demand */
export function PrototypeControls({ speed }: { speed: number }) {
  const reorg = useSimulateReorg()
  return (
    <div className="fixed inset-x-2 bottom-2 z-[60] mx-auto flex max-w-fit items-center gap-1 overflow-x-auto whitespace-nowrap rounded-xl border border-divider bg-surface-primary/95 p-1.5 text-xs shadow-lg backdrop-blur max-md:mr-16 md:bottom-4">
      <span className="px-2 font-bold text-secondary uppercase tracking-wide max-md:hidden">
        Prototype
      </span>
      {[1, 3].map((s) => (
        <a
          key={s}
          href={s === 1 ? '/ethereum' : `/ethereum?speed=${s}`}
          data-active={s === speed}
          className="rounded-lg px-2 py-1.5 font-mono text-secondary data-[active=true]:bg-surface-tertiary data-[active=true]:text-primary"
        >
          {s}×
        </a>
      ))}
      <span className="mx-1 h-5 w-px bg-divider" />
      {REORG_BUTTONS.map(({ label, depth, title }) => (
        <button
          key={label}
          type="button"
          title={title}
          onClick={() => reorg(depth)}
          className="rounded-lg px-2 py-1.5 font-medium text-secondary hover:text-primary"
        >
          {label}
        </button>
      ))}
    </div>
  )
}

const REORG_BUTTONS = [
  {
    label: '⟲ Reorg',
    depth: undefined,
    title: 'A typical reorg: usually 1 slot, sometimes a few',
  },
  { label: '⟲ 5 deep', depth: 5, title: 'Rewrites the newest 5 slots' },
]
