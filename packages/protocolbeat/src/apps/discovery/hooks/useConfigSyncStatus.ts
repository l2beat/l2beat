import { useQuery } from '@tanstack/react-query'
import { getConfigSyncStatus } from '../../../api/api'

type Props = {
  project: string
}

export function useConfigSyncStatus({ project }: Props) {
  const syncStatusQuery = useQuery({
    queryKey: ['projects', project, 'config', 'sync-status'],
    queryFn: () => getConfigSyncStatus(project),
    retry: false,
  })

  return {
    isInSync: syncStatusQuery.data?.isInSync,
    isPending: syncStatusQuery.isPending || syncStatusQuery.isFetching,
    isError: syncStatusQuery.isError,
  }
}
