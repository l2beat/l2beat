import path from 'path'
import { UnixTime } from '@l2beat/shared-pure'
import { writeFile } from 'fs/promises'
import { cwd } from 'process'
import superjson from 'superjson'
import { layer3s } from '.'

superjson.registerCustom<UnixTime, string>(
  {
    isApplicable: (value) => value instanceof UnixTime,
    serialize: (value) => value.toString(),
    deserialize: (value) => new UnixTime(parseInt(value)),
  },
  'UnixTime',
)

function main() {
  writeFile(
    path.join(cwd(), 'src/resolved/layer3s.json'),
    superjson.stringify(layer3s),
  )
}

main()
