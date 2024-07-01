import { RateLimitedProvider } from '@l2beat/discovery'
import { providers } from 'ethers'

const RPC_URL = 'https://rpc.hypr.network'

// this script is here so you can stress test a RPC url.
async function main() {
  const callsPerMinute = 1500
  const provider = new providers.JsonRpcProvider(RPC_URL)
  const rateLimitedProvider = new RateLimitedProvider(provider, callsPerMinute)

  let i = 0
  const promises = []
  while (i < callsPerMinute / 2) {
    promises.push(
      (async () => {
        const block = await rateLimitedProvider.getBlock(i)
        console.log(block.number.toString() + ': ' + block.hash)
      })(),
    )
    i++
  }

  await Promise.all(promises)

  console.log(`no problems`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
