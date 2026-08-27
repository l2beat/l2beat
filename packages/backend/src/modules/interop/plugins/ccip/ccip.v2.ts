import { EthereumAddress } from '@l2beat/shared-pure'
import { BinaryReader } from '../../../../tools/BinaryReader'

export interface CCIPV2Message {
  sourceChainSelector: bigint
  destChainSelector: bigint
  messageNumber: bigint
  tokenTransfer?: {
    sourceToken: EthereumAddress
    amount: bigint
  }
}

// MessageV1Codec encodes messages with abi.encodePacked rather than standard ABI
// encoding. All integer fields are big-endian and variable-length byte fields are
// prefixed by their byte length.
export function decodeCCIPV2Message(
  encodedMessage: string,
): CCIPV2Message | undefined {
  try {
    const reader = new BinaryReader(encodedMessage)

    const version = reader.readUint8()
    if (version !== 1) return undefined

    const sourceChainSelector = reader.readUint64()
    const destChainSelector = reader.readUint64()
    const messageNumber = reader.readUint64()

    // executionGasLimit, ccipReceiveGasLimit, finality, ccvAndExecutorHash
    reader.skipBytes(4 + 4 + 4 + 32)

    skipUint8LengthPrefixedBytes(reader) // onRamp
    skipUint8LengthPrefixedBytes(reader) // offRamp
    skipUint8LengthPrefixedBytes(reader) // sender
    skipUint8LengthPrefixedBytes(reader) // receiver
    skipUint16LengthPrefixedBytes(reader) // destBlob

    const tokenTransferLength = reader.readUint16()
    const tokenTransfer =
      tokenTransferLength === 0
        ? undefined
        : decodeTokenTransferV1(reader.readBytes(tokenTransferLength))
    if (tokenTransferLength > 0 && !tokenTransfer) return undefined

    skipUint16LengthPrefixedBytes(reader) // data
    if (reader.length !== 0) return undefined

    return {
      sourceChainSelector,
      destChainSelector,
      messageNumber,
      tokenTransfer,
    }
  } catch {
    return undefined
  }
}

function decodeTokenTransferV1(encoded: string) {
  const reader = new BinaryReader(encoded)
  const version = reader.readUint8()
  if (version !== 1) return undefined

  const amount = reader.readUint256()
  skipUint8LengthPrefixedBytes(reader) // sourcePoolAddress
  const sourceToken = readEvmAddress(reader)
  skipUint8LengthPrefixedBytes(reader) // destTokenAddress
  skipUint8LengthPrefixedBytes(reader) // tokenReceiver
  skipUint16LengthPrefixedBytes(reader) // extraData

  if (!sourceToken || reader.length !== 0) return undefined
  return { sourceToken, amount }
}

function readEvmAddress(reader: BinaryReader): EthereumAddress | undefined {
  const length = reader.readUint8()
  const encoded = reader.readBytes(length)

  if (length === 20) return EthereumAddress(encoded)
  if (length === 32) return EthereumAddress(`0x${encoded.slice(-40)}`)
  return undefined
}

function skipUint8LengthPrefixedBytes(reader: BinaryReader) {
  reader.skipBytes(reader.readUint8())
}

function skipUint16LengthPrefixedBytes(reader: BinaryReader) {
  reader.skipBytes(reader.readUint16())
}
