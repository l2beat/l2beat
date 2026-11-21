import { HttpClient } from '@l2beat/shared'
import type { json } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { readFileSync } from 'fs'
import path from 'path'
import { gunzipSync, gzipSync } from 'zlib'
import type { WatchContext } from '../WatchTemplate'
import { sortDeep, visitObjects } from '../watchedValue'
import { buildKnown, normalizeRef } from './ossificationDataset'
import { ossificationLeads } from './ossificationLeads'

// Methodology: every request is served from fixtures recorded from the live
// dataset and DeFiHackLabs on 2026-10-28, trimmed by hand to one example per
// branch. An unrecorded URL throws, so the test never reaches the network.
const FIXTURES = path.join(__dirname, 'fixtures', 'ossificationLeads')
const KNOWN_URL = 'https://l2beat.github.io/ossification-dataset/known.json'
const TARBALL_URL =
  'https://codeload.github.com/l2beat/ossification-dataset/tar.gz/refs/heads/main'
const TREE_URL =
  'https://api.github.com/repos/SunWeb3Sec/DeFiHackLabs/git/trees/main?recursive=1'
const DEFI_HACK_LABS = {
  repository: 'SunWeb3Sec/DeFiHackLabs',
  branch: 'main',
  pathPrefix: 'src/test/',
  sinceMonth: '2026-01',
}

describe(ossificationLeads.name, () => {
  it('returns the same sorted value twice, without volatile fields', async () => {
    const context = recordedContext(defaultResponses())
    const params = knownParams()
    const first = await ossificationLeads.fetch(params, context)
    const second = await ossificationLeads.fetch(params, context)
    expect(second).toEqual(first)
    expect(JSON.stringify(first)).toEqual(JSON.stringify(sortDeep(first)))
    visitObjects(first, (object) => {
      for (const key of ['timestamp', 'updatedAt', 'hash', 'sha']) {
        expect(Object.hasOwn(object, key)).toEqual(false)
      }
    })
  })

  it('marks recorded PoCs handled and the rest open and pending', async () => {
    const value = await fetchValue(knownParams(), defaultResponses())
    expect(value.leads).toEqual({
      'dfhl:src/test/2026-03/VTSwapHook_exp.sol': handled('2026-03/VTSwapHook'),
      'dfhl:src/test/2026-04/SaturnProtocol_exp.sol': handled(
        '2026-04/SaturnProtocol',
      ),
      'dfhl:src/test/2026-05/SKP_exp2.sol': {
        pending: true,
        status: 'open',
        title: 'SKP_exp2',
        url: 'https://github.com/SunWeb3Sec/DeFiHackLabs/blob/main/src/test/2026-05/SKP_exp2.sol',
      },
      'dfhl:src/test/2026-09/SpiralHookV2_exp.sol': handled(
        '2026-09/SpiralHookV2',
      ),
      'dfhl:src/test/2026-10/MOKE_exp.sol': open('2026-10/MOKE'),
      // Recorded under its old 2026-07 path: a move is a new open lead.
      'dfhl:src/test/2026-10/PerpetualProtocol_exp.sol': open(
        '2026-10/PerpetualProtocol',
      ),
    })
  })

  it('copies incidents and recorded keys of the dataset', async () => {
    const value = await fetchValue(knownParams(), defaultResponses())
    const known = readFixture('known.json') as {
      incidents: Record<string, string>
      recorded: string[]
    }
    expect(value.incidents).toEqual(known.incidents)
    expect(Object.keys(value.recorded as object)).toEqual(known.recorded)
    expect(Object.values(value.recorded as object).every((x) => x)).toEqual(
      true,
    )
  })

  it('builds the same value from the dataset archive', async () => {
    const fromKnown = await fetchValue(knownParams(), defaultResponses())
    const fromTarball = await fetchValue(
      { dataset: { tarballUrl: TARBALL_URL }, defiHackLabs: DEFI_HACK_LABS },
      defaultResponses(),
    )
    expect(fromTarball).toEqual(fromKnown)
  })

  it('throws on a failed request, a malformed body or a truncated tree', async () => {
    const failures: [Record<string, () => Response>, string][] = [
      [{ [KNOWN_URL]: () => new Response('', { status: 500 }) }, 'HTTP error'],
      [{ [KNOWN_URL]: () => jsonResponse({ incidents: [] }) }, 'Expected'],
      [
        { [TREE_URL]: () => jsonResponse({ truncated: true, tree: [] }) },
        'GitHub tree truncated',
      ],
      [{ [TREE_URL]: () => new Response('not json') }, 'not valid JSON'],
    ]
    for (const [failure, message] of failures) {
      const context = recordedContext({ ...defaultResponses(), ...failure })
      await expect(
        ossificationLeads.fetch(knownParams(), context),
      ).toBeRejectedWith(message)
    }
  })

  it('throws on a truncated or unsupported archive', async () => {
    const archive = datasetTarball()
    const failures: [Uint8Array, string][] = [
      [
        gzipSync(gunzipSync(archive).subarray(0, 2048)),
        'Tar archive truncated',
      ],
      [archive.subarray(0, archive.length - 10), 'unexpected end of file'],
      [
        gzipSync(tar([{ path: 'x', type: 'L', content: 'long' }])),
        'Unsupported tar entry',
      ],
    ]
    for (const [failure, message] of failures) {
      const context = recordedContext({
        ...defaultResponses(),
        [TARBALL_URL]: () => new Response(failure),
      })
      await expect(
        ossificationLeads.fetch(
          {
            dataset: { tarballUrl: TARBALL_URL },
            defiHackLabs: DEFI_HACK_LABS,
          },
          context,
        ),
      ).toBeRejectedWith(message)
    }
  })

  it('rejects params without a YYYY-MM month', () => {
    const params = {
      dataset: { knownUrl: KNOWN_URL },
      defiHackLabs: { ...DEFI_HACK_LABS, sinceMonth: '2026-1' },
    }
    expect(ossificationLeads.params.safeValidate(params).success).toEqual(false)
  })
})

describe(buildKnown.name, () => {
  it('fails without the research files', () => {
    expect(() => buildKnown(new Map())).toThrow('Dataset file missing')
  })
})

describe(normalizeRef.name, () => {
  it('turns a DeFiHackLabs blob URL into a dfhl key', () => {
    expect(
      normalizeRef(
        'https://github.com/SunWeb3Sec/DeFiHackLabs/blob/b3719ce7/src/test/2021-08/Cream_exp.sol',
      ),
    ).toEqual('dfhl:src/test/2021-08/Cream_exp.sol')
  })

  it('keeps other refs unchanged', () => {
    for (const ref of ['https://example.com/post', 'eip155:1:0x12']) {
      expect(normalizeRef(ref)).toEqual(ref)
    }
  })
})

function knownParams() {
  return { dataset: { knownUrl: KNOWN_URL }, defiHackLabs: DEFI_HACK_LABS }
}

function handled(file: string) {
  return {
    status: 'handled',
    title: file.slice(file.indexOf('/') + 1),
    url: `https://github.com/SunWeb3Sec/DeFiHackLabs/blob/main/src/test/${file}_exp.sol`,
  }
}

function open(file: string) {
  return { pending: true, ...handled(file), status: 'open' }
}

async function fetchValue(
  params: Parameters<typeof ossificationLeads.fetch>[0],
  responses: Record<string, () => Response>,
): Promise<Record<string, json>> {
  const value = await ossificationLeads.fetch(
    params,
    recordedContext(responses),
  )
  return value as Record<string, json>
}

function defaultResponses(): Record<string, () => Response> {
  return {
    [KNOWN_URL]: () => jsonResponse(readFixture('known.json')),
    [TREE_URL]: () => jsonResponse(readFixture('tree.json')),
    [TARBALL_URL]: () => new Response(datasetTarball()),
  }
}

function recordedContext(
  responses: Record<string, () => Response>,
): WatchContext {
  class RecordedHttpClient extends HttpClient {
    override async fetchRaw(url: string): Promise<Response> {
      const response = responses[url]
      if (response === undefined) {
        throw new Error('Unrecorded request', { cause: { url } })
      }
      return response()
    }
  }
  return { http: new RecordedHttpClient() }
}

function readFixture(name: string): json {
  return JSON.parse(readFileSync(path.join(FIXTURES, name), 'utf-8'))
}

function jsonResponse(value: json): Response {
  return new Response(JSON.stringify(value), { status: 200 })
}

function datasetTarball(): Uint8Array {
  const files = readFixture('dataset.json') as Record<string, json>
  const root = 'ossification-dataset-main'
  return gzipSync(
    tar([
      { path: 'pax_global_header', type: 'g', content: '52 comment=abc\n' },
      { path: `${root}/`, type: '5', content: '' },
      ...Object.entries(files).map(([file, value]) => ({
        path: `${root}/${file}`,
        type: '0',
        content: JSON.stringify(value),
      })),
    ]),
  )
}

// Writes ustar entries the way `git archive` does: paths over 100 bytes are
// split into the prefix field.
function tar(
  entries: { path: string; type: string; content: string }[],
): Uint8Array {
  const blocks: Uint8Array[] = []
  for (const entry of entries) {
    const content = new TextEncoder().encode(entry.content)
    const header = new Uint8Array(512)
    const split = entry.path.length > 100 ? entry.path.lastIndexOf('/') : -1
    writeField(header, 0, split < 0 ? entry.path : entry.path.slice(split + 1))
    writeField(header, 345, split < 0 ? '' : entry.path.slice(0, split))
    writeField(header, 100, '0000644')
    writeField(header, 124, content.length.toString(8).padStart(11, '0'))
    writeField(header, 156, entry.type)
    writeField(header, 257, 'ustar')
    writeField(header, 148, '        ')
    const sum = header.reduce((total, byte) => total + byte, 0)
    writeField(header, 148, `${sum.toString(8).padStart(6, '0')}\0 `)
    const padded = new Uint8Array(Math.ceil(content.length / 512) * 512)
    padded.set(content)
    blocks.push(header, padded)
  }
  blocks.push(new Uint8Array(1024))
  const archive = new Uint8Array(blocks.reduce((n, b) => n + b.length, 0))
  let offset = 0
  for (const block of blocks) {
    archive.set(block, offset)
    offset += block.length
  }
  return archive
}

function writeField(header: Uint8Array, offset: number, value: string): void {
  header.set(new TextEncoder().encode(value), offset)
}
