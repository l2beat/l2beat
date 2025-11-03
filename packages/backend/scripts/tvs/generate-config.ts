import { type Env, getEnv, Logger, type LogLevel } from '@l2beat/backend-tools'
import {
  type ChainConfig,
  type Project,
  ProjectService,
  type TvsToken,
} from '@l2beat/config'
import { HttpClient, RpcClient } from '@l2beat/shared'
import {
  assert,
  type LegacyToken,
  ProjectId,
  type TokenId,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  boolean,
  command,
  flag,
  option,
  optional,
  positional,
  run,
  string,
} from 'cmd-ts'
import * as fs from 'fs'
import {
  getTokenSyncRange,
  isInTokenSyncRange,
} from '../../src/modules/tvs/tools/getTokenSyncRange'
import { LocalExecutor } from '../../src/modules/tvs/tools/LocalExecutor'
import { LocalStorage } from '../../src/modules/tvs/tools/LocalStorage'
import { getLegacyConfig } from '../../src/modules/tvs/tools/legacyConfig/getLegacyConfig'
import { mapLegacyConfig } from '../../src/modules/tvs/tools/legacyConfig/mapLegacyConfig'
import { setTokenSyncRange } from '../../src/modules/tvs/tools/setTokenSyncRange'
import type { TokenValue } from '../../src/modules/tvs/types'

// we have disabled TVS for some projects using feature flags on HEROKU
// as this script will be phased out soon we decided to hardcode it here
const DISABLED_PROJECTS = ['kroma', 'treasure', 'real']

const args = {
  project: positional({
    type: optional(string),
    displayName: 'projectId',
    description: 'Project for which tvs config will be generated',
  }),
  includeZeroAmounts: flag({
    type: boolean,
    long: 'include-zero-amounts',
    short: 'iza',
    description: 'Include zero amounts in the config',
  }),
  exclude: option({
    type: optional(string),
    long: 'exclude',
    short: 'e',
    description: 'Exclude projects from TVS calculation',
  }),
}

const cmd = command({
  name: 'generate-tvs-config',
  args,
  handler: async (args) => {
    const env = getEnv()
    const logger = initLogger(env)
    const ps = new ProjectService()
    const localStorage = new LocalStorage('./scripts/tvs/local-data.json')
    const localExecutor = new LocalExecutor(ps, env, logger, localStorage)
    const timestamp =
      UnixTime.toStartOf(UnixTime.now(), 'hour') - 2 * UnixTime.HOUR

    let projects:
      | Project<'escrows' | 'tvsInfo', 'chainConfig' | 'isBridge'>[]
      | undefined

    const start = Date.now()

    const tokens = await ps.getTokens()

    if (!args.project) {
      if (args.exclude) {
        logger.info(`Excluding projects: ${args.exclude}`)
      }

      const excludedProjects = args.exclude
        ? args.exclude.split(',').map((p) => ProjectId(p.trim()))
        : []

      projects = (
        await ps.getProjects({
          select: ['escrows', 'tvsInfo'],
          optional: ['chainConfig', 'isBridge'],
        })
      ).filter(
        (project) =>
          !excludedProjects.includes(project.id) &&
          !DISABLED_PROJECTS.includes(project.id),
      )

      if (!projects) {
        logger.error('No TVS projects found')
        process.exit(1)
      }
    } else {
      if (DISABLED_PROJECTS.includes(args.project)) {
        logger.error(`TVS for project '${args.project}' is disabled`)
        process.exit(1)
      }

      const project = await ps.getProject({
        id: ProjectId(args.project),
        select: ['escrows', 'tvsInfo'],
        optional: ['chainConfig', 'isBridge'],
      })

      if (!project) {
        logger.error(`Project '${args.project}' not found`)
        process.exit(1)
      }

      projects = [project]
    }

    const projectsWithChain = (
      await ps.getProjects({ select: ['chainConfig'] })
    ).map((p) => p.chainConfig)

    const chains = new Map(projectsWithChain.map((p) => [p.name, p]))

    logger.info(`Generating new TVS config for projects (${projects.length})`)
    const regeneratedProjects = await Promise.all(
      projects.map(async (project) => {
        return await generateConfigForProject(
          project,
          tokens,
          chains,
          logger,
          localStorage,
        )
      }),
    )

    logger.info('Executing TVS to exclude zero-valued tokens')
    const lastNonZeroValues = await localExecutor.getLastNonZeroValues(
      timestamp,
      args.project ?? undefined,
    )
    const tvs = await localExecutor.getTvs(
      regeneratedProjects.map((p) => ({
        ...p,
        tokens: p.tokens.filter((token) =>
          isInTokenSyncRange(token, timestamp),
        ),
      })),
      timestamp,
      false,
    )

    for (const regenerated of regeneratedProjects) {
      let newConfig: TvsToken[] = []
      const filePath = `./../config/src/tvs/json/${regenerated.projectId.replace('=', '').replace(';', '')}.json`
      const current = readFromFile(filePath)

      if (regenerated.tokens.length > 0) {
        const tvsForProject = tvs.get(regenerated.projectId)
        assert(tvsForProject)

        newConfig = updateConfigWithTvs(
          current,
          regenerated.tokens,
          tvsForProject,
          lastNonZeroValues,
          args.includeZeroAmounts,
          logger,
        ).sort((a, b) => a.id.localeCompare(b.id))
      } else {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      }

      const mergedTokens = mergeWithExistingConfig(newConfig, current, logger)

      if (mergedTokens.length > 0) {
        writeToFile(filePath, regenerated.projectId, mergedTokens)
      }
    }

    const duration = (Date.now() - start) / 1000
    logger.info(`TVS config generation completed in ${duration.toFixed(2)}s`)
    process.exit(0)
  },
})

run(cmd, process.argv.slice(2))

function generateConfigForProject(
  project: Project<'escrows' | 'tvsInfo', 'chainConfig'>,
  tokens: LegacyToken[],
  chains: Map<string, ChainConfig>,
  logger: Logger,
  localStorage: LocalStorage,
) {
  const env = getEnv()

  const rpcApi = project.chainConfig?.apis.find((a) => a.type === 'rpc')
  const rpc = rpcApi
    ? new RpcClient({
        http: new HttpClient(),
        callsPerMinute: env.integer(
          `${project.id.toUpperCase()}_RPC_CALLS_PER_MINUTE`,
          rpcApi.callsPerMinute ?? 120,
        ),
        retryStrategy: 'RELIABLE',
        logger,
        url: env.string(`${project.id.toUpperCase()}_RPC_URL`, rpcApi.url),
        chain: project.id,
      })
    : undefined

  const legacyConfig = getLegacyConfig(project, tokens)
  return mapLegacyConfig(
    project,
    legacyConfig,
    chains,
    logger,
    localStorage,
    rpc,
  )
}

function updateConfigWithTvs(
  current: TvsToken[],
  regenerated: TvsToken[],
  tvs: TokenValue[],
  lastNonZeroValues: TokenValue[],
  includeZeroAmounts: boolean,
  logger: Logger,
) {
  const updatedTokens: TvsToken[] = []

  for (const token of tvs) {
    const tokenConfig = regenerated.find((t) => t.id === token.tokenId)
    assert(tokenConfig, `${token.tokenId} config not found`)

    // if non-zero value return config without any changes
    if (token.value !== 0 || includeZeroAmounts) {
      updatedTokens.push(tokenConfig)
      continue
    }

    const lastNonZeroValue = lastNonZeroValues.find(
      (t) => t.tokenId === token.tokenId,
    )

    // if last non-zero value is not found, skip the token
    if (!lastNonZeroValue) {
      continue
    }

    // if it was never tracked before and has zero value, skip the token
    const currentToken = current.find((t) => t.id === token.tokenId)
    if (!currentToken) {
      continue
    }

    // if the token was tracked before, but has zero value, suggest setting the untilTimestamp to the last non-zero value
    const currentUntilTimestamp = getTokenSyncRange(currentToken).untilTimestamp

    if (
      !currentUntilTimestamp ||
      currentUntilTimestamp > lastNonZeroValue.timestamp
    ) {
      logger.warn(
        `Token ${token.tokenId} has zero value, consider setting untilTimestamp to: ${lastNonZeroValue.timestamp}`,
      )
    }

    //if untilTimestamp is already set propagate it to new config
    if (currentUntilTimestamp) {
      setTokenSyncRange(tokenConfig, {
        untilTimestamp: currentUntilTimestamp,
      })
    }

    updatedTokens.push(tokenConfig)
  }

  return updatedTokens
}

function initLogger(env: Env) {
  return new Logger({
    level: env.string('LOG_LEVEL', 'INFO') as LogLevel,
  })
}

function writeToFile(
  filePath: string,
  project: string,
  nonZeroTokens: TvsToken[],
) {
  const wrapper = {
    $schema: 'schema/tvs-config-schema.json',
    projectId: ProjectId(project),
    tokens: nonZeroTokens,
  }

  fs.writeFileSync(
    filePath,
    JSON.stringify(
      wrapper,
      (_, v) => (typeof v === 'bigint' ? v.toString() : v),
      2,
    ) + '\n',
  )
}

function readFromFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return []
  }

  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  return json.tokens as TvsToken[]
}

function mergeWithExistingConfig(
  nonZeroTokens: TvsToken[],
  currentConfig: TvsToken[],
  logger: Logger,
) {
  const resultMap = new Map<string, TvsToken>()
  nonZeroTokens.forEach((token) => {
    if (resultMap.has(token.id)) {
      logger.warn(`Duplicate detected: ${token.id}`)
      token.id = (token.id + '-duplicate') as TokenId
    }

    resultMap.set(token.id, token)
  })

  const customTokens = currentConfig.filter((t) => t.mode === 'custom')
  customTokens.forEach((token) => {
    resultMap.set(token.id, token)
  })

  return Array.from(resultMap.values()).sort((a, b) => a.id.localeCompare(b.id))
}
