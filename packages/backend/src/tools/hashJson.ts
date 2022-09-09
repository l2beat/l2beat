import { Hash256, json } from '@l2beat/types'
import { createHash } from 'crypto'

export function hashJson(value: json) {
  const message = JSON.stringify(value)
  const hex = createHash('sha256').update(message).digest('hex')
  return Hash256('0x' + hex)
}
