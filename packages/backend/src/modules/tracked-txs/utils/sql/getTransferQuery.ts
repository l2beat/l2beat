import { type EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import type { BigQueryClientQuery } from '../../../../peripherals/bigquery/BigQueryClient'

export function getTransferQuery(
  transfersConfig: { from?: EthereumAddress; to: EthereumAddress }[],
  from: UnixTime,
  to: UnixTime,
): BigQueryClientQuery {
  const fromDate = UnixTime.toDate(from).toISOString()
  const toDate = UnixTime.toDate(to).toISOString()

  const params = [
    fromDate,
    toDate,
    ...transfersConfig.flatMap((c) => [
      ...(c.from ? [c.from.toLowerCase()] : []),
      c.to.toLowerCase(),
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
      traces.action.from_address,
      traces.action.to_address,
      txs.block_number,
      txs.block_timestamp,
      receipts.gas_used,
      txs.gas_price,
      (LENGTH(SUBSTR(txs.input, 3)) / 2) AS data_length,
      (LENGTH(REPLACE(REGEXP_REPLACE(SUBSTR(txs.input, 3), '([0-9A-Fa-f]{2})', '\\\\1x'), '00x', '')) / 3) AS non_zero_bytes,
    FROM
      bigquery-public-data.goog_blockchain_ethereum_mainnet_us.transactions AS txs
    JOIN
      bigquery-public-data.goog_blockchain_ethereum_mainnet_us.traces AS traces
    ON
      traces.error IS NULL
      AND txs.transaction_hash = traces.transaction_hash
      AND traces.action.call_type = 'call'
      AND traces.block_timestamp >= TIMESTAMP(?)
      AND traces.block_timestamp <= TIMESTAMP(?)
      AND (
        ${transfersConfig
          .map((tc) =>
            tc.from
              ? '(traces.action.from_address = ? AND traces.action.to_address = ?)'
              : '(traces.action.to_address = ?)',
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

  return { query, params, limitInGb: 10 }
}
