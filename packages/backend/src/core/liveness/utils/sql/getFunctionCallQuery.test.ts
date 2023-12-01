import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getFunctionCallQuery } from './getFunctionCallQuery'

describe(getFunctionCallQuery.name, () => {
  it('should return valid SQL query', () => {
    const ADDRESS_1 = EthereumAddress.random()
    const ADDRESS_2 = EthereumAddress.random()
    const query = getFunctionCallQuery(
      [
        {
          address: ADDRESS_1,
          selector: '0x' + 'A'.repeat(8),
        },
        {
          address: ADDRESS_2,
          selector: '0x' + 'B'.repeat(8),
        },
      ],
      UnixTime.fromDate(new Date('2021-01-01Z')),
      UnixTime.fromDate(new Date('2021-01-02Z')),
    )

    expect(query.query).toEqual(`
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
      ${Array.from({ length: 2 })
        .map(() => `(to_address = ? AND input LIKE ?)`)
        .join(' OR ')}
    )
  `)
    expect(query.params).toEqual([
      new Date('2021-01-01Z').toISOString(),
      new Date('2021-01-02Z').toISOString(),
      ADDRESS_1.toLowerCase(),
      '0x' + 'a'.repeat(8) + '%',
      ADDRESS_2.toLowerCase(),
      '0x' + 'b'.repeat(8) + '%',
    ])
  })

  it('should return valid SQL query when configs with program hashes', () => {
    const ADDRESS_1 = EthereumAddress.random()
    const ADDRESS_2 = EthereumAddress.random()
    const ADDRESS_3 = EthereumAddress.random()
    const programHash1 = '0x' + 'C'.repeat(8)
    const programHash2 = '0x' + 'D'.repeat(8)
    const query = getFunctionCallQuery(
      [
        {
          address: ADDRESS_1,
          selector: '0x' + 'A'.repeat(8),
        },
        {
          address: ADDRESS_2,
          selector: '0x' + 'B'.repeat(8),
          programHash: programHash1,
        },
        {
          address: ADDRESS_3,
          selector: '0x' + 'C'.repeat(8),
          programHash: programHash2,
        },
      ],
      UnixTime.fromDate(new Date('2021-01-01Z')),
      UnixTime.fromDate(new Date('2021-01-02Z')),
    )
    console.log(query)
    expect(query.query).toEqual(`
    SELECT
      block_number,
      CASE
        WHEN to_address IN (${Array.from({ length: 2 })
          .map(() => ' ? ')
          .join(',')}) THEN input
        ELSE LEFT(input, 10)
      END AS input,
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
      ${Array.from({ length: 3 })
        .map(() => `(to_address = ? AND input LIKE ?)`)
        .join(' OR ')}
    )
  `)
    expect(query.params).toEqual([
      ADDRESS_2.toLowerCase(),
      ADDRESS_3.toLowerCase(),
      new Date('2021-01-01Z').toISOString(),
      new Date('2021-01-02Z').toISOString(),
      ADDRESS_1.toLowerCase(),
      '0x' + 'a'.repeat(8) + '%',
      ADDRESS_2.toLowerCase(),
      '0x' + 'b'.repeat(8) + '%',
      ADDRESS_3.toLowerCase(),
      '0x' + 'c'.repeat(8) + '%',
    ])
  })
})
