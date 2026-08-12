import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  concatHex,
  type Hex,
  numberToHex,
  padHex,
  size,
  stringToHex,
} from 'viem'
import { decodeCCIPV2Message } from './ccip.v2'

describe(decodeCCIPV2Message.name, () => {
  it('decodes a MessageV1 token transfer with a padded EVM token address', () => {
    const message = encodeMessage({
      sourceChainSelector: 1n,
      destChainSelector: 2n,
      messageNumber: 3n,
      tokenTransfer: encodeTokenTransfer({
        amount: 123n,
        sourceToken: padHex('0x1234567890123456789012345678901234567890', {
          size: 32,
        }),
      }),
    })

    expect(decodeCCIPV2Message(message)).toEqual({
      sourceChainSelector: 1n,
      destChainSelector: 2n,
      messageNumber: 3n,
      tokenTransfer: {
        sourceToken: EthereumAddress(
          '0x1234567890123456789012345678901234567890',
        ),
        amount: 123n,
      },
    })
  })

  it('decodes a data-only MessageV1', () => {
    const message = encodeMessage({
      sourceChainSelector: 4n,
      destChainSelector: 5n,
      messageNumber: 6n,
    })

    expect(decodeCCIPV2Message(message)).toEqual({
      sourceChainSelector: 4n,
      destChainSelector: 5n,
      messageNumber: 6n,
      tokenTransfer: undefined,
    })
  })

  it('rejects unsupported versions, truncated fields, and trailing bytes', () => {
    const valid = encodeMessage({
      sourceChainSelector: 1n,
      destChainSelector: 2n,
      messageNumber: 3n,
    })

    expect(decodeCCIPV2Message(`0x02${valid.slice(4)}`)).toEqual(undefined)
    expect(decodeCCIPV2Message(valid.slice(0, -2))).toEqual(undefined)
    expect(decodeCCIPV2Message(`${valid}00`)).toEqual(undefined)
  })
})

function encodeMessage(args: {
  sourceChainSelector: bigint
  destChainSelector: bigint
  messageNumber: bigint
  tokenTransfer?: Hex
}) {
  return concatHex([
    numberToHex(1, { size: 1 }),
    numberToHex(args.sourceChainSelector, { size: 8 }),
    numberToHex(args.destChainSelector, { size: 8 }),
    numberToHex(args.messageNumber, { size: 8 }),
    numberToHex(100_000, { size: 4 }), // executionGasLimit
    numberToHex(50_000, { size: 4 }), // ccipReceiveGasLimit
    '0x00000001', // finality
    padHex('0x1234', { size: 32 }), // ccvAndExecutorHash
    uint8LengthPrefixed(padHex('0x11', { size: 32 })), // onRamp
    uint8LengthPrefixed(padHex('0x22', { size: 32 })), // offRamp
    uint8LengthPrefixed(padHex('0x33', { size: 32 })), // sender
    uint8LengthPrefixed(padHex('0x44', { size: 32 })), // receiver
    uint16LengthPrefixed('0x'), // destBlob
    uint16LengthPrefixed(args.tokenTransfer ?? '0x'),
    uint16LengthPrefixed(stringToHex('payload')), // data
  ])
}

function encodeTokenTransfer(args: { amount: bigint; sourceToken: Hex }) {
  return concatHex([
    numberToHex(1, { size: 1 }),
    numberToHex(args.amount, { size: 32 }),
    uint8LengthPrefixed(padHex('0x55', { size: 32 })), // sourcePoolAddress
    uint8LengthPrefixed(args.sourceToken),
    uint8LengthPrefixed(padHex('0x66', { size: 32 })), // destTokenAddress
    uint8LengthPrefixed(padHex('0x77', { size: 32 })), // tokenReceiver
    uint16LengthPrefixed('0xabcd'), // extraData
  ])
}

function uint8LengthPrefixed(value: Hex) {
  return concatHex([numberToHex(size(value), { size: 1 }), value])
}

function uint16LengthPrefixed(value: Hex) {
  return concatHex([numberToHex(size(value), { size: 2 }), value])
}
