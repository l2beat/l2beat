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
        `score ${String(result.score).padStart(3)}`,
        `bounty ${
          result.implicitBugBounty !== null
            ? formatCurrency(result.implicitBugBounty, 'usd').padStart(9)
            : 'n/a'.padStart(9)
        }`,
        `unchanged ${
          result.projectAgeSeconds !== null
            ? formatSeconds(result.projectAgeSeconds).padEnd(18)
            : 'unknown'.padEnd(18)
        }`,
        `lastChange ${
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
