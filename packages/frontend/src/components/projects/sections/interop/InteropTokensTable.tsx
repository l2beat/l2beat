import type { ProjectId } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import type { InteropSelection } from '~/pages/interop/utils/types'
import { useTRPC } from '~/trpc/React'
import { InteropTokensTableView } from './InteropTokensTableView'

const ALL_TOKENS_LIMIT = 10_000

export interface InteropTokensTableProps {
  projectId: ProjectId
  apiSelection: InteropSelection
}

export function InteropTokensTable({
  projectId,
  apiSelection,
}: InteropTokensTableProps) {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.interop.tokens.queryOptions(
      {
        ...apiSelection,
        id: projectId,
        limit: ALL_TOKENS_LIMIT,
      },
      {
        enabled: apiSelection.from.length > 0 && apiSelection.to.length > 0,
      },
    ),
  )

  return (
    <InteropTokensTableView
      tokens={data?.items}
      isLoading={isLoading}
      apiSelection={apiSelection}
    />
  )
}
