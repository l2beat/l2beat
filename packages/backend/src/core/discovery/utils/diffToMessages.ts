import { MAX_MESSAGE_LENGTH } from '../../../peripherals/discord/DiscordClient'
import { FieldDiff } from './diffContracts'
import { DiscoveryDiff } from './diffDiscovery'

export function diffToMessages(name: string, diffs: DiscoveryDiff[]): string[] {
  const header = getHeader(name)
  const overheadLength = header.length + wrapDiffCodeBlock('').length

  const maxLength = MAX_MESSAGE_LENGTH - overheadLength
  const messages = bundleMessages(
    diffs.flatMap((diff) => contractDiffToMessages(diff, overheadLength)),
    maxLength,
  )

  const result = messages.map((m) => `${header}${wrapDiffCodeBlock(m)}`)
  return result
}

export function contractDiffToMessages(
  diff: DiscoveryDiff,
  overheadLength = 0,
): string[] {
  if (diff.type === 'created') {
    return [`+ New contract: ${diff.name} | ${diff.address.toString()}\n\n`]
  }

  if (diff.type === 'deleted') {
    return [`- Deleted contract: ${diff.name} | ${diff.address.toString()}\n\n`]
  }

  const contractHeader = `${diff.name} | ${diff.address.toString()}\n\n`
  const maxLength = MAX_MESSAGE_LENGTH - contractHeader.length - overheadLength
  const messages = bundleMessages(
    diff.diff?.map(fieldDiffToString) ?? [],
    maxLength,
  )

  return messages.map((m) => `${contractHeader}${m}`)
}

export function bundleMessages(
  messages: string[],
  maxLength: number,
): string[] {
  const result: string[] = ['']
  let index = 0

  for (const value of messages) {
    if (value.length + result[index].length > maxLength) {
      index++
      result.push('')
    }

    result[index] += value
  }
  return result
}

// diffToWrapped(...) works based on the assumption
// that this function will not return string longer that MAX_MESSAGE_LENGTH
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

function getHeader(name: string) {
  return `${wrapBoldAndItalic(name)} | detected changes`
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
