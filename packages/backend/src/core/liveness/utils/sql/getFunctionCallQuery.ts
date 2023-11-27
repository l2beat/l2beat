import { Query } from '@google-cloud/bigquery'
import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

export function getFunctionCallQuery(
  functionCallsConfig: { address: EthereumAddress; selector: string }[],
  from: UnixTime,
  to: UnixTime,
): Query {
  const params = [
    from.toDate().toISOString(),
    to.toDate().toISOString(),
    ...functionCallsConfig.flatMap((c) => [
      c.address.toLowerCase(),
      c.selector.toLowerCase() + '%',
    ]),
  ]

  const query = `
    SELECT
      block_number,
      LEFT(input, 10) AS input,
      to_address,
      block_timestamp,
      transaction_hash,
    FROM
      bigquery-public-data.crypto_ethereum.traces
    WHERE call_type = 'call'
    AND status = 1
    AND block_timestamp >= TIMESTAMP(?)
    AND block_timestamp < TIMESTAMP(?)
    AND (
      ${functionCallsConfig
        .map(() => `(to_address = ? AND input LIKE ?)`)
        .join(' OR ')}
    )
  `

  return { query, params }
}
