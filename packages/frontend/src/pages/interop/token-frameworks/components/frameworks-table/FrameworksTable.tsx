import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type {
  FrameworkTableEntry,
  TokenFrameworksData,
} from '~/server/features/layer2s/interop/getTokenFrameworksData'
import type { InteropTransferDefaults } from '../../../components/InteropTransferTrigger'
import type { InteropTokenFramework } from '../../getInteropTokenFrameworksData'
import { FrameworkColumn } from './FrameworkColumn'

export function FrameworksTable({
  tokenFrameworks,
  data,
  isLoading,
  transfer,
}: {
  tokenFrameworks: InteropTokenFramework[]
  data: TokenFrameworksData | undefined
  isLoading: boolean
  transfer: InteropTransferDefaults
}) {
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
              transfer={transfer}
            />
          ))}
        </div>
      </div>
    </PrimaryCard>
  )
}
