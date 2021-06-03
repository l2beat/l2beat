import { BigQuery, Query } from '@google-cloud/bigquery'
import { AsyncQueue } from './AsyncQueue'

export class QueryQueue {
  private asyncQueue = new AsyncQueue({ length: 1 })

  constructor(private bigQuery: BigQuery) {}

  query(query: Query) {
    return this.asyncQueue.enqueue(() => this.bigQuery.query(query))
  }
}
