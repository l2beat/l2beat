const KEPT_KEY_PREFIX = 'layout/'

export function clearSavedState(
  storage: Pick<Storage, 'length' | 'key' | 'removeItem'>,
): void {
  const keys: string[] = []
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i)
    if (key !== null && !key.startsWith(KEPT_KEY_PREFIX)) {
      keys.push(key)
    }
  }
  for (const key of keys) {
    storage.removeItem(key)
  }
}
