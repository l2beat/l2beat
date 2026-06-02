import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { mkdtempSync, rmSync, writeFileSync } from 'fs'
import { basename, join, posix } from 'path'
import { getDiscoveryPaths } from '../../config/getDiscoveryPaths'
import type { IProvider } from '../../provider/IProvider'
import { MorphoDataHandler } from './MorphoDataHandler'

describe(MorphoDataHandler.name, () => {
  const provider = mockObject<IProvider>({})

  const vaultA = ChainSpecificAddress.random()
  const vaultB = ChainSpecificAddress.random()
  const marketA = ChainSpecificAddress.random()
  const marketB = ChainSpecificAddress.random()

  const morphoData = {
    entries: [
      {
        address: ChainSpecificAddress.random().toString(),
        type: 'Contract',
        name: 'Morpho Market 0xaaaa…',
        values: { id: '0xaaaa', lltv: '860000000000000000' },
      },
      {
        address: ChainSpecificAddress.random().toString(),
        type: 'Contract',
        name: 'Morpho Market 0xbbbb…',
        values: { id: '0xbbbb', lltv: '915000000000000000' },
      },
    ],
    vaults: [vaultA.toString(), vaultB.toString()],
    vaultMarkets: {
      [vaultA.toString()]: [marketA.toString(), marketB.toString()],
    },
  }

  // The handler resolves `file` relative to the discovery root, so the fixture
  // lives in a temp directory created inside it and is cleaned up afterwards.
  let tmpDir: string
  let relativeFile: string

  before(() => {
    const discoveryRoot = getDiscoveryPaths().discovery
    tmpDir = mkdtempSync(join(discoveryRoot, 'morpho-handler-test-'))
    writeFileSync(join(tmpDir, 'data.json'), JSON.stringify(morphoData))
    relativeFile = posix.join(basename(tmpDir), 'data.json')
  })

  after(() => {
    rmSync(tmpDir, { recursive: true, force: true })
  })

  function handler(
    select: 'markets' | 'vaults' | 'vaultMarkets',
    ignoreRelative?: boolean,
  ): MorphoDataHandler {
    return new MorphoDataHandler('field', {
      type: 'morphoData',
      file: relativeFile,
      select,
      ignoreRelative,
    })
  }

  it('selects market values', async () => {
    const result = await handler('markets').execute(provider, vaultA)
    expect(result).toEqual({
      field: 'field',
      value: [
        { id: '0xaaaa', lltv: '860000000000000000' },
        { id: '0xbbbb', lltv: '915000000000000000' },
      ],
      ignoreRelative: undefined,
    })
  })

  it('selects vaults', async () => {
    const result = await handler('vaults').execute(provider, vaultA)
    expect(result).toEqual({
      field: 'field',
      value: [vaultA.toString(), vaultB.toString()],
      ignoreRelative: undefined,
    })
  })

  it('selects the markets of the queried vault', async () => {
    const result = await handler('vaultMarkets', true).execute(provider, vaultA)
    expect(result).toEqual({
      field: 'field',
      value: [marketA.toString(), marketB.toString()],
      ignoreRelative: true,
    })
  })

  it('returns an empty list for a vault with no in-window markets', async () => {
    const result = await handler('vaultMarkets', true).execute(provider, vaultB)
    expect(result).toEqual({
      field: 'field',
      value: [],
      ignoreRelative: true,
    })
  })

  it('returns an error when the data file is missing', async () => {
    const missing = new MorphoDataHandler('field', {
      type: 'morphoData',
      file: 'does/not/exist.json',
      select: 'markets',
    })
    const result = await missing.execute(provider, vaultA)
    expect(result.field).toEqual('field')
    expect(result.error).toBeTruthy()
    expect(result.value).toEqual(undefined)
  })
})
