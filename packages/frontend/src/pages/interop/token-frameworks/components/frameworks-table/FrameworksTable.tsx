import { useQuery } from '@tanstack/react-query'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { FrameworkTableEntry } from '~/server/features/scaling/interop/getTokenFrameworksData'
import { useTRPC } from '~/trpc/React'
import type { InteropTokenFramework } from '../../getInteropTokenFrameworksData'
import { useTokenFrameworksSelectedChains } from '../../utils/TokenFrameworksSelectedChainsContext'
import { FrameworkColumn } from './FrameworkColumn'

export function FrameworksTable({
  tokenFrameworks,
}: {
  tokenFrameworks: InteropTokenFramework[]
}) {
  const trpc = useTRPC()
  const { selectedChains } = useTokenFrameworksSelectedChains()
  const apiSelection = { from: selectedChains, to: selectedChains }
  const { data, isLoading } = useQuery(
    trpc.interop.tokenFrameworks.queryOptions(apiSelection),
  )

  const tableById = new Map<string, FrameworkTableEntry>(
    data?.frameworkTable.map((entry) => [entry.id, entry]) ?? [],
  )

  const volumeById = new Map<string, number>(
    data?.frameworkDominance.volume.entries.map((entry) => [
      entry.id,
      entry.volume,
    ]) ?? [],
  )

  const sortedFrameworks = [...tokenFrameworks].sort(
    (a, b) => (volumeById.get(b.id) ?? 0) - (volumeById.get(a.id) ?? 0),
  )

  return (
    <PrimaryCard className="rounded-none! p-0 md:px-0 md:py-0">
      <div className="overflow-x-auto">
        <div className="flex min-w-fit">
          {sortedFrameworks.map((framework, i) => (
            <FrameworkColumn
              key={framework.id}
              framework={framework}
              entry={tableById.get(framework.id)}
              isFirst={i === 0}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>
    </PrimaryCard>
  )
}
