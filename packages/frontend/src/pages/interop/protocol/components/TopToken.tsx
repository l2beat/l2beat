import type { ProjectId } from '@l2beat/shared-pure'
import { api } from '~/trpc/React'
import { TopTokenWidget } from '../../components/widgets/TopTokenWidget'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'

export function TopToken({ id }: { id: ProjectId }) {
  const { allChainIds } = useInteropSelectedChains()
  const { data, isLoading } = api.interop.protocol.useQuery({
    from: allChainIds,
    to: allChainIds,
    id,
  })
  return (
    <TopTokenWidget
      className="md:mt-4"
      topToken={data?.topToken}
      isLoading={isLoading}
      hideProtocol
    />
  )
}
