/**
 * Runs a one-off Railgun broadcaster observation over Waku, using the same
 * RailgunBroadcasterProvider the privacy module runs in production.
 *
 * Usage:
 *   pnpm railgun-observe                  10 minute observation on Ethereum
 *   pnpm railgun-observe --minutes 2      quick connectivity check
 *   pnpm railgun-observe --chain-id 137   another Railgun chain
 */

import { Logger } from '@l2beat/backend-tools'
import { RailgunBroadcasterProvider } from '../src/modules/privacy/railgun/RailgunBroadcasterProvider'

function readNumberFlag(name: string, fallback: number): number {
  const index = process.argv.indexOf(name)
  if (index === -1) return fallback
  const value = Number(process.argv[index + 1])
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} expects a positive number`)
  }
  return value
}

async function main() {
  const chainId = readNumberFlag('--chain-id', 1)
  const minutes = readNumberFlag('--minutes', 10)

  const provider = new RailgunBroadcasterProvider(Logger.INFO)
  const startedAt = new Date()
  const results = await provider.observe({
    chainIds: [chainId],
    durationMs: minutes * 60_000,
  })
  const result = results.get(chainId)
  if (!result) {
    throw new Error(`Missing observation result for chainId ${chainId}`)
  }

  console.log(
    JSON.stringify(
      {
        chainId,
        startedAt: startedAt.toISOString(),
        endedAt: new Date().toISOString(),
        ...result,
      },
      null,
      2,
    ),
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
