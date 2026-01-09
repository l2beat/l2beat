/**
 * A Map implementation with upsert methods based on the TC39 proposal.
 * @see https://github.com/tc39/proposal-upsert
 */
/** biome-ignore-all lint/style/noNonNullAssertion: allow usage of `!` for simpler, canonical implementation */
export class UpsertMap<K, V> extends Map<K, V> {
  /**
   * Returns the value associated with the key if it exists,
   * otherwise inserts the default value and returns it.
   */
  getOrInsert(key: K, defaultValue: V): V {
    if (this.has(key)) {
      return this.get(key)!
    }
    this.set(key, defaultValue)
    return defaultValue
  }

  /**
   * Returns the value associated with the key if it exists,
   * otherwise computes the value using the callback, inserts it, and returns it.
   */
  getOrInsertComputed(key: K, callbackFn: (key: K) => V): V {
    if (this.has(key)) {
      return this.get(key)!
    }
    const value = callbackFn(key)
    this.set(key, value)
    return value
  }
}
