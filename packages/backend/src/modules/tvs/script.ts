import { layer2s } from '@l2beat/config'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { LocalExecutor } from './LocalExecutor'
import { mapConfig } from './mapConfig'

main().catch(() => {
  process.exit(1)
})

async function main() {
  const arbitrum = layer2s.find((l) => l.id === ProjectId('arbitrum'))
  assert(arbitrum)
  const config = mapConfig(arbitrum)

  const localExecutor = new LocalExecutor()
  const tvs = await localExecutor.run(config, [UnixTime.now()])

  console.log(tvs)
  // TODO: breakdown & sum
}
