import { type ValueWithSentiment } from '@l2beat/shared-pure'

export function getDestination(
  destinations: string[],
): ValueWithSentiment<string> {
  if (destinations.length === 0) {
    throw new Error('Invalid destination')
  }
  if (destinations.length === 1) {
    return { value: destinations[0]!, sentiment: 'neutral' }
  }

  return {
    value: 'Various',
    description: destinations.join(',\n'),
    sentiment: 'neutral',
  }
}
