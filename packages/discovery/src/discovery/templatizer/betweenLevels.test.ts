import { Logger } from '@l2beat/backend-tools'
import { Bytes, ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { type providers, utils } from 'ethers'
import { mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { AddressAnalyzer, type Analysis } from '../analysis/AddressAnalyzer'
import { TemplateService } from '../analysis/TemplateService'
import { ConfigRegistry } from '../config/ConfigRegistry'
import { makeEntryStructureConfig } from '../config/structureUtils'
import { type BetweenLevels, DiscoveryEngine } from '../engine/DiscoveryEngine'
import { HandlerExecutor } from '../handlers/HandlerExecutor'
import type { AllProviders } from '../provider/AllProviders'
import type { IProvider } from '../provider/IProvider'
import type { ProxyDetector } from '../proxies/ProxyDetector'
import type { SourceCodeService } from '../source/SourceCodeService'
import { FakeModelClient } from './model/FakeModelClient'
import { Templatizer } from './Templatizer'
import { bundle, contractSources } from './test/sources'

/**
 * The templatizer as `l2b discover --ai` runs it: the engine's hook between
 * levels, writing template files the analyzer then reads again. Only
 * the chain (provider, proxy detection, explorer sources) and the model are
 * fakes; the engine, the analyzer, the handlers, the template files and the
 * templatizer are the real ones.
 */
describe('Templatizer between the levels of discovery', () => {
  const REGISTRY = ChainSpecificAddress(
    'eth:0x1111111111111111111111111111111111111111',
  )
  const TWIN = ChainSpecificAddress(
    'eth:0x5555555555555555555555555555555555555555',
  )
  const OWNER = ChainSpecificAddress(
    'eth:0x2222222222222222222222222222222222222222',
  )
  const VALIDATOR = ChainSpecificAddress(
    'eth:0x3333333333333333333333333333333333333333',
  )
  const ABI = [
    'function owner() view returns (address)',
    'function isValidator(address who) view returns (bool)',
    'function setValidator(address who, bool active)',
    'event ValidatorUpdated(address indexed validator, bool active)',
  ]
  const BODY = `mapping(address => bool) public isValidator;
  function setValidator(address who, bool active) external onlyOwner {
    isValidator[who] = active;
    emit ValidatorUpdated(who, active);
  }`
  // Only a template can read the validators: no getter lists them.
  const DRAFT = JSON.stringify({
    fields: {
      validators: {
        reason:
          'isValidator is written only by setValidator (onlyOwner), which emits ValidatorUpdated',
        handler: {
          type: 'event',
          select: 'validator',
          add: { event: 'ValidatorUpdated', where: ['=', '#active', true] },
          remove: {
            event: 'ValidatorUpdated',
            where: ['!=', '#active', true],
          },
        },
      },
    },
  })
  const CONTRACTS = [REGISTRY, TWIN]

  let root: string
  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'templatizer-levels-'))
  })
  afterEach(() => rmSync(root, { recursive: true, force: true }))

  it('templatizes a level, analyzes it again with the template and follows what the template reads', async () => {
    const model = new FakeModelClient([DRAFT])
    const templateService = new TemplateService(root)
    const hook = templatizeBetweenLevels(templateService, model)

    const analyses = await discover(templateService, hook)

    // One model turn: the twin of the same code matched the template the
    // registry's turn wrote, and was analyzed again with it.
    expect(model.calls.length).toEqual(1)
    expect(summary(analyses)).toEqual([
      `${REGISTRY} proj/Registry validators=${VALIDATOR}`,
      `${OWNER} EOA`,
      `${VALIDATOR} EOA`,
      `${TWIN} proj/Registry validators=${VALIDATOR}`,
    ])
  })

  it('leaves the same result as discovery run afterwards with the templates it wrote, though it wrote through another TemplateService', async () => {
    const templatized = await discover(
      new TemplateService(root),
      templatizeBetweenLevels(
        new TemplateService(root),
        new FakeModelClient([DRAFT]),
      ),
    )
    const rediscovered = await discover(new TemplateService(root))

    expect(sorted(rediscovered).map(comparable)).toEqual(
      sorted(templatized).map(comparable),
    )
  })

  it('without the hook follows only what discovery reads by itself', async () => {
    const analyses = await discover(new TemplateService(root))

    expect(summary(analyses)).toEqual([
      `${REGISTRY} -`,
      `${OWNER} EOA`,
      `${TWIN} -`,
    ])
  })

  function templatizeBetweenLevels(
    templateService: TemplateService,
    model: FakeModelClient,
  ): BetweenLevels {
    const templatizer = new Templatizer(
      templateService,
      new HandlerExecutor(),
      {
        project: 'proj',
        model,
        modelLabel: 'fake default',
        artifactsRoot: join(root, 'trail'),
        previousTemplates: {},
        now: () => new Date('2026-09-29T12:00:00Z'),
      },
      Logger.SILENT,
    )
    return async (analyses) => {
      await templatizer.templatizeDiscovered(analyses, async (address) => ({
        provider: provider(),
        address,
        config: makeEntryStructureConfig({ types: {} } as never, address),
        sources: sourcesOf(address),
        proxyValues: {},
        implementationNames: {},
      }))
    }
  }

  /** `templateService` is the analyzer's; the hook may write through another. */
  async function discover(
    templateService: TemplateService,
    hook?: BetweenLevels,
  ): Promise<Analysis[]> {
    const analyzer = new AddressAnalyzer(
      mockObject<ProxyDetector>({
        detectProxy: async (_provider, address) => ({
          type: 'immutable',
          values: {},
          deployment: undefined,
          addresses: [address],
        }),
      }),
      mockObject<SourceCodeService>({
        getSources: async (_provider, addresses) =>
          sourcesOf(addresses[0] ?? REGISTRY),
      }),
      new HandlerExecutor(),
      templateService,
    )
    const config = new ConfigRegistry({
      name: 'proj',
      initialAddresses: CONTRACTS,
    })
    const { analyses } = await new DiscoveryEngine(
      analyzer,
      Logger.SILENT,
    ).discover(
      mockObject<AllProviders>({ get: mockFn().resolvesTo(provider()) }),
      config.structure,
      UnixTime(1_750_000_000),
      undefined,
      hook,
    )
    return analyses
  }

  function sourcesOf(address: ChainSpecificAddress) {
    return CONTRACTS.includes(address)
      ? contractSources([bundle('Registry', address, BODY)], ABI)
      : { ...contractSources([], []), isVerified: false }
  }

  function provider(): IProvider {
    const coder = new utils.Interface(ABI)
    const logs = [log(coder, 'ValidatorUpdated', [VALIDATOR.slice(4), true])]
    // `then: undefined` so that awaiting the provider does not touch the mock.
    return mockObject<IProvider & { then: undefined }>({
      then: undefined,
      chain: 'ethereum',
      blockNumber: 100,
      timestamp: UnixTime(1_750_000_000),
      getBytecode: async (address) =>
        CONTRACTS.includes(address) ? Bytes.fromHex('0x6000') : Bytes.EMPTY,
      getLogs: async (_address, topics) =>
        logs.filter((entry) => entry.topics[0] === topics[0]),
      callMethod: async <T>(
        _address: ChainSpecificAddress,
        fragment: string | utils.FunctionFragment,
      ) => {
        const name = typeof fragment === 'string' ? fragment : fragment.name
        return (name === 'owner' ? OWNER.slice(4) : undefined) as T | undefined
      },
    })
  }

  function log(
    coder: utils.Interface,
    event: string,
    args: unknown[],
  ): providers.Log {
    return {
      ...coder.encodeEventLog(coder.getEvent(event), args),
      blockNumber: 10,
      logIndex: 0,
      address: REGISTRY.slice(4),
      blockHash: '0x',
      transactionHash: '0x',
      transactionIndex: 0,
      removed: false,
    }
  }
})

/** `address template validators=…`, or `address EOA`, sorted by address. */
function summary(analyses: Analysis[]): string[] {
  return [...analyses]
    .sort((a, b) => a.address.localeCompare(b.address))
    .map((analysis) => {
      if (analysis.type !== 'Contract') {
        return `${analysis.address} ${analysis.type}`
      }
      const template = analysis.extendedTemplate?.template ?? '-'
      const validators = analysis.values.validators
      return validators === undefined
        ? `${analysis.address} ${template}`
        : `${analysis.address} ${template} validators=${validators}`
    })
}

function comparable(analysis: Analysis) {
  return analysis.type === 'Reference'
    ? analysis
    : {
        address: analysis.address,
        type: analysis.type,
        template: analysis.extendedTemplate,
        values: analysis.values,
        errors: analysis.errors,
        relatives: Object.keys(analysis.relatives),
      }
}

function sorted(analyses: Analysis[]): Analysis[] {
  return [...analyses].sort((a, b) => a.address.localeCompare(b.address))
}
