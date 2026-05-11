import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { FrameworkTableEntry } from '~/server/features/scaling/interop/getTokenFrameworksData'
import { api } from '~/trpc/React'
import type { InteropTokenFramework } from '../../getInteropTokenFrameworksData'
import { useTokenFrameworksSelectedChains } from '../../utils/TokenFrameworksSelectedChainsContext'
import { FrameworkColumn } from './FrameworkColumn'

export function FrameworksTable({
  tokenFrameworks,
}: {
  tokenFrameworks: InteropTokenFramework[]
}) {
  const { selectedChains } = useTokenFrameworksSelectedChains()
  const { data, isLoading } = api.interop.tokenFrameworks.useQuery({
    from: selectedChains,
    to: selectedChains,
  })

  const tableById = new Map<string, FrameworkTableEntry>(
    data?.frameworkTable.map((entry) => [entry.id, entry]) ?? [],
  )

  return (
    <PrimaryCard className="rounded-none! p-0 md:px-0 md:py-0">
      <div className="overflow-x-auto">
        <div className="flex min-w-fit">
          {tokenFrameworks.map((framework, i) => (
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
