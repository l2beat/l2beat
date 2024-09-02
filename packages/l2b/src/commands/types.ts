import { LEVEL, LogLevel } from '@l2beat/backend-tools/dist/logger/LogLevel'
import { Layer2Provider, Layer3Provider } from '@l2beat/config'
import { assert, EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import { Type, extendType, string } from 'cmd-ts'
import { stat } from 'fs/promises'

export const EthereumAddressValue: Type<string, EthereumAddress> = {
  async from(str): Promise<EthereumAddress> {
    return new Promise((resolve, _) => {
      resolve(EthereumAddress(str))
    })
  },
}

export const PositiveRpcBoundNumber: Type<string, number> = extendType(string, {
  async from(str) {
    const num = await Promise.resolve(parseInt(str, 10))
    assert(
      !isNaN(num) && num > 0 && num <= 1000000,
      'Call rate bound per minute must be a positive integer between 1 and 1,000,000',
    )
    return num
  },
})

export const Hash256Value: Type<string, Hash256> = {
  async from(str): Promise<Hash256> {
    return new Promise((resolve, _) => {
      resolve(Hash256(str))
    })
  },
}

export const LogLevelValue: Type<string, LogLevel> = {
  async from(str): Promise<LogLevel> {
    return new Promise((resolve, reject) => {
      if (LEVEL[str as keyof typeof LEVEL] !== undefined) {
        resolve(str as LogLevel)
      } else {
        const allLogLevels = Object.keys(LEVEL).join(', ')
        reject(new Error(`Undefined LogLevel provided, use ${allLogLevels}`))
      }
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

export const ExistingPath = extendType(string, {
  async from(path) {
    const stats = await stat(path)
    assert(stats.isDirectory() || stats.isFile(), 'Path does not exist')
    return path
  },
})

export const Directory = extendType(string, {
  async from(path) {
    const stats = await stat(path)
    assert(stats.isDirectory(), 'Path does not exist')
    return path
  },
})

export const File = extendType(string, {
  async from(path) {
    const stats = await stat(path)
    assert(stats.isFile(), 'Path does not exist')
    return path
  },
})

export const HttpUrl = extendType(string, {
  // biome-ignore lint/suspicious/useAwait: does not work without async
  async from(url) {
    assert(
      url.startsWith('http://') || url.startsWith('https://'),
      'URL must start with http:// or https://',
    )
    return url
  },
})
