import type { Address, Chain, TokenConfig } from '../../../../config/types'
import type { Value } from '../DecodedResult'

export function tokenAmount(
  value: Value | undefined,
  address: Address | undefined,
  chain: Chain,
  tokens: TokenConfig,
) {
  const token = address && tokens[address]
  const decimals = token?.decimals ?? 18 // We use 18 as the most common default
  const currency = token?.name ?? '???'

  if (value?.decoded?.type === 'number') {
    value.decoded = {
      type: 'amount',
      value: value.decoded.value,
      decimals,
      currency,
      currencyLink:
        address && `${chain.explorerUrl}/address/${address.split(':')[1]}`,
    }
  }
}

export class BinaryReader {
  private position = 0
  constructor(private readonly input: `0x${string}`) {}

  isAtEnd() {
    return !this.has(1)
  }

  get length() {
    return this.input.length / 2 - 1
  }

  has(n: number) {
    return this.position + n <= this.length
  }

  read(n: number): `0x${string}` {
    if (!this.has(n)) {
      throw new Error(
        `Cannot read ${n} bytes. Position: ${this.position}, total: ${this.length}`,
      )
    }

    const start = this.position * 2 + 2
    const slice = this.input.slice(start, start + n * 2)
    this.position += n
    return `0x${slice}`
  }

  sliceFromHere(start: number, end: number): `0x${string}` {
    const at = this.position * 2 + 2
    start = clamp(at + start * 2, 2, this.input.length)
    end = clamp(at + end * 2, 2, this.input.length)
    return `0x${this.input.slice(start, end)}`
  }
}

function clamp(v: number, min: number, max: number) {
  if (v < min) return min
  if (v > max) return max
  return v
}
