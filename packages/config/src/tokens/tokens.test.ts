import { CoingeckoClient, HttpClient } from '@l2beat/shared'
import { AssetId, CoingeckoId, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { Contract, providers, utils } from 'ethers'

import { config } from '../test/config'
import { tokenList } from './tokens'

describe('tokens', () => {
  const addresses = tokenList.map((x) => x.address)

  it('every token has a unique address', () => {
    const everyUnique = addresses.every((x, i) => addresses.indexOf(x) === i)
    expect(everyUnique).toEqual(true)
  })

  it('every token has a unique symbol', () => {
    const symbols = tokenList.map((x) => x.symbol)
    const everyUnique = symbols.every((x, i) => symbols.indexOf(x) === i)
    expect(everyUnique).toEqual(true)
  })

  it('tokens are ordered alphabetically', () => {
    const names = tokenList.map((x) => x.name)
    const sorted = [...names].sort((a, b) => a.localeCompare(b))
    expect(names).toEqual(sorted)
  })

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
    const checkedTokens = tokenList.filter(
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const data: string[] = (await contract.functions.aggregate(calls))[1]
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
    const coingeckoClient = new CoingeckoClient(
      http,
      process.env.COINGECKO_API_KEY,
    )

    const coinsList = await coingeckoClient.getCoinList({
      includePlatform: true,
    })

    const result = new Map<EthereumAddress, CoingeckoId | undefined>()

    coinsList.map((coin) => {
      if (coin.platforms.ethereum)
        result.set(EthereumAddress(coin.platforms.ethereum), coin.id)
    })

    tokenList.map((token) => {
      if (token.symbol === 'ETH') {
        expect(token.coingeckoId).toEqual(CoingeckoId('ethereum'))
      } else {
        const expectedId = token.address && result.get(token.address)
        if (expectedId) {
          expect(token.coingeckoId).toEqual(expectedId)
        }
      }
    })
  })
})
