import { getDiscoveryPaths } from '@l2beat/discovery'
import { assert } from '@l2beat/shared-pure'
import {
  command,
  extendType,
  number,
  oneOf,
  option,
  optional,
  string,
} from 'cmd-ts'
import { config as loadEnv } from 'dotenv'
import path from 'path'
import {
  STAKING_PROJECT_IDS,
  StakeDistributionFetcher,
  type StakingProjectSelection,
} from '../implementations/getStakeDistrib'

const PositiveInteger = extendType(number, {
  // biome-ignore lint/suspicious/useAwait: cmd-ts types require async-compatible parsing
  async from(value) {
    assert(
      Number.isInteger(value) && value > 0,
      'Value must be a positive integer',
    )

    return value
  },
})

const ProjectSelection = oneOf([
  'all',
  ...STAKING_PROJECT_IDS,
] as const satisfies readonly StakingProjectSelection[])

export const GetStakeDistrib = command({
  name: 'getstakedistrib',
  description:
    'Fetch staking-set snapshots from supported APIs and Dune, then write normalized JSON output. Project-specific output can be used directly as inclusionDelayChart.stakeDistribution config.',
  args: {
    project: option({
      type: ProjectSelection,
      long: 'project',
      short: 'p',
      defaultValue: () => 'all' as const,
      defaultValueIsSerializable: true,
    }),
    limit: option({
      type: PositiveInteger,
      long: 'limit',
      short: 'l',
      defaultValue: () => 10,
      defaultValueIsSerializable: true,
    }),
    outputPath: option({
      type: optional(string),
      long: 'output-path',
      short: 'o',
    }),
  },
  handler: async (args) => {
    loadDotenvFiles()
    const outputPath =
      args.outputPath !== undefined
        ? path.resolve(process.cwd(), args.outputPath)
        : undefined
    const fetcher = new StakeDistributionFetcher(
      args.project,
      args.limit,
      outputPath,
    )
    await fetcher.fetchAndDisplay()
  },
})

// DUNE_API_KEY conventionally lives in packages/backend/.env. Existing
// environment variables always take precedence over .env files.
function loadDotenvFiles(): void {
  try {
    const { root } = getDiscoveryPaths()
    loadEnv({ path: path.join(root, 'packages/backend/.env') })
    loadEnv({ path: path.join(root, '.env') })
  } catch {
    loadEnv()
  }
}
