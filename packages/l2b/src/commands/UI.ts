import { command, flag } from 'cmd-ts'
import { runDiscoveryUi } from '../implementations/discovery-ui/main'

export const UI = command({
  name: 'ui',
  description: 'Launches DiscoUI.',
  version: '1.0.0',
  args: {
    readonly: flag({
      long: 'readonly',
      description: 'Run in read-only mode',
    }),
  },
  handler: runDiscoveryUi,
})
