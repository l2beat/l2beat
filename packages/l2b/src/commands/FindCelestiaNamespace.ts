import { command, positional, string } from 'cmd-ts'
import { findCelestiaNamespace } from '../implementations/find-celestia-namespace/find-celestia-namespace'
import { HttpUrl } from './types'

export const FindCelestiaNamespace = command({
  name: 'find-celestia-namespace',
  description: 'Finds the celestia namespace based on given commitment.',
  version: '1.0.0',
  args: {
    apiUrl: positional({
      displayName: 'apiUrl',
      type: HttpUrl,
    }),
    commitment: positional({ type: string, displayName: 'commitment' }),
  },
  handler: ({ apiUrl, commitment }) => {
    findCelestiaNamespace(apiUrl, commitment)
  },
})
