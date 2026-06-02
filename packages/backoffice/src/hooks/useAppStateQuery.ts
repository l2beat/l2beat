import type { AppStateRecord } from '@l2beat/database'
import { useBackendApi } from '~/react-query/trpc'

export function useAppStateQuery<K extends AppStateRecord['key']>(key: K) {
  const api = useBackendApi()
  const { data, ...rest } = api.appState.get.useQuery(key)

  return {
    data: data as AppStateRecord<K> | null | undefined,
    ...rest,
  }
}
