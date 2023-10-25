import { BigQueryTransfersResult } from '@l2beat/shared'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { LivenessRecord } from '../../../peripherals/database/LivenessRepository'
import { LivenessTransfer } from '../types/LivenessConfig'
import { transformTransfersQueryResult } from './transformTransfersQueryResult'

describe(transformTransfersQueryResult.name, () => {
  it('should transform results', () => {
    const ADDRESS_1 = EthereumAddress.random()
    const ADDRESS_2 = EthereumAddress.random()
    const ADDRESS_3 = EthereumAddress.random()
    const ADDRESS_4 = EthereumAddress.random()
    const ADDRESS_5 = EthereumAddress.random()
    const ADDRESS_6 = EthereumAddress.random()
    const sinceTimestamp = UnixTime.now()

    const config: LivenessTransfer[] = [
      {
        projectId: ProjectId('project1'),
        from: ADDRESS_1,
        to: ADDRESS_2,
        type: 'STATE',
        sinceTimestamp,
      },
      {
        projectId: ProjectId('project1'),
        from: ADDRESS_3,
        to: ADDRESS_4,
        type: 'DA',
        sinceTimestamp,
      },
      {
        projectId: ProjectId('project2'),
        from: ADDRESS_5,
        to: ADDRESS_6,
        type: 'STATE',
        sinceTimestamp,
      },
    ]
    const queryResults: BigQueryTransfersResult = [
      {
        transaction_hash: '0x095e4e9ee709e353ad7849cf30e4dc19',
        block_number: 1,
        block_timestamp: UnixTime.fromDate(new Date('2022-01-01T01:00:00Z')),
        from_address: ADDRESS_1,
        to_address: ADDRESS_2,
      },
      {
        transaction_hash: '0x915d9ed63e196d8c612aad5d6f5cd1ba',
        block_number: 2,
        block_timestamp: UnixTime.fromDate(new Date('2022-01-01T02:00:00Z')),
        from_address: ADDRESS_3,
        to_address: ADDRESS_4,
      },
      {
        transaction_hash: '0x90d5e81b40d6a6fa6f34b3dc67d3fce6',
        block_number: 3,
        block_timestamp: UnixTime.fromDate(new Date('2022-01-01T03:00:00Z')),
        from_address: ADDRESS_5,
        to_address: ADDRESS_6,
      },
    ]
    const expected: LivenessRecord[] = [
      {
        projectId: ProjectId('project1'),
        blockNumber: 1,
        timestamp: UnixTime.fromDate(new Date('2022-01-01T01:00:00Z')),
        txHash: '0x095e4e9ee709e353ad7849cf30e4dc19',
        type: 'STATE',
      },
      {
        projectId: ProjectId('project1'),
        blockNumber: 2,
        timestamp: UnixTime.fromDate(new Date('2022-01-01T02:00:00Z')),
        txHash: '0x915d9ed63e196d8c612aad5d6f5cd1ba',
        type: 'DA',
      },
      {
        projectId: ProjectId('project2'),
        blockNumber: 3,
        timestamp: UnixTime.fromDate(new Date('2022-01-01T03:00:00Z')),
        txHash: '0x90d5e81b40d6a6fa6f34b3dc67d3fce6',
        type: 'STATE',
      },
    ]

    expect(transformTransfersQueryResult(config, queryResults)).toEqual(
      expected,
    )
  })
})
