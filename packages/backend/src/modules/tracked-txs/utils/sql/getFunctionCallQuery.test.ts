import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { range } from 'lodash'

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
    const { query, params, types, limitInGb } = getFunctionCallQuery(
      CONFIGURATIONS,
      FROM,
      TO,
    )

    expect(query).toEqual(`
    SELECT
      txs.hash,
      traces.to_address,
      txs.block_number,
      txs.block_timestamp,
      CASE
        WHEN traces.to_address IN UNNEST(?) THEN traces.input
      ELSE
      LEFT(traces.input, 10)
    END
      AS input,
    FROM
      bigquery-public-data.crypto_ethereum.transactions AS txs
    JOIN
      bigquery-public-data.crypto_ethereum.traces AS traces
    ON
      txs.hash = traces.transaction_hash
      AND traces.call_type = 'call'
      AND traces.status = 1
      AND traces.block_timestamp >= TIMESTAMP(?)
      AND traces.block_timestamp < TIMESTAMP(?)
      AND (
        ${range(2)
          .map(() => `(traces.to_address = ? AND traces.input LIKE ?)`)
          .join(' OR ')}
      )
    WHERE
      txs.block_timestamp >= TIMESTAMP(?)
      AND txs.block_timestamp < TIMESTAMP(?)
  `)

    expect(params).toEqual([
      [ADDRESS_2.toLowerCase()],
      FROM.toDate().toISOString(),
      TO.toDate().toISOString(),
      ADDRESS_1.toLowerCase(),
      SELECTOR_1.toLowerCase() + '%',
      ADDRESS_2.toLowerCase(),
      SELECTOR_2.toLowerCase() + '%',
      FROM.toDate().toISOString(),
      TO.toDate().toISOString(),
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
      'STRING',
      'STRING',
    ])

    expect(limitInGb).toEqual(8)
  })
})
