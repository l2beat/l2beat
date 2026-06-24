import type { ConfigReader, DiscoveryOutput } from '@l2beat/discovery'
import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import mock from 'mock-fs'
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

    expect(result.entrypoint).toEqual('Proxy/contracts/Implementation.sol')
    expect(Object.keys(result.files).sort()).toEqual([
      'Direct.sol',
      'Proxy/Proxy.p.sol',
      'Proxy/contracts/Implementation.sol',
    ])
    expect(
      Buffer.from(
        result.files['Proxy/contracts/Implementation.sol']!,
      ).toString(),
    ).toEqual('contract Implementation {}')
  })

  it('loads the full .flat folder for a direct contract entrypoint', async () => {
    mockFlatSources()

    const result = await loadAnalyzerSourceInput(configReader(), {
      project: PROJECT,
      address: DIRECT,
      entrypoint: 'Direct.sol',
    })

    expect(result.entrypoint).toEqual('Direct.sol')
    expect(Object.keys(result.files).sort()).toEqual([
      'Direct.sol',
      'Proxy/Proxy.p.sol',
      'Proxy/contracts/Implementation.sol',
    ])
    expect(Buffer.from(result.files['Direct.sol']!).toString()).toEqual(
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
    ).toBeRejectedWith('Entrypoint not found')
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

    expect(result.entrypoint).toEqual('Direct.sol')
    expect(Object.keys(result.files).sort()).toEqual([
      'Direct.sol',
      'Proxy/Proxy.p.sol',
      'Proxy/contracts/Implementation.sol',
    ])
    expect(Buffer.from(result.files['Direct.sol']!).toString()).toEqual(
      'contract Direct {}',
    )
  })

  it('loads the full .flat folder for a .flat contract folder entrypoint', async () => {
    mockFlatSources()

    const result = await loadFlatEntrypointSourceInput(
      `${PROJECT_PATH}/.flat/Proxy/contracts/Implementation.sol`,
    )

    expect(result.entrypoint).toEqual('Proxy/contracts/Implementation.sol')
    expect(Object.keys(result.files).sort()).toEqual([
      'Direct.sol',
      'Proxy/Proxy.p.sol',
      'Proxy/contracts/Implementation.sol',
    ])
    expect(
      Buffer.from(
        result.files['Proxy/contracts/Implementation.sol']!,
      ).toString(),
    ).toEqual('contract Implementation {}')
  })

  it('rejects entrypoints outside a .flat folder', async () => {
    mock({
      [PROJECT_PATH]: {
        'Contract.sol': 'contract Contract {}',
      },
    })

    await expect(
      loadFlatEntrypointSourceInput(`${PROJECT_PATH}/Contract.sol`),
    ).toBeRejectedWith('Entrypoint path must be inside a .flat')
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
  return mockObject<ConfigReader>({
    getProjectPath: () => PROJECT_PATH,
    readDiscovery: () => DISCOVERY,
  })
}
