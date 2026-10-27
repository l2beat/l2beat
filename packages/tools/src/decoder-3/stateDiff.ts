import {
  type AbiFunction,
  decodeAbiParameters,
  encodeFunctionData,
  type Hex,
  parseAbi,
  parseAbiItem,
  toFunctionSelector,
} from 'viem'
import type { DecodedValue } from './decode'
import { getterEnumNote } from './enums'
import { decodeGameArgs } from './packedSchemas'

export interface StateRead {
  label: string
  data: Hex
  // The value the call writes, or the value it requires.
  next: DecodedValue
  // The call reverts unless the getter already returns next.
  requirement?: boolean
  decodeCurrent(result: Hex): DecodedValue
}

export interface StateChange {
  label: string
  // Undefined when the getter reverted or returned no value of its type.
  current?: DecodedValue
  next: DecodedValue
  changed?: boolean
  requirement?: boolean
}

export interface StateContext {
  // Function signatures of the call's target.
  abi?: readonly string[]
  // msg.sender of the call, when known.
  sender?: Hex
}

const GETTERS = parseAbi([
  'function gameImpls(uint32) view returns (address)',
  'function gameArgs(uint32) view returns (bytes)',
  'function initBonds(uint32) view returns (uint256)',
])

type Getter = (typeof GETTERS)[number]['name']

// Setters whose current value has a getter on the same contract. Members are
// positional, since signatures from lookup services may omit argument names.
const SETTERS: {
  abi: string
  reads(members: DecodedValue[], chainId?: number): StateRead[]
}[] = [
  {
    abi: 'function setImplementation(uint32 _gameType, address _impl, bytes _args)',
    reads: ([gameType, impl, args], chainId) => [
      gameImplsRead(gameType, impl, chainId),
      read('gameArgs', gameType, args, (result) => {
        const [bytes] = decodeAbiParameters([{ type: 'bytes' }], result)
        return (
          decodeGameArgs(gameType?.value ?? '', bytes, chainId) ??
          value('bytes', bytes, chainId)
        )
      }),
    ],
  },
  {
    abi: 'function setImplementation(uint32 _gameType, address _impl)',
    reads: ([gameType, impl], chainId) => [
      gameImplsRead(gameType, impl, chainId),
    ],
  },
  {
    abi: 'function setInitBond(uint32 _gameType, uint256 _initBond)',
    reads: ([gameType, initBond], chainId) => [
      read('initBonds', gameType, initBond, (result) => {
        const [bond] = decodeAbiParameters([{ type: 'uint256' }], result)
        return { ...value('number', result, chainId), value: bond.toString() }
      }),
    ],
  },
]

export function getStateReads(
  call: DecodedValue,
  context: StateContext = {},
): StateRead[] | undefined {
  if (call.type !== 'call') return
  const selector = call.bytes.slice(0, 10).toLowerCase()
  const setter = SETTERS.find(({ abi }) => toFunctionSelector(abi) === selector)
  try {
    if (setter) return setter.reads(call.members ?? [], call.chainId)
    const getters = parseGetters(context.abi ?? [])
    const reads =
      ownershipReads(call, getters, context.sender) ??
      setterReads(call, getters)
    return reads?.length ? reads : undefined
  } catch {
    return
  }
}

// Getters without arguments that return one value, by name.
function parseGetters(abi: readonly string[]) {
  const getters = new Map<string, string>()
  for (const signature of abi) {
    try {
      const item = parseAbiItem(signature) as AbiFunction
      if (item.type !== 'function' || item.inputs.length !== 0) continue
      const [output] = item.outputs
      if (item.outputs.length === 1 && output && isGetterType(output.type)) {
        getters.set(item.name, output.type)
      }
    } catch {}
  }
  return getters
}

function ownershipReads(
  call: DecodedValue,
  getters: Map<string, string>,
  sender: Hex | undefined,
): StateRead[] | undefined {
  const members = call.members ?? []
  if (call.functionName === 'acceptOwnership' && members.length === 0) {
    if (!sender) return []
    const next = value('address', sender.toLowerCase() as Hex, call.chainId)
    return [
      ...(getters.get('pendingOwner') === 'address'
        ? [
            {
              ...getterRead('pendingOwner', 'address', next, call.chainId),
              requirement: true,
            },
          ]
        : []),
      ...(getters.get('owner') === 'address'
        ? [getterRead('owner', 'address', next, call.chainId)]
        : []),
    ]
  }
  const [newOwner] = members
  if (
    call.functionName === 'transferOwnership' &&
    members.length === 1 &&
    newOwner?.type === 'address'
  ) {
    // Ownable2Step only nominates the new owner.
    const getter = getters.has('pendingOwner') ? 'pendingOwner' : 'owner'
    if (getters.get(getter) !== 'address') return []
    return [getterRead(getter, 'address', newOwner, call.chainId)]
  }
}

// setFoo(x) and updateFoo(x) with a foo() getter of the same type.
function setterReads(
  call: DecodedValue,
  getters: Map<string, string>,
): StateRead[] | undefined {
  const match = /^(?:set|update)([A-Z]\w*)$/.exec(call.functionName ?? '')
  const [next] = call.members ?? []
  if (!match?.[1] || call.members?.length !== 1 || !next) return
  const name = `${match[1][0]?.toLowerCase()}${match[1].slice(1)}`
  const type = getters.get(name)
  const setter = parseAbiItem(call.functionAbi ?? '') as AbiFunction
  if (!type || setter.inputs[0]?.type !== type) return
  return [getterRead(name, type, next, call.chainId)]
}

function getterRead(
  name: string,
  type: string,
  next: DecodedValue,
  chainId?: number,
): StateRead {
  return {
    label: `${name}()`,
    data: toFunctionSelector(`function ${name}()`),
    next,
    decodeCurrent: (result) => {
      const [decoded] = decodeAbiParameters([{ type }], result)
      const current = toDecodedValue(type, decoded, result, chainId)
      const note = getterEnumNote(name, current.value)
      return { ...current, name, ...(note ? { note } : {}) }
    },
  }
}

function isGetterType(type: string) {
  return /^(address|bool|string|u?int\d*|bytes\d*)$/.test(type)
}

function toDecodedValue(
  type: string,
  decoded: unknown,
  result: Hex,
  chainId?: number,
): DecodedValue {
  if (type === 'address') {
    return value('address', (decoded as string).toLowerCase() as Hex, chainId)
  }
  if (type === 'bool' || /^u?int\d*$/.test(type)) {
    return {
      ...value(type === 'bool' ? 'bool' : 'number', result, chainId),
      value: String(decoded),
    }
  }
  if (type === 'string') {
    return { ...value('string', result, chainId), value: decoded as string }
  }
  return value('bytes', decoded as Hex, chainId)
}

export function compareState(
  read: StateRead,
  result: Hex | null,
): StateChange[] {
  const requirement = read.requirement ? { requirement: true } : {}
  let current: DecodedValue | undefined
  try {
    if (result !== null) current = read.decodeCurrent(result)
  } catch {}
  if (!current) return [{ label: read.label, next: read.next, ...requirement }]
  return diff(read.label, current, read.next).map((change) => ({
    ...change,
    ...requirement,
  }))
}

function diff(
  label: string,
  current: DecodedValue,
  next: DecodedValue,
): StateChange[] {
  const currentMembers = current.members ?? []
  const nextMembers = next.members ?? []
  if (
    current.type === 'tuple' &&
    next.type === 'tuple' &&
    currentMembers.length === nextMembers.length &&
    nextMembers.every((member, i) => member.name === currentMembers[i]?.name)
  ) {
    return nextMembers.flatMap((member, i) =>
      // biome-ignore lint/style/noNonNullAssertion: checked above
      diff(`${label}.${member.name}`, currentMembers[i]!, member),
    )
  }
  return [{ label, current, next, changed: !isSameValue(current, next) }]
}

function isSameValue(a: DecodedValue, b: DecodedValue) {
  if (a.type === 'tuple' || b.type === 'tuple' || a.type === 'bytes') {
    return a.bytes.toLowerCase() === b.bytes.toLowerCase()
  }
  return a.type === b.type && a.value.toLowerCase() === b.value.toLowerCase()
}

function gameImplsRead(
  gameType: DecodedValue | undefined,
  impl: DecodedValue | undefined,
  chainId?: number,
) {
  return read('gameImpls', gameType, impl, (result) => {
    const [address] = decodeAbiParameters([{ type: 'address' }], result)
    return value('address', address.toLowerCase() as Hex, chainId)
  })
}

function read(
  getter: Getter,
  gameType: DecodedValue | undefined,
  next: DecodedValue | undefined,
  decodeCurrent: (result: Hex) => DecodedValue,
): StateRead {
  if (!gameType || !next) throw new Error('Missing setter argument')
  return {
    label: `${getter}(${gameType.value})`,
    data: encodeFunctionData({
      abi: GETTERS,
      functionName: getter,
      args: [Number(gameType.value)],
    }),
    next,
    decodeCurrent,
  }
}

function value(
  type: DecodedValue['type'],
  bytes: Hex,
  chainId?: number,
): DecodedValue {
  const decoded: DecodedValue = { type, bytes, value: bytes }
  if (chainId !== undefined) decoded.chainId = chainId
  return decoded
}
