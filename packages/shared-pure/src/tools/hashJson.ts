import { Hash256, json } from '../types'

export function hashJson(value: json) {
  // FIXME: In order for storybook to work we cannot use a top level import
  /* eslint-disable */
  const { createHash } = require('crypto')
  const message = JSON.stringify(value)
  const hex: string = createHash('sha256').update(message).digest('hex')
  /* eslint-enable */
  return Hash256('0x' + hex)
}
