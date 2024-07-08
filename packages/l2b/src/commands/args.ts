import { option } from 'cmd-ts'
import { ExistingPath } from 'cmd-ts/batteries/fs'

export const discoveryPath = option({
  type: ExistingPath,
  long: 'discovery-path',
  short: 'd',
  defaultValue: () => '../backend',
})
