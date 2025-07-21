import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import type { AnalyzedContract } from '../analysis/AddressAnalyzer'
import { EMPTY_ANALYZED_CONTRACT, EMPTY_ANALYZED_EOA } from '../utils/testUtils'
import { processAnalysis } from './structureOutput'
import { sortByKeys } from './toDiscoveryOutput'

const emptyOutputMeta = {
  type: 'EOA',
  unverified: true,
  proxyType: 'EOA',
} as const

describe(processAnalysis.name, () => {
  const baseContract = {
    ...EMPTY_ANALYZED_CONTRACT,
    type: 'Contract' as const,
    isVerified: true,
    deploymentTimestamp: UnixTime(1234),
    deploymentBlockNumber: 9876,
    proxyType: 'immutable',
    ignoreInWatchMode: undefined,
  }

  const baseEOA = {
    ...EMPTY_ANALYZED_EOA,
  }

  const ADDRESS_A = ChainSpecificAddress(
    'eth:0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa',
  )
  const ADDRESS_B = ChainSpecificAddress(
    'eth:0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
  )
  const ADDRESS_C = ChainSpecificAddress(
    'eth:0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  )
  const ADDRESS_D = ChainSpecificAddress(
    'eth:0xDDdDddDdDdddDDddDDddDDDDdDdDDdDDdDDDDDDd',
  )
  const ADDRESS_E = ChainSpecificAddress(
    'eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  )

  const CONTRACT_A: AnalyzedContract = {
    ...baseContract,
    address: ADDRESS_A,
    name: 'A',
    isVerified: false,
  }

  const CONTRACT_B: AnalyzedContract = {
    ...baseContract,
    address: ADDRESS_B,
    name: 'B',
    values: { a: 1, b: 2 },
    errors: { c: 'error' },
    abis: {
      [ADDRESS_B.toString()]: [
        'function a() view returns (uin32)',
        'function b() view returns (uin32)',
        'function c() view returns (uin32)',
      ],
    },
  }

  const CONTRACT_C: AnalyzedContract = {
    ...baseContract,
    address: ADDRESS_C,
    name: 'C',
    proxyType: 'EIP1967 proxy',
    values: {
      $admin: ADDRESS_D,
      $implementation: ADDRESS_E,
      foo: 'foo',
      bar: 'bar',
    },
    abis: {
      [ADDRESS_C.toString()]: [],
      [ADDRESS_E.toString()]: [
        'function foo() view returns (string)',
        'function bar() view returns (string)',
      ],
    },
  }

  it('sorts EOAs', () => {
    const result = processAnalysis([
      { ...baseEOA, type: 'EOA', address: ADDRESS_B },
      { ...baseEOA, type: 'EOA', address: ADDRESS_A },
      { ...baseEOA, type: 'EOA', address: ADDRESS_C },
    ])

    expect(result).toEqual({
      entries: [
        { ...emptyOutputMeta, address: ADDRESS_A },
        { ...emptyOutputMeta, address: ADDRESS_B },
        { ...emptyOutputMeta, address: ADDRESS_C },
      ],
      abis: {},
    })
  })

  it('processes an unverified contract', () => {
    const result = processAnalysis([CONTRACT_A])

    expect(result).toEqual({
      entries: [
        {
          type: 'Contract',
          name: CONTRACT_A.name,
          address: ADDRESS_A,
          unverified: true,
          proxyType: CONTRACT_A.proxyType,
          sinceBlock: baseContract.deploymentBlockNumber,
          sinceTimestamp: baseContract.deploymentTimestamp,
        },
      ],
      abis: CONTRACT_A.abis,
    })
  })

  it('processes a verified contract with values and errors', () => {
    const result = processAnalysis([CONTRACT_B])

    expect(result).toEqual({
      entries: [
        {
          type: 'Contract',
          name: CONTRACT_B.name,
          address: ADDRESS_B,
          proxyType: CONTRACT_B.proxyType,
          sinceBlock: baseContract.deploymentBlockNumber,
          sinceTimestamp: baseContract.deploymentTimestamp,
          values: CONTRACT_B.values,
          errors: CONTRACT_B.errors,
        },
      ],
      abis: CONTRACT_B.abis,
    })
  })

  it('processes a proxy', () => {
    const result = processAnalysis([
      CONTRACT_C,
      { ...baseEOA, type: 'EOA', address: ADDRESS_D },
    ])

    expect(result).toEqual({
      entries: [
        {
          type: 'Contract',
          name: CONTRACT_C.name,
          address: ADDRESS_C,
          proxyType: CONTRACT_C.proxyType,
          sinceBlock: baseContract.deploymentBlockNumber,
          sinceTimestamp: baseContract.deploymentTimestamp,
          values: CONTRACT_C.values,
        },
        {
          ...emptyOutputMeta,
          address: ADDRESS_D,
        },
      ],
      abis: CONTRACT_C.abis,
    })
  })

  it('processes multiple contracts', function () {
    const result = processAnalysis([
      CONTRACT_A,
      CONTRACT_B,
      CONTRACT_C,
      {
        ...baseEOA,
        type: 'EOA',
        address: ADDRESS_D,
      },
    ])

    expect(result).toEqual({
      entries: [
        {
          type: 'Contract',
          address: ADDRESS_A,
          name: CONTRACT_A.name,
          unverified: true,
          proxyType: CONTRACT_A.proxyType,
          sinceBlock: baseContract.deploymentBlockNumber,
          sinceTimestamp: baseContract.deploymentTimestamp,
        },
        {
          type: 'Contract',
          address: ADDRESS_B,
          name: CONTRACT_B.name,
          proxyType: CONTRACT_B.proxyType,
          values: CONTRACT_B.values,
          errors: CONTRACT_B.errors,
          sinceBlock: baseContract.deploymentBlockNumber,
          sinceTimestamp: baseContract.deploymentTimestamp,
        },
        {
          type: 'Contract',
          address: ADDRESS_C,
          name: CONTRACT_C.name,
          proxyType: CONTRACT_C.proxyType,
          values: CONTRACT_C.values,
          sinceBlock: baseContract.deploymentBlockNumber,
          sinceTimestamp: baseContract.deploymentTimestamp,
        },
        {
          ...emptyOutputMeta,
          address: ADDRESS_D,
        },
      ],
      abis: {
        ...CONTRACT_A.abis,
        ...CONTRACT_B.abis,
        ...CONTRACT_C.abis,
      },
    })

    expect(JSON.stringify(result)).toMatchSnapshot(this)
  })

  it('field order does not matter', () => {
    // TODO: in the future it shouldn't
    const result1 = processAnalysis([
      {
        ...CONTRACT_B,
        values: { a: 1, b: 2, c: 3 },
        errors: { x: 'error', y: 'error', z: 'error' },
      },
    ])
    const result2 = processAnalysis([
      {
        ...CONTRACT_B,
        values: { c: 3, b: 2, a: 1 },
        errors: { z: 'error', y: 'error', x: 'error' },
      },
    ])

    expect(JSON.stringify(result1)).toEqual(JSON.stringify(result2))
  })
})

describe(sortByKeys.name, () => {
  it('sorts an object by keys', () => {
    const obj = {
      foo: 'foo',
      bar: 'bar',
    }

    expect(JSON.stringify(obj)).toEqual('{"foo":"foo","bar":"bar"}')
    expect(JSON.stringify(sortByKeys(obj))).toEqual('{"bar":"bar","foo":"foo"}')
  })
})
