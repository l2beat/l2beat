import {
  LEVEL,
  type LogLevel,
} from '@l2beat/backend-tools/dist/logger/LogLevel'
import { assert, EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import { extendType, string, type Type } from 'cmd-ts'
import { stat } from 'fs/promises'

export const EthereumAddressValue: Type<string, EthereumAddress> = {
  from(str): Promise<EthereumAddress> {
    return new Promise((resolve, _) => {
      resolve(EthereumAddress(str))
    })
  },
}

export function Separated<T>(
  type: Type<string, T>,
  separator = ',',
): Type<string, T[]> {
  return {
    async from(str) {
      const values = str.split(separator)
      const parsed = await Promise.all(values.map(type.from))
      return parsed
    },
  }
}

export const PositiveRpcBoundNumber: Type<string, number> = extendType(string, {
  async from(str) {
    const num = await Promise.resolve(Number.parseInt(str, 10))
    assert(
      !isNaN(num) && num > 0 && num <= 1000000,
      'Call rate bound per minute must be a positive integer between 1 and 1,000,000',
    )
    return num
  },
})

export const Hash256Value: Type<string, Hash256> = {
  from(str): Promise<Hash256> {
    return new Promise((resolve, _) => {
      resolve(Hash256(str))
    })
  },
}

export const LogLevelValue: Type<string, LogLevel> = {
  from(str): Promise<LogLevel> {
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
