import { ProjectRiskViewEntry } from '@l2beat/config'

export function getDestination(destinations: string[]): ProjectRiskViewEntry {
  if (destinations.length === 0) {
    throw new Error('Invalid destination')
  }
  if (destinations.length === 1) {
    return { value: destinations[0], description: '', sentiment: 'neutral' }
  }
  if (destinations.length === 2) {
    return {
      value: destinations.join(', '),
      description: '',
      sentiment: 'neutral',
    }
  }
  return {
    value: 'Various',
    description: destinations.join(',\n'),
    sentiment: 'neutral',
  }
}
