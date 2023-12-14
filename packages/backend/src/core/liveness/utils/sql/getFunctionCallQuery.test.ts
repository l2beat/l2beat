import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getFunctionCallQuery } from './getFunctionCallQuery'

const ADDRESS_1 = EthereumAddress.random()
const ADDRESS_2 = EthereumAddress.random()
const SELECTOR_1 = '0x' + 'A'.repeat(8)
const SELECTOR_2 = '0x' + 'B'.repeat(8)
const FROM = UnixTime.fromDate(new Date('2021-01-01Z'))
const TO = UnixTime.fromDate(new Date('2021-01-02Z'))

const FUNCTION_CALLS = [
  {
    address: ADDRESS_1,
    selector: SELECTOR_1,
  },
  {
    address: ADDRESS_2,
    selector: SELECTOR_2,
  },
]

describe(getFunctionCallQuery.name, () => {
  it('returns valid SQL when sharpSubmissions are empty', () => {
    const { query, params } = getFunctionCallQuery(FUNCTION_CALLS, [], FROM, TO)

    expect(query).toEqual(`
    SELECT
      block_number,
      LEFT(input, 10) AS input,
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
      FROM.toDate().toISOString(),
      TO.toDate().toISOString(),
      ADDRESS_1.toLowerCase(),
      SELECTOR_1.toLowerCase() + '%',
      ADDRESS_2.toLowerCase(),
      SELECTOR_2.toLowerCase() + '%',
    ])
  })

  it('returns valid SQL when sharpSubmissions are not empty', () => {
    const ADDRESS_3 = EthereumAddress.random()
    const ADDRESS_4 = EthereumAddress.random()

    const SELECTOR_3 = '0x' + 'C'.repeat(8)
    const SELECTOR_4 = '0x' + 'D'.repeat(8)
    const sharpSubmissionsConfig = [
      {
        address: ADDRESS_3,
        selector: SELECTOR_3,
      },
      {
        address: ADDRESS_4,
        selector: SELECTOR_4,
      },
    ]
    const { query, params } = getFunctionCallQuery(
      FUNCTION_CALLS,
      sharpSubmissionsConfig,
      FROM,
      TO,
    )

    expect(query).toEqual(`
    SELECT
      block_number,
      CASE WHEN to_address IN (?,?) THEN input ELSE LEFT(input, 10) END AS input,
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
      ${Array.from({ length: 4 })
        .map(() => `(to_address = ? AND input LIKE ?)`)
        .join(' OR ')}
    )
  `)

    expect(params).toEqual([
      [ADDRESS_3.toLowerCase(), ADDRESS_4.toLowerCase()],
      FROM.toDate().toISOString(),
      TO.toDate().toISOString(),
      ADDRESS_1.toLowerCase(),
      SELECTOR_1.toLowerCase() + '%',
      ADDRESS_2.toLowerCase(),
      SELECTOR_2.toLowerCase() + '%',
      ADDRESS_3.toLowerCase(),
      SELECTOR_3.toLowerCase() + '%',
      ADDRESS_4.toLowerCase(),
      SELECTOR_4.toLowerCase() + '%',
    ])
  })
})
