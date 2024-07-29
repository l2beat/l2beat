import { assert } from '@l2beat/backend-tools'
import { DiscoveryOutput, FieldMeta } from '@l2beat/discovery-types'
import { toUpper } from 'lodash'
import { normalizeDiffPath } from '../utils/normalizeDiffPath'
import { FieldDiff } from './diffContracts'
import { DiscoveryDiff } from './diffDiscovery'

export interface ContractDiffInformation {
  description: string
  fields: Record<string, FieldMeta>
}

export function discoveryDiffToMarkdown(
  diffs: DiscoveryDiff[],
  discovery: DiscoveryOutput,
  maxLength: number = Number.MAX_SAFE_INTEGER,
): string {
  const result = []

  const joinerString = '\n\n'
  const countOfNewLines = joinerString.length * (diffs.length - 1)
  let lengthAccumulator = 0
  for (const diff of diffs) {
    const contract = getContractDiffInformation(discovery, diff.name)
    const markdown = contractDiffToMarkdown(
      diff,
      contract,
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
  contract: ContractDiffInformation | undefined,
  maxLength: number = Number.MAX_SAFE_INTEGER,
): string {
  const result = []
  result.push('```diff')
  if (diff.type) {
    const marker = diff.type === 'created' ? '+' : '-'
    result.push(`${marker}   Status: ${toUpper(diff.type)}`)
  }

  const contractDescription = contract?.description ?? 'None'
  const contractLine = `    contract ${diff.name} (${diff.address.toString()})`
  const descriptionLine = `    +++ description: ${contractDescription}`
  if (diff.diff) {
    result.push(`${contractLine} {`)
    result.push(descriptionLine)

    for (const valueDiff of diff.diff) {
      let field: FieldMeta | undefined
      if (valueDiff.key !== undefined) {
        field = contract?.fields?.[normalizeDiffPath(valueDiff.key)]
      }

      result.push(fieldDiffToMarkdown(valueDiff, field))
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
  field: FieldMeta | undefined,
  maxLength: number = Number.MAX_SAFE_INTEGER,
): string {
  const result = []

  if (field?.description !== undefined) {
    result.push(`+++ description: ${field.description}`)
  }
  if (field?.severity !== undefined) {
    result.push(`+++ severity: ${field.severity}`)
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

function getContractDiffInformation(
  discovery: DiscoveryOutput,
  name: string,
): ContractDiffInformation | undefined {
  const contract = discovery.contracts.find((c) => c.name === name)
  if (contract === undefined) {
    return contract
  }

  const result: ContractDiffInformation = {
    description: contract.descriptions?.join(' ') ?? 'None',
    fields: contract.fieldMeta ?? {},
  }

  return result
}
