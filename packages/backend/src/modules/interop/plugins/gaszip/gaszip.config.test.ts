import { Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import { expect, mockFn, mockObject } from 'earl'
import { InteropConfigStore } from '../../engine/config/InteropConfigStore'
import { GasZipConfigPlugin } from './gaszip.config'

describe(GasZipConfigPlugin.name, () => {
  describe(GasZipConfigPlugin.prototype.getLatestNetworks.name, () => {
    it('maps Gas.zip chain names to ours', async () => {
      const plugin = new GasZipConfigPlugin(
        [{ id: 999, name: 'hyperevm' }],
        new InteropConfigStore(undefined),
        Logger.SILENT,
        httpReturning({
          chains: [
            { name: 'HyperEVM', chain: 999, short: 430, mainnet: true },
            { name: 'HyperCore', chain: 88778877, short: 291, mainnet: true },
            { name: 'Solana', chain: 501474, short: 245, mainnet: true },
          ],
        }),
        60_000,
      )

      expect(await plugin.getLatestNetworks()).toEqual([
        { chain: 'solana', gaszipId: 245, chainId: 501474 },
        { chain: 'hyperliquid', gaszipId: 291, chainId: 88778877 },
        { chain: 'hyperevm', gaszipId: 430, chainId: 999 },
      ])
    })
  })
})

function httpReturning(body: unknown) {
  return mockObject<HttpClient>({
    fetchRaw: mockFn().resolvesTo({
      ok: true,
      json: async () => body,
    } as unknown as Response),
  })
}
