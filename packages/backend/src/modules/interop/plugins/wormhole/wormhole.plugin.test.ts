import { expect, mockObject } from 'earl'
import { InteropConfigStore } from '../../engine/config/InteropConfigStore'
import type { LogToCapture } from '../types'
import { WormholeConfig } from './wormhole.config'
import { WormholePlugin } from './wormhole.plugin'

describe(WormholePlugin.name, () => {
  describe(WormholePlugin.prototype.capture.name, () => {
    it('skips a chain known only by its Wormhole chain ID', async () => {
      const store = new InteropConfigStore(undefined)
      await store.set(WormholeConfig, [{ chain: 'bsc', wormholeChainId: 4 }])
      const plugin = new WormholePlugin(store)

      const result = plugin.capture(mockObject<LogToCapture>({ chain: 'bsc' }))

      expect(result).toEqual(undefined)
    })
  })
})
