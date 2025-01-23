import { createHash } from 'crypto'
import { Hash256, type json } from '@l2beat/shared-pure'

export function hashJson(value: json) {
  const message = JSON.stringify(value)
  const hex: string = createHash('sha256').update(message).digest('hex')
  return Hash256('0x' + hex)
}
