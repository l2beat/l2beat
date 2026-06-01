import type { KeyValueRecord } from '@l2beat/database'
import { useBackendApi } from '~/react-query/trpc'

export function useKeyValueQuery<K extends KeyValueRecord['key']>(key: K) {
  const api = useBackendApi()
  const { data, ...rest } = api.keyValue.get.useQuery(key)

  return {
    data: data as KeyValueRecord<K> | null | undefined,
    ...rest,
  }
}
