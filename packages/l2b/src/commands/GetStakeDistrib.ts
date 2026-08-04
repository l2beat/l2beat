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
import fs from 'fs'
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
    const configRoot = resolveConfigRoot(process.cwd())
    loadEnv({ path: path.join(configRoot, '.env') })
    const outputPath =
      args.outputPath !== undefined
        ? path.resolve(process.cwd(), args.outputPath)
        : undefined
    const fetcher = new StakeDistributionFetcher(
      args.project,
      args.limit,
      configRoot,
      outputPath,
    )
    await fetcher.fetchAndDisplay()
  },
})

export function resolveConfigRoot(startPath: string): string {
  let current = path.resolve(startPath)

  while (true) {
    if (isConfigRoot(current)) {
      return current
    }

    const nestedConfigRoot = path.join(current, 'packages', 'config')
    if (isConfigRoot(nestedConfigRoot)) {
      return nestedConfigRoot
    }

    const parent = path.dirname(current)
    if (parent === current) {
      throw new Error(
        `Could not find packages/config from ${startPath}. Run this command from inside the l2beat repository.`,
      )
    }
    current = parent
  }
}

function isConfigRoot(directory: string): boolean {
  try {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(directory, 'package.json'), 'utf8'),
    ) as { name?: unknown }
    return packageJson.name === '@l2beat/config'
  } catch {
    return false
  }
}
