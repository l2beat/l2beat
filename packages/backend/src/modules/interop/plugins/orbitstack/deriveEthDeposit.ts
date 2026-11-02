import { concat, type Hex, keccak256, numberToHex, pad, toRlp } from 'viem'

export interface DerivedEthDeposit {
  to: Hex
  value: bigint
  l2TxHash: Hex
}

// `Inbox.depositEth()` delivers a kind 12 message whose data is
// `abi.encodePacked(dest, msg.value)`. The L2 executes it as an
// ArbitrumDepositTx (type 0x64) that emits no logs, so the only way to link
// both sides is to derive its hash:
// keccak256(0x64 || rlp([chainId, requestId, from, to, value])), where
// requestId is the message index and from is the sender from MessageDelivered
// (already aliased by the inbox).
export function deriveEthDeposit(params: {
  chainId: number
  messageIndex: bigint
  sender: string
  messageData: string
}): DerivedEthDeposit | undefined {
  // 20 bytes of address + 32 bytes of value
  if (!/^0x[0-9a-fA-F]{104}$/.test(params.messageData)) {
    return
  }

  const to = `0x${params.messageData.slice(2, 42).toLowerCase()}` as Hex
  const value = BigInt(`0x${params.messageData.slice(42)}`)

  const l2TxHash = keccak256(
    concat([
      '0x64',
      toRlp([
        toMinimalHex(BigInt(params.chainId)),
        pad(numberToHex(params.messageIndex), { size: 32 }),
        params.sender.toLowerCase() as Hex,
        to,
        toMinimalHex(value),
      ]),
    ]),
  )

  return { to, value, l2TxHash }
}

function toMinimalHex(value: bigint): Hex {
  if (value === 0n) {
    return '0x'
  }
  const hex = value.toString(16)
  return `0x${hex.length % 2 === 0 ? hex : `0${hex}`}`
}
