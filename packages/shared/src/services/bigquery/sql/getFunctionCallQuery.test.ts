import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getFunctionCallQuery } from './getFunctionCallQuery'

describe('getMethodQuery', () => {
  it('should return valid SQL query', () => {
    const receivers = [EthereumAddress.random(), EthereumAddress.random()]
    const methodsIds = ['0xabcdef', '0x123456']
    const startTimestamp = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))
    const endTimestamp = UnixTime.fromDate(new Date('2022-01-02T00:00:00Z'))
    const expectedQuery = [
      'SELECT',
      'block_number',
      'input',
      'to_address',
      'block_timestamp',
      'transaction_hash',
      'FROM',
      'bigquery-public-data.crypto_ethereum.traces',
      'WHERE',
      "call_type = 'call'",
      'AND status = 1',
      `AND block_timestamp >= TIMESTAMP("${startTimestamp
        .toDate()
        .toISOString()}")`,
      `AND block_timestamp < TIMESTAMP("${endTimestamp
        .toDate()
        .toISOString()}")`,
      'AND',
      '(',
      `(to_address = LOWER('${receivers[0].toLocaleLowerCase()}')`,
      `AND input LIKE '${methodsIds[0].toLocaleLowerCase()}%')`,
      'OR',
      `(to_address = LOWER('${receivers[1].toLocaleLowerCase()}')`,
      `AND input LIKE '${methodsIds[1].toLocaleLowerCase()}%')`,
      ')',
      'ORDER BY',
      'block_timestamp ASC;',
    ].join('\n')
    const result = getFunctionCallQuery(
      receivers,
      methodsIds,
      startTimestamp,
      endTimestamp,
    )
    expect(result).toEqual(expectedQuery)
  })
})
