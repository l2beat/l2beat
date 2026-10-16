import { Logger } from '@l2beat/backend-tools'
import { ChainSpecificAddress, Hash256, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type {
  AddressAnalyzer,
  Analysis,
  AnalyzedContract,
} from '../analysis/AddressAnalyzer'
import { ConfigRegistry } from '../config/ConfigRegistry'
import {
  type StructureConfig,
  StructureContract,
} from '../config/StructureConfig'
import type { AllProviders } from '../provider/AllProviders'
import type { IProvider } from '../provider/IProvider'
import { EMPTY_ANALYZED_CONTRACT } from '../utils/testUtils'
import { SimpleDiscoveryCounter } from './DiscoveryCounter'
import { type BetweenLevels, DiscoveryEngine } from './DiscoveryEngine'

const base = {
  ...EMPTY_ANALYZED_CONTRACT,
  isVerified: true,
  deploymentTimestamp: UnixTime(1234),
  deploymentBlockNumber: 9876,
  selfMeta: undefined,
  targetsMeta: undefined,
  combinedMeta: undefined,
}

type Thenable<T> = PromiseLike<T> | T

describe(DiscoveryEngine.name, () => {
  const A = ChainSpecificAddress.random()
  const B = ChainSpecificAddress.random()
  const C = ChainSpecificAddress.random()
  const D = ChainSpecificAddress.random()
  const strB = B.toString()
  const strC = C.toString()
  const strD = D.toString()
  const provider = mockObject<AllProviders>({
    get: mockFn().resolvesTo(
      mockObject<Thenable<IProvider>>({
        then: undefined,
      }),
    ),
  })

  it('can perform a discovery', async () => {
    const config = generateFakeConfig([A], {
      [B.toString()]: StructureContract.parse({ ignoreDiscovery: true }),
    })

    const addressAnalyzer = mockObject<AddressAnalyzer>({
      analyze: mockFn(),
    })
    addressAnalyzer.analyze
      .resolvesToOnce({
        ...base,
        address: A,
        type: 'Contract',
        name: 'A',
        relatives: { [strB]: new Set(), [strC]: new Set() },
      })
      .resolvesToOnce({
        ...base,
        address: C,
        type: 'Contract',
        name: 'C',
        relatives: { [strB]: new Set(), [strD]: new Set() },
      })
      .resolvesToOnce({
        ...base,
        address: D,
        type: 'Contract',
        name: 'D',
        relatives: {},
      })

    const engine = new DiscoveryEngine(addressAnalyzer, Logger.SILENT)
    const { analyses } = await engine.discover(provider, config.structure, 1234)

    expect(analyses).toEqual([
      {
        ...base,
        type: 'Contract',
        name: 'A',
        address: A,
        relatives: { [strB]: new Set(), [strC]: new Set() },
      },
      {
        ...base,
        type: 'Contract',
        name: 'C',
        address: C,
        relatives: { [strB]: new Set(), [strD]: new Set() },
      },
      { ...base, type: 'Contract', name: 'D', address: D },
    ])
  })

  describe('with a hook between levels', () => {
    it('follows the relatives of the analysis a template written between levels makes, not of the one made without it', async () => {
      const chain = new FakeChain({
        A: { shape: 'SA', relatives: (t) => (t ? { C: [] } : { B: [] }) },
        B: { relatives: () => ({}) },
        C: { relatives: () => ({}) },
      })
      const hook = chain.writeOnFirstSight({ A: 'SA' })

      const analyses = await chain.discover(['A'], hook)

      expect(chain.summary(analyses)).toEqual(['A:SA@1', 'C'])
      expect(chain.analyzed).toEqual(['A', 'A', 'C'])
    })

    it('follows the template suggestions of the analysis made again, not of the first one', async () => {
      const chain = new FakeChain(
        {
          A: {
            shape: 'SA',
            relatives: (t) => (t ? { B: ['R'] } : { B: ['X'] }),
          },
          B: { relatives: () => ({}) },
        },
        { R: 1, X: 1 },
      )
      const hook = chain.writeOnFirstSight({ A: 'SA' })

      const analyses = await chain.discover(['A'], hook)

      expect(chain.summary(analyses)).toEqual(['A:SA@1', 'B:R@1'])
    })

    it('analyzes again every contract of a level that a template written for one of them matches', async () => {
      const chain = new FakeChain({
        A: { relatives: () => ({ B1: [], B2: [] }) },
        B1: { shape: 'S', relatives: () => ({}) },
        B2: { shape: 'S', relatives: () => ({}) },
      })
      const hook = chain.writeOnFirstSight({ B1: 'S' })

      const analyses = await chain.discover(['A'], hook)

      expect(chain.summary(analyses)).toEqual(['A', 'B1:S@1', 'B2:S@1'])
      expect(chain.analyzed.filter((name) => name === 'B2')).toEqual([
        'B2',
        'B2',
      ])
      // Once at level 0, and at level 1 until a call changes nothing.
      expect(hook.calls).toEqual(3)
    })

    it('analyzes again a contract of an earlier level whose template changed, and follows what it now points to', async () => {
      const chain = new FakeChain(
        {
          A: {
            shape: 'T',
            relatives: (t) => (t?.version === 2 ? { B: [], D: [] } : { B: [] }),
          },
          B: { relatives: () => ({}) },
          D: { relatives: () => ({}) },
        },
        { T: 1 },
      )
      const hook = chain.writeOnFirstSight({ B: 'T' })

      const analyses = await chain.discover(['A'], hook)

      expect(chain.summary(analyses)).toEqual(['A:T@2', 'B', 'D'])
      expect(chain.analyzed).toEqual(['A', 'B', 'A', 'D'])
    })

    it('follows only what a contract of an earlier level newly points to once analyzed again, so what it skipped is not skipped and counted again', async () => {
      const chain = new FakeChain(
        {
          A: {
            shape: 'T',
            relatives: (t) =>
              t?.version === 2 ? { B: [], X: [], D: [] } : { B: [], X: [] },
          },
          B: { relatives: () => ({}) },
          D: { relatives: () => ({}) },
        },
        { T: 1 },
      )
      const counter = new SimpleDiscoveryCounter()

      const analyses = await chain.discover(
        ['A'],
        chain.writeOnFirstSight({ B: 'T' }),
        { overrides: { [chain.address('X')]: { ignoreDiscovery: true } } },
        counter,
      )

      expect(chain.summary(analyses)).toEqual(['A:T@2', 'B', 'D'])
      // A, B, the skip of X, and D: X counted once.
      expect(counter.getCount()).toEqual(4)
    })

    it('analyzes a contract again with the template its referrer suggested, not the one its code matches', async () => {
      const chain = new FakeChain(
        {
          A: { relatives: () => ({ B: ['R'] }) },
          B: { shape: 'S', relatives: () => ({}) },
        },
        { R: 1, S: 1 },
      )
      const hook = chain.writeOnFirstSight({ B: 'R' })

      const analyses = await chain.discover(['A'], hook)

      expect(chain.summary(analyses)).toEqual(['A', 'B:R@2'])
      expect(chain.analyzed).toEqual(['A', 'B', 'B'])
    })

    it('counts an analysis made again against neither maxAddresses nor maxDepth', async () => {
      const contracts = {
        A: { shape: 'SA', relatives: () => ({ B: [] }) },
        B: { shape: 'SB', relatives: () => ({ C: [] }) },
        C: { shape: 'SC', relatives: () => ({ D: [] }) },
        D: { shape: 'SD', relatives: () => ({}) },
      }
      const writeAll = { A: 'SA', B: 'SB', C: 'SC', D: 'SD' }
      const cases = [
        {
          limits: { maxAddresses: 2 },
          expected: ['A:SA@1', 'B:SB@1', 'C:SC@1'],
        },
        { limits: { maxDepth: 1 }, expected: ['A:SA@1', 'B:SB@1'] },
      ]
      for (const { limits, expected } of cases) {
        const without = new FakeChain(contracts)
        const plain = await without.discover(['A'], undefined, limits)

        const chain = new FakeChain(contracts)
        const hooked = await chain.discover(
          ['A'],
          chain.writeOnFirstSight(writeAll),
          limits,
        )

        expect(without.summary(plain)).toEqual(
          expected.map((entry) => entry.split(':')[0] ?? entry),
        )
        expect(chain.summary(hooked)).toEqual(expected)
      }
    })

    it('drops what an analysis made again no longer points to, after the last level too', async () => {
      const chain = new FakeChain({
        A: { shape: 'SA', relatives: (t) => (t ? {} : { B: [] }) },
        B: { relatives: () => ({}) },
      })
      // Written only once B, which A no longer points to then, was analyzed.
      const hook = chain.writeOnFirstSight({ B: 'SA' })

      const analyses = await chain.discover(['A'], hook)

      expect(chain.summary(analyses)).toEqual(['A:SA@1'])
    })

    it('gives the hook every analysis so far, references included, and checks only analyses for a changed template', async () => {
      const chain = new FakeChain({
        A: { relatives: () => ({ B: [], C: [] }) },
        C: { relatives: () => ({}) },
      })
      const seen: string[][] = []
      const hook: BetweenLevels = async (analyses) => {
        seen.push(analyses.map((analysis) => chain.nameOf(analysis.address)))
      }

      await chain.discover(['A'], hook, {
        entrypoints: {
          [chain.address('B')]: { type: 'Contract', project: 'other' },
        },
      })

      expect(seen).toEqual([['A'], ['A', 'B', 'C']])
    })

    it('stops discovery with the error the hook throws', async () => {
      const chain = new FakeChain({ A: { relatives: () => ({}) } })
      const error = new Error('templatizer failed')

      await expect(
        chain.discover(['A'], async () => {
          throw error
        }),
      ).toBeRejectedWith(error.message)
    })

    it('stops rather than analyze an address forever when its template keeps changing', async () => {
      const chain = new FakeChain({ A: { relatives: () => ({}) } })
      chain.alwaysChanged = true

      await expect(chain.discover(['A'], async () => {})).toBeRejectedWith(
        'was analyzed again and its template still changed',
      )
    })

    it('without a hook, never asks whether a template changed', async () => {
      const chain = new FakeChain({
        A: { shape: 'SA', relatives: () => ({ B: [] }) },
        B: { relatives: () => ({}) },
      })
      chain.alwaysChanged = true

      const analyses = await chain.discover(['A'])

      expect(chain.summary(analyses)).toEqual(['A', 'B'])
      expect(chain.changeChecks).toEqual(0)
    })
  })
})

interface FakeContract {
  /** The template its code matches once that template exists. */
  shape?: string
  /** What it points to, each with the templates it suggests, given the template it was analyzed with. */
  relatives: (template?: {
    id: string
    version: number
  }) => Record<string, string[] | undefined>
}

/**
 * Contracts named by letter, whose relatives depend on the template they
 * are analyzed with. A template exists once it has a version, and a write
 * bumps it. The analyzer chooses templates and answers `templateChanged`
 * as the real one does: a referrer's suggestion first, then the shape.
 */
class FakeChain {
  readonly analyzed: string[] = []
  changeChecks = 0
  alwaysChanged = false
  private readonly addresses: Record<string, ChainSpecificAddress> = {}
  private readonly names: Record<string, string> = {}

  constructor(
    private readonly contracts: Record<string, FakeContract>,
    readonly versions: Record<string, number> = {},
  ) {}

  address(name: string): ChainSpecificAddress {
    const address = this.addresses[name] ?? ChainSpecificAddress.random()
    this.addresses[name] = address
    this.names[address.toString()] = name
    return address
  }

  nameOf(address: ChainSpecificAddress): string {
    return this.names[address.toString()] ?? address.toString()
  }

  /** `name` or `name:template@version`, in the order discovery returned them. */
  summary(analyses: Analysis[]): string[] {
    return analyses.map((analysis) => {
      const name = this.nameOf(analysis.address)
      const template =
        analysis.type === 'Reference' ? undefined : analysis.extendedTemplate
      return template === undefined
        ? name
        : `${name}:${template.template}@${versionOf(template.templateHash)}`
    })
  }

  /** A hook that writes `writes[name]` the first time it sees `name`, as the templatizer asks about a contract once. */
  writeOnFirstSight(
    writes: Record<string, string>,
  ): BetweenLevels & { calls: number } {
    const done = new Set<string>()
    const hook = Object.assign(
      async (analyses: readonly Analysis[]) => {
        hook.calls++
        for (const analysis of analyses) {
          const name = this.nameOf(analysis.address)
          const template = writes[name]
          if (template !== undefined && !done.has(name)) {
            done.add(name)
            this.versions[template] = (this.versions[template] ?? 0) + 1
          }
        }
      },
      { calls: 0 },
    )
    return hook
  }

  async discover(
    initial: string[],
    hook?: BetweenLevels,
    extra: object = {},
    counter = new SimpleDiscoveryCounter(),
  ): Promise<Analysis[]> {
    const config = new ConfigRegistry({
      name: 'test',
      initialAddresses: initial.map((name) => this.address(name)),
      ...extra,
    })
    const engine = new DiscoveryEngine(this.analyzer(), Logger.SILENT)
    const { analyses } = await engine.discover(
      mockObject<AllProviders>({
        get: mockFn().resolvesTo(
          mockObject<Thenable<IProvider>>({ then: undefined }),
        ),
      }),
      config.structure,
      UnixTime(1234),
      counter,
      hook,
    )
    return analyses
  }

  private analyzer(): AddressAnalyzer {
    return mockObject<AddressAnalyzer>({
      analyze: async (_provider, address, _config, suggested) => {
        const name = this.nameOf(address)
        const contract = this.contracts[name]
        if (contract === undefined) {
          throw new Error(`no contract ${name}`)
        }
        this.analyzed.push(name)
        const byReferrer = [...(suggested ?? [])][0]
        const template = byReferrer ?? this.shapeMatch(name)
        const version = template === undefined ? 0 : this.versionOf(template)
        return {
          ...base,
          type: 'Contract',
          name,
          address,
          extendedTemplate:
            template === undefined
              ? undefined
              : {
                  template,
                  reason:
                    byReferrer === undefined ? 'byShapeMatch' : 'byReferrer',
                  templateHash: hashOf(version),
                },
          relatives: Object.fromEntries(
            Object.entries(
              contract.relatives(
                template === undefined ? undefined : { id: template, version },
              ),
            ).map(([relative, templates]) => [
              this.address(relative).toString(),
              new Set(templates ?? []),
            ]),
          ),
        } satisfies AnalyzedContract
      },
      reloadTemplates: () => {},
      templateChanged: (analysis) => {
        if ((analysis as Analysis).type === 'Reference') {
          throw new Error('asked about a reference')
        }
        this.changeChecks++
        if (this.alwaysChanged) {
          return true
        }
        const used = analysis.extendedTemplate
        const now =
          used !== undefined && used.reason !== 'byShapeMatch'
            ? used.template
            : this.shapeMatch(this.nameOf(analysis.address))
        return (
          now !== used?.template ||
          (now !== undefined &&
            hashOf(this.versionOf(now)).toString() !==
              used?.templateHash.toString())
        )
      },
    })
  }

  private shapeMatch(name: string): string | undefined {
    const shape = this.contracts[name]?.shape
    return shape !== undefined && this.versions[shape] !== undefined
      ? shape
      : undefined
  }

  private versionOf(template: string): number {
    return this.versions[template] ?? 0
  }
}

function hashOf(version: number): Hash256 {
  return Hash256(`0x${version.toString(16).padStart(64, '0')}`)
}

function versionOf(hash: Hash256): number {
  return Number.parseInt(hash.toString().slice(2), 16)
}

const generateFakeConfig = (
  initialAddresses: ChainSpecificAddress[],
  overrides: StructureConfig['overrides'],
): ConfigRegistry => {
  return new ConfigRegistry({
    name: 'test',
    initialAddresses,
    overrides: overrides ?? {},
  })
}
