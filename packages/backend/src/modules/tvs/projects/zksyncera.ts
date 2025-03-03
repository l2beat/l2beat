import { Logger, getEnv } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { HttpClient, RpcClient } from '@l2beat/shared'
import { assert, EthereumAddress, ProjectId } from '@l2beat/shared-pure'
import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import { toMulticallConfigEntry } from '../../../peripherals/multicall/MulticallConfig'
import type { MulticallConfigEntry } from '../../../peripherals/multicall/types'
import { mapConfig } from '../mapConfig'

async function main() {
  const env = getEnv()
  const rpc = new RpcClient({
    http: new HttpClient(),
    callsPerMinute: 60,
    retryStrategy: 'RELIABLE',
    logger: Logger.INFO,
    url: env.string('ZKSYNC2_RPC_URL'),
    sourceName: 'zksync',
  })

  const config: MulticallConfigEntry = toMulticallConfigEntry({
    version: '3',
    address: EthereumAddress('0xF9cda624FBC7e059355ce98a31693d299FACd963'),
    batchSize: 150,
    sinceBlock: 3908235,
  })

  const multicall = new MulticallClient(rpc, [config])

  const ps = new ProjectService()
  const zksync = await ps.getProject({
    id: ProjectId('zksync2'),
    select: ['tvlConfig', 'chainConfig'],
  })
  assert(zksync)

  await mapConfig(zksync, zksync.chainConfig, multicall)
}

main().catch((e: unknown) => {
  console.error(e)
})

// const filePath = path.join(__dirname, 'zksyncera-config.json')
// export const zksyncEraConfig: TvsConfig = JSON.parse(
//   readFileSync(filePath, 'utf8'),
// )
//
