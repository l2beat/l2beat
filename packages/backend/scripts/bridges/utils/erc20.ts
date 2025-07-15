import type { RpcClient } from '@l2beat/shared'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import {
  decodeFunctionResult,
  encodeFunctionData,
  type Hex,
  parseAbi,
} from 'viem'
import type { Receive } from '../types/Receive'
import type { Send } from '../types/Send'

const ERC20 = parseAbi([
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
])

export async function getTokenAmount(
  rpc: RpcClient,
  decoded: Send | Receive,
  start: number,
) {
  try {
    const decimals = await rpc.call(
      {
        to: EthereumAddress(decoded.token.split(':')[1]),
        data: Bytes.fromHex(
          encodeFunctionData({ abi: ERC20, functionName: 'decimals' }),
        ),
      },
      start,
    )

    const dec = decodeFunctionResult({
      abi: ERC20,
      functionName: 'decimals',
      data: decimals.toString() as unknown as Hex,
    })

    const decimalShift = BigInt(dec) - 4n
    const divisor = decimalShift > 0n ? 10n ** decimalShift : 1n
    const amount = Number(BigInt(decoded.amount) / divisor) / 10000
    return amount
  } catch {
    return `(failed to calculate) ${decoded.amount}`
  }
}

export async function getTokenSymbol(
  rpc: RpcClient,
  decoded: Send | Receive,
  start: number,
) {
  try {
    const symbol = await rpc.call(
      {
        to: EthereumAddress(decoded.token.split(':')[1]),
        data: Bytes.fromHex(
          encodeFunctionData({ abi: ERC20, functionName: 'symbol' }),
        ),
      },
      start,
    )

    const token = decodeFunctionResult({
      abi: ERC20,
      functionName: 'symbol',
      data: symbol.toString() as unknown as Hex,
    })
    return token
  } catch {
    return decoded?.token
  }
}
