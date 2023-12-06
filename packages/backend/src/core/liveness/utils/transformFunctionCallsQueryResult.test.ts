import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { LivenessRecord } from '../../../peripherals/database/LivenessRepository'
import {
  LivenessFunctionCall,
  makeLivenessFunctionCall,
} from '../types/LivenessConfig'
import { BigQueryFunctionCallsResult } from '../types/model'
import { transformFunctionCallsQueryResult } from './transformFunctionCallsQueryResult'

describe(transformFunctionCallsQueryResult.name, () => {
  it('should transform results', () => {
    const ADDRESS_1 = EthereumAddress.random()
    const SELECTOR_1 = '0x095e4'
    const ADDRESS_2 = EthereumAddress.random()
    const SELECTOR_2 = '0x915d9'
    const ADDRESS_3 = EthereumAddress.random()
    const SELECTOR_3 = '0x90d5e'
    const sinceTimestamp = UnixTime.now()

    const config: LivenessFunctionCall[] = [
      makeLivenessFunctionCall({
        formula: 'functionCall',
        projectId: ProjectId('project1'),
        address: ADDRESS_1,
        selector: SELECTOR_1,
        type: 'STATE',
        sinceTimestamp,
      }),
      makeLivenessFunctionCall({
        formula: 'functionCall',
        projectId: ProjectId('project1'),
        address: ADDRESS_2,
        selector: SELECTOR_2,
        type: 'DA',
        sinceTimestamp,
      }),
      makeLivenessFunctionCall({
        formula: 'functionCall',
        projectId: ProjectId('project2'),
        address: ADDRESS_3,
        selector: SELECTOR_3,
        type: 'STATE',
        sinceTimestamp,
      }),
    ]

    const timestamp = UnixTime.fromDate(new Date('2022-01-01T01:00:00Z'))
    const block = 1
    const txHashes = [
      '0x095e4e9ee709e353ad7849cf30e4dc19',
      '0x915d9ed63e196d8c612aad5d6f5cd1ba',
      '0x90d5e81b40d6a6fa6f34b3dc67d3fce6',
    ]

    const queryResults: BigQueryFunctionCallsResult = [
      {
        transaction_hash: txHashes[0],
        block_number: block,
        block_timestamp: timestamp,
        input: SELECTOR_1,
        to_address: ADDRESS_1,
      },
      {
        transaction_hash: txHashes[1],
        block_number: block,
        block_timestamp: timestamp,
        input: SELECTOR_2,
        to_address: ADDRESS_2,
      },
      {
        transaction_hash: txHashes[2],
        block_number: block,
        block_timestamp: timestamp,
        input: SELECTOR_3,
        to_address: ADDRESS_3,
      },
    ]
    const expected: LivenessRecord[] = [
      {
        txHash: txHashes[0],
        livenessId: config[0].id,
        blockNumber: block,
        timestamp: timestamp,
      },
      {
        txHash: txHashes[1],
        livenessId: config[1].id,
        blockNumber: block,
        timestamp: timestamp,
      },
      {
        txHash: txHashes[2],
        livenessId: config[2].id,
        blockNumber: block,
        timestamp: timestamp,
      },
    ]

    expect(transformFunctionCallsQueryResult(config, queryResults)).toEqual(
      expected,
    )
  })
})
