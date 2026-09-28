import { Logger } from '@l2beat/backend-tools'
import type { CallParameters, HttpClient, IRpcClient } from '@l2beat/shared'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import {
  decodeFunctionData,
  encodeFunctionResult,
  type Hex,
  parseAbi,
} from 'viem'
import { InteropConfigStore } from '../../engine/config/InteropConfigStore'
import {
  CCIPConfigPlugin,
  type CCIPNetwork,
  getKnownOffRamps,
  getOffRampsBySource,
} from './ccip.config'

const ROUTER_ABI = parseAbi([
  'function getOnRamp(uint64 destChainSelector) view returns (address)',
  'function getOffRamps() view returns ((uint64 sourceChainSelector, address offRamp)[])',
])

const ETHEREUM_SELECTOR = '5009297550715157269'
const ARBITRUM_SELECTOR = '4949039107694359620'
const UNLISTED_SELECTOR = '123'

const ROUTER = address('1')
const ON_RAMP_V16 = address('2')
const OFF_RAMP_V2 = address('3')
const RETIRED_OFF_RAMP = address('4')
const UNLISTED_OFF_RAMP = address('5')
const ROUTER_ON_RAMP = address('6')

const CHAINS_JSON = {
  mainnet: {
    chainSelector: ETHEREUM_SELECTOR,
    router: { address: ROUTER, version: '1.2.0' },
  },
  'ethereum-mainnet-arbitrum-1': { chainSelector: ARBITRUM_SELECTOR },
}

const LANES_JSON = {
  mainnet: {
    'ethereum-mainnet-arbitrum-1': {
      onRamp: { address: ON_RAMP_V16, version: '1.6.0' },
      offRamp: { address: OFF_RAMP_V2, version: '2.0.0' },
    },
  },
}

describe(CCIPConfigPlugin.name, () => {
  describe(CCIPConfigPlugin.prototype.getLatestNetworks.name, () => {
    it('adds every OffRamp registered on the Router, keyed by source chain', async () => {
      const plugin = createPlugin(
        rpcReturning({
          onRamps: { [ARBITRUM_SELECTOR]: ROUTER_ON_RAMP },
          offRamps: [
            [ARBITRUM_SELECTOR, OFF_RAMP_V2],
            [ARBITRUM_SELECTOR, RETIRED_OFF_RAMP],
            [UNLISTED_SELECTOR, UNLISTED_OFF_RAMP],
          ],
        }),
      )

      const { networks } = await plugin.getLatestNetworks()
      const ethereum = getNetwork(networks, 'ethereum')

      expect(ethereum.offRampV2).toEqual(OFF_RAMP_V2)
      expect(ethereum.offRampsBySource).toEqual({
        arbitrum: sorted([OFF_RAMP_V2, RETIRED_OFF_RAMP]),
        [`Unknown_${UNLISTED_SELECTOR}`]: [UNLISTED_OFF_RAMP],
      })
      expect(ethereum.offRamps).toEqual(
        sorted([OFF_RAMP_V2, RETIRED_OFF_RAMP, UNLISTED_OFF_RAMP]),
      )
      expect(ethereum.onRampsByDestination).toEqual({
        arbitrum: [ROUTER_ON_RAMP],
      })
    })

    it('keeps OffRamps from previous refreshes that the docs no longer list', async () => {
      const previous: CCIPNetwork = {
        chain: 'ethereum',
        chainSelector: ETHEREUM_SELECTOR,
        outboundLanes: {},
        inboundLanes: { base: RETIRED_OFF_RAMP },
        offRamp: UNLISTED_OFF_RAMP,
      }
      const plugin = createPlugin(undefined)

      const { networks } = await plugin.getLatestNetworks([previous])
      const ethereum = getNetwork(networks, 'ethereum')

      expect(ethereum.inboundLanes).toEqual({})
      expect(ethereum.offRampsBySource).toEqual({ base: [RETIRED_OFF_RAMP] })
      expect(ethereum.offRamps).toEqual(
        sorted([OFF_RAMP_V2, RETIRED_OFF_RAMP, UNLISTED_OFF_RAMP]),
      )
    })

    it('still resolves OnRamps when the OffRamp lookup fails', async () => {
      const plugin = createPlugin(
        rpcReturning({
          onRamps: { [ARBITRUM_SELECTOR]: ROUTER_ON_RAMP },
          offRamps: 'revert',
        }),
      )

      const { networks } = await plugin.getLatestNetworks()
      const ethereum = getNetwork(networks, 'ethereum')

      expect(ethereum.onRampsByDestination).toEqual({
        arbitrum: [ROUTER_ON_RAMP],
      })
      expect(ethereum.offRampsBySource).toEqual({})
      expect(ethereum.offRamps).toEqual([OFF_RAMP_V2])
    })
  })
})

describe(getKnownOffRamps.name, () => {
  it('reads configs persisted before OffRamp history existed', () => {
    const network: CCIPNetwork = {
      chain: 'ethereum',
      chainSelector: ETHEREUM_SELECTOR,
      outboundLanes: {},
      inboundLanes: { arbitrum: RETIRED_OFF_RAMP },
      offRamp: UNLISTED_OFF_RAMP,
      offRampV2: OFF_RAMP_V2,
    }

    expect(getOffRampsBySource(network)).toEqual({
      arbitrum: [RETIRED_OFF_RAMP],
    })
    expect(getKnownOffRamps(network)).toEqual(
      sorted([OFF_RAMP_V2, RETIRED_OFF_RAMP, UNLISTED_OFF_RAMP]),
    )
  })
})

function createPlugin(rpc: IRpcClient | undefined) {
  const http = mockObject<HttpClient>({
    fetchRaw: mockFn(async (url: string) => {
      const body = url.endsWith('chains.json') ? CHAINS_JSON : LANES_JSON
      return { json: async () => body } as unknown as Response
    }),
  })
  return new CCIPConfigPlugin(
    [{ name: 'ethereum' }, { name: 'arbitrum' }],
    new InteropConfigStore(undefined),
    Logger.SILENT,
    http,
    rpc ? new Map([['ethereum', rpc]]) : new Map(),
    60_000,
  )
}

function rpcReturning(options: {
  onRamps: Record<string, EthereumAddress>
  offRamps: [string, EthereumAddress][] | 'revert'
}) {
  return mockObject<IRpcClient>({
    getLatestBlockNumber: mockFn().resolvesTo(100),
    isMulticallDeployed: () => false,
    call: mockFn(async (call: CallParameters) => {
      const { functionName, args } = decodeFunctionData({
        abi: ROUTER_ABI,
        data: call.input.toString() as Hex,
      })
      if (functionName === 'getOnRamp') {
        const onRamp =
          options.onRamps[args[0].toString()] ?? EthereumAddress.ZERO
        return encodeResult('getOnRamp', onRamp)
      }
      if (options.offRamps === 'revert') {
        throw new Error('execution reverted')
      }
      return encodeResult(
        'getOffRamps',
        options.offRamps.map(([sourceChainSelector, offRamp]) => ({
          sourceChainSelector: BigInt(sourceChainSelector),
          offRamp,
        })),
      )
    }),
  })
}

function encodeResult(
  functionName: 'getOnRamp' | 'getOffRamps',
  result: unknown,
) {
  return Bytes.fromHex(
    encodeFunctionResult({
      abi: ROUTER_ABI,
      functionName,
      result,
    } as Parameters<typeof encodeFunctionResult>[0]),
  )
}

function getNetwork(networks: CCIPNetwork[], chain: string): CCIPNetwork {
  const network = networks.find((n) => n.chain === chain)
  if (!network) throw new Error(`Missing network ${chain}`)
  return network
}

function address(digit: string) {
  return EthereumAddress(`0x${digit.repeat(40)}`)
}

function sorted(addresses: EthereumAddress[]) {
  return [...addresses].sort()
}
