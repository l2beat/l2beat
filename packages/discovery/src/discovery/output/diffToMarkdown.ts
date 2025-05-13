import { assert } from '@l2beat/shared-pure'
import toUpper from 'lodash/toUpper'
import type { FieldDiff } from './diffContracts'
import type { DiscoveryDiff } from './diffDiscovery'

export function discoveryDiffToMarkdown(
  diffs: DiscoveryDiff[],
  maxLength: number = Number.MAX_SAFE_INTEGER,
): string {
  const result = []

  const joinerString = '\n\n'
  const countOfNewLines = joinerString.length * (diffs.length - 1)
  let lengthAccumulator = 0
  for (const diff of diffs) {
    const markdown = contractDiffToMarkdown(diff, maxLength - countOfNewLines)

    lengthAccumulator += markdown.length
    if (lengthAccumulator > maxLength) {
      break
    }

    result.push(markdown)
  }

  const joined = result.join(joinerString)
  return joined
}

export function contractDiffToMarkdown(
  diff: DiscoveryDiff,
  maxLength: number = Number.MAX_SAFE_INTEGER,
): string {
  const result = []
  result.push('```diff')
  if (diff.type) {
    const marker = diff.type === 'created' ? '+' : '-'
    result.push(`${marker}   Status: ${toUpper(diff.type)}`)
  }

  const contractDescription = diff?.description ?? 'None'
  const contractLine = `    ${diff.addressType === 'EOA' ? 'EOA' : 'contract'} ${diff.name ?? ''} (${diff.address.toString()})`
  const descriptionLine = `    +++ description: ${contractDescription}`
  if (diff.diff) {
    result.push(`${contractLine} {`)
    result.push(descriptionLine)

    for (const valueDiff of diff.diff) {
      result.push(fieldDiffToMarkdown(valueDiff, maxLength))
    }

    result.push('    }')
  } else {
    result.push(contractLine)
    result.push(descriptionLine)
  }

  const endOfDiff = '\n```'
  const joined = result.join('\n')
  return handleOverflow(joined, maxLength, endOfDiff)
}

export function fieldDiffToMarkdown(
  diff: FieldDiff,
  maxLength: number = Number.MAX_SAFE_INTEGER,
): string {
  const result = []

  if (diff?.description !== undefined) {
    result.push(`+++ description: ${diff.description}`)
  }
  if (diff?.severity !== undefined) {
    result.push(`+++ severity: ${diff.severity}`)
  }

  const varName = diff.key ?? 'unknown'
  result.push(`      ${varName}:`)
  if (diff.before) {
    result.push(`-        ${diff.before}`)
  }
  if (diff.after) {
    result.push(`+        ${diff.after}`)
  }

  return handleOverflow(result.join('\n'), maxLength)
}

function handleOverflow(
  str: string,
  maxLength: number,
  userSuffix = '',
): string {
  const WARNING_MESSAGE = '... (message too long)'
  assert(
    maxLength > WARNING_MESSAGE.length + userSuffix.length,
    'maxLength must be greater than WARNING_MESSAGE.length + userSuffix.length',
  )

  if (str.length + userSuffix.length <= maxLength) {
    return str + userSuffix
  }

  return `${str.substring(
    0,
    maxLength - WARNING_MESSAGE.length - userSuffix.length,
  )}${WARNING_MESSAGE}${userSuffix}`
}
