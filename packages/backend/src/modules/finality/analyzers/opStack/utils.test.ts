import { readFileSync } from 'fs'
import path from 'path'
import { expect } from 'earl'

import {
  byteArrFromHexStr,
  hexStrFromByteArr,
} from '../../utils/byteArrFromHexStr'
import { decompressToByteArray } from './utils'

describe(decompressToByteArray.name, () => {
  it('should decompress an example channel', async () => {
    const buff = readFileSync(path.join(__dirname, 'stub/channel.json'))
    const stub = JSON.parse(buff.toString()) as {
      channel: string
      decompressed: string
    }

    const channel = byteArrFromHexStr(stub.channel)
    const decompressed = await decompressToByteArray(channel)
    const decompressedStr = hexStrFromByteArr(decompressed)
    expect(decompressedStr).toEqual(stub.decompressed)
  })
})
