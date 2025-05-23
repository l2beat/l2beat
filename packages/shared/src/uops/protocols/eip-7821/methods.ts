import { ethers } from 'ethers'
import type { Method, Operation } from '../../types'
import { defineMethod } from '../defineMethod'
import { EIP_7821_TRANSACTION_SIGNATURE } from './const'

export const EIP7821_methods: Method[] = [
  defineMethod(
    EIP_7821_TRANSACTION_SIGNATURE,
    ([mode, executionData]) => {
      const txs = decodeExecuteInput(mode, executionData)
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
    'EIP-7821',
  ),
]

interface Call {
  to: string
  value: bigint
  data: string
}

// https://eips.ethereum.org/EIPS/eip-7821
function decodeExecuteInput(mode: string, executionData: string): Call[] {
  const id = executionModeId(mode)

  const calls: Call[] = []

  if (id === 3) {
    const decoded = ethers.utils.defaultAbiCoder.decode(
      ['bytes[]'],
      executionData,
    )
    const batches: string[] = decoded[0]

    batches.forEach((batch) => {
      calls.push(...decodeExecuteInput(mode, batch))
    })

    return calls
  }

  const decoded = ethers.utils.defaultAbiCoder.decode(
    [`tuple(address to, uint256 value, bytes data)[]`],
    executionData,
  )
  return decoded[0]
}

function executionModeId(mode: string): number {
  const m = mode.slice(0, 22)

  switch (m) {
    case '0x01000000000000000000':
      return 1
    case '0x01000000000078210001':
      return 2
    case '0x01000000000078210002':
      return 3
    default:
      throw new Error(`Unsupported execution mode: ${mode}`)
  }
}
