import { SQLiteCache } from '@l2beat/discovery'
import { expect } from 'earl'
import { mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import path from 'path'
import { createCliLogger } from '../common/CliLogger'
import {
  type DumpSource,
  FETCHED_KINDS,
  fetchDiscoveryCache,
} from './fetchDiscoveryCache'

describe(fetchDiscoveryCache.name, () => {
  let directory: string
  let cache: SQLiteCache

  beforeEach(() => {
    directory = mkdtempSync(path.join(tmpdir(), 'fetch-discovery-cache-'))
    cache = new SQLiteCache(path.join(directory, 'discovery.sqlite'))
  })

  afterEach(async () => {
    await cache.close()
    rmSync(directory, { recursive: true, force: true })
  })

  it('fetches block independent kinds that are missing locally', async () => {
    const source = fakeSource({
      'ethereum.getSource-v3.0x1': 'source 1',
      'ethereum.getSource-v3.0x2': 'source 2',
      'arbitrum.getDeployment.0x3': 'deployment',
      'ethereum.getBlock.100': 'block',
      'ethereum.getBlockNumberAtOrBefore.1700000000': 'block number',
      'ethereum.call.100.0x1.0x2': 'call',
      'ethereum.getLogs.0x1.0.100.0x2': 'logs',
    })
    await cache.set('ethereum.getSource-v3.0x2', 'local source 2')

    const stats = await fetchDiscoveryCache(
      quietCli(),
      onePerKind(source),
      cache,
    )

    expect(stats.keysScanned).toEqual(5)
    expect(stats.keysFetched).toEqual(4)
    expect(await cache.get('ethereum.getSource-v3.0x1')).toEqual('source 1')
    expect(await cache.get('ethereum.getSource-v3.0x2')).toEqual(
      'local source 2',
    )
    expect(await cache.get('arbitrum.getDeployment.0x3')).toEqual('deployment')
    expect(await cache.get('ethereum.getBlock.100')).toEqual('block')
    expect(
      await cache.get('ethereum.getBlockNumberAtOrBefore.1700000000'),
    ).toEqual('block number')
    expect(await cache.get('ethereum.call.100.0x1.0x2')).toEqual(undefined)
    expect(await cache.get('ethereum.getLogs.0x1.0.100.0x2')).toEqual(undefined)
  })

  it('skips keys evicted between scan and dump', async () => {
    const source = fakeSource({ 'ethereum.getSource-v3.0x1': 'source' })
    const evictingSource: DumpSource = {
      scan: source.scan,
      dump: async () => null,
    }

    const stats = await fetchDiscoveryCache(
      quietCli(),
      onePerKind(evictingSource),
      cache,
    )

    expect(stats.keysEvicted).toEqual(1)
    expect(stats.keysFetched).toEqual(0)
    expect(await cache.get('ethereum.getSource-v3.0x1')).toEqual(undefined)
  })

  it('scans each kind on its own source', async () => {
    const scannedPatterns: string[][] = FETCHED_KINDS.map(() => [])
    const sources: DumpSource[] = scannedPatterns.map((patterns) => ({
      scan: async (_, pattern) => {
        patterns.push(pattern)
        return { cursor: 0, keys: [] }
      },
      dump: async () => null,
    }))

    await fetchDiscoveryCache(quietCli(), sources, cache)

    expect(scannedPatterns).toEqual(
      FETCHED_KINDS.map((kind) => [`*.${kind}.*`]),
    )
  })

  it('requires one source per kind', async () => {
    const source = fakeSource({})

    await expect(
      fetchDiscoveryCache(quietCli(), [source], cache),
    ).toBeRejectedWith('Expected one source per fetched kind')
  })
})

function onePerKind(source: DumpSource): DumpSource[] {
  return FETCHED_KINDS.map(() => source)
}

function quietCli() {
  return createCliLogger({ output: process.stdout, quiet: true })
}

function fakeSource(values: Record<string, string>): DumpSource {
  const keys = Object.keys(values)
  return {
    scan: async (cursor, pattern) => {
      const kind = pattern.slice('*.'.length, -'.*'.length)
      const page = keys.slice(cursor, cursor + 2)
      const nextCursor = cursor + 2 < keys.length ? cursor + 2 : 0
      return {
        cursor: nextCursor,
        keys: page.filter((key) => key.split('.')[1] === kind),
      }
    },
    dump: async (key) => {
      const value = values[key]
      return value === undefined ? null : rawStringDump(value)
    },
  }
}

function rawStringDump(value: string): Buffer {
  const bytes = Buffer.from(value)
  return Buffer.concat([
    Buffer.from([0x00, bytes.length]),
    bytes,
    Buffer.alloc(10),
  ])
}
