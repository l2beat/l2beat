import { toFunctionSelector } from 'viem'
import type { Address, Chain, TokenConfig } from '../../../../config/types'
import type { DecodedCall, Value } from '../DecodedResult'
import type { NestedCall } from './types'
import { BinaryReader, tokenAmount } from './utils'

const selectors = {
  batch: toFunctionSelector('function batch()'),
}

export function whitebitBatchPlugin(
  call: DecodedCall,
  chain: Chain,
  _: Address | undefined,
  tokens: TokenConfig,
): NestedCall[] | false {
  if (call.selector !== selectors.batch) {
    return false
  }
  if (call.extra !== undefined) {
    try {
      const value = decodeBatch(call.extra, chain, tokens)
      call.arguments = [value]
      call.extra = undefined
      return []
    } catch {}
  }
  return []
}

function decodeBatch(
  data: `0x${string}`,
  chain: Chain,
  tokens: TokenConfig,
): Value {
  const reader = new BinaryReader(data)
  const count = Number(reader.read(1))

  const triplets = Array.from({ length: count }).map(() => ({
    tokenIndex: Number(reader.read(1)),
    addressIndex: Number(reader.read(1)),
    amountIndex: Number(reader.read(1)),
  }))

  const values: `0x${string}`[] = []
  while (!reader.isAtEnd()) {
    values.push(reader.read(20))
  }

  const results = triplets.map((t): Value => {
    const token = values[t.tokenIndex]
    const address = values[t.addressIndex]
    const amount = values[t.amountIndex]

    if ((!token && t.tokenIndex !== 255) || !address || !amount) {
      throw new Error('Invalid encoding')
    }

    const amountValue: Value = {
      name: 'amount',
      abi: 'uint20',
      encoded: amount,
      decoded: {
        type: 'number',
        value: BigInt(amount).toString(),
      },
    }
    if (token) {
      tokenAmount(amountValue, `${chain.shortName}:${token}`, chain, tokens)
    } else {
      amountValue.decoded = {
        type: 'amount',
        value: BigInt(amount).toString(),
        decimals: 18,
        currency: 'ETH',
      }
    }

    return {
      name: '',
      abi: '(address, address, uint20)',
      encoded: '0x',
      decoded: {
        type: 'array',
        values: [
          {
            name: 'token',
            abi: 'address',
            encoded: token ?? '0x',
            decoded: token
              ? {
                  type: 'address',
                  value: `${chain.shortName}:${token}`,
                  explorerLink: `${chain.explorerUrl}/address/${token}`,
                }
              : {
                  type: 'string',
                  value: 'ETH',
                },
          },
          {
            name: 'address',
            abi: 'address',
            encoded: address,
            decoded: {
              type: 'address',
              value: `${chain.shortName}:${address}`,
              explorerLink: `${chain.explorerUrl}/address/${address}`,
            },
          },
          amountValue,
        ],
      },
    }
  })

  return {
    name: 'items',
    abi: 'custom',
    encoded: data,
    decoded: {
      type: 'array',
      values: results,
    },
  }
}
