import type { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import type { BigQueryClientQuery } from '../../../../peripherals/bigquery/BigQueryClient'

export function getTransferQuery(
  transfersConfig: { from: EthereumAddress; to: EthereumAddress }[],
  from: UnixTime,
  to: UnixTime,
): BigQueryClientQuery {
  const params = [
    from.toDate().toISOString(),
    to.toDate().toISOString(),
    ...transfersConfig.flatMap((c) => [
      c.from.toLowerCase(),
      c.to.toLowerCase(),
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
      traces.from_address,
      traces.to_address,
      txs.block_number,
      txs.block_timestamp,
      txs.receipt_gas_used,
      txs.gas_price,
      txs.receipt_blob_gas_used,
      txs.receipt_blob_gas_price,
      CalculateCalldataGasUsed(txs.input) AS calldata_gas_used,
      (LENGTH(SUBSTR(txs.input, 3)) / 2) AS data_length,
    FROM
      bigquery-public-data.crypto_ethereum.transactions AS txs
    JOIN
      bigquery-public-data.crypto_ethereum.traces AS traces
    ON
      traces.status = 1
      AND txs.hash = traces.transaction_hash
      AND traces.call_type = 'call'
      AND traces.block_timestamp >= TIMESTAMP(?)
      AND traces.block_timestamp <= TIMESTAMP(?)
      AND (
        ${transfersConfig
          .map(() => `(traces.from_address = ? AND traces.to_address = ?)`)
          .join(' OR ')}
      )
    WHERE
      txs.block_timestamp >= TIMESTAMP(?)
      AND txs.block_timestamp <= TIMESTAMP(?)
  `

  return { query, params, limitInGb: 10 }
}
