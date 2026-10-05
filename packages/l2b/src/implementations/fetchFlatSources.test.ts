import { FLAT_SOURCES_ZSTD_WINDOW_LOG } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs'
import { createServer, type Server } from 'http'
import type { AddressInfo } from 'net'
import { tmpdir } from 'os'
import path from 'path'
import { constants, zstdCompressSync } from 'zlib'
import { createCliLogger } from './common/CliLogger'
import { splitLines, syncFlatSources } from './fetchFlatSources'

describe(syncFlatSources.name, () => {
  let server: Server | undefined
  let discoveryPath = ''

  beforeEach(() => {
    discoveryPath = mkdtempSync(path.join(tmpdir(), 'flat-sources-'))
    mkdirSync(path.join(discoveryPath, 'a', '.flat'), { recursive: true })
    writeFileSync(path.join(discoveryPath, 'a', '.flat', 'Old.sol'), 'old')
  })

  afterEach(() => {
    server?.close()
    server = undefined
    rmSync(discoveryPath, { recursive: true, force: true })
  })

  it('replaces flat sources of every project', async () => {
    const url = await serve([
      { projectCount: 2 },
      entry('a', { 'A.sol': 'new a', 'lib/L.sol': 'lib' }),
      entry('b', { 'B.sol': 'new b' }),
    ])

    await syncFlatSources(quietCli(), url, discoveryPath, undefined)

    expect(readTree('a')).toEqual({ 'A.sol': 'new a', 'lib/L.sol': 'lib' })
    expect(readTree('b')).toEqual({ 'B.sol': 'new b' })
    expect(existsSync(path.join(discoveryPath, 'a', '.flat@download'))).toEqual(
      false,
    )
  })

  it('keeps existing flat sources when the response ends early', async () => {
    const url = await serve([
      { projectCount: 2 },
      entry('a', { 'A.sol': 'new a' }),
    ])

    await expect(
      syncFlatSources(quietCli(), url, discoveryPath, undefined),
    ).toBeRejectedWith('Flat sources response ended after 1 of 2 projects')

    expect(readTree('a')).toEqual({ 'Old.sol': 'old' })
    expect(readdirSync(path.join(discoveryPath, 'a'))).toEqual(['.flat'])
  })

  it('keeps existing flat sources when copying to the output fails', async () => {
    const url = await serve([
      { projectCount: 2 },
      entry('a', { 'A.sol': 'new a' }),
      entry('b', { 'B.sol': 'new b' }),
    ])
    const outputDirectory = path.join(discoveryPath, '_output')
    mkdirSync(outputDirectory)
    writeFileSync(path.join(outputDirectory, 'b'), 'not a directory')

    await expect(
      syncFlatSources(quietCli(), url, discoveryPath, outputDirectory),
    ).toBeRejected()

    expect(readTree('a')).toEqual({ 'Old.sol': 'old' })
  })

  async function serve(lines: object[]): Promise<string> {
    const body = zstdCompressSync(
      Buffer.from(lines.map((line) => `${JSON.stringify(line)}\n`).join('')),
      {
        params: { [constants.ZSTD_c_windowLog]: FLAT_SOURCES_ZSTD_WINDOW_LOG },
      },
    )
    const listening = createServer((_, response) => response.end(body))
    server = listening
    await new Promise<void>((resolve) => listening.listen(0, resolve))
    const { port } = listening.address() as AddressInfo
    return `http://localhost:${port}`
  }

  function readTree(projectId: string): Record<string, string> {
    const flatPath = path.join(discoveryPath, projectId, '.flat')
    const result: Record<string, string> = {}
    const files = readdirSync(flatPath, {
      recursive: true,
      withFileTypes: true,
    })
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(file.parentPath, file.name)
        result[path.relative(flatPath, filePath)] = readFileSync(
          filePath,
          'utf8',
        )
      }
    }
    return result
  }
})

function entry(projectId: string, flat: Record<string, string>) {
  return { projectId, timestamp: 1, contentHash: 'hash', flat }
}

function quietCli() {
  return createCliLogger({ output: process.stdout, quiet: true })
}

describe(splitLines.name, () => {
  it('joins lines split across chunks', async () => {
    const result = await collect(['{"a":', '1}\n{"b"', ':2}\n', '{"c":3}\n'])

    expect(result).toEqual(['{"a":1}', '{"b":2}', '{"c":3}'])
  })

  it('decodes a multibyte character split across chunks', async () => {
    const bytes = Buffer.from('{"a":"zażółć"}\n')
    const splitAt = bytes.indexOf(Buffer.from('ż')) + 1

    const result = await collect([
      bytes.subarray(0, splitAt),
      bytes.subarray(splitAt),
    ])

    expect(result).toEqual(['{"a":"zażółć"}'])
  })

  it('does not split on unicode line separators', async () => {
    const line = JSON.stringify({ a: 'x y z\rw' })

    const result = await collect([`${line}\n`])

    expect(result).toEqual([line])
  })

  it('splits many lines in one chunk', async () => {
    const result = await collect(['1\n2\n3\n'])

    expect(result).toEqual(['1', '2', '3'])
  })

  it('throws when the stream ends mid line', async () => {
    await expect(collect(['{"a":1}\n{"b"'])).toBeRejectedWith(
      'Flat sources response ends mid line',
    )
  })
})

async function collect(chunks: (string | Buffer)[]): Promise<string[]> {
  async function* source() {
    for (const chunk of chunks) {
      yield Buffer.from(chunk)
    }
  }
  const result: string[] = []
  for await (const line of splitLines(source())) {
    result.push(line)
  }
  return result
}
