import { UpgradeabilityParameters } from '@l2beat/discovery-types'
import { expect } from 'earl'

import { EthereumAddress } from '../../utils/EthereumAddress'
import { UnixTime } from '../../utils/UnixTime'
import { AnalyzedContract } from '../analysis/AddressAnalyzer'
import { processAnalysis, sortByKeys } from './toDiscoveryOutput'

describe(processAnalysis.name, () => {
  const base = {
    type: 'Contract' as const,
    derivedName: undefined,
    errors: {},
    values: {},
    isVerified: true,
    deploymentTimestamp: new UnixTime(1234),
    deploymentBlockNumber: 9876,
    upgradeability: { type: 'immutable' } as UpgradeabilityParameters,
    implementations: [],
    abis: {},
    source: [],
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
    upgradeability: {
      type: 'EIP1967 proxy',
      admin: ADDRESS_D,
      implementation: ADDRESS_E,
    },
    implementations: [ADDRESS_E],
    values: {
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
      eoas: [ADDRESS_A, ADDRESS_B, ADDRESS_C],
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
          sinceTimestamp: base.deploymentTimestamp.toNumber(),
          upgradeability: CONTRACT_A.upgradeability,
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
          sinceTimestamp: base.deploymentTimestamp.toNumber(),
          upgradeability: CONTRACT_B.upgradeability,
          values: CONTRACT_B.values,
          errors: CONTRACT_B.errors,
        },
      ],
      eoas: [],
      abis: CONTRACT_B.abis,
    })
  })

  it('processes a proxy', () => {
    const result = processAnalysis([
      CONTRACT_C,
      {
        type: 'EOA',
        address: ADDRESS_D,
      },
    ])

    expect(result).toEqual({
      contracts: [
        {
          address: ADDRESS_C,
          name: 'C',
          sinceTimestamp: base.deploymentTimestamp.toNumber(),
          upgradeability: CONTRACT_C.upgradeability,
          implementations: CONTRACT_C.implementations,
          values: CONTRACT_C.values,
        },
      ],
      eoas: [ADDRESS_D],
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
          upgradeability: CONTRACT_A.upgradeability,
          sinceTimestamp: base.deploymentTimestamp.toNumber(),
        },
        {
          address: ADDRESS_B,
          name: 'B',
          derivedName: 'Something not B',
          upgradeability: CONTRACT_B.upgradeability,
          values: CONTRACT_B.values,
          errors: CONTRACT_B.errors,
          sinceTimestamp: base.deploymentTimestamp.toNumber(),
        },
        {
          address: ADDRESS_C,
          name: 'C',
          upgradeability: CONTRACT_C.upgradeability,
          implementations: CONTRACT_C.implementations,
          values: CONTRACT_C.values,
          sinceTimestamp: base.deploymentTimestamp.toNumber(),
        },
      ],
      eoas: [ADDRESS_D],
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

  it('undefined keys in upgradeability are skipped', () => {
    const resultUndefined = processAnalysis([
      {
        ...CONTRACT_A,
        upgradeability: {
          type: 'immutable',
          key: undefined,
        } as UpgradeabilityParameters,
      },
    ])
    const result = processAnalysis([CONTRACT_A])

    expect(resultUndefined).toEqual(result)
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
