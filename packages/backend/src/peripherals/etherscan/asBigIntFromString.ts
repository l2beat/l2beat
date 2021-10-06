import { as } from '../cast'

export const asBigIntFromString = as.mapped(as.string, (value) => {
  if (!/^-?\d+$/.test(value)) {
    throw new TypeError('Value must represent a base 10 integer')
  }
  return BigInt(value)
})
