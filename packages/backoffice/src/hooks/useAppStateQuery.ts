import type { AppStateRecord } from '@l2beat/database'
import { useQuery } from '@tanstack/react-query'
import { useBackendTrpc } from '~/react-query/trpc'

export function useAppStateQuery<K extends AppStateRecord['key']>(key: K) {
  const trpc = useBackendTrpc()
  const { data, ...rest } = useQuery(trpc.appState.findByKey.queryOptions(key))

  return {
    data: data as AppStateRecord<K> | null | undefined,
    ...rest,
  }
}
