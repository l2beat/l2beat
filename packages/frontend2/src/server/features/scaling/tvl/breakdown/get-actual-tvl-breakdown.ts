import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { bootDepsForTvl } from './deps'

export async function getActualTvlBreakdown() {
  console.time('deps.boot')
  const service = bootDepsForTvl(ProjectId('arbitrum'))
  console.timeEnd('deps.boot')

  console.time('getTvlBreakdown')
  const breakdown = await service.getTvlBreakdown(
    UnixTime.now().toStartOf('hour').add(-1, 'hours'),
  )
  console.timeEnd('getTvlBreakdown')

  // console.dir({ breakdown }, { depth: null })
}
