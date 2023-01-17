import { DiscoveryDiff } from './diffDiscovery'

export function diffToMessage(name: string, diff: DiscoveryDiff[]): string[] {
  const beginning = `Detected changes for ${name}\n\n\`\`\`diff\n`
  const end = '```'

  const messages: string[][] = []
  let index = 0
  messages[index] = []

  for(const d of diff) {
    const l = messages[index].join('').length
    if(beginning.length + l + end.length + diffToString(d).length < 2000) {
      messages[index].push(`${diffToString(d)}\n`)
    } else {
      index += 1
      messages[index] = []
      messages[index].push(`${diffToString(d)}\n`)
    }
  }

  const result = messages.map(m => `${beginning}${m.join('')}${end}`)

  return result
}

export function diffToString(diff: DiscoveryDiff): string {
  if (diff.type === 'created') {
    return `+ New contract: ${diff.name} | ${diff.address.toString()}\n`
  }

  if (diff.type === 'deleted') {
    return `- Deleted contract: ${diff.name} | ${diff.address.toString()}\n`
  }

  let message = `${diff.name} | ${diff.address.toString()}\n\n`

  for (const d of diff.diff ?? []) {
    if (d.key !== undefined) {
      message += `${d.key}\n`
    }
    if (d.before) {
      message += `- ${d.before}\n`
    }
    if (d.after) {
      message += `+ ${d.after}\n`
    }
    message += '\n'
  }

  return message
}
