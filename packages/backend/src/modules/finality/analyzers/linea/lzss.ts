import { BitConsumer } from './BitConsumer'

const CompressionLevel_NoCompression = 0

const Symbol_ShortBackreference = 0xfe
const Symbol_LongBackreference = 0xfd
const Symbol_DictionaryLookup = 0xff

export function decompress(
  compressed: Uint8Array,
  dictionary: Uint8Array,
): Uint8Array {
  const consumer = new BitConsumer(compressed)

  const _version = consumer.consume(16)
  const compressionLevel = consumer.consume(8)

  if (compressionLevel === CompressionLevel_NoCompression) {
    return compressed.slice(3)
  }

  const result: number[] = []
  while (consumer.bytePos < compressed.length) {
    const symbol = consumer.consume(8)

    switch (symbol) {
      case Symbol_ShortBackreference: {
        const length = consumer.consume(8) + 1
        const address = consumer.consume(14) + 1

        for (let i = 0; i < length; i++) {
          if (address > result.length) {
            throw Error(
              `trying to write a short reference that overflows the output buffer ${address}, ${length}, ${result.length}`,
            )
          }
          result.push(result[result.length - address])
        }

        break
      }
      case Symbol_LongBackreference: {
        const length = consumer.consume(8) + 1
        const address = consumer.consume(19) + 1

        for (let i = 0; i < length; i++) {
          if (address > result.length) {
            throw Error(
              `trying to write a long reference that overflows the output buffer ${address}, ${length}, ${result.length}`,
            )
          }
          result.push(result[result.length - address])
        }

        break
      }
      case Symbol_DictionaryLookup: {
        const length = consumer.consume(8) + 1
        const address = consumer.consume(17)

        if (
          address > dictionary.length ||
          address + length > dictionary.length
        ) {
          throw new Error(
            `dictionary out of bounds ${address}, ${length}, ${result.length}`,
          )
        }
        for (let i = 0; i < length; i++) {
          result.push(dictionary[address + i])
        }

        break
      }
      default: {
        result.push(symbol)
        break
      }
    }
  }

  return new Uint8Array(result)
}
