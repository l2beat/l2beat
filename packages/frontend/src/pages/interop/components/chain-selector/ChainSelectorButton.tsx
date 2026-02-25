import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/core/Drawer'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/core/Popover'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import { ChainSelectorChainToggle } from './ChainSelectorChainToggle'
import type { InteropChainWithIcon } from './types'

export function ChainSelectorButton({
  chainKey,
  allChains,
}: {
  chainKey: 'from' | 'to'
  allChains: InteropChainWithIcon[]
}) {
  const { selectedChains, selectChain } = useInteropSelectedChains()
  const selectedFrom =
    selectedChains.from.length === 1 ? selectedChains.from[0] : undefined
  const selectedTo =
    selectedChains.to.length === 1 ? selectedChains.to[0] : undefined

  const chainsWithDetails = allChains.map(({ id, name, iconUrl }) => ({
    id,
    name,
    iconUrl,
    isSelected: {
      from: selectedFrom === id,
      to: selectedTo === id,
    },
  }))

  const selectedChain = chainsWithDetails.find(
    (chain) => chain.isSelected[chainKey],
  )

  const trigger = (
    <div className="flex h-10 items-center justify-center gap-2 rounded-lg border border-divider bg-surface-primary px-4 py-[7px] text-xs leading-none md:text-sm">
      <img
        key={selectedChain?.id}
        src={selectedChain?.iconUrl}
        alt={selectedChain?.name}
        className="size-5"
      />
      <div className="font-semibold leading-none">{selectedChain?.name}</div>
    </div>
  )

  return (
    <div className="flex items-start gap-1 max-md:w-full max-md:flex-col md:items-center md:gap-3">
      {/* Mobile */}
      <Drawer>
        <DrawerTrigger className="w-full md:hidden">{trigger}</DrawerTrigger>
        <DrawerContent className="pb-4">
          <DrawerHeader className="mb-4 gap-2">
            <DrawerTitle className="mb-0 font-semibold text-lg text-primary leading-none">
              Chain selector
            </DrawerTitle>
            <DrawerDescription className="font-semibold text-secondary text-xs leading-none">
              Select two chains
            </DrawerDescription>
          </DrawerHeader>
          <div className="mb-2 font-semibold text-xs leading-none">
            First chain
          </div>
          <div className="flex flex-wrap gap-1">
            {chainsWithDetails.map((chain) => (
              <ChainSelectorChainToggle
                key={chain.id}
                chain={chain}
                isSelected={chain.isSelected.from}
                toggleSelected={(chainId) => selectChain('from', chainId)}
                disabled={chain.isSelected.to}
              />
            ))}
          </div>
          <div className="mt-3 mb-2 font-semibold text-xs leading-none">
            Second chain
          </div>
          <div className="flex flex-wrap gap-1">
            {chainsWithDetails.map((chain) => (
              <ChainSelectorChainToggle
                key={chain.id}
                chain={chain}
                isSelected={chain.isSelected.to}
                toggleSelected={(chainId) => selectChain('to', chainId)}
                disabled={chain.isSelected.from}
              />
            ))}
          </div>
        </DrawerContent>
      </Drawer>
      {/* Desktop */}
      <Popover>
        <PopoverTrigger className="max-md:hidden" asChild>
          {trigger}
        </PopoverTrigger>
        <PopoverContent
          className="!bg-surface-primary max-w-95 p-4"
          align="start"
          side="bottom"
        >
          <div className="mt-2.5 flex flex-wrap gap-1">
            {chainsWithDetails.map((chain) => (
              <ChainSelectorChainToggle
                key={chain.id}
                chain={chain}
                isSelected={chain.isSelected[chainKey]}
                toggleSelected={(chainId) => selectChain(chainKey, chainId)}
                disabled={chain.isSelected[chainKey === 'from' ? 'to' : 'from']}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
