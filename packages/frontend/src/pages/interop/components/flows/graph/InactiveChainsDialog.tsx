import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/core/Dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { cn } from '~/utils/cn'
import type { InteropChainWithIcon } from '../../chain-selector/types'

export function InactiveChainsDialog({
  chains,
}: {
  chains: InteropChainWithIcon[]
}) {
  const cappedChains = chains.slice(0, 5)
  const remainingCount = chains.slice(5).length

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            'group/dialog-trigger grid items-center gap-1 text-left',
          )}
          style={{
            gridTemplateColumns: `${chains.length === 1 ? 20 : cappedChains.length * 15}px  1fr`,
          }}
        >
          <div className="-space-x-1.5 flex items-center">
            {cappedChains.map((chain, i) => (
              <Tooltip key={chain.id}>
                <TooltipTrigger asChild>
                  <img
                    src={chain.iconUrl}
                    alt={chain.name}
                    className="relative size-5 min-w-5 rounded-full bg-white shadow"
                    style={{ zIndex: 5 - i }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-bold text-label-value-15">{chain.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          {remainingCount > 0 && (
            <span className="font-bold text-label-value-12 group-hover/dialog-trigger:underline max-md:opacity-50 md:text-label-value-13">
              +{remainingCount}
            </span>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="gap-0 bg-surface-primary p-0 max-md:border-none md:top-1/4 md:max-w-lg">
        <DialogClose />
        <div className="max-h-[320px] overflow-y-auto">
          <DialogHeader className="fade-out-to-bottom-3 sticky top-0 z-10 bg-surface-primary p-4">
            <DialogTitle>List of chains</DialogTitle>
          </DialogHeader>
          <div className="px-2 pb-2">
            {chains.length === 0 ? (
              <p className="px-2 py-3 text-center text-sm">No chains found.</p>
            ) : (
              <ul className="space-y-0.5">
                {chains.map((chain) => (
                  <li
                    key={chain.id}
                    className="flex items-center gap-3 rounded-sm px-2 py-3"
                  >
                    <img
                      src={chain.iconUrl}
                      alt={chain.name}
                      width={20}
                      height={20}
                      className="size-5"
                    />
                    <span className="font-bold text-label-value-15">
                      {chain.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
