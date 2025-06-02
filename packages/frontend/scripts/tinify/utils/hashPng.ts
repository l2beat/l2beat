import crypto from 'crypto'

export function hashPng(file: Buffer) {
  return crypto.createHash('md5').update(file).digest('hex')
}
