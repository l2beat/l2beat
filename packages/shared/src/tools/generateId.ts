import { v4 as uuidv4 } from 'uuid'
import { randomInt } from 'crypto'

export function generateId() {
  return uuidv4()
}

export function generateIntId() {
  return randomInt(1000)
}
