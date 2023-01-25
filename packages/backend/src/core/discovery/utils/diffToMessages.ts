import { MAX_MESSAGE_LENGTH } from '../../../peripherals/discord/DiscordClient'
import { FieldDiff } from './diffContracts'
import { DiscoveryDiff } from './diffDiscovery'

export function diffToMessages(name: string, diffs: DiscoveryDiff[]): string[] {
  const header = `${wrapBoldAndItalic(name)} | detected changes`
  const overheadLength = header.length + wrapDiffCodeBlock('').length
  const messages: string[] = ['']
  let index = 0

  for (const diff of diffs) {
    const nextDiff = diffToString(diff, overheadLength)

    for (const next of nextDiff) {
      const currentLength =
        wrapDiffCodeBlock(messages[index]).length + header.length
      if (currentLength + next.length >= MAX_MESSAGE_LENGTH) {
        index += 1
        messages.push('')
      }
      messages[index] += next
    }
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

export function diffToString(
  diff: DiscoveryDiff,
  overheadLength = 0,
): string[] {
  if (diff.type === 'created') {
    return [`+ New contract: ${diff.name} | ${diff.address.toString()}\n\n`]
  }

  if (diff.type === 'deleted') {
    return [`- Deleted contract: ${diff.name} | ${diff.address.toString()}\n\n`]
  }

  const prefix = `${diff.name} | ${diff.address.toString()}\n\n`
  const messages = ['']
  let index = 0

  for (const d of diff.diff ?? []) {
    const message = fieldDiffToString(d)
    if (
      prefix.length +
        messages[index].length +
        message.length +
        overheadLength >=
      MAX_MESSAGE_LENGTH
    ) {
      index += 1
      messages.push('')
    }
    messages[index] += message
  }

  return messages.map((m) => `${prefix}${m}`)
}

export function fieldDiffToString(diff: FieldDiff): string {
  let message = ''

  if (diff.key !== undefined) {
    message += `${diff.key}\n`
  }
  if (diff.before) {
    message += `- ${diff.before}\n`
  }
  if (diff.after) {
    message += `+ ${diff.after}\n`
  }
  message += '\n'

  return message 
}
