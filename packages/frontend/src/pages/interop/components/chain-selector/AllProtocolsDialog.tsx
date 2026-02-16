import { useState } from 'react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/core/Command'
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
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Trigger protocols={protocols} setIsOpen={setIsOpen} />{' '}
      <Dialog protocols={protocols} isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}

function Trigger({
  protocols,
  setIsOpen,
}: {
  protocols: ProtocolDisplayable[]
  setIsOpen: (isOpen: boolean) => void
}) {
  const remainingCount = protocols.slice(5).length

  return (
    <div className="inline-flex flex-wrap items-center gap-2">
      <button
        className={cn(
          'group/dialog-trigger grid grid-cols-[76px] items-center gap-1',
          remainingCount > 0 && 'grid-cols-[76px_30px]',
        )}
        onClick={() => setIsOpen(true)}
      >
        <div className="-space-x-1.5 flex items-center">
          {protocols.slice(0, 5).map((protocol, i) => (
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
                <p className="font-bold text-label-value-15">{protocol.name}</p>
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
    </div>
  )
}

function Dialog({
  protocols,
  isOpen,
  setIsOpen,
}: {
  protocols: ProtocolDisplayable[]
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) {
  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      title={`Across ${protocols.length} protocols`}
      description="Search for protocols"
    >
      <Command className="rounded-none">
        <CommandInput placeholder="Start typing to find protocol..." />
        <CommandList>
          <CommandEmpty>No protocols found.</CommandEmpty>
          <CommandGroup>
            {protocols.map((protocol) => (
              <CommandItem
                key={protocol.name}
                className="flex items-center gap-3"
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
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
