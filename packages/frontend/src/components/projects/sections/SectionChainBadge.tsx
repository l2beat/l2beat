import { cn } from '~/utils/cn'

/** The chain a section is about, on the page of a project shown one tracked chain at a time. */
export interface SectionChain {
  id: string
  name: string
  iconUrl: string
}

/** Names the chain a section is about in its header. */
export function SectionChainBadge({ chain }: { chain: SectionChain }) {
  return (
    <div className="flex h-8 w-max items-center gap-1.5 rounded-lg bg-surface-secondary px-3 font-medium text-secondary text-xs md:text-sm">
      <ChainIcon chain={chain} className="ring-surface-secondary" />
      {chain.name}
    </div>
  )
}

export function ChainIcon({
  chain,
  className,
}: {
  chain: Pick<SectionChain, 'iconUrl'>
  className?: string
}) {
  return (
    <img
      src={chain.iconUrl}
      alt=""
      width={16}
      height={16}
      className={cn('size-4 rounded-full bg-pure-white ring-1', className)}
    />
  )
}
