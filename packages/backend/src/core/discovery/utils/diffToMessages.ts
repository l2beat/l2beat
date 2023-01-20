import { MAX_MESSAGE_LENGTH } from '../../../peripherals/discord/DiscordClient'
import { DiscoveryDiff } from './diffDiscovery'

export function diffToMessages(name: string, diffs: DiscoveryDiff[]): string[] {
  const header = `${wrapBoldAndItalic(name)} | detected changes`
  const messages: string[] = ['']
  let index = 0

  for (const diff of diffs) {
    const currentLength =
      wrapDiffCodeBlock(messages[index]).length + header.length
    const nextDiff = diffToString(diff)

    if (currentLength + nextDiff.length >= MAX_MESSAGE_LENGTH) {
      index += 1
      messages.push('')
    }

    messages[index] += nextDiff + '\n'
  }

  const result = messages.map((m) => `${header}${wrapDiffCodeBlock(m)}`)
  return result
}

export function wrapBoldAndItalic(content: string) {
  const affix = '***'
  return `${affix}${content}${affix}`
}

export function wrapDiffCodeBlock(content: string) {
  const prefix = '```diff\n'
  const postfix = '```'

  return `${prefix}${content}${postfix}`
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
