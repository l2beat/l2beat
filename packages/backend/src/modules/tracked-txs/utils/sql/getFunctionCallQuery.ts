import { Query } from '@google-cloud/bigquery'
import { QueryParamTypes } from '@google-cloud/bigquery/build/src/bigquery'
import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

export function getFunctionCallQuery(
  configs: {
    address: EthereumAddress
    selector: string
    getFullInput: boolean
  }[],
  from: UnixTime,
  to: UnixTime,
): Query {
  const fullInputAddresses = configs
    .filter((c) => c.getFullInput)
    .map((c) => c.address.toLowerCase())
  const params = [
    fullInputAddresses,
    from.toDate().toISOString(),
    to.toDate().toISOString(),
    ...configs.flatMap((c) => [
      c.address.toLowerCase(),
      c.selector.toLowerCase() + '%',
    ]),
    from.toDate().toISOString(),
    to.toDate().toISOString(),
  ]

  const query = `
    SELECT
      txs.hash, txs.to_address, txs.block_number, txs.block_timestamp, txs.gas_price, txs.receipt_gas_used,
      CASE WHEN txs.to_address IN UNNEST(?) THEN traces.input ELSE LEFT(traces.input, 10) END AS input,
    FROM
      bigquery-public-data.crypto_ethereum.transactions as txs
    LEFT JOIN bigquery-public-data.crypto_ethereum.traces as traces
      ON txs.hash = traces.transaction_hash
      AND traces.call_type = 'call'
      AND traces.status = 1
      AND traces.block_timestamp >= TIMESTAMP(?)
      AND traces.block_timestamp < TIMESTAMP(?)
      AND (
        ${configs
          .map(() => `(traces.to_address = ? AND traces.input LIKE ?)`)
          .join(' OR ')}
      )
    WHERE txs.block_timestamp >= TIMESTAMP(?) AND txs.block_timestamp < TIMESTAMP(?)
  `

  // @ts-expect-error BigQuery types are wrong
  const types: QueryParamTypes = [
    ['STRING'],
    'STRING',
    'STRING',
    ...configs.flatMap(() => ['STRING', 'STRING']),
    'STRING',
    `STRING`,
  ]

  return { query, params, types }
}
