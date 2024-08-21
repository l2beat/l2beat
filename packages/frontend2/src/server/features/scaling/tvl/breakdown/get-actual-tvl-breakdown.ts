import { UnixTime } from '@l2beat/shared-pure'
import { bootDepsForTvl } from './deps'

export async function getActualTvlBreakdown() {
  const service = bootDepsForTvl()

  const breakdown = await service.getTvlBreakdown(
    UnixTime.now().toStartOf('hour').add(-1, 'hours'),
  )

  console.dir({ breakdown }, { depth: null })
}
