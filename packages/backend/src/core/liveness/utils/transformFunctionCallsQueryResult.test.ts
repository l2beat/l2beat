import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { readFileSync } from 'fs'

import { LivenessRecord } from '../../../peripherals/database/LivenessRepository'
import {
  LivenessFunctionCall,
  LivenessSharpSubmission,
  makeLivenessFunctionCall,
  makeLivenessSharpSubmissions,
} from '../types/LivenessConfig'
import { BigQueryFunctionCallsResult } from '../types/model'
import { transformFunctionCallsQueryResult } from './transformFunctionCallsQueryResult'

const ADDRESS_1 = EthereumAddress.random()
const SELECTOR_1 = '0x095e4'
const ADDRESS_2 = EthereumAddress.random()
const SELECTOR_2 = '0x915d9'
const SINCE_TIMESTAMP = UnixTime.now()

const timestamp = UnixTime.fromDate(new Date('2022-01-01T01:00:00Z'))
const block = 1
const txHashes = [
  '0x095e4e9ee709e353ad7849cf30e4dc19',
  '0x915d9ed63e196d8c612aad5d6f5cd1ba',
  '0x90d5e81b40d6a6fa6f34b3dc67d3fce6',
]

const inputFile = `src/test/sharpVerifierInput.txt`
const sharpInput = readFileSync(inputFile, 'utf-8')
const paradexProgramHash =
  '3258367057337572248818716706664617507069572185152472699066582725377748079373'

describe(transformFunctionCallsQueryResult.name, () => {
  it('should transform results', () => {
    const functionCalls: LivenessFunctionCall[] = [
      makeLivenessFunctionCall({
        formula: 'functionCall',
        projectId: ProjectId('project1'),
        address: ADDRESS_1,
        selector: SELECTOR_1,
        type: 'STATE',
        sinceTimestamp: SINCE_TIMESTAMP,
      }),
      makeLivenessFunctionCall({
        formula: 'functionCall',
        projectId: ProjectId('project1'),
        address: ADDRESS_2,
        selector: SELECTOR_2,
        type: 'DA',
        sinceTimestamp: SINCE_TIMESTAMP,
      }),
    ]

    const sharpSubmissions: LivenessSharpSubmission[] = [
      makeLivenessSharpSubmissions({
        formula: 'sharpSubmission',
        projectId: ProjectId('project2'),
        type: 'STATE',
        sinceTimestamp: SINCE_TIMESTAMP,
        programHashes: [paradexProgramHash],
      }),
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
        input: sharpInput,
        to_address: sharpSubmissions[0].address,
      },
    ]
    const expected: LivenessRecord[] = [
      {
        txHash: txHashes[0],
        livenessId: functionCalls[0].id,
        blockNumber: block,
        timestamp: timestamp,
      },
      {
        txHash: txHashes[1],
        livenessId: functionCalls[1].id,
        blockNumber: block,
        timestamp: timestamp,
      },
      {
        txHash: txHashes[2],
        livenessId: sharpSubmissions[0].id,
        blockNumber: block,
        timestamp: timestamp,
      },
    ]
    const result = transformFunctionCallsQueryResult(
      functionCalls,
      sharpSubmissions,
      queryResults,
    )

    expect(result).toEqual(expected)
  })

  it('throws when there is no matching configuration', () => {
    const functionCalls: LivenessFunctionCall[] = [
      makeLivenessFunctionCall({
        formula: 'functionCall',
        projectId: ProjectId('project1'),
        address: ADDRESS_1,
        selector: SELECTOR_1,
        type: 'STATE',
        sinceTimestamp: SINCE_TIMESTAMP,
      }),
    ]

    const queryResults: BigQueryFunctionCallsResult = [
      {
        to_address: EthereumAddress.random(),
        input: 'random-string',
        transaction_hash: txHashes[0],
        block_number: block,
        block_timestamp: timestamp,
      },
    ]

    expect(() =>
      transformFunctionCallsQueryResult(functionCalls, [], queryResults),
    ).toThrow('There should be at least one matching config')
  })

  it('includes only configurations which program hashes were proven', () => {
    const sharpSubmissions: LivenessSharpSubmission[] = [
      makeLivenessSharpSubmissions({
        formula: 'sharpSubmission',
        projectId: ProjectId('project1'),
        type: 'STATE',
        sinceTimestamp: SINCE_TIMESTAMP,
        programHashes: [paradexProgramHash],
      }),
      makeLivenessSharpSubmissions({
        formula: 'sharpSubmission',
        projectId: ProjectId('project2'),
        type: 'STATE',
        sinceTimestamp: SINCE_TIMESTAMP,
        programHashes: [paradexProgramHash + 'wrong-rest-part-of-hash'],
      }),
    ]

    const queryResults: BigQueryFunctionCallsResult = [
      {
        to_address: sharpSubmissions[0].address,
        input: sharpInput,
        transaction_hash: txHashes[0],
        block_number: block,
        block_timestamp: timestamp,
      },
    ]

    const expected: LivenessRecord[] = [
      {
        txHash: txHashes[0],
        livenessId: sharpSubmissions[0].id,
        blockNumber: block,
        timestamp: timestamp,
      },
    ]

    const result = transformFunctionCallsQueryResult(
      [],
      sharpSubmissions,
      queryResults,
    )

    expect(result).toEqual(expected)
  })
})
