import { toFunctionSelector } from 'viem'
import type { DecodedValue } from './decode'

interface KnownEnum {
  name: string
  members: readonly string[]
}

// ABIs erase enums to uint8, so member names come from the source.
const WITHDRAWAL_NETWORK: KnownEnum = {
  name: 'Types.WithdrawalNetwork',
  members: ['L1', 'L2'],
}

// Function selector and the position of its enum argument.
const ENUM_ARGUMENTS: Record<string, { index: number; known: KnownEnum }> = {
  [toFunctionSelector('function setWithdrawalNetwork(uint8)')]: {
    index: 0,
    known: WITHDRAWAL_NETWORK,
  },
}

const ENUM_GETTERS: Record<string, KnownEnum> = {
  withdrawalNetwork: WITHDRAWAL_NETWORK,
  WITHDRAWAL_NETWORK: WITHDRAWAL_NETWORK,
}

export function describeEnumArguments(call: DecodedValue) {
  if (call.type !== 'call') return
  const argument = ENUM_ARGUMENTS[call.bytes.slice(0, 10).toLowerCase()]
  if (!argument) return
  const member = call.members?.[argument.index]
  if (member?.type === 'number') {
    member.note = enumNote(argument.known, member.value)
  }
}

export function getterEnumNote(
  getter: string,
  value: string,
): DecodedValue['note'] {
  const known = ENUM_GETTERS[getter]
  return known && enumNote(known, value)
}

function enumNote(known: KnownEnum, value: string): DecodedValue['note'] {
  const member = known.members[Number(value)]
  if (member === undefined) {
    return { text: `not a ${known.name} value`, warning: true }
  }
  return { text: `${member} (${known.name})` }
}
