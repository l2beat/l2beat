import { Logger } from '@l2beat/backend-tools'
import type { CallParameters, HttpClient, IRpcClient } from '@l2beat/shared'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { InteropConfigStore } from '../../engine/config/InteropConfigStore'
import { parseWormholeChainIds, WormholeConfigPlugin } from './wormhole.config'

const GO_SOURCE = `
// NOTE: Please keep these in numerical order.
const (
	ChainIDUnset ChainID = 0
	// ChainIDSolana is the ChainID of Solana
	ChainIDSolana ChainID = 1
	// OBSOLETE: ChainIDTerra ChainID = 3
	// ChainIDBSC is the ChainID of Binance Smart Chain
	ChainIDBSC ChainID = 4
	ChainIDPolygon ChainID = 5
	ChainIDHyperEVM ChainID = 47
	ChainIDRobinhoodChain ChainID = 72
	ChainIDWormchain ChainID = 3104
)
`

const ETH_CORE = EthereumAddress('0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B')
const BSC_CORE = EthereumAddress('0x1111111111111111111111111111111111111111')
const BSC_TOKEN_BRIDGE = EthereumAddress(
  '0x2222222222222222222222222222222222222222',
)
const WORMHOLE_RELAYER = EthereumAddress(
  '0x27428DD2d3DD32A4D7f7C497eAaa23130d894911',
)

const DOCS_HTML = `
<h2>Core Contracts</h2>
<div class="tabbed-block"><table>
<thead><tr><th>Chain Name</th><th>Contract Address</th></tr></thead>
<tbody>
<tr><td>Ethereum</td><td><code>${ETH_CORE}</code></td></tr>
<tr><td>Solana</td><td><code>worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTth</code></td></tr>
<tr><td>Bsc</td><td><code>${BSC_CORE}</code></td></tr>
</tbody></table></div>
<h2>Wrapped Token Transfers (WTT)</h2>
<div class="tabbed-block"><table>
<tbody>
<tr><td>Bsc</td><td><code>${BSC_TOKEN_BRIDGE}</code></td></tr>
</tbody></table></div>
`

describe(parseWormholeChainIds.name, () => {
  it('parses chain ID declarations and maps names to ours', () => {
    expect(parseWormholeChainIds(GO_SOURCE)).toEqual([
      { chain: 'solana', wormholeChainId: 1 },
      { chain: 'bsc', wormholeChainId: 4 },
      { chain: 'polygonpos', wormholeChainId: 5 },
      { chain: 'hyperevm', wormholeChainId: 47 },
      { chain: 'robinhood', wormholeChainId: 72 },
      { chain: 'wormchain', wormholeChainId: 3104 },
    ])
  })

  it('returns nothing for unrelated content', () => {
    expect(parseWormholeChainIds('<html>404: Not Found</html>')).toEqual([])
  })
})

describe(WormholeConfigPlugin.name, () => {
  describe(WormholeConfigPlugin.prototype.getLatestNetworks.name, () => {
    it('merges SDK chain IDs with verified core contracts and token bridges', async () => {
      const rpc = mockObject<IRpcClient>({
        getBlock: mockFn().resolvesTo({ number: 100 }),
        isMulticallDeployed: () => false,
        call: mockFn(async (call: CallParameters) =>
          uint16(call.to === BSC_CORE ? 4 : 0),
        ),
      })
      const plugin = createPlugin({
        http: httpReturning({ docs: DOCS_HTML, chainIds: GO_SOURCE }),
        chains: [{ id: 56, name: 'bsc' }],
        rpcs: new Map([['bsc', rpc]]),
      })

      expect(await plugin.getLatestNetworks()).toEqual([
        { chain: 'solana', wormholeChainId: 1 },
        {
          chain: 'bsc',
          chainId: 56,
          wormholeChainId: 4,
          coreContract: BSC_CORE,
          relayer: WORMHOLE_RELAYER,
          tokenBridge: BSC_TOKEN_BRIDGE,
        },
        { chain: 'polygonpos', wormholeChainId: 5 },
        { chain: 'hyperevm', wormholeChainId: 47 },
        { chain: 'robinhood', wormholeChainId: 72 },
        { chain: 'wormchain', wormholeChainId: 3104 },
      ])
    })

    it('fails loudly when the chain ID source is not parseable', async () => {
      const plugin = createPlugin({
        http: httpReturning({ docs: DOCS_HTML, chainIds: '404: Not Found' }),
      })

      await expect(plugin.getLatestNetworks()).toBeRejectedWith(
        'Failed to parse Wormhole chain IDs',
      )
    })

    it('fails loudly when the docs page has no core contracts table', async () => {
      const plugin = createPlugin({
        http: httpReturning({
          docs: '<html><h1>Contract Addresses</h1></html>',
          chainIds: GO_SOURCE,
        }),
      })

      await expect(plugin.getLatestNetworks()).toBeRejectedWith(
        'Failed to parse Wormhole core contracts',
      )
    })
  })
})

function createPlugin(options: {
  http: HttpClient
  chains?: { id: number; name: string }[]
  rpcs?: Map<string, IRpcClient>
}) {
  return new WormholeConfigPlugin(
    options.chains ?? [],
    new InteropConfigStore(undefined),
    Logger.SILENT,
    options.http,
    options.rpcs ?? new Map(),
    60_000,
  )
}

function httpReturning(bodies: { docs: string; chainIds: string }) {
  return mockObject<HttpClient>({
    fetchRaw: mockFn(async (url: string) => {
      const body = url.includes('contract-addresses')
        ? bodies.docs
        : bodies.chainIds
      return { text: async () => body } as unknown as Response
    }),
  })
}

function uint16(value: number) {
  return Bytes.fromHex(`0x${value.toString(16).padStart(64, '0')}`)
}
