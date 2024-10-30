import { command } from 'cmd-ts'
import { runDiscoveryUi } from '../implementations/discovery-ui/main'

export const UI = command({
  name: 'ui',
  description: 'Launches discovery ui',
  version: '1.0.0',
  args: {},
  handler: runDiscoveryUi,
})
