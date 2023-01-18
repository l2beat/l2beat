import { DiscoveryDiff } from './diffDiscovery'

export function diffToMessage(name: string, diffs: DiscoveryDiff[]): string[] {
  const messages: string[][] = [[]]
  let index = 0

  for (const diff of diffs) {
    const currentLength = wrapCodeBlock(name, messages[index]).length
    const nextDiff = diffToString(diff)

    if (currentLength + nextDiff.length < 2000) {
      messages[index].push(nextDiff)
    } else {
      index += 1
      messages[index] = []
      messages[index].push(nextDiff)
    }
  }

  const result = messages.map((m) => wrapCodeBlock(name, m))
  return result
}

export function wrapCodeBlock(name: string, messages: string[]) {
  const prefix = `Detected changes for ${name}\n\n\`\`\`diff\n`
  const postfix = '\n```'

  return `${prefix}${messages.join('\n')}${postfix}`
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
