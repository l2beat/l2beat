import { LogFormatterPretty, Logger } from '@l2beat/backend-tools'
import { AvailDaProvider, HttpClient, PolkadotRpcClient } from '@l2beat/shared'

main()
  .catch((e: unknown) => {
    console.error(e)
  })
  .finally(() => process.exit(0))

async function main() {
  const http = new HttpClient()

  const client = new PolkadotRpcClient({
    url: 'https://mainnet.avail-rpc.com/',
    http,
    logger: initLogger(),
    retryStrategy: 'RELIABLE',
    sourceName: 'Avail',
    callsPerMinute: 100,
  })

  const provider = new AvailDaProvider(client)

  const result = await provider.getBlobs(932660, 932665)

  console.log(result)
}

function initLogger() {
  return new Logger({
    logLevel: 'INFO',
    transports: [
      {
        transport: console,
        formatter: new LogFormatterPretty(),
      },
    ],
  })
}
