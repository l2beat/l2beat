import type { ConfigReader, DiscoveryOutput } from '@l2beat/discovery'
import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import mock from 'mock-fs'
import { getCodePaths } from '../discovery/getCodePaths'

const PROJECT = 'zora'
const PROJECT_PATH = '/discovery/projects/zora'
const ADDRESS = ChainSpecificAddress.random()
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
  ],
  abis: {},
  configHash: Hash256.ZERO,
  usedTemplates: {},
  usedBlockNumbers: {},
}

describe(getCodePaths.name, () => {
  afterEach(() => {
    mock.restore()
  })

  it('preserves nested source paths for multi-file contracts', () => {
    mock({
      [PROJECT_PATH]: {
        '.flat': {
          Proxy: {
            'Proxy.p.sol': 'contract Proxy {}',
            contracts: {
              token: {
                'Token.sol': 'contract Token {}',
              },
            },
            interfaces: {
              'IERC20.sol': 'interface IERC20 {}',
            },
          },
        },
      },
    })

    const configReader = mockObject<ConfigReader>({
      getProjectPath: () => PROJECT_PATH,
      readDiscovery: () => DISCOVERY,
    })

    const result = getCodePaths(configReader, PROJECT, ADDRESS)

    expect(result).toEqual({
      entryName: 'Proxy',
      codePaths: [
        {
          name: 'Proxy.p.sol',
          path: `${PROJECT_PATH}/.flat/Proxy/Proxy.p.sol`,
        },
        {
          name: 'contracts/token/Token.sol',
          path: `${PROJECT_PATH}/.flat/Proxy/contracts/token/Token.sol`,
        },
        {
          name: 'interfaces/IERC20.sol',
          path: `${PROJECT_PATH}/.flat/Proxy/interfaces/IERC20.sol`,
        },
      ],
    })
  })
})
