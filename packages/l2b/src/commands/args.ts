import { option } from 'cmd-ts'
import { ExistingPath } from './types'

export const discoveryPath = option({
  type: ExistingPath,
  long: 'discovery-path',
  short: 'd',
  defaultValue: () => '../backend',
})
