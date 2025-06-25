import { command, flag, option, optional, string } from 'cmd-ts'
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
    etherscanApiKey: option({
      type: optional(string),
      env: 'L2B_ETHERSCAN_API_KEY',
      long: 'etherscan-key',
      short: 'k',
      defaultValue: () => 'YourApiKeyToken',
    }),
  },
  handler: runDiscoveryUi,
})
