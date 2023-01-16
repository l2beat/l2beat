import { DiscoveryDiff } from './diffDiscovery'

export function diffToString(diff: DiscoveryDiff): string {
  if (diff.type === 'created') {
    return `\`\`\`diff\n+New contract: ${
      diff.name
    } | ${diff.address.toString()}\n\`\`\``
  }

  if (diff.type === 'deleted') {
    return `\`\`\`diff\n-Deleted contract: ${
      diff.name
    } | ${diff.address.toString()}\n\`\`\``
  }

  let message = `\`\`\`diff\n${diff.name} | ${diff.address.toString()}\n\n`

  for (const d of diff.diff ?? []) {
    if (d.key !== undefined) {
      message += `${d.key}\n`
    }
    if (d.before) {
      message += `-${d.before}\n`
    }
    if (d.after) {
      message += `+${d.after}\n`
    }
    message += '\n'
  }

  return message + '```'
}
