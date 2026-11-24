import { Logger } from '@l2beat/backend-tools'
import type { HttpClient, IRpcClient } from '@l2beat/shared'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { InteropConfigStore } from '../../engine/config/InteropConfigStore'
import {
  WormholeConfig,
  WormholeConfigPlugin,
  type WormholeNetwork,
} from './wormhole.config'

const CORE_CONTRACT = EthereumAddress(`0x${'1'.repeat(40)}`)

const DOCS_HTML = `
  <div class="tabbed-block"><table><tbody>
    <tr><td>Celo</td><td><code>${CORE_CONTRACT}</code></td></tr>
  </tbody></table></div>`

const CHAIN_IDS_SOURCE = 'ChainIDCelo ChainID = 14'

describe(WormholeConfigPlugin.name, () => {
  describe(WormholeConfigPlugin.prototype.getLatestNetworks.name, () => {
    const previous: WormholeNetwork = {
      chain: 'celo',
      chainId: 42220,
      wormholeChainId: 14,
      coreContract: CORE_CONTRACT,
    }

    it('keeps the previous core contract when the RPC lookup fails', async () => {
      const rpc = mockObject<IRpcClient>({
        getBlock: mockFn().rejectsWith(new Error('HTTP timeout')),
      })

      const networks = await createPlugin([previous], rpc).getLatestNetworks()

      expect(networks).toEqual([previous])
    })

    it('keeps the previous core contract when no core resolves', async () => {
      const rpc = mockObject<IRpcClient>({
        getBlock: mockFn().resolvesTo({ number: 1 }),
        isMulticallDeployed: mockFn().returns(false),
        call: mockFn().rejectsWith(new Error('execution reverted')),
      })

      const networks = await createPlugin([previous], rpc).getLatestNetworks()

      expect(networks).toEqual([previous])
    })
  })
})

function createPlugin(previous: WormholeNetwork[], rpc: IRpcClient) {
  const store = new InteropConfigStore(undefined)
  store.writeAll({ [WormholeConfig.key]: previous })
  const http = mockObject<HttpClient>({
    fetchRaw: mockFn(async (url: string) => {
      const body = url.endsWith('.go') ? CHAIN_IDS_SOURCE : DOCS_HTML
      return { text: async () => body } as unknown as Response
    }),
  })
  return new WormholeConfigPlugin(
    [{ id: 42220, name: 'celo' }],
    store,
    Logger.SILENT,
    http,
    new Map([['celo', rpc]]),
    60_000,
  )
}
