import type { Logger } from '@l2beat/backend-tools'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import chalk from 'chalk'
import type { Analysis } from '../analysis/AddressAnalyzer'
import { toAddressArray } from '../utils/extractors'

export interface FrontierReferrer {
  address: ChainSpecificAddress
  name: string | undefined
  fields: { field: string; addresses: ChainSpecificAddress[] }[]
}

export function findFrontierReferrers(
  analyses: Analysis[],
  beyondMaxDepth: ChainSpecificAddress[],
): FrontierReferrer[] {
  const frontier = new Set(beyondMaxDepth)
  const referrers: FrontierReferrer[] = []
  for (const analysis of analyses) {
    if (analysis.type === 'Reference') {
      continue
    }
    const fields: FrontierReferrer['fields'] = []
    for (const [field, value] of Object.entries(analysis.values)) {
      const addresses = toAddressArray(value).filter(
        (address) => frontier.has(address) && address in analysis.relatives,
      )
      if (addresses.length > 0) {
        fields.push({ field, addresses: [...new Set(addresses)] })
      }
    }
    if (fields.length > 0) {
      referrers.push({ address: analysis.address, name: analysis.name, fields })
    }
  }
  return referrers
}

export function printFrontier(
  logger: Logger,
  analyses: Analysis[],
  beyondMaxDepth: ChainSpecificAddress[],
  maxDepth: number,
) {
  const count = new Set(beyondMaxDepth).size
  logger.info(
    chalk.yellowBright(
      `maxDepth ${maxDepth} reached: ${count} addresses one level deeper were not analyzed. The fields that lead to them:`,
    ),
  )
  for (const referrer of findFrontierReferrers(analyses, beyondMaxDepth)) {
    logger.info(`  ${referrer.name ?? '???'} ${referrer.address}`)
    for (const { field, addresses } of referrer.fields) {
      logger.info(`    ${field}: ${addresses.join(', ')}`)
    }
  }
}
