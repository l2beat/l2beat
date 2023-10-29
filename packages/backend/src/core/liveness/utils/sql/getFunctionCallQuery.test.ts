import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { LivenessFunctionCall } from '../../types/LivenessConfig'
import { getFunctionCallQuery } from './getFunctionCallQuery'

describe(getFunctionCallQuery.name, () => {
  it('should return valid SQL query', () => {
    const config: LivenessFunctionCall[] = [
      {
        projectId: ProjectId('project-1'), // irrelevant
        address: EthereumAddress.random(),
        selector: '0x12345678',
        type: 'DA', // irrelevant
        sinceTimestamp: new UnixTime(0), // irrelevant
      },
      {
        projectId: ProjectId('project-2'), // irrelevant
        address: EthereumAddress.random(),
        selector: '0x23456789',
        type: 'DA', // irrelevant
        sinceTimestamp: new UnixTime(0), // irrelevant
      },
    ]
    const startTimestamp = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))
    const endTimestamp = UnixTime.fromDate(new Date('2022-01-02T00:00:00Z'))
    const expectedQuery = [
      'SELECT',
      'block_number,',
      'LEFT(input, 10) AS input,',
      'to_address,',
      'block_timestamp,',
      'transaction_hash,',
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
      `(to_address = LOWER('${config[0].address.toLocaleLowerCase()}')`,
      `AND input LIKE '${config[0].selector.toLocaleLowerCase()}%')`,
      'OR',
      `(to_address = LOWER('${config[1].address.toLocaleLowerCase()}')`,
      `AND input LIKE '${config[1].selector.toLocaleLowerCase()}%')`,
      ')',
      'ORDER BY',
      'block_timestamp ASC;',
    ].join('\n')
    const result = getFunctionCallQuery(config, startTimestamp, endTimestamp)
    expect(result).toEqual(expectedQuery)
  })
})
