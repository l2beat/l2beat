import { cn } from '~/utils/cn'

export function ChainSelectorChainToggle({
  chain,
  isSelected,
  toggleSelected,
}: {
  chain: {
    id: string
    name: string
    iconUrl: string
  }
  isSelected: boolean
  toggleSelected: (chainId: string) => void
}) {
  return (
    <button
      className={cn(
        'flex h-10 cursor-pointer select-none items-center gap-2 rounded-sm border border-divider bg-surface-secondary py-1.5 pr-3 pl-2 transition-all focus:outline-none focus:ring focus:ring-brand md:h-8',
        isSelected && 'border-brand bg-brand/15',
      )}
      onClick={() => toggleSelected(chain.id)}
    >
      <img src={chain.iconUrl} alt={chain.name} className="size-5" />
      <div className="font-medium text-label-value-16 leading-none">
        {chain.name}
      </div>
    </button>
  )
}
