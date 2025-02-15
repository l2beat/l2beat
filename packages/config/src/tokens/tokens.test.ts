import { Logger, getEnv } from '@l2beat/backend-tools'
import { CoingeckoClient, HttpClient } from '@l2beat/shared'
import {
  assert,
  AssetId,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  type Token,
} from '@l2beat/shared-pure'
import { expect } from 'earl'
import { Contract, providers, utils } from 'ethers'
import { bridges } from '../projects/bridges'
import { chains } from '../projects/chains'
import { tokenList } from './tokens'

// Github actions sets env as an empty string when secret is not set
// this resulted in a bug on the outside contributors PRs
// workaround: getting and optional string and then doing OR (||)
// nullish coalescing (??) will not give expected result
const config = {
  alchemyApiKey:
    getEnv().optionalString('CONFIG_ALCHEMY_API_KEY') ||
    'mlGD422scpwVOpn3lye_swHEebbKQy0D',

  coingeckoApiKey: getEnv().optionalString('COINGECKO_API_KEY') || undefined,
}

describe('tokens', () => {
  it('every token has a unique address and chainId', () => {
    const tokens = tokenList.map((x) =>
      JSON.stringify({
        address: x.address,
        chainId: x.chainId,
      }),
    )
    const everyUnique = tokens.every((x, i) => tokens.indexOf(x) === i)
    expect(everyUnique).toEqual(true)
  })

  it('every token has a unique id', () => {
    const ids = tokenList.map((x) => x.id)
    const everyUnique = ids.every((x, i) => ids.indexOf(x) === i)
    expect(everyUnique).toEqual(true)
  })

  it('every token has a chain with minTimestampForTvl', () => {
    for (const token of tokenList) {
      const chain = chains.find((c) => c.chainId === +token.chainId)
      assert(chain, `Chain not found for token ${token.symbol}`)
      assert(
        chain.minTimestampForTvl,
        `Token ${token.symbol} added for chain without minTimestampForTvl ${chain.name}`,
      )
    }
  })

  describe('canonical', () => {
    const canonicalTokenList: Token[] = tokenList.filter(
      (t) => t.source === 'canonical' && t.chainId === ChainId.ETHEREUM,
    )

    describe('metadata is correct', function () {
      this.timeout(10_000)
      const MULTICALL_ADDRESS = '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441'
      const ABI = [
        'function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)',
        'function name() view returns (string)',
        'function symbol() view returns (string)',
        'function decimals() view returns (uint8)',
      ]
      const CODER = new utils.Interface(ABI)
      const NAME_CALL = CODER.encodeFunctionData('name')
      const SYMBOL_CALL = CODER.encodeFunctionData('symbol')
      const DECIMALS = CODER.encodeFunctionData('decimals')

      interface Metadata {
        name: string
        symbol: string
        decimals: number
      }
      const results: Record<string, Metadata> = {}
      const checkedTokens = canonicalTokenList.filter(
        (x) => x.id !== AssetId('op-optimism'),
      )

      before('fetch metadata', async () => {
        const provider = new providers.AlchemyProvider(
          'mainnet',
          config.alchemyApiKey,
        )
        const contract = new Contract(MULTICALL_ADDRESS, CODER, provider)

        const calls = checkedTokens.flatMap((x) =>
          !x.address
            ? []
            : [
                [x.address, NAME_CALL],
                [x.address, SYMBOL_CALL],
                [x.address, DECIMALS],
              ],
        )
        let data: string[] = []

        try {
          data = (await contract.functions.aggregate(calls))[1]
        } catch (error) {
          // @ts-expect-error Alchemy error is not typed
          const errorBody = error.error.body
          const message = JSON.parse(errorBody).error.message

          if (message) {
            throw new Error('Multicall failed. Alchemy error: ' + message)
          } else {
            throw error
          }
        }

        for (let i = 0; i < calls.length; i += 3) {
          const nameResult = data[i]
          const symbolResult = data[i + 1]
          const decimalsResult = data[i + 2]
          results[calls[i][0].toString()] = {
            name: decodeString(nameResult),
            symbol: decodeString(symbolResult),
            decimals: decodeNumber(decimalsResult),
          }
        }
      })

      function decodeString(hex: string) {
        try {
          return CODER.decodeFunctionResult('name', hex)[0] as string
        } catch {
          // This is a special case because MKR is broken and encodes name and
          // symbol as bytes32 null terminated strings
          let result = ''
          for (let i = 2; i < hex.length; i += 2) {
            const byte = hex[i] + hex[i + 1]
            if (byte === '00') {
              break
            }
            result += String.fromCharCode(parseInt(byte, 16))
          }
          return result
        }
      }

      function decodeNumber(hex: string) {
        return CODER.decodeFunctionResult('decimals', hex)[0] as number
      }

      for (const token of checkedTokens) {
        it(token.symbol, () => {
          if (!token.address) {
            return
          }
          expect(token.name).toEqual(results[token.address.toString()].name)
          expect(token.symbol).toEqual(results[token.address.toString()].symbol)
          expect(token.decimals).toEqual(
            results[token.address.toString()].decimals,
          )
        })
      }
    })

    it('every token has correct CoingeckoId', async function () {
      this.timeout(10000)

      const http = new HttpClient()
      const coingeckoClient = new CoingeckoClient({
        apiKey: config.coingeckoApiKey,
        http,
        retryStrategy: 'TEST',
        logger: Logger.SILENT,
        callsPerMinute: 10,
        sourceName: 'coingeckoApi',
      })

      const coinsList = await coingeckoClient.getCoinList({
        includePlatform: true,
      })

      const result = new Map<EthereumAddress, CoingeckoId | undefined>()

      coinsList.map((coin) => {
        if (coin.platforms.ethereum)
          result.set(EthereumAddress(coin.platforms.ethereum), coin.id)
      })

      canonicalTokenList.map((token) => {
        if (token.symbol === 'ETH') {
          expect(token.coingeckoId).toEqual(CoingeckoId('ethereum'))
        } else if (token.id === AssetId.WUSDM) {
          // TODO(radomski): This is a short term solution to the problem of
          // wrapped token prices. wUSDM is ~15% of Manta Pacific TVL but the
          // Coingecko price chart for the _WRAPPED_ version of this token is
          // broken. After an investigation we've decided to temporally
          // approximate the price of the wUSDM to be the same as the
          // non-wrapped source (USDM). In reality at the time of writing this
          // comment it's more like
          //
          // 1wUSDM = 1.0118 USDM
          //
          // A more generalized solution is required. But since we can't
          // stall forever until the perfect solution is ready we accept this
          // approximation. A generalized solution would determine the price
          // of a token based on the price of a different token times some
          // multiplier. Where the multiplier can be dynamic, that means it
          // requires calling a custom typescript function. Further work will
          // be cooperated by @antooni, refer to him for further questions
          //
          // - 3 January 2024
          //
          expect(token.coingeckoId).toEqual(
            CoingeckoId('mountain-protocol-usdm'),
          )
        } else if (token.id === AssetId.YBETH) {
          // TODO(maciekzygmunt): ybETH is a yield-bearing token version of vETH,
          // and its price should increase relative to vETH over time. Currently, the
          // price of ybETH is not available on CoinGecko, so we are using the price
          // of vETH as a placeholder. For now, the difference is not significant, so
          // there shouldn't be a major impact on TVL calculations. This should be updated
          // in the future when the price is added to CoinGecko.
          //
          // - 8 October 2024
          expect(token.coingeckoId).toEqual(CoingeckoId('veno-eth'))
        } else {
          const expectedId = token.address && result.get(token.address)

          if (expectedId === CoingeckoId('spectrum-eth')) {
            expect(token.coingeckoId).toEqual(CoingeckoId('wrapped-eeth'))
          } else if (expectedId) {
            expect(token.coingeckoId).toEqual(expectedId)
          }
        }
      })
    })
  })
  describe('external', () => {
    it('every external token has a bridgedUsing property', () => {
      const externalTokens = tokenList
        .filter((token) => token.source === 'external' && !token.bridgedUsing)
        .map((token) => token.symbol)
      expect(externalTokens).toHaveLength(0)
    })
    it('every bridge slug in bridgedUsing property is valid', () => {
      const tokenSlugs = tokenList
        .filter(
          (token) =>
            token.source === 'external' &&
            token.bridgedUsing?.bridges.some((b) => b.slug),
        )
        .flatMap((token) => token.bridgedUsing?.bridges.map((b) => b.slug))
      const bridgesSlugs = bridges.map((bridge) => bridge.display.slug)
      const invalidSlugs = tokenSlugs.filter(
        (slug) => !bridgesSlugs.includes(slug!),
      )

      expect(invalidSlugs).toHaveLength(0)
    })
  })
})
