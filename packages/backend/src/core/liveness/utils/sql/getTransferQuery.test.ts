import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getTransferQuery } from './getTransferQuery'

describe('getTransferQuery', () => {
  it('should return valid SQL query', () => {
    const senders = [EthereumAddress.random(), EthereumAddress.random()]
    const receivers = [EthereumAddress.random(), EthereumAddress.random()]
    const startTimestamp = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))
    const endTimestamp = UnixTime.fromDate(new Date('2022-01-02T00:00:00Z'))

    const expectedQuery = [
      'SELECT',
      'block_number,',
      'from_address,',
      'to_address,',
      'block_timestamp,',
      'transaction_hash,',
      'FROM',
      'bigquery-public-data.crypto_ethereum.traces',
      'WHERE',
      "call_type = 'call'",
      'AND status = 1',
      `AND block_timestamp >= TIMESTAMP('${startTimestamp
        .toDate()
        .toISOString()}')`,
      `AND block_timestamp < TIMESTAMP('${endTimestamp
        .toDate()
        .toISOString()}')`,
      'AND ',
      '(',
      `(from_address = LOWER('${senders[0].toLocaleLowerCase()}')`,
      `AND to_address = LOWER('${receivers[0].toLocaleLowerCase()}'))`,
      'OR',
      `(from_address = LOWER('${senders[1].toLocaleLowerCase()}')`,
      `AND to_address = LOWER('${receivers[1].toLocaleLowerCase()}'))`,
      ')',
      'ORDER BY ',
      'block_timestamp ASC;',
    ].join('\n')

    const result = getTransferQuery(
      senders,
      receivers,
      startTimestamp,
      endTimestamp,
    )
    expect(result).toEqual(expectedQuery)
  })
})
