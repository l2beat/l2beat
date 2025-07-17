import { Bytes, ChainSpecificAddress } from '@l2beat/shared-pure'
import type { IProvider } from '../../provider/IProvider'
import type { ProxyDetails } from '../types'

const LEADING_BYTECODE = Bytes.fromHex('0x363d3d373d3d3d363d73')
const TRAILING_BYTECODE = Bytes.fromHex('0x5af43d82803e903d91602b57fd5bf3')
const ETHEREUM_ADDRESS_LENGTH = 20

export async function detectEip1167Proxy(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ProxyDetails | undefined> {
  const bytecode = await provider.getBytecode(address)

  let left = 0
  const leading = bytecode.slice(left, LEADING_BYTECODE.length)
  left += LEADING_BYTECODE.length

  if (!leading.equals(LEADING_BYTECODE)) {
    return undefined
  }

  const addressBytes = bytecode.slice(left, left + ETHEREUM_ADDRESS_LENGTH)
  left += ETHEREUM_ADDRESS_LENGTH

  const trailing = bytecode.slice(left, left + TRAILING_BYTECODE.length)

  if (!trailing.equals(TRAILING_BYTECODE)) {
    return undefined
  }

  return {
    type: 'EIP1167 proxy',
    values: {
      $implementation: ChainSpecificAddress.fromLong(
        provider.chain,
        addressBytes.toString(),
      ),
    },
  }
}
