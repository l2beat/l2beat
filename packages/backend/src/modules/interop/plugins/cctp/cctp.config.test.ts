import { Logger } from '@l2beat/backend-tools'
import type { IRpcClient } from '@l2beat/shared'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { InteropConfigStore } from '../../engine/config/InteropConfigStore'
import { CCTPConfigPlugin, type CCTPNetwork, CCTPV2Config } from './cctp.config'

describe(CCTPConfigPlugin.name, () => {
  describe(CCTPConfigPlugin.prototype.getLatestNetworks.name, () => {
    it('keeps the previous message transmitter when the RPC lookup fails', async () => {
      const previous: CCTPNetwork = {
        chain: 'monad',
        chainId: 143,
        domain: 15,
        messageTransmitter: EthereumAddress(
          '0x81D40F21F12A8F0E3252Bccb954D722d4c464B64',
        ),
      }
      const store = new InteropConfigStore(undefined)
      store.writeAll({
        [CCTPV2Config.key]: [previous, { chain: 'monad', domain: 15 }],
      })
      const rpc = mockObject<IRpcClient>({
        call: mockFn().rejectsWith(new Error('HTTP timeout')),
      })
      const plugin = new CCTPConfigPlugin(
        [{ id: 143, name: 'monad' }],
        store,
        Logger.SILENT,
        new Map([['monad', rpc]]),
        60_000,
      )

      const { v2 } = await plugin.getLatestNetworks()

      expect(v2.find((n) => n.chain === 'monad')).toEqual(previous)
    })
  })
})
