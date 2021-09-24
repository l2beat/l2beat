import { as } from '../cast'
import { BigInteger, Bytes } from '../model'

export const asData = as.mapped(as.string, (value: string) => {
  if (!value.startsWith('0x')) {
    throw new TypeError('Data must start with 0x')
  }
  if (value.length % 2 !== 0) {
    throw new TypeError('Data must represent each byte as two digits')
  }
  try {
    return Bytes.fromHex(value)
  } catch {
    throw new TypeError('Data must be a hex string')
  }
})

export const asQuantity = as.mapped(as.string, (value: string) => {
  if (!value.startsWith('0x')) {
    throw new TypeError('Quantity must start with 0x')
  }
  if (value !== '0x0' && value.startsWith('0x0')) {
    throw new TypeError('Quantity cannot have leading zeroes')
  }
  try {
    return BigInteger.from(value)
  } catch {
    throw new TypeError('Quantity must be a hex string')
  }
})
