import { ParsedBigQueryResult } from './model'

export interface TxUpdaterInterface {
  update: (txs: ParsedBigQueryResult[]) => void
}
