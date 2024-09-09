import { option, optional } from 'cmd-ts'
import { ExistingPath } from './types'

export const discoveryPath = option({
  type: optional(ExistingPath),
  long: 'discovery-path',
  short: 'd',
})
