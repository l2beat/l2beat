import { Query } from '@google-cloud/bigquery'
import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

export function getTransferQuery(
  transfersConfig: { from: EthereumAddress; to: EthereumAddress }[],
  from: UnixTime,
  to: UnixTime,
): Query {
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

  // TODO: (tracked_tx) reinvestigate this query, maybe traces are not needed
  const query = `
    SELECT
      txs.hash,
      txs.from_address
      txs.to_address,
      txs.block_number,
      txs.block_timestamp,
      txs.gas_price
      txs.receipt_gas_used
    FROM
      bigquery-public-data.crypto_ethereum.transactions as txs
    LEFT JOIN bigquery-public-data.crypto_ethereum.traces as traces
      ON traces.status = 1
      AND traces.call_type = 'call'
      AND traces.block_timestamp >= TIMESTAMP(?)
      AND traces.block_timestamp < TIMESTAMP(?)
      AND (
        ${transfersConfig
          .map(() => `(traces.from_address = ? AND traces.to_address = ?)`)
          .join(' OR ')}
      )
    WHERE block_timestamp >= TIMESTAMP(?) AND block_timestamp < TIMESTAMP(?)
  `

  return { query, params }
}
