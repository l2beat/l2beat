import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type {
  ProtocolDisplayable,
  ProtocolEntry,
} from '~/server/features/scaling/interop/types'
import { NoResultsInfo } from '../summary/components/NoResultsInfo'
import { AllProtocolsDialog } from './chain-selector/AllProtocolsDialog'
import { AllProtocolsTable } from './table/AllProtocolsTable'

export function AllProtocolsCard({
  type,
  entries,
  zeroTransferProtocols,
  isLoading,
  hideTypeColumn,
  showAverageInFlightValueColumn,
  showNetMintedValueColumn,
}: {
  type: KnownInteropBridgeType | undefined
  entries: ProtocolEntry[] | undefined
  zeroTransferProtocols: ProtocolDisplayable[] | undefined
  isLoading: boolean
  hideTypeColumn?: boolean
  showAverageInFlightValueColumn?: boolean
  showNetMintedValueColumn?: boolean
}) {
  return (
    <PrimaryCard className="col-span-full flex flex-col max-md:border-divider max-md:border-b">
      <h2 className="font-bold text-heading-20 md:text-heading-24">
        All Protocols
      </h2>
      {isLoading && <Skeleton className="mt-2 h-[400px] w-full rounded-sm" />}
      {entries ? (
        entries.length === 0 ? (
          <NoResultsInfo />
        ) : (
          <>
            <AllProtocolsTable
              type={type}
              entries={entries}
              hideTypeColumn={hideTypeColumn}
              showAverageInFlightValueColumn={showAverageInFlightValueColumn}
              showNetMintedValueColumn={showNetMintedValueColumn}
            />
            {zeroTransferProtocols && zeroTransferProtocols.length > 0 && (
              <div className="mt-2 ml-auto flex items-center gap-2">
                <AllProtocolsDialog protocols={zeroTransferProtocols} />
                <span className="font-medium text-xs leading-none max-md:opacity-50 md:text-base">
                  have no transfers for the selected path.
                </span>
              </div>
            )}
          </>
        )
      ) : null}
    </PrimaryCard>
  )
}
