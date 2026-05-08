import { getCreate2Address, toFunctionSelector } from 'viem'
import { type DecodedValue, decodeType } from './decode'

const plugins = [multiSendPlugin, create2FactoryPlugin]

export function decode(
  data: `0x${string}`,
  signatures: string[],
  chainId: number,
  address?: `0x${string}`,
): DecodedValue | undefined {
  let value: DecodedValue | undefined
  for (const plugin of plugins) {
    try {
      value = plugin(data, chainId, address)
      if (value) break
    } catch {}
  }
  if (!value) {
    for (const signature of signatures) {
      try {
        value = decodeType(signature, data, chainId, address)
        if (value) break
      } catch {}
    }
  }
  if (value) applyCallTargetHeuristic(value)
  return value
}

const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

function applyCallTargetHeuristic(value: DecodedValue) {
  if (!value.members) return
  const target = value.members.find(
    (x) => x.type === 'address' && x.value !== ADDRESS_ZERO,
  )?.value
  for (const member of value.members) {
    applyCallTargetHeuristic(member)
    if (target && member.type === 'bytes') {
      member.address = target as `0x${string}`
    }
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

const CREATE2_DEPLOYER = '0x4e59b44847b379578588920ca78fbf26c0b4956c'

function create2FactoryPlugin(
  data: `0x${string}`,
  chainId: number,
  address?: `0x${string}`,
): DecodedValue | undefined {
  if (address !== CREATE2_DEPLOYER) return
  const salt = data.slice(0, 66) as `0x${string}`
  const bytecode: `0x${string}` = `0x${data.slice(66)}`
  const deployment = getCreate2Address({
    bytecode: bytecode,
    from: CREATE2_DEPLOYER,
    salt,
  })
  return {
    type: 'call',
    address,
    chainId,
    functionName: '<CREATE2 factory>',
    bytes: data,
    value: '',
    members: [
      {
        type: 'address',
        name: 'deployment',
        bytes: deployment,
        value: deployment,
        chainId,
      },
      {
        type: 'bytes',
        name: 'salt',
        bytes: salt,
        value: salt,
        chainId,
      },
      {
        type: 'bytes',
        name: 'bytecode',
        bytes: bytecode,
        value: bytecode,
        chainId,
      },
    ],
  }
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
