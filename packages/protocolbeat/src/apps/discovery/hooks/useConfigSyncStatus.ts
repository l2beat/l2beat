import { useQuery } from '@tanstack/react-query'
import {
  getConfigSyncStatus,
  getGlobalConfigSyncStatus,
} from '../../../api/api'

type ConfigSyncStatusProps = {
  project: string
  refetchInterval?: number
}

const DEFAULT_REFETCH_INTERVAL = 20_000

export function useConfigSyncStatus({
  project,
  refetchInterval,
}: ConfigSyncStatusProps) {
  const syncStatusQuery = useQuery({
    queryKey: ['config-sync-status', project],
    queryFn: () => getConfigSyncStatus(project),
    retry: false,
    refetchInterval: refetchInterval ?? DEFAULT_REFETCH_INTERVAL,
  })

  return {
    reasons: syncStatusQuery.data?.reasons,
    isPending: syncStatusQuery.isPending || syncStatusQuery.isFetching,
    isError: syncStatusQuery.isError,
  }
}

type GlobalConfigSyncStatusProps = {
  refetchInterval?: number
}

export function useGlobalConfigSyncStatus(props?: GlobalConfigSyncStatusProps) {
  const syncStatusQuery = useQuery({
    queryKey: ['config-sync-status'],
    queryFn: () => getGlobalConfigSyncStatus(),
    retry: false,
    refetchInterval: props?.refetchInterval ?? DEFAULT_REFETCH_INTERVAL,
  })

  return {
    reasons: syncStatusQuery.data?.reasons,
    isPending: syncStatusQuery.isPending || syncStatusQuery.isFetching,
    isError: syncStatusQuery.isError,
  }
}
