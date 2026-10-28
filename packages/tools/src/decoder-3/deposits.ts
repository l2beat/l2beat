import { type Hex, toFunctionSelector } from 'viem'
import type { DecodedValue } from './decode'

export const OP_DEPOSIT_ABI =
  'function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data)'
const OP_DEPOSIT_SELECTOR = toFunctionSelector(OP_DEPOSIT_ABI)

export function isOpDeposit(value: DecodedValue) {
  return (
    value.type === 'call' &&
    value.bytes.slice(0, 10).toLowerCase() === OP_DEPOSIT_SELECTOR
  )
}

const ALIAS_OFFSET = 0x1111000000000000000000000000000000001111n

// AddressAliasHelper.applyL1ToL2Alias
export function applyL1ToL2Alias(address: Hex): Hex {
  const aliased = (BigInt(address) + ALIAS_OFFSET) % 2n ** 160n
  return `0x${aliased.toString(16).padStart(40, '0')}`
}

// The portal aliases contract senders. EOAs keep their address, and so do
// EIP-7702 delegated EOAs, which EOA.isSenderEOA recognizes by their code.
export function getL2Sender(
  sender: Hex,
  kind: 'eoa' | 'contract' | 'delegated',
): Hex {
  return kind === 'contract' ? applyL1ToL2Alias(sender) : sender
}

// The target and data of a deposit belong to its L2. Chain 0 marks an L2 that
// is not known, so nothing is looked up on the wrong chain.
export function onDepositChain(
  deposit: DecodedValue,
  l2ChainId: number,
): DecodedValue {
  if (!deposit.members || deposit.members.length !== 5) return deposit
  return {
    ...deposit,
    members: deposit.members.map((member, i) =>
      i === 0 || i === 4 ? { ...member, chainId: l2ChainId } : member,
    ),
  }
}

export interface CallContext {
  // msg.sender of this call, when known.
  sender?: Hex
  // The address a deposit runs as on its L2.
  l2Sender?: Hex
  // The account whose code makes the calls nested in this value.
  childExecutor?: Hex
}

// executor is the account running the code that contains value. A call
// receives it as msg.sender, unless the call is delegatecalled and runs in
// that account's context, keeping a msg.sender that is not tracked.
export function getCallContext(
  value: DecodedValue,
  decoded: DecodedValue,
  executor: Hex | undefined,
  kindOf: (address: Hex) => 'eoa' | 'contract' | 'delegated' | undefined,
): CallContext {
  if (decoded.type !== 'call') return { childExecutor: executor }
  if (value.delegatecall) return { childExecutor: executor }
  const sender = executor
  if (!isOpDeposit(decoded)) {
    return { sender, childExecutor: decoded.address }
  }
  const kind = sender ? kindOf(sender) : undefined
  const l2Sender = sender && kind ? getL2Sender(sender, kind) : undefined
  return { sender, l2Sender, childExecutor: l2Sender }
}
