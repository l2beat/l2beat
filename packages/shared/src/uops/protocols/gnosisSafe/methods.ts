import { ethers } from 'ethers'
import { parseAbiItem } from 'viem'
import type { Method, Operation } from '../../types'
import { defineMethod } from '../defineMethod'
import { SAFE_EXEC_TRANSACTION_SIGNATURE } from './const'

export const SAFE_methods: Method[] = [
  defineMethod(
    parseAbiItem('function multiSend(bytes memory transactions)'),
    ([transactions]) => {
      const txs = decodeMultiSendInput(transactions)
      return txs.flatMap((op) => {
        const operations: Operation[] = []
        operations.push({
          type: 'recursive',
          calldata: op.data,
          to: op.to,
        })
        return operations
      })
    },
    'Safe:MultiSendCallOnly1.3.0',
  ),
  defineMethod(
    SAFE_EXEC_TRANSACTION_SIGNATURE,
    ([to, , data]) => {
      return [{ type: 'recursive', calldata: data, to }]
    },
    'Safe:Singleton1.3.0',
  ),
  defineMethod(
    parseAbiItem(
      'function executeUserOp(address to, uint256 value, bytes data, uint8 operation)',
    ),
    ([to, , data]) => {
      return [
        {
          type: 'recursive',
          calldata: data,
          to,
        },
      ]
    },
    'Safe4337Module',
  ),
]

type MultiSendTransaction = {
  operation: number
  to: string
  value: bigint
  data: string
}

// https://etherscan.io/address/0x40a2accbd92bca938b02010e17a5b8929b49130d#code
function decodeMultiSendInput(data: string): MultiSendTransaction[] {
  const txs: MultiSendTransaction[] = []

  // Initialize a pointer for reading the bytes
  let i = 0

  // Convert the transactions from a hex string to a Buffer for easier manipulation
  const txBuffer = ethers.utils.arrayify(data)

  // Read the length of the transaction data
  const length = txBuffer.length

  while (i < length - 1) {
    // First byte is the operation
    const operation = txBuffer[i]

    // Next 20 bytes is the address to send to
    const to = ethers.utils.getAddress(
      ethers.utils.hexlify(txBuffer.slice(i + 1, i + 21)),
    )

    // Next 32 bytes is the value (amount in wei to send)
    const value = ethers.BigNumber.from(
      txBuffer.slice(i + 21, i + 53),
    ).toBigInt()

    // Next 32 bytes is the data length
    const dataLength = Number(
      ethers.BigNumber.from(txBuffer.slice(i + 53, i + 85)).toString(),
    )

    // Following the dataLength, we extract the data
    const data = txBuffer.slice(i + 85, i + 85 + dataLength)

    txs.push({ operation, to, value, data: ethers.utils.hexlify(data) })

    // Move the pointer to the next transaction (85 bytes + dataLength)
    i += 85 + dataLength
  }
  return txs
}
