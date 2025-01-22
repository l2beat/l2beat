import type { QueryParamTypes } from '@google-cloud/bigquery/build/src/bigquery'
import type { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

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
    CREATE TEMP FUNCTION CalculateCalldataGasUsed(hexString STRING)
    RETURNS INT64
    LANGUAGE js AS """
      var nonZeroBytes = 0;
      var zeroBytes = 0;

      for (var i = 2; i < hexString.length; i += 2) {
        if(hexString.substr(i, 2)==='00') {
          zeroBytes++;
        } else {
          nonZeroBytes++;
        }
      }

      return 16 * nonZeroBytes + 4 * zeroBytes;
    """;

    SELECT DISTINCT
      txs.hash,
      traces.to_address,
      txs.block_number,
      txs.block_timestamp,
      txs.receipt_gas_used,
      txs.gas_price,
      txs.receipt_blob_gas_used,
      txs.receipt_blob_gas_price,
      CalculateCalldataGasUsed(txs.input) AS calldata_gas_used,
      (LENGTH(SUBSTR(txs.input, 3)) / 2) AS data_length,
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
          .map(() => `(traces.to_address = ? AND traces.input LIKE ?)`)
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
    `STRING`,
  ]

  return { query, params, types, limitInGb: 22 }
}
