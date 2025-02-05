import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import type { Meta } from '@l2beat/discovery-types'
import type { AnalyzedContract } from '../analysis/AddressAnalyzer'
import { EMPTY_ANALYZED_CONTRACT } from '../utils/testUtils'
import { processAnalysis, sortByKeys } from './toDiscoveryOutput'

const emptyOutputMeta: Meta = {
  description: undefined,
  issuedPermissions: undefined,
  receivedPermissions: undefined,
  directlyReceivedPermissions: undefined,
  categories: undefined,
  types: undefined,
  severity: undefined,
}

describe(processAnalysis.name, () => {
  const base = {
    ...EMPTY_ANALYZED_CONTRACT,
    type: 'Contract' as const,
    derivedName: undefined,
    isVerified: true,
    deploymentTimestamp: new UnixTime(1234),
    deploymentBlockNumber: 9876,
    proxyType: 'immutable',
    ignoreInWatchMode: undefined,
  }

  const ADDRESS_A = EthereumAddress(
    '0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa',
  )
  const ADDRESS_B = EthereumAddress(
    '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
  )
  const ADDRESS_C = EthereumAddress(
    '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  )
  const ADDRESS_D = EthereumAddress(
    '0xDDdDddDdDdddDDddDDddDDDDdDdDDdDDdDDDDDDd',
  )
  const ADDRESS_E = EthereumAddress(
    '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  )

  const CONTRACT_A: AnalyzedContract = {
    ...base,
    address: ADDRESS_A,
    name: 'A',
    isVerified: false,
  }

  const CONTRACT_B: AnalyzedContract = {
    ...base,
    address: ADDRESS_B,
    name: 'B',
    derivedName: 'Something not B',
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
    ...base,
    address: ADDRESS_C,
    name: 'C',
    proxyType: 'EIP1967 proxy',
    values: {
      $admin: ADDRESS_D.toString(),
      $implementation: ADDRESS_E.toString(),
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
      { type: 'EOA', address: ADDRESS_B },
      { type: 'EOA', address: ADDRESS_A },
      { type: 'EOA', address: ADDRESS_C },
    ])

    expect(result).toEqual({
      contracts: [],
      eoas: [
        { ...emptyOutputMeta, address: ADDRESS_A, name: undefined },
        { ...emptyOutputMeta, address: ADDRESS_B, name: undefined },
        { ...emptyOutputMeta, address: ADDRESS_C, name: undefined },
      ],
      abis: {},
    })
  })

  it('processes an unverified contract', () => {
    const result = processAnalysis([CONTRACT_A])

    expect(result).toEqual({
      contracts: [
        {
          address: ADDRESS_A,
          name: 'A',
          unverified: true,
          proxyType: CONTRACT_A.proxyType,
          sinceTimestamp: base.deploymentTimestamp.toNumber(),
        },
      ],
      eoas: [],
      abis: CONTRACT_A.abis,
    })
  })

  it('processes a verified contract with values and errors', () => {
    const result = processAnalysis([CONTRACT_B])

    expect(result).toEqual({
      contracts: [
        {
          address: ADDRESS_B,
          name: 'B',
          derivedName: 'Something not B',
          proxyType: CONTRACT_B.proxyType,
          sinceTimestamp: base.deploymentTimestamp.toNumber(),
          values: CONTRACT_B.values,
          errors: CONTRACT_B.errors,
          sourceHashes: [],
        },
      ],
      eoas: [],
      abis: CONTRACT_B.abis,
    })
  })

  it('processes a proxy', () => {
    const result = processAnalysis([
      CONTRACT_C,
      { type: 'EOA', address: ADDRESS_D },
    ])

    expect(result).toEqual({
      contracts: [
        {
          address: ADDRESS_C,
          name: 'C',
          proxyType: CONTRACT_C.proxyType,
          sinceTimestamp: base.deploymentTimestamp.toNumber(),
          values: CONTRACT_C.values,
          sourceHashes: [],
        },
      ],
      eoas: [{ ...emptyOutputMeta, address: ADDRESS_D, name: undefined }],
      abis: CONTRACT_C.abis,
    })
  })

  it('processes multiple contracts', function () {
    const result = processAnalysis([
      CONTRACT_A,
      CONTRACT_B,
      CONTRACT_C,
      {
        type: 'EOA',
        address: ADDRESS_D,
      },
    ])

    expect(result).toEqual({
      contracts: [
        {
          address: ADDRESS_A,
          name: 'A',
          unverified: true,
          proxyType: CONTRACT_A.proxyType,
          sinceTimestamp: base.deploymentTimestamp.toNumber(),
        },
        {
          address: ADDRESS_B,
          proxyType: CONTRACT_B.proxyType,
          name: 'B',
          derivedName: 'Something not B',
          values: CONTRACT_B.values,
          errors: CONTRACT_B.errors,
          sinceTimestamp: base.deploymentTimestamp.toNumber(),
          sourceHashes: [],
        },
        {
          address: ADDRESS_C,
          proxyType: CONTRACT_C.proxyType,
          name: 'C',
          values: CONTRACT_C.values,
          sinceTimestamp: base.deploymentTimestamp.toNumber(),
          sourceHashes: [],
        },
      ],
      eoas: [{ ...emptyOutputMeta, address: ADDRESS_D, name: undefined }],
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
