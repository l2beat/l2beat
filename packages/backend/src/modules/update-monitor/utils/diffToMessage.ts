import { type DiscoveryDiff, discoveryDiffToMarkdown } from '@l2beat/discovery'
import { MAX_MESSAGE_LENGTH } from '../../../peripherals/discord/DiscordClient'

export function diffToMessage(
  name: string,
  diffs: DiscoveryDiff[],
  blockNumber: number,
  chain: string,
  dependents: string[],
  nonce?: number,
  trackedTxsAffected?: boolean,
): string {
  const header = getHeader(name, chain, blockNumber, nonce)
  const dependentsMessage = getDependentsMessage(dependents)
  const trackedTxsMessage = trackedTxsAffected
    ? getTrackedTxsMessage()
    : undefined

  const overheadLength =
    header.length + dependentsMessage.length + (trackedTxsMessage?.length ?? 0)
  const maxLength = MAX_MESSAGE_LENGTH - overheadLength

  const message = discoveryDiffToMarkdown(diffs, maxLength)

  return `${header}${dependentsMessage}${trackedTxsMessage || ''}${message}`
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

function getTrackedTxsMessage(): string {
  return '\n' + wrapItalic('Tracked transactions might be affected.')
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
