/**
 * Collects stealth key registrations of privacy projects with a
 * `keyRegistrations` anonymity set into the frontend's data file, which the
 * frontend reads their anonymity sets from. The file lives in the frontend
 * package so it ships with the frontend's Docker image.
 *
 * Each run resumes after the last collected block, so rerun it to bring the
 * data up to date. Remove a project's entry to collect it from scratch.
 *
 * Usage:
 *   pnpm privacy-key-registrations
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { getEnv, Logger } from '@l2beat/backend-tools'
import {
  type ProjectPrivacyKeyRegistrationAnonymitySet,
  ProjectService,
} from '@l2beat/config'
import { getBlockNumberAtOrBefore, HttpClient, RpcClient } from '@l2beat/shared'
import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'

const OUTPUT_PATH = path.join(
  __dirname,
  '../../frontend/src/server/features/privacy/anonymity-set/keyRegistrations.json',
)
const BLOCK_RANGE = 50_000
// Stay behind the chain head so collected blocks are not reorged.
const CONFIRMATIONS = 64

type KeyRegistrations = Record<
  string,
  {
    /** Last collected block and its timestamp. */
    toBlock: number
    toTimestamp: number
    registrations: {
      blockNumber: number
      timestamp: number
      registrant: string
    }[]
  }
>

async function main() {
  const env = getEnv()
  const logger = Logger.INFO
  const http = new HttpClient()
  const ps = new ProjectService()

  const projects = await ps.getProjects({ select: ['privacyInfo'] })
  const data: KeyRegistrations = existsSync(OUTPUT_PATH)
    ? JSON.parse(readFileSync(OUTPUT_PATH, 'utf8'))
    : {}

  for (const project of projects) {
    const config = project.privacyInfo.anonymitySet
    if (config?.type !== 'keyRegistrations') continue

    const chain = ChainSpecificAddress.longChain(config.registry)
    const rpc = new RpcClient({
      chain,
      url: env.string(`${chain.toUpperCase()}_RPC_URL`),
      http,
      logger,
      callsPerMinute: 600,
      retryStrategy: 'SCRIPT',
    })
    await collect(project.id, config, rpc, data)
  }
}

async function collect(
  projectId: string,
  config: ProjectPrivacyKeyRegistrationAnonymitySet,
  rpc: RpcClient,
  data: KeyRegistrations,
) {
  const lastBlock = (await rpc.getLatestBlockNumber()) - CONFIRMATIONS
  const entry = data[projectId] ?? {
    toBlock:
      (await getBlockNumberAtOrBefore(
        config.sinceTimestamp,
        0,
        lastBlock,
        (block) => rpc.getBlock(block, false),
      )) - 1,
    toTimestamp: config.sinceTimestamp,
    registrations: [],
  }
  data[projectId] = entry
  const registry = ChainSpecificAddress.address(config.registry).toString()

  while (entry.toBlock < lastBlock) {
    const from = entry.toBlock + 1
    const to = Math.min(from + BLOCK_RANGE - 1, lastBlock)
    const logs = await rpc.getLogs(from, to, [registry], [config.event])
    const timestamps = await rpc.getBlockTimestamps([
      ...new Set([...logs.map((log) => log.blockNumber), to]),
    ])

    for (const log of logs) {
      const timestamp = timestamps.get(log.blockNumber)
      const topic = log.topics[1]
      if (timestamp === undefined || topic === undefined) {
        throw new Error(`Malformed log in block ${log.blockNumber}`)
      }
      if (timestamp < config.sinceTimestamp) continue
      entry.registrations.push({
        blockNumber: log.blockNumber,
        timestamp,
        registrant: EthereumAddress(`0x${topic.slice(-40)}`).toString(),
      })
    }
    entry.toBlock = to
    entry.toTimestamp = timestamps.get(to) ?? entry.toTimestamp
    // Saving after every range lets an interrupted run resume where it stopped.
    writeFileSync(OUTPUT_PATH, `${JSON.stringify(data, null, 2)}\n`)
    console.log(
      `${projectId}: blocks ${from}-${to}, ${logs.length} new, ${entry.registrations.length} total`,
    )
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
