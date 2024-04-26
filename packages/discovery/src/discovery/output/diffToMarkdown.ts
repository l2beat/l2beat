import { assert } from '@l2beat/backend-tools'
import { toUpper } from 'lodash'

import { ContractMeta, DiscoveryMeta, ValueMeta } from '../config/DiscoveryMeta'
import { getContractMeta, getValueMeta } from '../utils/metaGetters'
import { FieldDiff } from './diffContracts'
import { DiscoveryDiff } from './diffDiscovery'

export function discoveryDiffToMarkdown(
  diffs: DiscoveryDiff[],
  meta: DiscoveryMeta | undefined,
  maxLength: number = Number.MAX_SAFE_INTEGER,
): string {
  const result = []

  const joinerString = '\n\n'
  const countOfNewLines = joinerString.length * (diffs.length - 1)
  let lengthAccumulator = 0
  for (const diff of diffs) {
    const contractMeta = getContractMeta(meta, diff.name)
    const markdown = contractDiffToMarkdown(
      diff,
      contractMeta,
      maxLength - countOfNewLines,
    )

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
  contractMeta: ContractMeta | undefined,
  maxLength: number = Number.MAX_SAFE_INTEGER,
): string {
  const result = []
  result.push('```diff')
  if (diff.type) {
    const marker = diff.type === 'created' ? '+' : '-'
    result.push(`${marker}   Status: ${toUpper(diff.type)}`)
  }

  const contractDescription = contractMeta?.description ?? 'None'
  const contractLine = `    contract ${diff.name} (${diff.address.toString()})`
  const descriptionLine = `    +++ description: ${contractDescription}`
  if (diff.diff) {
    result.push(`${contractLine} {`)
    result.push(descriptionLine)

    for (const valueDiff of diff.diff) {
      const valueMeta = getValueMeta(contractMeta, valueDiff.key)
      result.push(fieldDiffToMarkdown(valueDiff, valueMeta))
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
  meta: ValueMeta | undefined,
  maxLength: number = Number.MAX_SAFE_INTEGER,
): string {
  const result = []

  if (meta?.description !== null && meta?.description !== undefined) {
    result.push(`+++ description: ${meta.description}`)
  }
  if (meta?.type !== null && meta?.type !== undefined) {
    result.push(`+++ type: ${meta.type.toString()}`)
  }
  if (meta?.severity !== null && meta?.severity !== undefined) {
    result.push(`+++ severity: ${meta.severity}`)
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
