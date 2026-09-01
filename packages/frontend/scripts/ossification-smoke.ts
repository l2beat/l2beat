import { formatCurrency, formatSeconds } from '@l2beat/shared-pure'
import { getProjectOssification } from '~/server/features/projects/ossification/getProjectOssification'

const IDS = [
  'tornado-cash',
  'privacy-pools',
  'railgun',
  'uniswapv3',
  'taiko',
  'arbitrum',
  'optimism',
  'base',
  'zksync2',
  'scroll',
  'linea',
  'starknet',
  'mantle',
  'lighter',
  'ink',
  'morph',
]

async function main() {
  const requestedIds = process.argv
    .slice(2)
    .filter((arg) => !arg.startsWith('--'))
  const ids = requestedIds.length > 0 ? requestedIds : IDS
  for (const id of ids) {
    const result = await getProjectOssification(id)
    if (!result) {
      console.log(`${id}: no data`)
      continue
    }
    console.log(
      [
        id.padEnd(14),
        `ossification ${String(result.score).padStart(3)}`,
        `exposure ${
          result.exposure !== null
            ? `${formatCurrency(result.exposure, 'usd')}·yr`.padStart(12)
            : 'n/a'.padStart(12)
        }`,
        `lastChange(clock) ${
          result.projectAgeSeconds !== null
            ? formatSeconds(result.projectAgeSeconds).padEnd(18)
            : 'unknown'.padEnd(18)
        }`,
        `lastEvent ${
          result.lastCriticalChangeAgeSeconds !== null
            ? formatSeconds(result.lastCriticalChangeAgeSeconds).padEnd(18)
            : 'never'.padEnd(18)
        }`,
        `rate ${result.criticalChangesPerYear.toFixed(1)}/yr`,
        `events(3y) ${result.clusteredEventCount}`,
        `contracts ${result.contracts.length}`,
      ].join('  '),
    )
    if (process.argv.includes('--perimeter')) {
      console.log(
        '  perimeter:',
        result.contracts.map((contract) => contract.name).join(', '),
      )
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
