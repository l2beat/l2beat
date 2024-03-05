import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { readFileSync } from 'fs'

import {
  BigQueryFunctionCallResult,
  ParsedBigQueryFunctionCallResult,
} from '../types/model'
import {
  TrackedTxFunctionCall,
  TrackedTxSharpSubmission,
} from '../types/TrackedTxsConfig'
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
    const functionCalls: TrackedTxFunctionCall[] = [
      {
        formula: 'functionCall',
        projectId: ProjectId('project1'),
        address: ADDRESS_1,
        selector: SELECTOR_1,
        sinceTimestamp: SINCE_TIMESTAMP,
        uses: [],
      },
      {
        formula: 'functionCall',
        projectId: ProjectId('project1'),
        address: ADDRESS_2,
        selector: SELECTOR_2,
        sinceTimestamp: SINCE_TIMESTAMP,
        uses: [],
      },
    ]

    const sharpSubmissions: TrackedTxSharpSubmission[] = [
      {
        formula: 'sharpSubmission',
        projectId: ProjectId('project2'),
        sinceTimestamp: SINCE_TIMESTAMP,
        programHashes: [paradexProgramHash],
        address: EthereumAddress.random(),
        selector: '0x9b3b76cc',
        uses: [],
      },
    ]

    const queryResults: BigQueryFunctionCallResult[] = [
      {
        hash: txHashes[0],
        block_number: block,
        block_timestamp: timestamp,
        input: SELECTOR_1,
        to_address: ADDRESS_1,
        gas_price: 100,
        receipt_gas_used: 5000,
      },
      {
        hash: txHashes[1],
        block_number: block,
        block_timestamp: timestamp,
        input: SELECTOR_2,
        to_address: ADDRESS_2,
        gas_price: 1000,
        receipt_gas_used: 20,
      },
      {
        hash: txHashes[2],
        block_number: block,
        block_timestamp: timestamp,
        input: sharpInput,
        to_address: sharpSubmissions[0].address,
        gas_price: 2031,
        receipt_gas_used: 2050,
      },
    ]
    const expected: ParsedBigQueryFunctionCallResult[] = [
      {
        type: 'functionCall',
        hash: txHashes[0],
        blockNumber: block,
        blockTimestamp: timestamp,
        toAddress: ADDRESS_1,
        gasPrice: 100,
        gasUsed: 5000,
        input: SELECTOR_1,
      },
      {
        type: 'functionCall',
        hash: txHashes[1],
        blockNumber: block,
        blockTimestamp: timestamp,
        toAddress: ADDRESS_2,
        gasPrice: 1000,
        gasUsed: 20,
        input: SELECTOR_2,
      },
      {
        type: 'functionCall',
        hash: txHashes[2],
        blockNumber: block,
        blockTimestamp: timestamp,
        toAddress: sharpSubmissions[0].address,
        gasPrice: 2031,
        gasUsed: 2050,
        input: sharpInput,
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
    const functionCalls: TrackedTxFunctionCall[] = [
      {
        formula: 'functionCall',
        projectId: ProjectId('project1'),
        address: ADDRESS_1,
        selector: SELECTOR_1,
        sinceTimestamp: SINCE_TIMESTAMP,
        uses: [],
      },
    ]

    const queryResults: BigQueryFunctionCallResult[] = [
      {
        hash: txHashes[0],
        to_address: EthereumAddress.random(),
        input: 'random-string',
        block_number: block,
        block_timestamp: timestamp,
        gas_price: 25,
        receipt_gas_used: 100,
      },
    ]

    expect(() =>
      transformFunctionCallsQueryResult(functionCalls, [], queryResults),
    ).toThrow('There should be at least one matching config')
  })

  it('includes only configurations which program hashes were proven', () => {
    const sharpSubmissions: TrackedTxSharpSubmission[] = [
      {
        formula: 'sharpSubmission',
        projectId: ProjectId('project1'),
        sinceTimestamp: SINCE_TIMESTAMP,
        programHashes: [paradexProgramHash],
        address: EthereumAddress.random(),
        selector: '0x9b3b76cc',
        uses: [],
      },
      {
        formula: 'sharpSubmission',
        projectId: ProjectId('project2'),
        sinceTimestamp: SINCE_TIMESTAMP,
        programHashes: [paradexProgramHash + 'wrong-rest-part-of-hash'],
        address: EthereumAddress.random(),
        selector: 'random-selector-2',
        uses: [],
      },
    ]

    const queryResults: BigQueryFunctionCallResult[] = [
      {
        hash: txHashes[0],
        to_address: sharpSubmissions[0].address,
        input: sharpInput,
        block_number: block,
        block_timestamp: timestamp,
        gas_price: 1000,
        receipt_gas_used: 20,
      },
    ]

    const expected: ParsedBigQueryFunctionCallResult[] = [
      {
        type: 'functionCall',
        hash: txHashes[0],
        blockNumber: block,
        blockTimestamp: timestamp,
        toAddress: sharpSubmissions[0].address,
        gasPrice: 1000,
        gasUsed: 20,
        input: sharpInput,
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
