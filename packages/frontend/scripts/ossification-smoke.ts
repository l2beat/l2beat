import { formatSeconds } from '@l2beat/shared-pure'
import { getProjectOssification } from '~/server/features/projects/ossification/getProjectOssification'

const IDS = [
  'taiko',
  'arbitrum',
  'optimism',
  'scroll',
  'linea',
  'zksync2',
  'base',
  'tornado-cash',
]

function main() {
  for (const id of IDS) {
    const result = getProjectOssification(id)
    if (!result) {
      console.log(`${id}: no data`)
      continue
    }
    console.log(
      [
        id.padEnd(14),
        `score ${String(result.score).padStart(3)}`,
        `lastChange ${
          result.lastCriticalChangeAgeSeconds !== null
            ? formatSeconds(result.lastCriticalChangeAgeSeconds).padEnd(18)
            : 'never'.padEnd(18)
        }`,
        `rate ${result.criticalChangesPerYear.toFixed(1)}/yr`,
        `events(3y) ${result.clusteredEventCount}`,
        `contracts ${result.contracts.length}`,
        `weakest: ${result.weakestLink?.name} (${
          result.weakestLink
            ? formatSeconds(result.weakestLink.ageSeconds)
            : '?'
        })`,
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

main()
