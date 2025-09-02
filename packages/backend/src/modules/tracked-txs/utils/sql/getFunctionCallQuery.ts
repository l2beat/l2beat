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
      txs.hash,
      traces.to_address,
      txs.block_number,
      txs.block_timestamp,
      txs.receipt_gas_used,
      txs.gas_price,
      txs.receipt_blob_gas_used,
      txs.receipt_blob_gas_price,
      (LENGTH(SUBSTR(txs.input, 3)) / 2) AS data_length,
      (LENGTH(REPLACE(REGEXP_REPLACE(SUBSTR(txs.input, 3), '([0-9A-Fa-f]{2})', '\\\\1x'), '00x', '')) / 3) AS non_zero_bytes,
      CASE
        WHEN traces.to_address IN UNNEST(?) THEN traces.input
      ELSE
      LEFT(traces.input, 10)
    END
      AS input,
    FROM
      bigquery-public-data.crypto_ethereum.transactions AS txs
    JOIN
      bigquery-public-data.crypto_ethereum.traces AS traces
    ON
      txs.hash = traces.transaction_hash
      AND traces.call_type = 'call'
      AND traces.status = 1
      AND traces.block_timestamp >= TIMESTAMP(?)
      AND traces.block_timestamp <= TIMESTAMP(?)
      AND (
        ${configs
          .map(() => '(traces.to_address = ? AND traces.input LIKE ?)')
          .join(' OR ')}
      )
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
