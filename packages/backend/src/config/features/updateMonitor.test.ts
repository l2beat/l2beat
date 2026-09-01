import { Env } from '@l2beat/backend-tools'
import type { ChainConfig } from '@l2beat/config'
import { expect } from 'earl'
import { getChainDiscoveryConfig } from './updateMonitor'

describe(getChainDiscoveryConfig.name, () => {
  it('preserves Blockscout V2, V1, and Sourcify source order', () => {
    const chain: ChainConfig = {
      name: 'example',
      chainId: 123,
      apis: [
        { type: 'rpc', url: 'https://rpc.example' },
        { type: 'blockscoutV2', url: 'https://blockscout.example/api/v2' },
        { type: 'blockscout', url: 'https://blockscout.example/api' },
        { type: 'sourcify', chainId: 123 },
      ],
    }
    const env = new Env({
      EXAMPLE_RPC_URL_FOR_DISCOVERY: 'https://rpc.example',
    })

    const result = getChainDiscoveryConfig(env, chain.name, [chain])

    expect(result.explorer).toEqual([
      { type: 'blockscoutV2', url: 'https://blockscout.example/api/v2' },
      {
        type: 'blockscout',
        url: 'https://blockscout.example/api',
        unsupported: { getContractCreation: undefined },
      },
      { type: 'sourcify', chainId: 123 },
    ])
  })
})
