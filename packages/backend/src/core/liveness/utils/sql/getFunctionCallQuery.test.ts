import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getFunctionCallQuery } from './getFunctionCallQuery'

const ADDRESS_1 = EthereumAddress.random()
const ADDRESS_2 = EthereumAddress.random()
const SELECTOR_1 = '0x' + 'A'.repeat(8)
const SELECTOR_2 = '0x' + 'B'.repeat(8)
const FROM = UnixTime.fromDate(new Date('2021-01-01Z'))
const TO = UnixTime.fromDate(new Date('2021-01-02Z'))

const CONFIGURATIONS = [
  {
    address: ADDRESS_1,
    selector: SELECTOR_1,
    getFullInput: false,
  },
  {
    address: ADDRESS_2,
    selector: SELECTOR_2,
    getFullInput: true,
  },
]

describe(getFunctionCallQuery.name, () => {
  it('returns valid SQL', () => {
    const { query, params, types } = getFunctionCallQuery(
      CONFIGURATIONS,
      FROM,
      TO,
    )

    expect(query).toEqual(`
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
      ${Array.from({ length: 2 })
        .map(() => `(to_address = ? AND input LIKE ?)`)
        .join(' OR ')}
    )
  `)

    expect(params).toEqual([
      [ADDRESS_2.toLowerCase()],
      FROM.toDate().toISOString(),
      TO.toDate().toISOString(),
      ADDRESS_1.toLowerCase(),
      SELECTOR_1.toLowerCase() + '%',
      ADDRESS_2.toLowerCase(),
      SELECTOR_2.toLowerCase() + '%',
    ])

    // @ts-expect-error BigQuery types are wrong
    expect(types).toEqual([
      ['STRING'],
      'STRING',
      'STRING',
      'STRING',
      'STRING',
      'STRING',
      'STRING',
    ])
  })
})
