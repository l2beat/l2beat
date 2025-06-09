import { toFunctionSelector } from 'viem'
import type { Address, Chain } from '../../../../config/types'
import type { DecodedCall, DecodedValue, Value } from '../DecodedResult'
import type { NestedCall } from './types'
import { BinaryReader } from './utils'

const selectors = {
  multiSend: toFunctionSelector('function multiSend(bytes transactions)'),
}

export function multiSendPlugin(
  call: DecodedCall,
  chain: Chain,
): NestedCall[] | false {
  if (call.selector !== selectors.multiSend) {
    return false
  }
  if (call.arguments[0]?.decoded?.type === 'bytes') {
    try {
      const [value, calls] = decodeMultisend(
        call.arguments[0].decoded.value,
        chain,
      )
      call.arguments[0].decoded = value
      return calls
    } catch (e) {
      console.error(e)
    }
  }
  return []
}

function decodeMultisend(
  data: `0x${string}`,
  chain: Chain,
): [DecodedValue, NestedCall[]] {
  const reader = new BinaryReader(data)
  const values: Value[] = []
  const calls: NestedCall[] = []
  while (!reader.isAtEnd()) {
    reader.read(1) // operation: call or delegatecall, ignored
    const to = reader.read(20)
    const address: Address = `${chain.shortName}:${to}`
    const value = reader.read(32)
    const length = Number(reader.read(32))
    const data = reader.read(length)

    const bytes: Value = {
      name: 'data',
      abi: 'bytes',
      encoded: data,
      decoded: { type: 'bytes', value: data, dynamic: true },
    }
    values.push({
      name: '',
      abi: '(address, uint256, bytes)',
      encoded: reader.sliceFromHere(-(length + 32 + 32 + 20 + 1), 0),
      decoded: {
        type: 'array',
        values: [
          {
            name: 'to',
            abi: 'address',
            encoded: to,
            decoded: {
              type: 'address',
              value: address,
              explorerLink: `${chain.explorerUrl}/address/${to}`,
            },
          },
          {
            name: 'value',
            abi: 'uint256',
            encoded: value,
            decoded: {
              type: 'amount',
              currency: chain.nativeCurrency.symbol,
              decimals: chain.nativeCurrency.decimals,
              value: BigInt(value).toString(),
            },
          },
          bytes,
        ],
      },
    })
    calls.push({ to: address, data: bytes })
  }
  return [{ type: 'array', values }, calls]
}
