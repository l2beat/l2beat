import { DiscoveryDiff, FieldDiff } from '@l2beat/discovery'

import { MAX_MESSAGE_LENGTH } from '../../../peripherals/discord/DiscordClient'

export interface DiffMetadata {
  blockNumber: number
  dependents: string[]
  nonce?: number
}

export function diffToMessages(
  name: string,
  diffs: DiscoveryDiff[],
  metadata: DiffMetadata,
): string[] {
  const header = getHeader(name, metadata.blockNumber, metadata.nonce)
  const dependentsMessage = getDependentsMessage(metadata.dependents)
  const overheadLength =
    header.length + dependentsMessage.length + wrapDiffCodeBlock('').length

  const maxLength = MAX_MESSAGE_LENGTH - overheadLength
  const messages = diffs.flatMap((diff) =>
    contractDiffToMessages(diff, maxLength),
  )

  const bundledMessages = bundleMessages(messages, maxLength)

  return bundledMessages.map(
    (m) => `${header}${dependentsMessage}${wrapDiffCodeBlock(m)}`,
  )
}

export function contractDiffToMessages(
  diff: DiscoveryDiff,
  maxLength = MAX_MESSAGE_LENGTH,
): string[] {
  if (diff.type === 'created') {
    return [`+ New contract: ${diff.name} | ${diff.address.toString()}\n\n`]
  }

  if (diff.type === 'deleted') {
    return [`- Deleted contract: ${diff.name} | ${diff.address.toString()}\n\n`]
  }

  const contractHeader = `${diff.name} | ${diff.address.toString()}\n\n`
  const messages = diff.diff?.map(fieldDiffToMessage) ?? []

  //bundle message is called second time to handle situation when
  //diff in a single contract would result in a message larger than MAX_MESSAGE_LENGTH
  const maxLengthAdjusted = maxLength - contractHeader.length
  const bundledMessages = bundleMessages(messages, maxLengthAdjusted)

  return bundledMessages.map((m) => `${contractHeader}${m}`)
}

// current implementation of message bundling works based on the assumption
// that every element of messages array is no longer than MAX_MESSAGE_LENGTH
export function bundleMessages(
  messages: string[],
  maxLength: number,
): string[] {
  const bundle: string[] = ['']
  let index = 0

  for (const message of messages) {
    if (message.length + bundle[index].length > maxLength) {
      index++
      bundle.push('')
    }

    bundle[index] += message
  }
  return bundle
}

export function fieldDiffToMessage(diff: FieldDiff): string {
  let message = ''

  if (diff.key !== undefined) {
    message += `${diff.key}\n`
  }
  if (diff.before || 'before' in diff) {
    message += `- ${diff.before ?? 'undefined'}\n`
  }
  if (diff.after || 'after' in diff) {
    message += `+ ${diff.after ?? 'undefined'}\n`
  }

  message += '\n'

  return message
}

function getHeader(name: string, blockNumber: number, nonce?: number) {
  if (nonce === undefined) {
    return `${wrapBoldAndItalic(name)} | detected changes`
  }
  return `> ${formatNonce(
    nonce,
  )} (block_number=${blockNumber})\n\n${wrapBoldAndItalic(
    name,
  )} | detected changes`
}

function getDependentsMessage(dependents: string[]) {
  if (dependents.length === 0) {
    return ''
  }
  return (
    '\n' +
    wrapItalic('This is a shared module, used by the following projects:') +
    ' ' +
    wrapBoldAndItalic(dependents.join(', ') + '.')
  )
}

export function formatNonce(nonce: number): string {
  const length = 4
  if (nonce.toString().length > length) {
    return `#${nonce}`
  }

  const zerosToAdd = length - nonce.toString().length
  const zeros = '0'.repeat(zerosToAdd)
  return `#${zeros}${nonce}`
}

export function wrapItalic(content: string) {
  const affix = '*'
  return `${affix}${content}${affix}`
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
