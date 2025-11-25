import type { QueryParamTypes } from '@google-cloud/bigquery/build/src/bigquery'
import { type EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import type { BigQueryClientQuery } from '../../../../peripherals/bigquery/BigQueryClient'

export function getFunctionCallQuery(
  configs: {
    address: EthereumAddress
    selector: string
    getFullInput: boolean
  }[],
  from: UnixTime,
  to: UnixTime,
): BigQueryClientQuery {
  const fullInputAddresses = configs
    .filter((c) => c.getFullInput)
    .map((c) => c.address.toLowerCase())
  const fromDate = UnixTime.toDate(from).toISOString()
  const toDate = UnixTime.toDate(to).toISOString()

  const params = [
    fullInputAddresses,
    fromDate,
    toDate,
    ...configs.flatMap((c) => [
      c.address.toLowerCase(),
      c.selector.toLowerCase() + '%',
    ]),
    fromDate,
    toDate,
  ]

  // To calculate the non-zero bytes we are grouping bytes by adding 'x' sign between each byte
  // and then removing all '00x' sequences. Next step is to divide length of result by 3 as this is length of '00x' sequence.
  const query = `
    SELECT DISTINCT
      txs.transaction_hash,
      txs.transaction_type,
      traces.action.to_address,
      txs.block_number,
      txs.block_timestamp,
      receipts.gas_used,
      txs.gas_price,
      (LENGTH(SUBSTR(txs.input, 3)) / 2) AS data_length,
      (LENGTH(REPLACE(REGEXP_REPLACE(SUBSTR(txs.input, 3), '([0-9A-Fa-f]{2})', '\\\\1x'), '00x', '')) / 3) AS non_zero_bytes,
      CASE
        WHEN traces.action.to_address IN UNNEST(?) THEN traces.action.input
      ELSE
      LEFT(traces.action.input, 10)
    END
      AS input,
    FROM
      bigquery-public-data.goog_blockchain_ethereum_mainnet_us.transactions AS txs
    JOIN
      bigquery-public-data.goog_blockchain_ethereum_mainnet_us.traces AS traces
    ON
      txs.transaction_hash = traces.transaction_hash
      AND traces.action.call_type = 'call'
      AND traces.error IS NULL
      AND traces.block_timestamp >= TIMESTAMP(?)
      AND traces.block_timestamp <= TIMESTAMP(?)
      AND (
        ${configs
          .map(
            () =>
              '(traces.action.to_address = ? AND traces.action.input LIKE ?)',
          )
          .join(' OR ')}
      )
    JOIN
      bigquery-public-data.goog_blockchain_ethereum_mainnet_us.receipts as receipts
    ON
      txs.transaction_hash = receipts.transaction_hash
      AND receipts.block_timestamp >= TIMESTAMP(?)
      AND receipts.block_timestamp <= TIMESTAMP(?)
    WHERE
      txs.block_timestamp >= TIMESTAMP(?)
      AND txs.block_timestamp <= TIMESTAMP(?)
  `

  // @ts-expect-error BigQuery types are wrong
  const types: QueryParamTypes = [
    ['STRING'],
    'STRING',
    'STRING',
    ...configs.flatMap(() => ['STRING', 'STRING']),
    'STRING',
    'STRING',
  ]

  return { query, params, types, limitInGb: 22 }
}
