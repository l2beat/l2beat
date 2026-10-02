import chunk from 'lodash/chunk'

/** Bounds concurrent RPC requests while keeping results in input order. */
export async function mapInBatches<T, R>(
  items: T[],
  batchSize: number,
  map: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = []
  for (const batch of chunk(items, batchSize)) {
    results.push(...(await Promise.all(batch.map(map))))
  }
  return results
}
