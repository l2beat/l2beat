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
    url: env.string('POLYGONZKEVM_RPC_URL'),
    sourceName: 'polygon',
  })

  const config: MulticallConfigEntry = toMulticallConfigEntry({
    address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
    batchSize: 150,
    sinceBlock: 57746,
    version: '3',
  })

  const multicall = new MulticallClient(rpc, [config])

  const ps = new ProjectService()
  const polygonZkEvm = await ps.getProject({
    id: ProjectId('polygonzkevm'),
    select: ['tvlConfig', 'chainConfig'],
  })
  assert(polygonZkEvm)

  await mapConfig(polygonZkEvm, polygonZkEvm.chainConfig, multicall)
}

main().catch((e: unknown) => {
  console.error(e)
})

// const filePath = path.join(__dirname, 'polygonzkevm-config.json')
// export const polygonZkEvmConfig: TvsConfig = JSON.parse(
//   readFileSync(filePath, 'utf8'),
// )
//
