import { writeFileSync } from 'fs'
import path from 'path'
import { Logger, getEnv } from '@l2beat/backend-tools'
import { ProjectService, tokenList } from '@l2beat/config'
import { HttpClient, RpcClient } from '@l2beat/shared'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { mapConfig } from '../mapConfig'

async function main() {
  const projectId = 'cronoszkevm'

  const ps = new ProjectService()
  const project = await ps.getProject({
    id: ProjectId(projectId),
    select: ['tvlConfig', 'chainConfig'],
  })
  assert(project, `${projectId}: Project not found`)

  const env = getEnv()

  const rpc = new RpcClient({
    http: new HttpClient(),
    callsPerMinute: env.integer(
      `${projectId.toUpperCase()}_RPC_CALLS_PER_MINUTE`,
      120,
    ),
    retryStrategy: 'RELIABLE',
    logger: Logger.INFO,
    url: env.string(
      `${projectId.toUpperCase()}_RPC_URL`,
      project.chainConfig.apis.find((a) => a.type === 'rpc')?.url,
    ),
    sourceName: projectId,
  })

  const config = await mapConfig(project, project.chainConfig, rpc)

  console.log(
    `Generated ${config.tokens.length} tokens for ${config.projectId} from:`,
  )
  console.log(
    `\tescrows ${project.tvlConfig.escrows.length}: ${project.tvlConfig.escrows.map((e) => e.address)}`,
  )
  console.log(
    `\ttokens ${
      tokenList.filter(
        (t) => t.supply !== 'zero' && t.chainId === project.chainConfig.chainId,
      ).length
    }: ${tokenList
      .filter(
        (t) => t.supply !== 'zero' && t.chainId === project.chainConfig.chainId,
      )
      .map((t) => t.symbol)
      .join(', ')}`,
  )

  const filePath = path.join(__dirname, `${projectId}-config.json`)

  writeFileSync(
    filePath,
    JSON.stringify(
      {
        $schema: 'schema/tvs-config-schema.json',
        ...config,
      },
      null,
      2,
    ) + '\n',
  )
}

main().catch((e: unknown) => {
  console.error(e)
})

// const filePath = path.join(__dirname, 'zksyncera-config.json')
// export const zksyncEraConfig: TvsConfig = JSON.parse(
//   readFileSync(filePath, 'utf8'),
// )
//
