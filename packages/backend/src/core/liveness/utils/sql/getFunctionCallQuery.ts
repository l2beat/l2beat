import { Query } from '@google-cloud/bigquery'
import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

export function getFunctionCallQuery(
  functionCalls: { address: EthereumAddress; selector: string }[],
  sharpSubmissions: { address: EthereumAddress; selector: string }[],
  from: UnixTime,
  to: UnixTime,
): Query {
  let params: (string | string[])[] = [
    from.toDate().toISOString(),
    to.toDate().toISOString(),
    ...functionCalls.flatMap((c) => [
      c.address.toLowerCase(),
      c.selector.toLowerCase() + '%',
    ]),
    ...sharpSubmissions.flatMap((c) => [
      c.address.toLowerCase(),
      c.selector.toLowerCase() + '%',
    ]),
  ]

  if (sharpSubmissions.length > 0) {
    params = [sharpSubmissions.map((c) => c.address.toLowerCase()), ...params]
  }

  const query = `
    SELECT
      block_number,
      ${
        sharpSubmissions.length > 0
          ? `CASE WHEN to_address IN (${sharpSubmissions
              .map(() => '?')
              .join(',')}) THEN input ELSE LEFT(input, 10) END AS input,`
          : `LEFT(input, 10) AS input,`
      }
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
      ${[...functionCalls, ...sharpSubmissions]
        .map(() => `(to_address = ? AND input LIKE ?)`)
        .join(' OR ')}
    )
  `

  return { query, params }
}
