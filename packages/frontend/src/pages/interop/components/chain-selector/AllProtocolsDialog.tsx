import {
  Dialog,
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
import type { ProtocolDisplayable } from '~/server/features/scaling/interop/types'
import { cn } from '~/utils/cn'

export function AllProtocolsDialog({
  protocols,
}: {
  protocols: ProtocolDisplayable[]
}) {
  const cappedProtocols = protocols.slice(0, 5)
  const remainingCount = protocols.slice(5).length

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            'group/dialog-trigger grid items-center gap-1 text-left',
          )}
          style={{
            gridTemplateColumns: `${protocols.length === 1 ? 20 : cappedProtocols.length * 15}px  1fr`,
          }}
        >
          <div className="-space-x-1.5 flex items-center">
            {cappedProtocols.map((protocol, i) => (
              <Tooltip key={protocol.name}>
                <TooltipTrigger asChild>
                  <img
                    src={protocol.iconUrl}
                    alt={protocol.name}
                    className="relative size-5 min-w-5 rounded-full bg-white shadow"
                    style={{ zIndex: 5 - i }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-bold text-label-value-15">
                    {protocol.name}
                  </p>
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
      <DialogContent className="max-h-[320px] gap-0 overflow-y-auto bg-surface-primary p-0 max-md:border-none md:top-1/4 md:max-w-lg">
        <DialogHeader className="fade-out-to-bottom-3 sticky top-0 z-10 bg-surface-primary p-4">
          <DialogTitle>List of protocols</DialogTitle>
        </DialogHeader>
        <div className="px-2 pb-2">
          {protocols.length === 0 ? (
            <p className="px-2 py-3 text-center text-sm">No protocols found.</p>
          ) : (
            <ul className="space-y-0.5">
              {protocols.map((protocol) => (
                <li
                  key={protocol.name}
                  className="flex items-center gap-3 rounded-sm px-2 py-3"
                >
                  <img
                    src={protocol.iconUrl}
                    alt={protocol.name}
                    width={20}
                    height={20}
                    className="size-5"
                  />
                  <span className="font-bold text-label-value-15">
                    {protocol.name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
