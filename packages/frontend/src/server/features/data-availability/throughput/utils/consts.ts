export const THROUGHPUT_ENABLED_DA_LAYERS = ['ethereum']

/**
 * Alt-DA layers are no longer indexed but their old rows stay in the
 * database; reading them would mix stale history into live Ethereum data.
 */
export function withoutDeprecatedDaLayers<T extends { daLayer: string }>(
  records: T[],
): T[] {
  return records.filter((r) => THROUGHPUT_ENABLED_DA_LAYERS.includes(r.daLayer))
}
