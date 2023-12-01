import { Query } from '@google-cloud/bigquery'
import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

export function getFunctionCallQuery(
  functionCallsConfig: {
    address: EthereumAddress
    selector: string
    programHash?: string
  }[],
  from: UnixTime,
  to: UnixTime,
): Query {
  const functionCallsWithProgramHash = functionCallsConfig.filter(
    (c) => c.programHash,
  )
  const params = [
    ...functionCallsWithProgramHash.map((c) => c.address.toLowerCase()),
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
      ${
        functionCallsWithProgramHash.length > 0
          ? `CASE
        WHEN to_address IN (${functionCallsWithProgramHash
          .map(() => ' ? ')
          .join(',')}) THEN input
        ELSE LEFT(input, 10)
      END AS input,`
          : `LEFT(input, 10) AS input,`
      }
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
