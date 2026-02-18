import { cn } from '~/utils/cn'

export function ChainSelectorChainToggle({
  chain,
  isSelected,
  toggleSelected,
  disabled,
}: {
  chain: {
    id: string
    name: string
    iconUrl: string
  }
  isSelected: boolean
  toggleSelected: (chainId: string) => void
  disabled?: boolean
}) {
  return (
    <button
      className={cn(
        'flex h-8 cursor-pointer select-none items-center gap-2 rounded-sm border border-divider bg-surface-secondary py-1.5 pr-3 pl-2 transition-all focus:outline-none focus:ring focus:ring-brand disabled:cursor-not-allowed disabled:opacity-40',
        isSelected && 'border-brand bg-brand/15',
      )}
      onClick={() => toggleSelected(chain.id)}
      disabled={disabled}
    >
      <img src={chain.iconUrl} alt={chain.name} className="size-5" />
      <div className="font-medium text-label-value-16 leading-none">
        {chain.name}
      </div>
    </button>
  )
}
