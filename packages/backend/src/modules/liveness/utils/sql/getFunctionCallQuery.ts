import { Query } from '@google-cloud/bigquery'
import { QueryParamTypes } from '@google-cloud/bigquery/build/src/bigquery'
import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

export function getFunctionCallQuery(
  configs: {
    address: EthereumAddress
    selector: string
    getFullInput: boolean
  }[],
  from: UnixTime,
  to: UnixTime,
): Query {
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
  ]

  const query = `
    SELECT
      block_number,
      CASE WHEN to_address IN UNNEST(?) THEN input ELSE LEFT(input, 10) END AS input,
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
      ${configs.map(() => `(to_address = ? AND input LIKE ?)`).join(' OR ')}
    )
  `

  // @ts-expect-error BigQuery types are wrong
  const types: QueryParamTypes = [
    ['STRING'],
    'STRING',
    'STRING',
    ...configs.flatMap(() => ['STRING', 'STRING']),
  ]

  return { query, params, types }
}
