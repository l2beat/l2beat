import type { KeyValueRecord } from '@l2beat/backend/trpc'
import { useBackendApi } from '~/react-query/trpc'

export function useKeyValueQuery<K extends KeyValueRecord['key']>(key: K) {
  const api = useBackendApi()
  const { data, ...rest } = api.keyValue.get.useQuery(key)

  return {
    data: data as unknown as KeyValueRecord<K>,
    ...rest,
  }
}
