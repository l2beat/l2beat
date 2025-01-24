import { BigNumber, ethers } from 'ethers'

import { assert } from '@l2beat/shared-pure'
import { rlpDecode } from '../../utils/rlpDecode'
import { constants } from './const'
import { decodeUint32 } from './numerics'
import type { PolygonZkEvmTransaction, RawPolygonZkEvmBlock } from './types'

export { decodeBatch }

/**
 * Code has been adapted from the original implementation in the Polygon ZK EVM
 * Only few styling and type changes have been made since we do not need full batch context
 * @see https://github.com/0xPolygonHermez/zkevm-node/blob/bf4aa0335ac761dc5d86cb1bca2e8cc087cd4024/state/encoding_batch_v2.go#L206
 */
function decodeBatch(txsData: Uint8Array): RawPolygonZkEvmBlock[] {
  const { changeL2Block } = constants

  const blocks: RawPolygonZkEvmBlock[] = []
  let currentBlock: RawPolygonZkEvmBlock | null = null
  let offset = 0

  while (offset < txsData.length) {
    const currentByte = txsData[offset]

    if (currentByte === changeL2Block) {
      // Push the current block to blocks array if it's not null
      if (currentBlock) {
        blocks.push(currentBlock)
      }

      // Decode the block header and update the current block and offset
      const { newOffset, currentBlock: newBlock } = decodeBlockHeader(
        txsData,
        offset + 1,
      )
      offset = newOffset
      currentBlock = newBlock
    } else {
      // Handle case when current block is null at the beginning of a batch
      if (!currentBlock) {
        try {
          // Test decode, it will throw in case of malformed batch
          decodeSingleTransactionRLP(txsData, offset)
        } catch (error) {
          console.error(
            `Malformed batch or batch doesn't start with l2block`,
            error,
          )
          throw error
        }
      }

      // Decode a single transaction and update the current block's transactions
      const { newPos, transaction } = decodeSingleTransactionRLP(
        txsData,
        offset,
      )
      offset = newPos

      currentBlock?.transactions.push(transaction)
    }

    assert(currentBlock, 'Malformed batch - unexpected end of bytes to process')
  }

  // Catch decoded block header
  if (currentBlock) {
    blocks.push(currentBlock)
  }

  return blocks
}

function decodeBlockHeader(txsData: Uint8Array, offset: number) {
  const [offsetA, deltaTimestamp] = decodeUint32(txsData, offset)
  const [offsetB, indexL1InfoTree] = decodeUint32(txsData, offsetA)

  const currentBlock = {
    deltaTimestamp,
    indexL1InfoTree,
    transactions: [],
  }

  return {
    newOffset: offsetB,
    currentBlock,
  }
}

function decodeSingleTransactionRLP(txsData: Uint8Array, offset: number) {
  const transactionLength = decodeRLPListLengthAt(txsData, offset)
  const { rLength, sLength, vLength, efficiencyPercentageByteLength } =
    constants

  const expectedBytesEnd =
    offset +
    transactionLength +
    rLength +
    sLength +
    vLength +
    efficiencyPercentageByteLength

  assert(
    expectedBytesEnd <= txsData.length,
    'Malformed RLP: Not enough data to decode transaction',
  )

  const dataStart = offset + transactionLength
  const transactionData = txsData.slice(offset, dataStart)

  const r = txsData.slice(dataStart, dataStart + rLength)
  const s = txsData.slice(dataStart + rLength, dataStart + rLength + sLength)
  const v = txsData.slice(
    dataStart + rLength + sLength,
    dataStart + rLength + sLength + vLength,
  )

  const rlpFields = rlpDecode(transactionData) as Uint8Array[]

  const transaction = rlpToTransaction(rlpFields, v, r, s)

  return { newPos: expectedBytesEnd, transaction }
}

function rlpToTransaction(
  fields: Uint8Array[],
  rawV: Uint8Array,
  rawR: Uint8Array,
  rawS: Uint8Array,
): PolygonZkEvmTransaction {
  const fieldsSizeWithoutChainID = 6
  const fieldsSizeWithChainID = 7

  assert(
    fields.length >= fieldsSizeWithoutChainID,
    'Transaction has too few fields in order to be decoded',
  )

  const [
    rawNonce,
    rawGasPrice,
    rawGasLimit,
    rawTo,
    rawValue,
    rawData,
    rawChainId,
  ] = fields

  function zeroIfEmpty(arr?: Uint8Array) {
    return arr?.length === 0 ? new Uint8Array([0]) : arr
  }

  const nonce = BigNumber.from(zeroIfEmpty(rawNonce))
  const gasPrice = BigNumber.from(zeroIfEmpty(rawGasPrice))
  const gasLimit = BigNumber.from(rawGasLimit)
  let to: string | undefined = undefined

  if (rawTo && rawTo.length > 0) {
    to = ethers.utils.getAddress(ethers.utils.hexlify(rawTo))
  }

  const value = BigNumber.from(zeroIfEmpty(rawValue))
  const data = `0x${Buffer.from(rawData ?? []).toString('hex')}`

  const currentV = BigNumber.from(rawV)

  const v =
    fields.length >= fieldsSizeWithChainID
      ? coerceVParam(BigNumber.from(rawChainId), currentV)
      : currentV

  const r = BigNumber.from(rawR)
  const s = BigNumber.from(rawS)

  return {
    nonce,
    gasPrice,
    gasLimit,
    to,
    value,
    data,
    chainId:
      fields.length >= fieldsSizeWithChainID
        ? BigNumber.from(rawChainId)
        : undefined,

    v,
    r,
    s,
  }
}

function coerceVParam(chainId: BigNumber, v: BigNumber) {
  const { ether155V, etherPre155V } = constants

  const a = chainId.mul(2)
  const b = v.sub(ether155V)
  const c = a.add(etherPre155V)

  return b.add(c)
}

function decodeRLPListLengthAt(txsData: Uint8Array, offset: number): number {
  const txDataLength = txsData.length
  const num = txsData[offset]

  const { c0, headerByteLength, f7, shortRlp } = constants

  assert(num !== undefined, 'Cannot decode list length - out of bytes')
  assert(
    num >= c0,
    `Malformed RLP: First byte of transaction if invalid (${num.toString(16)})`,
  )

  let length = num - c0

  if (length > shortRlp) {
    const lengthInByteOfSize = num - f7

    assert(
      offset + headerByteLength + lengthInByteOfSize <= txDataLength,
      'Malformed RLP: Not enough data to get length',
    )
    // Extracting length bytes and converting to number
    const sizeBytes = txsData.slice(offset + 1, offset + 1 + lengthInByteOfSize)
    const n = parseInt(Buffer.from(sizeBytes).toString('hex'), 16)

    assert(!isNaN(n), 'Error parsing length value from RLP bytes')

    length = n + num - f7
  }

  return length + headerByteLength
}
