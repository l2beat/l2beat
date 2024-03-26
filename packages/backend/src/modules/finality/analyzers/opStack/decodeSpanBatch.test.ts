import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { readFileSync } from 'fs'
import path from 'path'

import { decodeSpanBatch } from './decodeSpanBatch'
import { byteArrFromHexStr } from './utils'

describe(decodeSpanBatch.name, () => {
  it('should decode the blob', () => {
    const buff = readFileSync(path.join(__dirname, 'stub/batch_base.json'))
    const stub = JSON.parse(buff.toString()) as {
      batch: string
      decoded: { timestamp: number; txCount: number }[]
    }

    const batch = byteArrFromHexStr(stub.batch)
    const data = decodeSpanBatch(batch, {
      l2BlockTimeSeconds: 2,
      genesisTimestamp: new UnixTime(1686789347),
    })
    expect(data).toEqual(stub.decoded)
  })
})
