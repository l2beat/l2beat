import { Layer2Provider, Layer3Provider } from '@l2beat/config'
import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { Type, extendType, string } from 'cmd-ts'

export const EthereumAddressValue: Type<string, EthereumAddress> = {
  async from(str): Promise<EthereumAddress> {
    return new Promise((resolve, _) => {
      resolve(EthereumAddress(str))
    })
  },
}

const SUPPORTED_STACKS: {
  stack: Layer2Provider | Layer3Provider
  slug: string
}[] = [
  { stack: 'Arbitrum', slug: 'arbitrum' },
  { stack: 'Loopring', slug: 'loopring' },
  { stack: 'OP Stack', slug: 'opstack' },
  { stack: 'OVM', slug: 'ovm' },
  { stack: 'Polygon', slug: 'polygon' },
  { stack: 'StarkEx', slug: 'starkex' },
  { stack: 'Starknet', slug: 'starknet' },
  { stack: 'ZK Stack', slug: 'zks' },
  { stack: 'ZKsync Lite', slug: 'zksync' },
]

export const ProjectStack = extendType(string, {
  async from(slug) {
    const result = SUPPORTED_STACKS.find((x) => x.slug === slug)?.stack
    assert(
      result !== undefined,
      `You need to provide a valid stack, choose from ${SUPPORTED_STACKS.map(
        (x) => x.slug,
      ).join(', ')}`,
    )
    return result
  },
})
