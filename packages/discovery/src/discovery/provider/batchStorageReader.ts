import { assert, Bytes, type EthereumAddress } from '@l2beat/shared-pure'
import type { providers } from 'ethers'

export type StorageSlot = number | bigint | Bytes

// Hand-assembled runtime bytecode for a minimal SLOAD batcher. Used as the
// `code` field in an eth_call state override so the call executes at the
// target address with this bytecode, letting SLOAD read the target's real
// storage. No on-chain deployment, no state change.
//
// Calldata layout: concatenated 32-byte slot numbers (no selector).
// Return data: concatenated 32-byte values, one per slot.
//
// Solidity equivalent:
//   contract StorageReader {
//     fallback() external {
//       assembly {
//         let size := calldatasize()
//         for { let i := 0 } lt(i, size) { i := add(i, 32) } {
//           mstore(i, sload(calldataload(i)))
//         }
//         return(0, size)
//       }
//     }
//   }
//
// Disassembly (28 bytes):
//   00: 60 00        PUSH1 0            ; i = 0
//   02: 5b           JUMPDEST           ; loop:
//   03: 80           DUP1               ;   [i, i]
//   04: 36           CALLDATASIZE       ;   [size, i, i]
//   05: 90           SWAP1              ;   [i, size, i]
//   06: 10           LT                 ;   [i<size, i]
//   07: 15           ISZERO             ;   [!(i<size), i]
//   08: 60 16        PUSH1 22           ;   jump target for exit
//   0a: 57           JUMPI              ;   exit if i>=size
//   0b: 80           DUP1               ;   [i, i]
//   0c: 35           CALLDATALOAD       ;   [slot, i]
//   0d: 54           SLOAD              ;   [value, i]
//   0e: 81           DUP2               ;   [i, value, i]
//   0f: 52           MSTORE             ;   mem[i..i+32] = value
//   10: 60 20        PUSH1 32
//   12: 01           ADD                ;   i += 32
//   13: 60 02        PUSH1 2            ;   jump back to loop
//   15: 56           JUMP
//   16: 5b           JUMPDEST           ; exit:
//   17: 50           POP
//   18: 36           CALLDATASIZE
//   19: 60 00        PUSH1 0
//   1b: f3           RETURN             ; return mem[0..size]
export const STORAGE_READER_BYTECODE =
  '0x60005b803690101560165780355481526020016002565b50366000f3'

function slotToHex32(slot: StorageSlot): string {
  if (slot instanceof Bytes) {
    const hex = slot.toString().slice(2)
    if (hex.length > 64) {
      throw new Error('batchStorageReader: slot longer than 32 bytes')
    }
    return hex.padStart(64, '0')
  }
  return slot.toString(16).padStart(64, '0')
}

function encodeSlotsAsCalldata(slots: readonly StorageSlot[]): string {
  let hex = '0x'
  for (const slot of slots) {
    hex += slotToHex32(slot)
  }
  return hex
}

function decodeStorageBatchResult(result: string, slotCount: number): Bytes[] {
  const hex = result.startsWith('0x') ? result.slice(2) : result
  const expectedLength = slotCount * 64

  assert(
    expectedLength === hex.length,
    `batchStorageReader: expected ${expectedLength} hex chars, got ${hex.length}`,
  )

  const values: Bytes[] = []
  for (let i = 0; i < slotCount; i++) {
    values.push(Bytes.fromHex('0x' + hex.slice(i * 64, (i + 1) * 64)))
  }
  return values
}

export async function batchReadStorageViaOverride(
  rpcProvider: providers.JsonRpcProvider,
  address: EthereumAddress,
  slots: readonly StorageSlot[],
  blockNumber: number,
): Promise<Bytes[]> {
  const calldata = encodeSlotsAsCalldata(slots)
  const blockTag = '0x' + blockNumber.toString(16)
  const result: string = await rpcProvider.send('eth_call', [
    { to: address.toString(), data: calldata },
    blockTag,
    { [address.toString()]: { code: STORAGE_READER_BYTECODE } },
  ])
  return decodeStorageBatchResult(result, slots.length)
}
