import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import map from 'lodash/map'

import type { AnalyzedContract } from '../analysis/AddressAnalyzer'
import { EMPTY_ANALYZED_CONTRACT } from '../utils/testUtils'
import { getSourceOutputPath } from './saveDiscoveryResult'

describe(getSourceOutputPath.name, () => {
  const genAnalyzedContract = (name: string): AnalyzedContract => ({
    ...EMPTY_ANALYZED_CONTRACT,
    type: 'Contract' as const,
    name,
    address: ChainSpecificAddress.random(),
    isVerified: true,
    deploymentTimestamp: UnixTime(1234),
    deploymentBlockNumber: 9876,
    proxyType: 'immutable',
  })

  const contractA = genAnalyzedContract('A')
  const contractB1 = genAnalyzedContract('B')
  const contractB2 = genAnalyzedContract('B')
  const allContracts = [contractA, contractB1, contractB2]

  it('adds address suffix if names clash', () => {
    const allContractNames = map(allContracts, (c) => c.name)
    const root = '/.code'
    const pathA = getSourceOutputPath(
      'a.sol',
      0,
      1,
      contractA.name,
      ChainSpecificAddress.address(contractA.address),
      root,
      allContractNames,
    )
    const pathB1 = getSourceOutputPath(
      'b.sol',
      0,
      1,
      contractB1.name,
      ChainSpecificAddress.address(contractB1.address),
      root,
      allContractNames,
    )
    const pathB2 = getSourceOutputPath(
      'b.sol',
      0,
      1,
      contractB2.name,
      ChainSpecificAddress.address(contractB2.address),
      root,
      allContractNames,
    )

    expect(pathA).toEqual(`${root}/A/a.sol`)
    expect(pathB1).toEqual(
      `${root}/B-${ChainSpecificAddress.address(contractB1.address).toString()}/b.sol`,
    )
    expect(pathB2).toEqual(
      `${root}/B-${ChainSpecificAddress.address(contractB2.address).toString()}/b.sol`,
    )
  })

  it('adds proxy/implementation suffixes', () => {
    const allContractNames = map(allContracts, (c) => c.name)
    const root = '/.code'
    const pathA_proxy = getSourceOutputPath(
      'a1.sol',
      0,
      2,
      contractA.name,
      ChainSpecificAddress.address(contractA.address),
      root,
      allContractNames,
    )
    const pathA_impl = getSourceOutputPath(
      'a2.sol',
      1,
      2,
      contractA.name,
      ChainSpecificAddress.address(contractA.address),
      root,
      allContractNames,
    )

    expect(pathA_proxy).toEqual(`${root}/A/proxy/a1.sol`)
    expect(pathA_impl).toEqual(`${root}/A/implementation/a2.sol`)
  })

  it('adds proxy and numbered implementation suffixes', () => {
    const allContractNames = map(allContracts, (c) => c.name)
    const sourcesCount = 3
    const root = '/.code'
    const pathA_proxy = getSourceOutputPath(
      'a1.sol',
      0,
      sourcesCount,
      contractA.name,
      ChainSpecificAddress.address(contractA.address),
      root,
      allContractNames,
    )
    const pathA_impl1 = getSourceOutputPath(
      'a2.sol',
      1,
      sourcesCount,
      contractA.name,
      ChainSpecificAddress.address(contractA.address),
      root,
      allContractNames,
    )
    const pathA_impl2 = getSourceOutputPath(
      'a3.sol',
      2,
      sourcesCount,
      contractA.name,
      ChainSpecificAddress.address(contractA.address),
      root,
      allContractNames,
    )

    expect(pathA_proxy).toEqual(`${root}/A/proxy/a1.sol`)
    expect(pathA_impl1).toEqual(`${root}/A/implementation-1/a2.sol`)
    expect(pathA_impl2).toEqual(`${root}/A/implementation-2/a3.sol`)
  })

  it('properly handles mix of name clashes and implementations', () => {
    const allContractNames = map(allContracts, (c) => c.name)
    const sourcesCount = 3
    const root = '/.code'
    const pathB1_proxy = getSourceOutputPath(
      'b11.sol',
      0,
      sourcesCount,
      contractB1.name,
      ChainSpecificAddress.address(contractB1.address),
      root,
      allContractNames,
    )
    const pathB1_impl1 = getSourceOutputPath(
      'b12.sol',
      1,
      sourcesCount,
      contractB1.name,
      ChainSpecificAddress.address(contractB1.address),
      root,
      allContractNames,
    )
    const pathB1_impl2 = getSourceOutputPath(
      'b13.sol',
      2,
      sourcesCount,
      contractB1.name,
      ChainSpecificAddress.address(contractB1.address),
      root,
      allContractNames,
    )
    expect(pathB1_proxy).toEqual(
      `${root}/B-${ChainSpecificAddress.address(contractB1.address).toString()}/proxy/b11.sol`,
    )
    expect(pathB1_impl1).toEqual(
      `${root}/B-${ChainSpecificAddress.address(contractB1.address).toString()}/implementation-1/b12.sol`,
    )
    expect(pathB1_impl2).toEqual(
      `${root}/B-${ChainSpecificAddress.address(contractB1.address).toString()}/implementation-2/b13.sol`,
    )
  })
})
