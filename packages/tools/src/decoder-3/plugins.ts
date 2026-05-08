import { toFunctionSelector } from 'viem'
import { type DecodedValue, decodeType } from './decode'

const plugins = [multiSendPlugin]

export function decode(
  data: `0x${string}`,
  signatures: string[],
  chainId: number,
  address?: `0x${string}`,
): DecodedValue | undefined {
  for (const plugin of plugins) {
    try {
      const value = plugin(data, chainId, address)
      if (value) return value
    } catch {}
  }
  for (const signature of signatures) {
    try {
      return decodeType(signature, data, chainId, address)
    } catch {}
  }
}

const MULTISEND_SELECTOR = toFunctionSelector(
  'function multiSend(bytes transactions)',
)
function multiSendPlugin(
  data: `0x${string}`,
  chainId: number,
  address?: `0x${string}`,
): DecodedValue | undefined {
  if (data.slice(0, 10) !== MULTISEND_SELECTOR) return

  const decoded = decodeType(
    'function multiSend(bytes transactions)',
    data,
    chainId,
    address,
  )
  const bytes = decoded.members?.[0]?.bytes ?? '0x'

  const reader = new BinaryReader(bytes)
  const values: DecodedValue[] = []

  let i = 0
  while (!reader.isAtEnd()) {
    const callMembers: DecodedValue[] = []

    const operation = reader.read(1) // operation: call or delegatecall, ignored
    callMembers.push({
      type: 'number',
      name: 'operation',
      bytes: operation,
      value: Number(operation).toString(),
      chainId,
    })

    const target = reader.read(20)
    callMembers.push({
      type: 'address',
      name: 'target',
      bytes: target,
      value: target,
      chainId,
    })

    const value = reader.read(32)
    callMembers.push({
      type: 'number',
      name: 'value',
      bytes: value,
      value: BigInt(value).toString(),
      chainId,
    })

    const length = Number(reader.read(32))
    const data = reader.read(length)
    callMembers.push({
      type: 'bytes',
      name: 'data',
      bytes: data,
      value: data,
      chainId,
      address: target,
    })

    values.push({
      name: (i++).toString(),
      type: 'array',
      bytes: '0x',
      value: '',
      members: callMembers,
      chainId,
    })
  }
  decoded.members = values
  return decoded
}

class BinaryReader {
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
}
