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
  ]

  const query = `
    SELECT
      block_number,
      from_address,
      to_address,
      block_timestamp,
      transaction_hash
    FROM
      bigquery-public-data.crypto_ethereum.traces
    WHERE call_type = 'call'
    AND status = 1
    AND block_timestamp >= TIMESTAMP(?)
    AND block_timestamp < TIMESTAMP(?)
    AND (
      ${transfersConfig
        .map(() => `(from_address = ? AND to_address = ?)`)
        .join(' OR ')}
    )
  `

  return { query, params }
}
