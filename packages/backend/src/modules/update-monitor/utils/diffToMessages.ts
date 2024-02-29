import {
  ContractMeta,
  DiscoveryDiff,
  DiscoveryMeta,
  FieldDiff,
  getContractMeta,
  getValueMeta,
  ValueMeta,
} from '@l2beat/discovery'

import { MAX_MESSAGE_LENGTH } from '../../../peripherals/discord/DiscordClient'

export function diffToMessages(
  name: string,
  diffs: DiscoveryDiff[],
  meta: DiscoveryMeta | undefined,
  blockNumber: number,
  chain: string,
  dependents: string[],
  nonce?: number,
): string[] {
  const header = getHeader(name, chain, blockNumber, nonce)
  const dependentsMessage = getDependentsMessage(dependents)
  const overheadLength =
    header.length + dependentsMessage.length + wrapDiffCodeBlock('').length

  const maxLength = MAX_MESSAGE_LENGTH - overheadLength
  const messages = diffs.flatMap((diff) =>
    contractDiffToMessages(diff, getContractMeta(meta, diff.name), maxLength),
  )

  const bundledMessages = bundleMessages(messages, maxLength)

  return bundledMessages.map(
    (m) => `${header}${dependentsMessage}${wrapDiffCodeBlock(m)}`,
  )
}

export function contractDiffToMessages(
  diff: DiscoveryDiff,
  contractMeta: ContractMeta | undefined,
  maxLength = MAX_MESSAGE_LENGTH,
): string[] {
  if (diff.type === 'created') {
    return [`+ New contract: ${diff.name} | ${diff.address.toString()}\n\n`]
  }

  if (diff.type === 'deleted') {
    return [`- Deleted contract: ${diff.name} | ${diff.address.toString()}\n\n`]
  }

  const contractHeader = [
    `${diff.name} | ${diff.address.toString()}`,
    `+++ description: ${contractMeta?.description ?? 'None'}`,
    '',
    '',
  ].join('\n')
  const maxLengthAdjusted = maxLength - contractHeader.length
  const messages =
    diff.diff?.map((d) =>
      fieldDiffToMessage(
        d,
        getValueMeta(contractMeta, d.key),
        maxLengthAdjusted,
      ),
    ) ?? []

  //bundle message is called second time to handle situation when
  //diff in a single contract would result in a message larger than MAX_MESSAGE_LENGTH
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

function hideOverflow(str: string, maxLength: number) {
  if (str.length <= maxLength) {
    return str
  }

  return `${str.substring(0, maxLength - 3)}...`
}

export function fieldDiffToMessage(
  diff: FieldDiff,
  valueMeta: ValueMeta | undefined,
  maxLength = MAX_MESSAGE_LENGTH,
): string {
  let message = ''

  message += valueMeta?.description
    ? `+++ description: ${valueMeta.description}\n`
    : ''
  message += valueMeta?.type ? `+++ type: ${valueMeta.type.toString()}\n` : ''
  message += valueMeta?.severity ? `+++ severity: ${valueMeta.severity}\n` : ''

  if (diff.key !== undefined) {
    message += `${diff.key}\n`
  }
  if (diff.before || 'before' in diff) {
    message += `- ${diff.before ?? 'undefined'}\n`
  }
  if (diff.after || 'after' in diff) {
    message += `+ ${diff.after ?? 'undefined'}\n`
  }

  const NEW_LINE_BIAS = 1
  if (message.length + NEW_LINE_BIAS > maxLength) {
    const warningMessage = 'Warning: Message has been truncated\n'
    message =
      warningMessage +
      hideOverflow(message, maxLength - warningMessage.length - NEW_LINE_BIAS)
  }

  message += '\n'

  return message
}

function getHeader(
  name: string,
  chain: string,
  blockNumber: number,
  nonce?: number,
) {
  name = wrapBoldAndItalic(name)
  chain = wrapBoldAndItalic(chain)
  if (nonce === undefined) {
    return `${name} | detected changes on chain: ${chain}`
  }
  return `> ${formatNonce(
    nonce,
  )} (block_number=${blockNumber})\n\n${name} | detected changes on chain: ${chain}`
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
