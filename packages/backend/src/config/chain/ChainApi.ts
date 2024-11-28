import { BlockApi } from './BlockApi'
import { IndexerApi } from './IndexerApi'

export interface ChainApi {
  readonly name: string
  readonly blockApis: BlockApi[]
  readonly indexerApis: IndexerApi[]
}
