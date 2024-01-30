import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getTransferQuery } from './getTransferQuery'

describe(getTransferQuery.name, () => {
  it('should return valid SQL query', () => {
    const ADDRESS_1 = EthereumAddress.random()
    const ADDRESS_2 = EthereumAddress.random()
    const ADDRESS_3 = EthereumAddress.random()
    const ADDRESS_4 = EthereumAddress.random()
    const query = getTransferQuery(
      [
        { from: ADDRESS_1, to: ADDRESS_2 },
        { from: ADDRESS_3, to: ADDRESS_4 },
      ],
      UnixTime.fromDate(new Date('2021-01-01Z')),
      UnixTime.fromDate(new Date('2021-01-02Z')),
    )

    expect(query.query).toEqual(`
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
      ${Array.from({ length: 2 })
        .map(() => `(from_address = ? AND to_address = ?)`)
        .join(' OR ')}
    )
  `)
    expect(query.params).toEqual([
      new Date('2021-01-01Z').toISOString(),
      new Date('2021-01-02Z').toISOString(),
      ADDRESS_1.toLowerCase(),
      ADDRESS_2.toLowerCase(),
      ADDRESS_3.toLowerCase(),
      ADDRESS_4.toLowerCase(),
    ])
  })
})
