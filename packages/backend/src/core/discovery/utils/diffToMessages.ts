import { MAX_MESSAGE_LENGTH } from '../../../peripherals/discord/DiscordClient'
import { FieldDiff } from './diffContracts'
import { DiscoveryDiff } from './diffDiscovery'

export function diffToMessages(name: string, diffs: DiscoveryDiff[]): string[] {
  const header = `${wrapBoldAndItalic(name)} | detected changes`
  const messages: string[] = ['']
  let index = 0

  for (const diff of diffs) {
    
    const nextDiff = diffToString(diff)

    for(const next of nextDiff){
      const currentLength =
      wrapDiffCodeBlock(messages[index]).length + header.length
      console.log(currentLength + next.length + '\n'.length)
      if (currentLength + next.length + '\n'.length >= MAX_MESSAGE_LENGTH) {
        index += 1
        messages.push('')
      }
      messages[index] += next +'\n'
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

export function diffToString(diff: DiscoveryDiff): string[] {
  if (diff.type === 'created') {
    return [`+ New contract: ${diff.name} | ${diff.address.toString()}\n`]
  }

  if (diff.type === 'deleted') {
    return [`- Deleted contract: ${diff.name} | ${diff.address.toString()}\n`]
  }

  const prefic =`${diff.name} | ${diff.address.toString()}\n\n` 
  const messages = ['']
  let index = 0

  for (const d of diff.diff ?? []) {
    const message = fieldDiffToString(d)
    if(prefic.length + messages[index].length + message.length + 12 + 31 >= MAX_MESSAGE_LENGTH) {
      index += 1
        messages.push('')
    }
    messages[index] += message

  }

  return messages.map(m => `${prefic}${m}`)
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
