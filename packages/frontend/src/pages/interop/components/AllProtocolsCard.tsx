import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import { Skeleton } from '~/components/core/Skeleton'
import { ProjectIconList } from '~/components/ProjectIconList'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { toProtocolItems } from '~/pages/interop/utils/toProtocolItems'
import type {
  ProtocolDisplayable,
  ProtocolEntry,
} from '~/server/features/layer2s/interop/types'
import { NoResultsInfo } from '../summary/components/NoResultsInfo'
import { BetweenChainsInfo } from './BetweenChainsInfo'
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
      <BetweenChainsInfo className="mt-1" />
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
              <div className="flex items-center justify-center gap-1 border-divider border-t pt-4">
                <ProjectIconList
                  projects={toProtocolItems(zeroTransferProtocols)}
                  title="Protocols without transfers"
                />
                <span className="font-normal text-secondary text-xs leading-none md:text-base">
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
