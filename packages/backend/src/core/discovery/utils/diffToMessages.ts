import { MAX_MESSAGE_LENGTH } from '../../../peripherals/discord/DiscordClient'
import { FieldDiff } from './diffContracts'
import { DiscoveryDiff } from './diffDiscovery'

export function diffToWrappedMessages(
  name: string,
  diffs: DiscoveryDiff[],
): string[] {
  const header = `${wrapBoldAndItalic(name)} | detected changes`
  const overheadLength = header.length + wrapDiffCodeBlock('').length
  const messages = truncateString(diffs.flatMap((diff) => diffToMessages(diff,overheadLength)), MAX_MESSAGE_LENGTH, overheadLength)

  const result = messages.map((m) => `${header}${wrapDiffCodeBlock(m)}`)
  return result
}

export function truncateString(values: string[], maxLength: number, overheadLength:number  = 0): string[]{
  const result: string[] = ['']
  let index = 0

  for(const value of values){
    if(value.length + result[index].length + overheadLength > maxLength){
      index++
      result.push('')
    }

    result[index] += value
  }
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

export function diffToMessages(
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
  const messages = truncateString(diff.diff?.map(fieldDiffToString) ?? [], MAX_MESSAGE_LENGTH, prefix.length + overheadLength)
  
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
