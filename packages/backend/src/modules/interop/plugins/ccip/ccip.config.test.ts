import { Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { Response } from 'node-fetch'
import { InteropConfigStore } from '../../engine/config/InteropConfigStore'
import { CCIPConfigPlugin } from './ccip.config'

describe(CCIPConfigPlugin.name, () => {
  it('keeps v1.6 and v2.0 per-chain ramps alongside legacy lanes', async () => {
    const chains = {
      mainnet: {
        chainSelector: '1',
        router: { address: address(1), version: '1.2.0' },
      },
      'ethereum-mainnet-arbitrum-1': { chainSelector: '2' },
      'ethereum-mainnet-base-1': { chainSelector: '3' },
      'ethereum-mainnet-optimism-1': { chainSelector: '4' },
    }
    const lanes = {
      mainnet: {
        'ethereum-mainnet-arbitrum-1': {
          onRamp: { address: address(2), version: '1.5.0' },
          offRamp: { address: address(3), version: '1.5.0' },
        },
        'ethereum-mainnet-base-1': {
          onRamp: { address: address(4), version: '1.6.1' },
          offRamp: { address: address(5), version: '1.6.1' },
        },
        'ethereum-mainnet-optimism-1': {
          onRamp: { address: address(6), version: '2.0.0' },
          offRamp: { address: address(7), version: '2.0.0' },
        },
      },
    }
    const http = mockObject<HttpClient>({
      fetchRaw: async (url) =>
        new Response(
          JSON.stringify(url.includes('chains.json') ? chains : lanes),
        ),
    })
    const plugin = new CCIPConfigPlugin(
      [{ name: 'ethereum' }],
      new InteropConfigStore(undefined),
      Logger.SILENT,
      http,
      -1,
    )

    const result = await plugin.getLatestNetworks()

    expect(result.networks).toEqual([
      {
        chain: 'ethereum',
        chainSelector: '1',
        router: EthereumAddress(address(1)),
        outboundLanes: { arbitrum: EthereumAddress(address(2)) },
        inboundLanes: { arbitrum: EthereumAddress(address(3)) },
        onRamp: EthereumAddress(address(4)),
        offRamp: EthereumAddress(address(5)),
        onRampV2: EthereumAddress(address(6)),
        offRampV2: EthereumAddress(address(7)),
      },
    ])
  })
})

function address(n: number) {
  return `0x${n.toString(16).padStart(40, '0')}`
}
