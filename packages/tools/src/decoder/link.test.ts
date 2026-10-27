import { randomBytes } from 'node:crypto'
import { deflateRawSync, inflateRawSync } from 'node:zlib'
import { expect, mockObject } from 'earl'
import {
  CALLDATA_BYTES_MAX,
  compressCalldata,
  decompressCalldata,
  linkParams,
  readLink,
  readLinkData,
  writeLink,
} from './link'

const HASH =
  '0x72cd8876128636f521ee95d874b59f0ce2c6e7f621bca48e342262f4285e40f0'
const ADDRESS = '0x8eab2d97dfce405a1692a21b3ff3a172d593d319'

describe(linkParams.name, () => {
  it('prefers the query so decoder-new links keep working', () => {
    expect(linkParams('?hash=1', '#data=2').toString()).toEqual('hash=1')
    expect(linkParams('', '#data=2').toString()).toEqual('data=2')
  })
})

describe(readLink.name, () => {
  it('reads nothing from an empty query', () => {
    expect(readLink(new URLSearchParams())).toEqual(undefined)
  })

  it('reads a decoder-new transaction link and ignores its empty data', () => {
    const link = readLink(new URLSearchParams(`hash=${HASH}&data=AwA`))
    expect(link).toEqual({
      type: 'transaction',
      hash: HASH,
      chainId: undefined,
    })
  })

  it('reads a transaction link with a chain', () => {
    const link = readLink(new URLSearchParams(`hash=${HASH}&chainId=10`))
    expect(link).toEqual({ type: 'transaction', hash: HASH, chainId: 10 })
  })

  it('reads a decoder-new calldata link', () => {
    const link = readLink(
      new URLSearchParams(
        `data=u7BsvUHxkfBdDESC-TOnvPbZqsA4499vd_7uAAOxpGfTAA&to=${ADDRESS}&chainId=1`,
      ),
    )
    expect(link).toEqual({
      type: 'calldata',
      data: 'u7BsvUHxkfBdDESC-TOnvPbZqsA4499vd_7uAAOxpGfTAA',
      to: ADDRESS,
      chainId: 1,
    })
  })

  it('defaults calldata links to Ethereum like decoder-new', () => {
    const link = readLink(new URLSearchParams('data=AwA'))
    expect(link).toEqual({
      type: 'calldata',
      data: 'AwA',
      to: undefined,
      chainId: 1,
    })
  })

  it('rejects malformed values', () => {
    for (const query of [
      'hash=0x1234',
      `hash=${HASH}&chainId=abc`,
      `hash=${HASH}&chainId=-1`,
      'data=AwA&to=0x1234',
      `to=${ADDRESS}`,
    ]) {
      expect(readLink(new URLSearchParams(query))).toEqual({ type: 'invalid' })
    }
  })
})

describe(writeLink.name, () => {
  it('writes a transaction link without data', async () => {
    const query = await writeLink({
      hash: HASH,
      data: '',
      address: '',
      chainId: 0,
    })
    expect(query).toEqual(`?hash=${HASH}`)
    expect(readLink(linkParams(query, ''))).toEqual({
      type: 'transaction',
      hash: HASH,
      chainId: undefined,
    })
  })

  it('round trips calldata through the fragment', async () => {
    const fragment = await writeLink({
      hash: '',
      data: '0xa9059cbb0000',
      address: ADDRESS,
      chainId: 42161,
    })
    expect(fragment.startsWith('#data=')).toEqual(true)
    const link = readLink(linkParams('', fragment))
    if (link?.type !== 'calldata') throw new Error('Expected calldata link')
    expect(link.to).toEqual(ADDRESS)
    expect(link.chainId).toEqual(42161)
    expect(await decompressCalldata(link.data)).toEqual('0xa9059cbb0000')
  })
})

describe('long calldata links', () => {
  it('keeps data too long for a request URL in the fragment', async () => {
    const calldata = randomBytes(16 * 1024).toString('hex')
    const fragment = await writeLink({
      hash: '',
      data: `0x${calldata}`,
      address: '',
      chainId: 1,
    })
    const link = readLink(linkParams('', fragment))
    if (link?.type !== 'calldata') throw new Error('Expected calldata link')
    expect(await decompressCalldata(readLinkData(link.data))).toEqual(
      `0x${calldata}`,
    )
  })

  it('reads decoder-new data kept in local storage', () => {
    globalThis.localStorage = mockObject<Storage>({
      getItem: (key) => (key === 'data' ? 'AwA' : null),
    })
    try {
      expect(readLinkData('0xLOCALSTORAGE')).toEqual('AwA')
    } finally {
      Reflect.deleteProperty(globalThis, 'localStorage')
    }
  })
})

describe(decompressCalldata.name, () => {
  it('matches the zlib inflate the tools-api used', async () => {
    const encoded = 'u7BsvUHxkfBdDESC-TOnvPbZqsA4499vd_7uAAOxpGfTAA'
    const expected: `0x${string}` = `0x${inflateRawSync(Buffer.from(encoded, 'base64url')).toString('hex')}`
    expect(await decompressCalldata(encoded)).toEqual(expected)
  })

  it('reads data compressed by zlib', async () => {
    const calldata = Buffer.from('deadbeef'.repeat(100), 'hex')
    const encoded = deflateRawSync(calldata).toString('base64url')
    expect(await decompressCalldata(encoded)).toEqual(
      `0x${calldata.toString('hex')}`,
    )
  })

  it('round trips empty calldata', async () => {
    expect(await decompressCalldata(await compressCalldata('0x'))).toEqual('0x')
  })

  it('rejects calldata above the limit', async () => {
    const encoded = deflateRawSync(
      Buffer.alloc(CALLDATA_BYTES_MAX + 1),
    ).toString('base64url')
    await expect(decompressCalldata(encoded)).toBeRejectedWith(
      'Calldata too long',
    )
  })
})
