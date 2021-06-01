import { BigQuery } from '@google-cloud/bigquery'
import { BlockInfo } from './BlockInfo'
import { getConfig } from './Config'

export function setup() {
  const config = getConfig()

  const bigQuery = new BigQuery()
  const blockInfo = new BlockInfo(bigQuery)

  return {
    config,
    blockInfo,
  }
}
