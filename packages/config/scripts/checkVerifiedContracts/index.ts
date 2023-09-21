import { Logger, LogLevel } from '@l2beat/shared'
import { branded, EthereumAddress } from '@l2beat/shared-pure'
import { config as dotenv } from 'dotenv'
import { readFile } from 'fs/promises'
import { parse, ParseError } from 'jsonc-parser'
import * as z from 'zod'

import { bridges, layer2s } from '../../src'
import {
  areAllProjectContractsVerified,
  getUniqueContractsForAllProjects,
} from './addresses'
import { getEtherscanClient } from './etherscan'
import {
  loadPreviouslyVerifiedContracts,
  saveResult,
  VerificationMap,
} from './output'
import { verifyContracts } from './tasks'
import { getEnv } from './utils'

export const OUTPUT_FILEPATH = 'src/verified.json'

export type ManuallyVerfiedContracts = z.infer<typeof ManuallyVerfiedContracts>
export const ManuallyVerfiedContracts = z.array(
  branded(z.string(), EthereumAddress),
)

async function getManuallyVerified() {
  const content = await readFile(
    'scripts/checkVerifiedContracts/manuallyVerified.jsonc',
    'utf-8',
  )
  const errors: ParseError[] = []
  const parsed: unknown = parse(content, errors, {
    allowTrailingComma: true,
  })
  if (errors.length !== 0) {
    throw new Error('Cannot parse manuallyVerified.jsonc')
  }

  return ManuallyVerfiedContracts.parse(parsed)
}

export async function main() {
  const logger = new Logger({ logLevel: LogLevel.INFO, format: 'pretty' })
  const envWorkersVar = 'ETHERSCAN_WORKERS'
  const workersCount = parseInt(getEnv(envWorkersVar, '4'))
  const manuallyVerified = await getManuallyVerified()

  console.log('Check Verified Contracts.')
  console.log('=========================')
  console.log(
    `${envWorkersVar}=${workersCount} (can be changed via environment variable)`,
  )

  const projects = [...layer2s, ...bridges]
  const previouslyVerified = await loadPreviouslyVerifiedContracts(
    OUTPUT_FILEPATH,
  )
  const addresses = getUniqueContractsForAllProjects(projects)
  const etherscanClient = getEtherscanClient()
  const addressVerificationMap = await verifyContracts(
    addresses,
    previouslyVerified,
    new Set(manuallyVerified),
    etherscanClient,
    workersCount,
    logger,
  )
  const projectVerificationMap: VerificationMap = {}
  projects.forEach((project) => {
    projectVerificationMap[project.id.toString()] =
      areAllProjectContractsVerified(project, addressVerificationMap)
  })
  await saveResult(
    OUTPUT_FILEPATH,
    addressVerificationMap,
    projectVerificationMap,
  )
}

dotenv()
main().catch((error) => {
  console.error(error)
  process.exit(1)
})
