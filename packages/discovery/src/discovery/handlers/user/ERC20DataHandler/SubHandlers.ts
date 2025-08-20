import {
  assert,
  ChainSpecificAddress,
  type EthereumAddress,
} from '@l2beat/shared-pure'
import type { IProvider } from '../../../provider/IProvider'

type ERC20SubHandlerDeps = {
  provider: IProvider
  address: ChainSpecificAddress
  abi: string[]
}

type ERC20SubHandler<T> = {
  classify: (deps: ERC20SubHandlerDeps) => Promise<boolean> | boolean
  execute: (deps: ERC20SubHandlerDeps) => Promise<T> | T
}

type OpCanonicalResult = {
  canonical: boolean
  underlying?: ChainSpecificAddress
}

export const OpCanonical: ERC20SubHandler<OpCanonicalResult> = {
  classify: ({ abi }) => {
    return (
      abi.includes('function bridge() view returns (address)') &&
      abi.includes('function l1Token() view returns (address)')
    )
  },
  execute: async ({ provider, address }) => {
    const bridgeCall = provider.callMethod<EthereumAddress>(
      address,
      'function bridge() view returns (address)',
      [],
    )

    const l1TokenCall = provider.callMethod<EthereumAddress>(
      address,
      'function l1Token() view returns (address)',
      [],
    )

    const [bridge, l1Token] = await Promise.all([bridgeCall, l1TokenCall])

    assert(
      bridge && l1Token,
      'bridge or l1token not found even though it should be',
    )

    return {
      canonical:
        bridge.toLowerCase() === '0x4200000000000000000000000000000000000010',
      underlying: ChainSpecificAddress.fromLong('ethereum', l1Token),
    }
  },
}
