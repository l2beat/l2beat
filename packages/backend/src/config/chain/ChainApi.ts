import type { BlockApi } from './BlockApi'
import type { IndexerApi } from './IndexerApi'

export interface ChainApi {
  readonly name: string
  readonly blockApis: BlockApi[]
  readonly indexerApis: IndexerApi[]
}
