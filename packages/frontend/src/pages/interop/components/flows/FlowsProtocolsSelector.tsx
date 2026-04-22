import { Checkbox } from '~/components/core/Checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/core/Dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/core/Drawer'
import { ScrollWithGradient } from '~/components/ScrollWithGradient'
import { InfoIcon } from '~/icons/Info'
import type { ProtocolDisplayable } from '~/server/features/scaling/interop/types'
import { MIN_SELECTED_PROTOCOLS } from './consts'
import { useInteropFlows } from './utils/InteropFlowsContext'

export function FlowsProtocolsSelector({
  allProtocols,
}: {
  allProtocols: (ProtocolDisplayable & {
    id: string
  })[]
}) {
  const {
    selectedProtocols,
    toggleProtocolSelection,
    selectAllProtocols,
    deselectAllProtocols,
  } = useInteropFlows()

  const protocolsWithDetails = allProtocols.map(({ id, name, iconUrl }) => ({
    id,
    name,
    iconUrl,
    isSelected: selectedProtocols.includes(id),
  }))

  const selectedProtocolsWithDetails = protocolsWithDetails.filter(
    (protocol) => protocol.isSelected,
  )

  const allSelected = selectedProtocols.length === allProtocols.length

  const belowMinimumSelection =
    selectedProtocols.length < MIN_SELECTED_PROTOCOLS

  const selectionMessage = belowMinimumSelection ? (
    <div className="flex items-center gap-1 px-4">
      <InfoIcon className="shrink-0 fill-negative" />
      <div className="font-medium text-negative text-paragraph-14">
        At least {MIN_SELECTED_PROTOCOLS} protocol must be selected.
      </div>
    </div>
  ) : null

  const trigger = (
    <div className="flex h-9.5 items-center justify-center gap-1.5 rounded-lg border border-divider bg-surface-primary! p-2">
      <span className="rounded-full bg-pink-900 px-2 py-[3px] font-semibold text-white text-xs leading-none">{`${selectedProtocols.length}/${allProtocols.length}`}</span>
      <span className="font-bold text-lg leading-none">Protocols</span>
      <div className="flex items-center gap-1 max-md:hidden lg:max-xl:hidden">
        <div className="-space-x-2 md:-space-x-1 flex items-center">
          {selectedProtocolsWithDetails.slice(0, 5).map((protocol, i) => (
            <img
              key={protocol.id}
              src={protocol.iconUrl}
              alt={protocol.name}
              className="size-5 rounded-full bg-white shadow"
              style={{ zIndex: selectedProtocols.length - i }}
            />
          ))}
        </div>
        {selectedProtocolsWithDetails.length > 5 && (
          <span className="font-semibold text-xs leading-none">
            +{selectedProtocolsWithDetails.length - 5}
          </span>
        )}
      </div>
    </div>
  )

  const footer = (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={selectAllProtocols}
        disabled={allSelected}
        className="w-fit cursor-pointer font-medium text-brand text-label-value-15 underline disabled:cursor-not-allowed disabled:text-secondary"
      >
        Select all
      </button>
      <button
        type="button"
        onClick={deselectAllProtocols}
        disabled={selectedProtocols.length === 0}
        className="w-fit cursor-pointer font-medium text-brand text-label-value-15 underline disabled:cursor-not-allowed disabled:text-secondary"
      >
        Deselect all
      </button>
    </div>
  )

  return (
    <div className="flex items-start gap-1 max-md:w-full max-md:flex-col md:items-center md:gap-3">
      {/* Mobile */}
      <Drawer>
        <DrawerTrigger className="w-full md:hidden">{trigger}</DrawerTrigger>
        <DrawerContent
          className="max-h-[90dvh] pb-4"
          contentClassName="min-h-0 flex flex-col"
        >
          <DrawerHeader className="mb-4 gap-2">
            <DrawerTitle className="mb-0 font-semibold text-lg text-primary leading-none">
              Protocol selector
            </DrawerTitle>
            <DrawerDescription className="font-semibold text-secondary text-xs leading-none">
              Select protocols
            </DrawerDescription>
            {selectionMessage}
          </DrawerHeader>
          <ScrollWithGradient className="min-h-0">
            {protocolsWithDetails.map((protocol) => (
              <Checkbox
                key={protocol.id}
                name={protocol.name}
                className="flex h-10 w-full flex-row-reverse items-center justify-between px-4 py-2.5 hover:bg-surface-secondary"
                checked={protocol.isSelected}
                onCheckedChange={() => toggleProtocolSelection(protocol.id)}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={protocol.iconUrl}
                    alt={protocol.name}
                    className="size-4"
                  />
                  <span className="font-semibold text-xs leading-none">
                    {protocol.name}
                  </span>
                </div>
              </Checkbox>
            ))}
          </ScrollWithGradient>
          <div className="mt-4 px-4">{footer}</div>
        </DrawerContent>
      </Drawer>
      {/* Desktop */}
      <Dialog>
        <DialogTrigger className="cursor-pointer max-md:hidden" asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className="flex max-h-[60dvh] w-full flex-col gap-1 overflow-y-hidden bg-surface-primary md:max-w-112">
          <DialogHeader>
            <DialogTitle className="text-heading-24">Protocols</DialogTitle>
            <DialogDescription className="sr-only">
              Select protocols
            </DialogDescription>
            {selectionMessage}
          </DialogHeader>
          <ScrollWithGradient>
            {protocolsWithDetails.map((protocol) => (
              <Checkbox
                key={protocol.id}
                name={protocol.name}
                className="flex h-10 w-full flex-row-reverse items-center justify-between px-3 py-2.5 hover:bg-surface-secondary"
                checked={protocol.isSelected}
                onCheckedChange={() => toggleProtocolSelection(protocol.id)}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={protocol.iconUrl}
                    alt={protocol.name}
                    className="size-4"
                  />
                  <span className="font-bold text-label-value-16">
                    {protocol.name}
                  </span>
                </div>
              </Checkbox>
            ))}
          </ScrollWithGradient>
          <div className="mt-1">{footer}</div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
