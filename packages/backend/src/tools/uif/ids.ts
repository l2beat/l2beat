const INDEXER_IDS = new Set<string>()
const CONFIG_IDS = new Set<string>()

export function assetUniqueIndexerId(id: string) {
  if (INDEXER_IDS.has(id)) {
    throw new Error(`Indexer id ${id} is duplicated!`)
  }
  INDEXER_IDS.add(id)
}

export function assetUniqueConfigId(id: string) {
  if (CONFIG_IDS.has(id)) {
    throw new Error(`Configuration id ${id} is duplicated!`)
  }
  CONFIG_IDS.add(id)
}

export function _TEST_ONLY_resetUniqueIds() {
  INDEXER_IDS.clear()
  CONFIG_IDS.clear()
}
