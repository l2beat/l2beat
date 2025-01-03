import { readFileSync } from 'fs'
import path from 'path'
import { expect } from 'earl'
import { decodeBlob } from './decodeBlob'

describe('decodes blobs', () => {
  it('v0', () => {
    const blobHexString = readHexString(
      path.join(__dirname, 'testdata/v0blobHexString.json'),
    )
    const blocks = decodeBlob(blobHexString)

    expect(blocks[0]).toEqual({ blockNumber: 1, timestamp: 1735741854 })
    expect(blocks.at(-1)).toEqual({ blockNumber: 322, timestamp: 1735742548 })
  })
})

function readHexString(path: string): string {
  const content = readFileSync(path, 'utf-8')
  return JSON.parse(content).data as string
}
