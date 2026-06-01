import type { KeyValueRecord } from '@l2beat/backend/trpc'
import { useBackendApi } from '~/react-query/trpc'

export function useKeyValueQuery<K extends KeyValueRecord['key']>(
  key: K,
): Omit<
  ReturnType<typeof useBackendApi>['keyValue']['get']['useQuery'],
  'data'
> & { data: KeyValueRecord<K> } {
  const api = useBackendApi()
  const { data, ...rest } = api.keyValue.get.useQuery(key)

  return {
    data: data as unknown as KeyValueRecord<K>,
    ...rest,
  }
}
