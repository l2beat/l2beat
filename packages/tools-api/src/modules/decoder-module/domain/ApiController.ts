import { inflateRawSync } from 'zlib'
import type { Chain } from '../../../config/types'
import type { AlchemyClient } from '../../../third-party/AlchemyClient'
import type { IAddressService } from './AddressService'
import type { Decoder, Transaction } from './Decoder'
import type { ISignatureService } from './SignatureService'

export interface ApiQuery {
  hash?: `0x${string}`
  data?: string
  to?: `0x${string}`
  chainId?: number
}

export type LookupQuery =
  | { type: 'address'; chainId: number; address: `0x${string}` }
  | { type: 'selector'; selector: `0x${string}` }

export interface LookupResult {
  signature: string
  selector: `0x${string}`
  chainId?: number
  address?: `0x${string}`
}

export interface TransactionQuery {
  chainId?: number
  hash: `0x${string}`
}

export interface TransactionResult {
  hash: `0x${string}`
  chainId: number
  to: `0x${string}` | undefined
  data: `0x${string}`
}

export class ApiController {
  constructor(
    private decoder: Decoder,
    private signatureService: ISignatureService,
    private addressService: IAddressService,
    private alchemyClient: AlchemyClient,
    private chains: Chain[],
  ) {}

  async lookup(queries: LookupQuery[]): Promise<LookupResult[]> {
    const results = await Promise.all(
      queries.map(async (q) => {
        if (q.type === 'selector') {
          const entries = await this.signatureService.lookup(q.selector)
          return entries.map(
            (signature): LookupResult => ({
              signature: signature,
              selector: q.selector,
            }),
          )
        }
        if (q.type === 'address') {
          const chain = this.chains.find((x) => x.chainId === q.chainId)
          if (!chain) return []
          const result = await this.addressService
            .lookup(`${chain.shortName}:${q.address}`)
            .catch(() => undefined)
          if (!result) return []
          return result.abi.map(
            (v): LookupResult => ({
              signature: v.signature,
              selector: v.selector,
              address: q.address,
              chainId: q.chainId,
            }),
          )
        }
        return []
      }),
    )
    return results.flat()
  }

  async getTx(query: TransactionQuery): Promise<TransactionResult | null> {
    try {
      const tx = await this.toTx(query)
      return {
        hash: query.hash,
        chainId: tx.chain.chainId,
        to: tx.to ? (tx.to.split(':')[1] as `0x${string}`) : undefined,
        data: tx.data,
      }
    } catch (e) {
      if (e instanceof Error && e.message.includes('Transaction not found!')) {
        return null
      }
      throw e
    }
  }

  async handle(query: ApiQuery) {
    const tx = await this.toTx(query)
    const result = await this.decoder.decode(tx)
    if (query.hash) {
      result.transaction = {
        hash: query.hash,
        explorerLink: `${tx.chain.explorerUrl}/tx/${query.hash}`,
      }
    }
    return result
  }

  private async toTx(query: ApiQuery): Promise<Transaction> {
    const hash = query.hash
    if (!hash) {
      if (!query.data) {
        throw new Error('No data')
      }

      const chainId = query.chainId ?? 1
      const chain = this.chains.find((x) => x.chainId === chainId)
      if (!chain) {
        throw new Error('Unknown chain id!')
      }

      return {
        data: decodeCalldata(query.data),
        to: query.to ? `${chain.shortName}:${query.to}` : undefined,
        chain,
      }
    }

    if (query.chainId) {
      const chain = this.chains.find((x) => x.chainId === query.chainId)
      if (!chain) {
        throw new Error('Unknown chain id!')
      }
      const tx = await this.alchemyClient.getTransaction(hash, chain)
      if (!tx) {
        throw new Error('Transaction not found!')
      }
      return { chain, data: tx.data, to: tx.to }
    }

    const results = await Promise.allSettled(
      this.chains.map(async (c): Promise<Transaction | undefined> => {
        const tx = await this.alchemyClient.getTransaction(hash, c)
        if (tx) {
          return { chain: c, data: tx.data, to: tx.to }
        }
      }),
    )
    for (const res of results) {
      if (res.status === 'fulfilled' && res.value) {
        return res.value
      }
    }
    throw new Error('Transaction not found!')
  }
}

function decodeCalldata(calldata: string): `0x${string}` {
  if (calldata.length > 4096) {
    throw new Error('Calldata too long')
  }

  const compressedBytes = urlSafeBase64Decode(calldata)
  const bytes = inflateRawSync(compressedBytes, { maxOutputLength: 128 * 1024 })
  const result = `0x${bytes.toString('hex')}` as const
  return result
}

function urlSafeBase64Decode(data: string): Buffer {
  const replaced = data
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(data.length + ((4 - (data.length % 4)) % 4), '=')

  return Buffer.from(replaced, 'base64')
}
