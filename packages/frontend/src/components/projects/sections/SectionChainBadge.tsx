/** The chain a section is about, on the page of a project shown one tracked chain at a time. */
export interface SectionChain {
  id: string
  name: string
  iconUrl: string
}

/** Names the chain, or the chains, a section is about in its header. */
export function SectionChainBadge({
  chains,
  label,
}: {
  chains: Pick<SectionChain, 'id' | 'iconUrl'>[]
  label: string
}) {
  return (
    <div className="flex h-8 w-max items-center gap-1.5 rounded-lg bg-surface-secondary px-3 font-medium text-secondary text-xs md:text-sm">
      <span className="-space-x-1 flex">
        {chains.map((chain) => (
          <img
            key={chain.id}
            src={chain.iconUrl}
            alt=""
            width={16}
            height={16}
            className="size-4 rounded-full bg-pure-white ring-1 ring-surface-secondary"
          />
        ))}
      </span>
      {label}
    </div>
  )
}
