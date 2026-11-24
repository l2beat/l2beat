import { Logger } from '@l2beat/backend-tools'
import type { IRpcClient } from '@l2beat/shared'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { InteropConfigStore } from '../../engine/config/InteropConfigStore'
import { CCTPConfigPlugin, type CCTPNetwork, CCTPV2Config } from './cctp.config'

describe(CCTPConfigPlugin.name, () => {
  describe(CCTPConfigPlugin.prototype.getLatestNetworks.name, () => {
    const previous: CCTPNetwork = {
      chain: 'monad',
      chainId: 143,
      domain: 15,
      messageTransmitter: EthereumAddress(
        '0x81D40F21F12A8F0E3252Bccb954D722d4c464B64',
      ),
    }

    it('keeps the previous message transmitter when the RPC lookup fails', async () => {
      const rpc = mockObject<IRpcClient>({
        call: mockFn().rejectsWith(new Error('HTTP timeout')),
      })

      const { v2 } = await createPlugin(previous, rpc).getLatestNetworks()

      expect(v2.find((n) => n.chain === 'monad')).toEqual(previous)
    })

    it('keeps the previous message transmitter when the lookup returns no data', async () => {
      const rpc = mockObject<IRpcClient>({
        call: mockFn().resolvesTo(Bytes.EMPTY),
      })

      const { v2 } = await createPlugin(previous, rpc).getLatestNetworks()

      expect(v2.find((n) => n.chain === 'monad')).toEqual(previous)
    })
  })
})

function createPlugin(previous: CCTPNetwork, rpc: IRpcClient) {
  const store = new InteropConfigStore(undefined)
  store.writeAll({
    [CCTPV2Config.key]: [previous, { chain: 'monad', domain: 15 }],
  })
  return new CCTPConfigPlugin(
    [{ id: 143, name: 'monad' }],
    store,
    Logger.SILENT,
    new Map([['monad', rpc]]),
    60_000,
  )
}
