import { Hash256 } from './Hash256'
import { json } from './json'

export function hashJson(value: json): Hash256 {
  // FIXME: In order for storybook to work we cannot use a top level import
  /* eslint-disable */
  const { createHash } = require('crypto')
  const message = JSON.stringify(value)
  const hex: string = createHash('sha256').update(message).digest('hex')
  /* eslint-enable */
  return Hash256('0x' + hex)
}
