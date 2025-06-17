import { command, flag } from 'cmd-ts'
import { runDiscoveryUi } from '../implementations/discovery-ui/main'
import { explorerApiKey } from './args'

export const UI = command({
  name: 'ui',
  description: 'Launches DiscoUI.',
  version: '1.0.0',
  args: {
    explorerApiKey,
    readonly: flag({
      long: 'readonly',
      description: 'Run in read-only mode',
    }),
  },
  handler: runDiscoveryUi,
})
