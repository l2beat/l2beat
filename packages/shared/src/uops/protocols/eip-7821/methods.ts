import { ethers } from 'ethers'
import { BinaryReader } from '../../../tools/BinaryReader'
import type { Method, Operation, TransferOperation } from '../../types'
import { defineMethod } from '../defineMethod'
import {
  EIP_7821_TRANSACTION_SIGNATURE,
  WHITEBIT_TRANSACTION_SIGNATURE,
} from './const'

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
  defineMethod(
    WHITEBIT_TRANSACTION_SIGNATURE,
    (_, calldata) => {
      return decodeBatchInput(calldata)
    },
    'WhiteBIT sweeper',
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
    ['tuple(address to, uint256 value, bytes data)[]'],
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

function decodeBatchInput(data: `0x${string}`): TransferOperation[] {
  if (!data) {
    return []
  }

  const reader = new BinaryReader(data, 4)
  const count = Number(reader.read(1))

  const triplets = Array.from({ length: count }).map(() => ({
    tokenIndex: Number(reader.read(1)),
    addressIndex: Number(reader.read(1)),
    amountIndex: Number(reader.read(1)),
  }))

  const values: `0x${string}`[] = []
  while (!reader.isAtEnd()) {
    values.push(reader.read(20))
  }

  const results = triplets.map((t) => {
    const token = values[t.tokenIndex]
    const address = values[t.addressIndex]
    const amount = values[t.amountIndex]

    if ((!token && t.tokenIndex !== 255) || !address || !amount) {
      throw new Error('Invalid encoding')
    }

    return {
      type: 'transfer' as const,
      name: token ? 'collectERC20()' : 'collectETH()',
      to: address,
      count: 1,
    }
  })

  return results
}
