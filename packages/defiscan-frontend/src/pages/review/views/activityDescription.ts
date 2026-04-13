import type { ActivityEvent } from '../../../types'

interface DescribeOptions {
  /** When true, the contract name is omitted — caller is rendering it separately as a title. */
  omitName?: boolean
}

export function describeActivityEvent(
  event: ActivityEvent,
  options: DescribeOptions = {},
): string {
  const implCount = event.implementations.length
  const implPhrase =
    implCount === 1
      ? 'a new implementation'
      : `${implCount} new implementations`

  if (options.omitName) {
    const tag = event.isDependency ? 'Dependency upgraded' : 'Upgraded'
    return `${tag} to ${implPhrase}.`
  }

  if (event.isDependency) {
    const owner = event.entity ? `${event.entity}'s ` : ''
    return `${owner}${event.contractName} (dependency) was upgraded to ${implPhrase}.`
  }
  return `${event.contractName} was upgraded to ${implPhrase}.`
}
