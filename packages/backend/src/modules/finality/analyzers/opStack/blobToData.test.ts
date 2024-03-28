import { expect } from 'earl'
import { readFileSync } from 'fs'
import path from 'path'

import { blobToData } from './blobToData'
import { byteArrFromHexStr, hexStrFromByteArr } from './utils'

describe(blobToData.name, () => {
  it('should decode the blob', () => {
    const buff = readFileSync(path.join(__dirname, 'stub/blob.json'))
    const stub = JSON.parse(buff.toString()) as {
      blob: string
      decoded: string
    }

    const blob = byteArrFromHexStr(stub.blob)
    const data = blobToData(blob)
    const dataStr = hexStrFromByteArr(data)
    expect(dataStr).toEqual(stub.decoded)
  })
})
