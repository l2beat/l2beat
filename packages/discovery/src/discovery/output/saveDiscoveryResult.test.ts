import { Logger } from '@l2beat/backend-tools'
import {
  ChainSpecificAddress,
  type Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'
import { mkdtempSync, rmSync, writeFileSync } from 'fs'
import map from 'lodash/map'
import { tmpdir } from 'os'
import { join } from 'path'

import type { AnalyzedContract } from '../analysis/AddressAnalyzer'
import { EMPTY_ANALYZED_CONTRACT } from '../utils/testUtils'
import {
  getSourceOutputPath,
  mergeAdditionalEntries,
} from './saveDiscoveryResult'
import type { DiscoveryOutput, EntryParameters } from './types'

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

describe(mergeAdditionalEntries.name, () => {
  const entry = (address: string, name: string): EntryParameters =>
    ({ address, name, type: 'Contract' }) as unknown as EntryParameters

  const output = (entries: EntryParameters[]): DiscoveryOutput => ({
    name: 'test',
    timestamp: 0,
    entries,
    abis: {},
    configHash: '0x' as Hash256,
    usedTemplates: {},
    usedBlockNumbers: {},
  })

  const addrA = ChainSpecificAddress.random()
  const addrB = ChainSpecificAddress.random()

  let tmpDir: string
  before(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'morpho-merge-test-'))
  })
  after(() => {
    rmSync(tmpDir, { recursive: true, force: true })
  })

  function writeFixture(name: string, entries: EntryParameters[]): string {
    writeFileSync(join(tmpDir, name), JSON.stringify({ entries }))
    return name
  }

  it('does nothing when additionalEntries is undefined', () => {
    const out = output([entry(addrA.toString(), 'A')])
    mergeAdditionalEntries(out, undefined, tmpDir, Logger.SILENT)
    expect(out.entries.length).toEqual(1)
  })

  it('skips (with a warning) a missing file', () => {
    const out = output([entry(addrA.toString(), 'A')])
    mergeAdditionalEntries(out, 'missing.json', tmpDir, Logger.SILENT)
    expect(out.entries.length).toEqual(1)
  })

  it('appends entries that are not already discovered', () => {
    const out = output([entry(addrA.toString(), 'A')])
    const file = writeFixture('extra.json', [entry(addrB.toString(), 'B')])
    mergeAdditionalEntries(out, file, tmpDir, Logger.SILENT)
    expect(out.entries.map((e) => e.address.toString())).toEqual([
      addrA.toString(),
      addrB.toString(),
    ])
  })

  it('lets a real discovered entry win on address conflict', () => {
    const out = output([entry(addrA.toString(), 'Real A')])
    const file = writeFixture('conflict.json', [
      entry(addrA.toString(), 'Synthetic A'),
      entry(addrB.toString(), 'B'),
    ])
    mergeAdditionalEntries(out, file, tmpDir, Logger.SILENT)
    expect(out.entries.length).toEqual(2)
    const a = out.entries.find((e) => e.address === addrA.toString())
    expect(a?.name).toEqual('Real A')
  })
})
