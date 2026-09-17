import type { ConfigReader, DiscoveryOutput } from '@l2beat/discovery'
import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import mock from 'mock-fs'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  loadAnalyzerSourceInput,
  loadFlatEntrypointSourceInput,
} from './loadFlatSources'

const PROJECT = 'zora'
const PROJECT_PATH = '/discovery/projects/zora'
const ADDRESS = ChainSpecificAddress.random()
const DIRECT = ChainSpecificAddress.random()
const IMPLEMENTATION = ChainSpecificAddress.random()
const DISCOVERY: DiscoveryOutput = {
  name: PROJECT,
  timestamp: 0,
  entries: [
    {
      type: 'Contract',
      name: 'Proxy',
      address: ADDRESS,
      values: {
        $implementation: IMPLEMENTATION,
      },
    },
    {
      type: 'Contract',
      name: 'Direct',
      address: DIRECT,
      values: {},
    },
  ],
  abis: {},
  configHash: Hash256.ZERO,
  usedTemplates: {},
  modelledAgainst: {},
  usedBlockNumbers: {},
}

describe(loadAnalyzerSourceInput.name, () => {
  afterEach(() => {
    mock.restore()
  })

  it('loads the full .flat folder for a selected implementation entrypoint', async () => {
    mockFlatSources()

    const result = await loadAnalyzerSourceInput(configReader(), {
      project: PROJECT,
      address: ADDRESS,
      entrypoint: 'contracts/Implementation.sol',
    })

    expect(result.entrypoint).toStrictEqual(
      'Proxy/contracts/Implementation.sol',
    )
    expect(Object.keys(result.files).sort()).toStrictEqual([
      'Direct.sol',
      'Proxy/Proxy.p.sol',
      'Proxy/contracts/Implementation.sol',
    ])
    expect(
      Buffer.from(
        result.files['Proxy/contracts/Implementation.sol']!,
      ).toString(),
    ).toStrictEqual('contract Implementation {}')
  })

  it('loads the full .flat folder for a direct contract entrypoint', async () => {
    mockFlatSources()

    const result = await loadAnalyzerSourceInput(configReader(), {
      project: PROJECT,
      address: DIRECT,
      entrypoint: 'Direct.sol',
    })

    expect(result.entrypoint).toStrictEqual('Direct.sol')
    expect(Object.keys(result.files).sort()).toStrictEqual([
      'Direct.sol',
      'Proxy/Proxy.p.sol',
      'Proxy/contracts/Implementation.sol',
    ])
    expect(Buffer.from(result.files['Direct.sol']!).toString()).toStrictEqual(
      'contract Direct {}',
    )
  })

  it('throws when the requested entrypoint is missing', async () => {
    mockFlatSources()

    await expect(
      loadAnalyzerSourceInput(configReader(), {
        project: PROJECT,
        address: ADDRESS,
        entrypoint: 'Missing.sol',
      }),
    ).rejects.toThrow('Entrypoint not found')
  })
})

describe(loadFlatEntrypointSourceInput.name, () => {
  afterEach(() => {
    mock.restore()
  })

  it('loads the full .flat folder for a direct .flat file', async () => {
    mockFlatSources()

    const result = await loadFlatEntrypointSourceInput(
      `${PROJECT_PATH}/.flat/Direct.sol`,
    )

    expect(result.entrypoint).toStrictEqual('Direct.sol')
    expect(Object.keys(result.files).sort()).toStrictEqual([
      'Direct.sol',
      'Proxy/Proxy.p.sol',
      'Proxy/contracts/Implementation.sol',
    ])
    expect(Buffer.from(result.files['Direct.sol']!).toString()).toStrictEqual(
      'contract Direct {}',
    )
  })

  it('loads the full .flat folder for a .flat contract folder entrypoint', async () => {
    mockFlatSources()

    const result = await loadFlatEntrypointSourceInput(
      `${PROJECT_PATH}/.flat/Proxy/contracts/Implementation.sol`,
    )

    expect(result.entrypoint).toStrictEqual(
      'Proxy/contracts/Implementation.sol',
    )
    expect(Object.keys(result.files).sort()).toStrictEqual([
      'Direct.sol',
      'Proxy/Proxy.p.sol',
      'Proxy/contracts/Implementation.sol',
    ])
    expect(
      Buffer.from(
        result.files['Proxy/contracts/Implementation.sol']!,
      ).toString(),
    ).toStrictEqual('contract Implementation {}')
  })

  it('rejects entrypoints outside a .flat folder', async () => {
    mock({
      [PROJECT_PATH]: {
        'Contract.sol': 'contract Contract {}',
      },
    })

    await expect(
      loadFlatEntrypointSourceInput(`${PROJECT_PATH}/Contract.sol`),
    ).rejects.toThrow('Entrypoint path must be inside a .flat')
  })
})

function mockFlatSources() {
  mock({
    [PROJECT_PATH]: {
      '.flat': {
        'Direct.sol': 'contract Direct {}',
        Proxy: {
          'Proxy.p.sol': 'contract Proxy {}',
          contracts: {
            'Implementation.sol': 'contract Implementation {}',
          },
        },
      },
    },
  })
}

function configReader() {
  return {
    getProjectPath: vi.fn(() => PROJECT_PATH),
    readDiscovery: vi.fn(() => DISCOVERY),
  } as unknown as ConfigReader
}
