import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { LivenessTransfer } from '../../types/LivenessConfig'
import { getTransferQuery } from './getTransferQuery'

describe('getTransferQuery', () => {
  it('should return valid SQL query', () => {
    const config: LivenessTransfer[] = [
      {
        projectId: ProjectId('project-1'), // irrelevant
        from: EthereumAddress.random(),
        to: EthereumAddress.random(),
        type: 'DA', // irrelevant
        sinceTimestamp: new UnixTime(0), // irrelevant
      },
      {
        projectId: ProjectId('project-2'), // irrelevant
        from: EthereumAddress.random(),
        to: EthereumAddress.random(),
        type: 'DA', // irrelevant
        sinceTimestamp: new UnixTime(0), // irrelevant
      },
    ]
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
      `(from_address = LOWER('${config[0].from.toLocaleLowerCase()}')`,
      `AND to_address = LOWER('${config[0].to.toLocaleLowerCase()}'))`,
      'OR',
      `(from_address = LOWER('${config[1].from.toLocaleLowerCase()}')`,
      `AND to_address = LOWER('${config[1].to.toLocaleLowerCase()}'))`,
      ')',
      'ORDER BY ',
      'block_timestamp ASC;',
    ].join('\n')

    const result = getTransferQuery(config, startTimestamp, endTimestamp)
    expect(result).toEqual(expectedQuery)
  })
})
