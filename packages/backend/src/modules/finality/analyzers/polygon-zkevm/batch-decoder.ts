import { BigNumber, ethers } from 'ethers'

import { rlpDecode } from '../../utils/rlpDecode'
import { constants } from './const'
import { decodeUint32 } from './numerics'
import { PolygonZkEvmTransaction, RawPolygonZkEvmBlock } from './types'

const changeL2Block = 0x0b // example value

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

export function decodeBatchV2(txsData: Uint8Array) {
  const blocks: RawPolygonZkEvmBlock[] = []
  let currentBlock: RawPolygonZkEvmBlock | null = null
  let offset = 0

  while (offset < txsData.length) {
    const currentByte = txsData[offset]

    switch (currentByte) {
      case changeL2Block:
        if (currentBlock !== null) {
          blocks.push(currentBlock)
        }

        // eslint-disable-next-line no-case-declarations
        const header = decodeBlockHeader(txsData, offset + 1)

        offset = header.newOffset
        currentBlock = header.currentBlock
        break
      default:
        if (currentBlock === null) {
          try {
            decodeSingleTransactionRLP(txsData, offset)
          } catch (e) {
            console.error(
              `Malformed batch or batch doesn't start with l2block`,
              e,
            )
            throw e
          }
        }

        // eslint-disable-next-line no-case-declarations
        const { newPos, transaction } = decodeSingleTransactionRLP(
          txsData,
          offset,
        )

        offset = newPos

        currentBlock?.transactions.push(transaction)
    }

    if (currentBlock === null) {
      throw new Error('Not a tx')
    }
  }

  if (currentBlock !== null) {
    blocks.push(currentBlock)
  }

  return blocks
}

function decodeSingleTransactionRLP(txsData: Uint8Array, offset: number) {
  const transactionLength = decodeRLPListLengthFromOffset(txsData, offset)
  const { rLength, sLength, vLength, EfficiencyPercentageByteLength } =
    constants

  const endPos =
    offset +
    transactionLength +
    rLength +
    sLength +
    vLength +
    EfficiencyPercentageByteLength

  if (endPos > txsData.length) {
    throw new Error('Not enough data to decode tx')
  }

  const dataStart = offset + transactionLength
  const txInfo = txsData.slice(offset, dataStart)
  const rData = txsData.slice(dataStart, dataStart + rLength)
  const sData = txsData.slice(
    dataStart + rLength,
    dataStart + rLength + sLength,
  )
  const vData = txsData.slice(
    dataStart + rLength + sLength,
    dataStart + rLength + sLength + vLength,
  )

  const rlpFields = rlpDecode(txInfo) as Uint8Array[]

  const transaction = rlpToTransaction(rlpFields, vData, rData, sData)

  return { newPos: endPos, transaction }
}

function rlpToTransaction(
  fields: Uint8Array[],
  v: Uint8Array,
  r: Uint8Array,
  s: Uint8Array,
): PolygonZkEvmTransaction {
  const { ether155V, etherPre155V } = constants
  const fieldsSizeWithoutChainID = 6
  const fieldsSizeWithChainID = 7

  if (fields.length < fieldsSizeWithoutChainID) {
    throw new Error('Transaction type not supported')
  }

  const nonce = BigNumber.from(fields[0]).toNumber()
  const gasPrice = BigNumber.from(fields[1])
  const gas = BigNumber.from(fields[2]).toNumber()
  let to: string | undefined = undefined

  if (fields[3] && fields[3].length !== 0) {
    to = ethers.utils.getAddress(ethers.utils.hexlify(fields[3]))
  }

  const value = BigNumber.from(fields[4]?.length === 0 ? 0 : fields[4])
  const data = fields[5]

  let txV = BigNumber.from(v)

  if (fields.length >= fieldsSizeWithChainID) {
    const chainID = BigNumber.from(fields[6])
    const a = chainID.mul(2)
    const b = BigNumber.from(v).sub(ether155V) // Assuming ether155V is 27
    const c = a.add(etherPre155V) // Assuming etherPre155V is 35
    txV = b.add(c)
  }

  const txR = BigNumber.from(r)
  const txS = BigNumber.from(s)

  return {
    nonce,
    gasPrice,
    gas,
    to,
    value,
    data: `0x${Buffer.from(data ?? new Uint8Array([])).toString('hex')}`,
    v: txV,
    r: txR,
    s: txS,
  }
}

function decodeRLPListLengthFromOffset(
  txsData: Uint8Array,
  offset: number,
): number {
  const txDataLength = txsData.length
  const num = txsData[offset]

  const { c0, headerByteLength, f7, shortRlp } = constants

  if (num === undefined) {
    throw new Error('RLP.ErrInvalidRLP.OutOfBytes')
  }

  if (num < c0) {
    console.debug(`error num < c0: ${num}, ${c0}`)
    throw new Error(
      `First byte of tx (${num.toString(16)}) is < 0xc0: ErrInvalidRLP`,
    )
  }

  let length = num - c0

  if (length > shortRlp) {
    const lengthInByteOfSize = num - f7
    if (offset + headerByteLength + lengthInByteOfSize > txDataLength) {
      console.debug('Error not enough data')
      throw new Error('Not enough data to get length: ErrInvalidRLP')
    }

    // Extracting length bytes and converting to number
    const sizeBytes = txsData.slice(offset + 1, offset + 1 + lengthInByteOfSize)
    const n = parseInt(Buffer.from(sizeBytes).toString('hex'), 16)

    if (isNaN(n)) {
      console.debug('Error parsing length')
      throw new Error('Error parsing length value: ErrInvalidRLP')
    }

    length = n + num - f7
  }

  return length + headerByteLength
}
