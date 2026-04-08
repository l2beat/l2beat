import type { ProjectId } from '@l2beat/shared-pure'
import { api } from '~/trpc/React'
import { TopTokenWidget } from '../../components/widgets/TopTokenWidget'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'

export function TopToken({ id }: { id: ProjectId }) {
  const { selectionForApi } = useInteropSelectedChains()
  const { data, isLoading } = api.interop.protocol.useQuery({
    ...selectionForApi,
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
