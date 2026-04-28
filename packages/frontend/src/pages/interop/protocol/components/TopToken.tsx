import type { ProjectId } from '@l2beat/shared-pure'
import { api } from '~/trpc/React'
import { TopTokenWidget } from '../../components/widgets/TopTokenWidget'
import type { InteropSelection } from '../../utils/types'

export function TopToken({
  id,
  apiSelection,
}: {
  id: ProjectId
  apiSelection: InteropSelection
}) {
  const { data, isLoading } = api.interop.protocol.useQuery({
    ...apiSelection,
    id,
  })
  return (
    <TopTokenWidget
      className="md:mt-4"
      topToken={data?.topToken}
      isLoading={isLoading}
      hideProtocol
      hideChainsInfo
    />
  )
}
