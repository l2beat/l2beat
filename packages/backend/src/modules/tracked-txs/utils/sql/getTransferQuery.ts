import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { BigQueryClientQuery } from '../../../../peripherals/bigquery/BigQueryClient'

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
    SELECT
      txs.hash,
      traces.from_address,
      traces.to_address,
      txs.block_number,
      txs.block_timestamp,
    FROM
      bigquery-public-data.crypto_ethereum.transactions AS txs
    JOIN
      bigquery-public-data.crypto_ethereum.traces AS traces
    ON
      traces.status = 1
      AND txs.hash = traces.transaction_hash
      AND traces.call_type = 'call'
      AND traces.block_timestamp >= TIMESTAMP(?)
      AND traces.block_timestamp < TIMESTAMP(?)
      AND (
        ${transfersConfig
          .map(() => `(traces.from_address = ? AND traces.to_address = ?)`)
          .join(' OR ')}
      )
    WHERE
      txs.block_timestamp >= TIMESTAMP(?)
      AND txs.block_timestamp < TIMESTAMP(?)
  `

  return { query, params, limitInGb: 2 }
}
