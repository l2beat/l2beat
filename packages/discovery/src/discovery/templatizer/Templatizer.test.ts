import { Logger } from '@l2beat/backend-tools'
import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { type providers, utils } from 'ethers'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { TemplateService } from '../analysis/TemplateService'
import { makeEntryStructureConfig } from '../config/structureUtils'
import { HandlerExecutor } from '../handlers/HandlerExecutor'
import type { IProvider } from '../provider/IProvider'
import type { PerContractSource } from '../source/SourceCodeService'
import type { Draft } from './draft/Draft'
import { FakeModelClient } from './model/FakeModelClient'
import { TemplatizationFailedError } from './TemplatizationFailedError'
import {
  type TemplatizeRequest,
  Templatizer,
  type TemplatizerSettings,
} from './Templatizer'
import { bundle, contractSources } from './test/sources'
import { addShape } from './write/writeTemplate'

describe(Templatizer.name, () => {
  const ADDRESS = 'eth:0x1111111111111111111111111111111111111111'
  const TWIN = 'eth:0x5555555555555555555555555555555555555555'
  const OWNER = '0x2222222222222222222222222222222222222222'
  const VALIDATOR = '0x3333333333333333333333333333333333333333'
  const ABI = [
    'function owner() view returns (address)',
    'function isValidator(address who) view returns (bool)',
    'function setValidator(address who, bool active)',
    'event ValidatorUpdated(address indexed validator, bool active)',
    'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)',
  ]
  const BODY = `mapping(address => bool) public isValidator;
  function setValidator(address who, bool active) external onlyOwner {
    isValidator[who] = active;
    emit ValidatorUpdated(who, active);
  }`
  const DRAFT: Draft = {
    fields: {
      validators: {
        handler: {
          type: 'event',
          select: 'validator',
          add: { event: 'ValidatorUpdated', where: ['=', '#active', true] },
          remove: {
            event: 'ValidatorUpdated',
            where: ['!=', '#active', true],
          },
        },
        covers: ['isValidator(address)', 'ValidatorUpdated'],
        reason:
          'isValidator is written only by setValidator (onlyOwner), which emits ValidatorUpdated',
      },
    },
    skips: [{ item: 'OwnershipTransferred', reason: 'covered' }],
  }

  let root: string
  let templateService: TemplateService

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'templatizer-'))
    templateService = new TemplateService(root)
  })
  afterEach(() => rmSync(root, { recursive: true, force: true }))

  function templatizer(
    model: FakeModelClient,
    previousTemplates: Record<string, string> = {},
    settings: Partial<TemplatizerSettings> = {},
  ) {
    return new Templatizer(
      templateService,
      new HandlerExecutor(),
      {
        project: 'proj',
        model,
        modelLabel: 'fake default',
        artifactsRoot: join(root, 'trail'),
        previousTemplates,
        now: () => new Date('2026-09-29T12:00:00Z'),
        ...settings,
      },
      Logger.SILENT,
    )
  }

  function request(
    bundles: PerContractSource[],
    abi: string[] = ABI,
    types: Record<string, unknown> = {},
  ): TemplatizeRequest {
    const address = bundles[0]?.address ?? ChainSpecificAddress(ADDRESS)
    return {
      provider: provider(),
      address,
      config: makeEntryStructureConfig({ types } as never, address),
      sources: contractSources(bundles, abi),
      proxyValues: {},
      implementationNames: {},
      values: { owner: `eth:${OWNER}` },
      errors: {},
    }
  }

  function templateText(templateId: string): string {
    return readFileSync(
      join(root, '_templates', templateId, 'template.jsonc'),
      'utf8',
    )
  }

  it('authors a template, writes its shape and returns an id V1 matches', async () => {
    const model = new FakeModelClient([JSON.stringify(DRAFT)])
    const req = request([bundle('Registry', ADDRESS, BODY)])

    const templateId = await templatizer(model).templateFor(req)

    expect(templateId).toEqual('proj/Registry')
    const text = templateText('proj/Registry')
    expect(text).toInclude(
      '// Authored by fake-model via l2b discover --ai on 2026-09-29, 1 round(s). Review before committing.',
    )
    expect(text).toInclude('// covers: isValidator(address), ValidatorUpdated')
    expect(templateService.loadContractTemplate('proj/Registry')).toEqual(
      expect.subset({
        fields: {
          validators: { handler: DRAFT.fields.validators?.handler as never },
        },
      }),
    )
    expect(
      templateService.findMatchingTemplates(req.sources, req.address),
    ).toEqual(['proj/Registry'])
    const trail = join(root, 'trail', 'proj', ADDRESS)
    expect(existsSync(join(trail, 'summary.json'))).toEqual(true)
  })

  it('authors one template for two addresses with the same code analysed at once', async () => {
    const model = new FakeModelClient([JSON.stringify(DRAFT)])
    const instance = templatizer(model)

    const ids = await Promise.all([
      instance.templateFor(request([bundle('Registry', ADDRESS, BODY)])),
      instance.templateFor(request([bundle('Registry', TWIN, BODY)])),
    ])

    expect(ids).toEqual(['proj/Registry', 'proj/Registry'])
    expect(model.calls.length).toEqual(1)
  })

  it('keeps a field whose events were never emitted and notes it for the reviewer', async () => {
    const model = new FakeModelClient([JSON.stringify(DRAFT)])
    const req = {
      ...request([bundle('Registry', ADDRESS, BODY)]),
      provider: provider([]),
    }

    const templateId = await templatizer(model).templateFor(req)

    expect(templateId).toEqual('proj/Registry')
    expect(model.calls.length).toEqual(1)
    expect(templateText('proj/Registry')).toInclude(
      '    // review: empty at block 100: no logs yet for ValidatorUpdated\n    "validators": {',
    )
  })

  it('writes a template without asking the model when there is nothing to rule on', async () => {
    const model = new FakeModelClient([])
    const abi = ['function owner() view returns (address)']

    const templateId = await templatizer(model).templateFor(
      request([bundle('Plain', ADDRESS)], abi),
    )

    expect(templateId).toEqual('proj/Plain')
    expect(model.calls).toEqual([])
    expect(templateText('proj/Plain')).toInclude('without a model call')
  })

  it('stops discovery with a distinct error when no draft passes, and writes nothing', async () => {
    const invalid = JSON.stringify({ ...DRAFT, skips: [] })
    const model = new FakeModelClient([invalid, invalid, invalid])

    const failure = await failureOf(
      templatizer(model).templateFor(
        request([bundle('Registry', ADDRESS, BODY)]),
      ),
    )

    expect(failure.failure).toEqual('no-acceptable-draft')
    expect(failure.message).toInclude(
      `--ai could not templatize Registry (${ADDRESS}): no acceptable draft after 3 round(s)`,
    )
    expect(failure.message).toInclude(
      'Discovery stopped without writing discovered.json',
    )
    expect(failure.message).toInclude(
      'Or rerun without --ai to leave this contract untemplatized on purpose.',
    )
    expect(failure.message).toInclude(`Trail: ${join(root, 'trail')}`)
    expect(templateService.exists('proj/Registry')).toEqual(false)
    expect(model.calls.length).toEqual(3)
  })

  it('stops at the first turn the model does not answer, and starts no other turn', async () => {
    const model = new FakeModelClient([
      new Error('opencode reported an error: rate_limit_exceeded'),
      JSON.stringify(DRAFT),
    ])
    const instance = templatizer(model)

    const first = await failureOf(
      instance.templateFor(request([bundle('Registry', ADDRESS, BODY)])),
    )
    const next = await failureOf(
      instance.templateFor(
        request([bundle('Other', TWIN, `${BODY}\n  uint256 public other;`)]),
      ),
    )

    expect(first.failure).toEqual('model-unavailable')
    expect(first.message).toInclude(
      'the model did not answer: opencode reported an error: rate_limit_exceeded',
    )
    expect(first.message).toInclude('the quota is not spent')
    expect(next.failure).toEqual('model-unavailable')
    expect(model.calls.length).toEqual(1)
  })

  it('turns a failure of its own into the same distinct error', async () => {
    const unparsableAbi = ['this is not a fragment']

    const failure = await failureOf(
      templatizer(new FakeModelClient([])).templateFor(
        request([bundle('Registry', ADDRESS, BODY)], unparsableAbi),
      ),
    )

    expect(failure.failure).toEqual('internal')
    expect(failure.message).toInclude('This is a bug in the templatizer')
  })

  it('leaves the contract untemplatized for the benchmark, but still stops when the model does not answer', async () => {
    const invalid = JSON.stringify({ ...DRAFT, skips: [] })
    const leaving = (model: FakeModelClient) =>
      templatizer(model, {}, { onFailure: 'leave-untemplatized' })

    const templateId = await leaving(
      new FakeModelClient([invalid, invalid, invalid]),
    ).templateFor(request([bundle('Registry', ADDRESS, BODY)]))
    const unavailable = await failureOf(
      leaving(new FakeModelClient([new Error('connection reset')])).templateFor(
        request([bundle('Registry', ADDRESS, BODY)]),
      ),
    )

    expect(templateId).toEqual(undefined)
    expect(unavailable.failure).toEqual('model-unavailable')
  })

  it('refuses unverified code and EIP-2535 diamonds', () => {
    const instance = templatizer(new FakeModelClient([]))
    const sources = contractSources([bundle('Registry', ADDRESS, BODY)])

    expect(instance.canTemplatize(sources, 'EIP1967 proxy')).toEqual(true)
    expect(instance.canTemplatize(sources, 'EIP2535 diamond proxy')).toEqual(
      false,
    )
    expect(
      instance.canTemplatize({ ...sources, isVerified: false }, undefined),
    ).toEqual(false)
  })

  describe('when the address had a template for older code', () => {
    const OLD_TEMPLATE = `{
  "$schema": "../../../../../discovery/schemas/contract.v2.schema.json",
  "description": "Keeps the validator set.",
  "ignoreMethods": ["threshold"],
  "fields": {
    // written by a researcher
    "validators": {
      "severity": "HIGH",
      "handler": {
        "type": "event",
        "select": "validator",
        "add": { "event": "ValidatorUpdated", "where": ["=", "#active", true] },
        "remove": { "event": "ValidatorUpdated", "where": ["!=", "#active", true] }
      }
    },
    "threshold": {
      "handler": { "type": "call", "method": "threshold", "args": [] }
    }
    // a trailing comment the researcher left here
  }
}
`

    function writeOldTemplate(text = OLD_TEMPLATE) {
      const directory = join(root, '_templates', 'proj', 'Registry')
      mkdirSync(directory, { recursive: true })
      writeFileSync(join(directory, 'template.jsonc'), text)
      const old = bundle(
        'Registry',
        ADDRESS,
        `${BODY}\n  uint public threshold;`,
      )
      addShape(templateService, 'proj/Registry', {
        facts: {
          chain: 'ethereum',
          blockNumber: 50,
          name: 'Registry',
          shapeHash: getHash(old),
          address: old.address,
        } as never,
        sources: contractSources(
          [old],
          [...ABI, 'function threshold() view returns (uint256)'],
        ),
      })
    }

    it('adds the shape, keeps every field and notes the one that fails, without a model call', async () => {
      writeOldTemplate()
      const model = new FakeModelClient([])
      const req = request([bundle('Registry', ADDRESS, BODY)])

      const templateId = await templatizer(model, {
        [ADDRESS]: 'proj/Registry',
      }).templateFor(req)

      expect(templateId).toEqual('proj/Registry')
      expect(model.calls).toEqual([])
      const text = templateText('proj/Registry')
      // The new code has no threshold(): V1's handler factory says so.
      expect(text).toEqual(
        OLD_TEMPLATE.replace(
          '    "threshold": {',
          '    // review: fails at block 100: Cannot find a matching method for threshold\n    "threshold": {',
        ),
      )
      expect(
        Object.keys(
          JSON.parse(
            readFileSync(
              join(root, '_templates', 'proj', 'Registry', 'shapes.json'),
              'utf8',
            ),
          ),
        ).length,
      ).toEqual(2)
      expect(
        templateService.findMatchingTemplates(req.sources, req.address),
      ).toEqual(['proj/Registry'])
    })

    it('adds only the shape when every field still executes', async () => {
      const oldText = OLD_TEMPLATE.replace(
        /,\n {4}"threshold": \{\n.*\n {4}\}/,
        '',
      )
      writeOldTemplate(oldText)
      const model = new FakeModelClient([])
      const req = request([bundle('Registry', ADDRESS, BODY)])

      const templateId = await templatizer(model, {
        [ADDRESS]: 'proj/Registry',
      }).templateFor(req)

      expect(templateId).toEqual('proj/Registry')
      expect(model.calls).toEqual([])
      expect(templateText('proj/Registry')).toEqual(oldText)
      expect(
        templateService.findMatchingTemplates(req.sources, req.address),
      ).toEqual(['proj/Registry'])
    })

    it('does not repeat a note a previous run wrote', async () => {
      writeOldTemplate(
        OLD_TEMPLATE.replace(
          '    "threshold": {',
          '    // review: fails at block 42: Cannot find a matching method for threshold\n    "threshold": {',
        ),
      )
      const before = templateText('proj/Registry')

      await templatizer(new FakeModelClient([]), {
        [ADDRESS]: 'proj/Registry',
      }).templateFor(request([bundle('Registry', ADDRESS, BODY)]))

      expect(templateText('proj/Registry')).toEqual(before)
    })
  })

  describe('with --ai-revisit, for a template that still matches', () => {
    const MATCHING_TEMPLATE = `{
  "$schema": "../../../../../discovery/schemas/contract.v2.schema.json",
  "description": "Keeps the validator set.",
  "ignoreMethods": ["nonce"],
  "fields": {
    // written by a researcher
    "validators": {
      "severity": "HIGH",
      "handler": {
        "type": "event",
        "select": "validator",
        "add": { "event": "ValidatorUpdated", "where": ["=", "#active", true] },
        "remove": { "event": "ValidatorUpdated", "where": ["!=", "#active", true] }
      }
    }
  }
}
`
    const OWNER_HISTORY: Draft = {
      fields: {
        ownershipHistory: {
          handler: {
            type: 'event',
            select: 'newOwner',
            add: { event: 'OwnershipTransferred' },
          },
          covers: ['OwnershipTransferred'],
          reason: 'transferOwnership (onlyOwner) emits OwnershipTransferred',
        },
      },
      skips: [{ item: 'isValidator(address)', reason: 'covered' }],
    }

    function writeMatchingTemplate(
      text = MATCHING_TEMPLATE,
      abi = ABI,
    ): TemplatizeRequest {
      const directory = join(root, '_templates', 'proj', 'Registry')
      mkdirSync(directory, { recursive: true })
      writeFileSync(join(directory, 'template.jsonc'), text)
      const req = request([bundle('Registry', ADDRESS, BODY)], abi)
      const [current] = req.sources.sources
      if (current === undefined) throw new Error('no bundle')
      addShape(templateService, 'proj/Registry', {
        facts: {
          chain: 'ethereum',
          blockNumber: 50,
          name: 'Registry',
          shapeHash: getHash(current),
          address: current.address,
        } as never,
        sources: req.sources,
      })
      return req
    }

    function revisiting(model: FakeModelClient) {
      return templatizer(model, {}, { revisit: true })
    }

    it('asks the model what the template misses and appends its fields after the existing ones', async () => {
      const req = writeMatchingTemplate()
      const model = new FakeModelClient([JSON.stringify(OWNER_HISTORY)])

      await revisiting(model).revisit(req, 'proj/Registry')

      const text = templateText('proj/Registry')
      expect(model.calls.length).toEqual(1)
      expect(model.prompts[0] ?? '').toInclude('### Existing fields (1)')
      expect(model.prompts[0] ?? '').toInclude('// written by a researcher')
      expect(model.prompts[0] ?? '').not.toInclude('- `ValidatorUpdated`')
      expect(
        text.startsWith(MATCHING_TEMPLATE.slice(0, -'\n  }\n}\n'.length)),
      ).toEqual(true)
      expect(text).toInclude(
        [
          '    },',
          '    // Added by fake-model via l2b discover --ai-revisit on 2026-09-29, 1 round(s). Review before committing.',
          '    // transferOwnership (onlyOwner) emits OwnershipTransferred',
          '    // covers: OwnershipTransferred',
          '    // review: empty at block 100: no logs yet for OwnershipTransferred',
          '    "ownershipHistory": {',
        ].join('\n'),
      )
      expect(text).toInclude('"ignoreMethods": ["nonce"]')
      expect(Object.keys(shapes()).length).toEqual(1)
      expect(
        Object.keys(
          templateService.loadContractTemplate('proj/Registry').fields,
        ),
      ).toEqual(['validators', 'ownershipHistory'])
    })

    it('leaves the template untouched when the model finds nothing to add, however it skipped', async () => {
      const req = writeMatchingTemplate()
      const nothing: Draft = {
        fields: {},
        skips: [
          { item: 'isValidator(address)', reason: 'unbounded' },
          { item: 'OwnershipTransferred', reason: 'covered' },
        ],
      }
      const model = new FakeModelClient([JSON.stringify(nothing)])

      await revisiting(model).revisit(req, 'proj/Registry')

      expect(model.calls.length).toEqual(1)
      expect(templateText('proj/Registry')).toEqual(MATCHING_TEMPLATE)
    })

    it('keeps a failing field, notes it, tells the model about it and still asks', async () => {
      const broken = MATCHING_TEMPLATE.replace(
        '  "fields": {',
        '  "fields": {\n    "threshold": {\n      "handler": { "type": "call", "method": "threshold", "args": [] }\n    },',
      )
      const req = writeMatchingTemplate(broken, [
        ...ABI,
        'function threshold() view returns (uint256)',
      ])
      const model = new FakeModelClient([JSON.stringify(OWNER_HISTORY)])

      await revisiting(model).revisit(req, 'proj/Registry')

      const text = templateText('proj/Registry')
      expect(model.prompts[0] ?? '').toInclude(
        '// fails at block 100: Execution reverted\n"threshold": {',
      )
      expect(text).toInclude(
        '  "fields": {\n    // review: fails at block 100: Execution reverted\n    "threshold": {',
      )
      expect(text).toInclude('"ownershipHistory": {')
      expect(
        Object.keys(
          templateService.loadContractTemplate('proj/Registry').fields,
        ),
      ).toEqual(['threshold', 'validators', 'ownershipHistory'])
    })

    it('writes only the notes when the template already decides every item', async () => {
      const deciding = MATCHING_TEMPLATE.replace(
        '"ignoreMethods": ["nonce"]',
        '"ignoreMethods": ["nonce", "isValidator"]',
      ).replace(
        '  "fields": {',
        '  "fields": {\n    "owners": {\n      "handler": { "type": "event", "select": "newOwner", "add": { "event": "OwnershipTransferred" } }\n    },\n    "threshold": {\n      "handler": { "type": "call", "method": "threshold", "args": [] }\n    },',
      )
      const req = writeMatchingTemplate(deciding, [
        ...ABI,
        'function threshold() view returns (uint256)',
      ])
      const model = new FakeModelClient([])

      await revisiting(model).revisit(req, 'proj/Registry')

      expect(model.calls).toEqual([])
      expect(templateText('proj/Registry')).toEqual(
        deciding.replace(
          '    "threshold": {',
          '    // review: fails at block 100: Execution reverted\n    "threshold": {',
        ),
      )
    })

    it('dry-runs with the project types the analyzer has, so a template field using one does not fail', async () => {
      const typed = MATCHING_TEMPLATE.replace(
        '  "fields": {',
        '  "fields": {\n    "ownerTag": {\n      "handler": { "type": "call", "method": "owner", "args": [] },\n      "edit": ["format", "OwnerTag"]\n    },',
      )
      const directory = join(root, '_templates', 'proj', 'Registry')
      mkdirSync(directory, { recursive: true })
      writeFileSync(join(directory, 'template.jsonc'), typed)
      const req = request([bundle('Registry', ADDRESS, BODY)], ABI, {
        OwnerTag: {
          typeCaster: 'Mapping',
          arg: { [`eth:${OWNER}`]: 'the owner' },
        },
      })
      const [current] = req.sources.sources
      if (current === undefined) throw new Error('no bundle')
      addShape(templateService, 'proj/Registry', {
        facts: {
          chain: 'ethereum',
          blockNumber: 50,
          name: 'Registry',
          shapeHash: getHash(current),
          address: current.address,
        } as never,
        sources: req.sources,
      })
      const model = new FakeModelClient([JSON.stringify(OWNER_HISTORY)])

      await revisiting(model).revisit(req, 'proj/Registry')

      expect(templateText('proj/Registry')).not.toInclude('review: fails')
      expect(model.prompts[0] ?? '').not.toInclude('fails at block')
    })

    it('revisits a template once however many contracts share it', async () => {
      const req = writeMatchingTemplate()
      const twin = request([bundle('Registry', TWIN, BODY)])
      const model = new FakeModelClient([JSON.stringify(OWNER_HISTORY)])
      const instance = revisiting(model)

      await Promise.all([
        instance.revisit(req, 'proj/Registry'),
        instance.revisit(twin, 'proj/Registry'),
      ])

      expect(model.calls.length).toEqual(1)
    })

    it('does not revisit a template this run authored', async () => {
      const model = new FakeModelClient([JSON.stringify(DRAFT)])
      const instance = revisiting(model)
      const req = request([bundle('Registry', ADDRESS, BODY)])

      const templateId = await instance.templateFor(req)
      await instance.revisit(req, templateId ?? '')

      expect(model.calls.length).toEqual(1)
    })

    it('stops discovery when the revisit fails, naming the template it would have changed', async () => {
      const req = writeMatchingTemplate()
      const invalid = JSON.stringify({ fields: {}, skips: [] })
      const model = new FakeModelClient([invalid, invalid, invalid])

      const failure = await failureOf(
        revisiting(model).revisit(req, 'proj/Registry'),
      )

      expect(failure.failure).toEqual('no-acceptable-draft')
      expect(failure.message).toInclude(
        `--ai-revisit could not revisit proj/Registry on Registry (${ADDRESS})`,
      )
      expect(failure.message).toInclude(
        'Or rerun without --ai-revisit to keep proj/Registry as it is.',
      )
      expect(templateText('proj/Registry')).toEqual(MATCHING_TEMPLATE)
    })

    function shapes(): Record<string, unknown> {
      return JSON.parse(
        readFileSync(
          join(root, '_templates', 'proj', 'Registry', 'shapes.json'),
          'utf8',
        ),
      )
    }
  })

  async function failureOf(
    pending: Promise<unknown>,
  ): Promise<TemplatizationFailedError> {
    try {
      await pending
    } catch (error) {
      if (error instanceof TemplatizationFailedError) {
        return error
      }
      throw error
    }
    throw new Error('expected a TemplatizationFailedError')
  }

  function provider(
    emitted: [event: string, args: unknown[]][] = [
      ['ValidatorUpdated', [VALIDATOR, true]],
    ],
  ): IProvider {
    const coder = new utils.Interface(ABI)
    const logs = emitted.map(([event, args]) => log(coder, event, args))
    return mockObject<IProvider>({
      chain: 'ethereum',
      blockNumber: 100,
      timestamp: UnixTime(1_750_000_000),
      getLogs: async (_address, topics) =>
        logs.filter((entry) => entry.topics[0] === topics[0]),
      callMethod: async <T>(
        _address: ChainSpecificAddress,
        fragment: string | utils.FunctionFragment,
      ) => {
        const name = typeof fragment === 'string' ? fragment : fragment.name
        return (name === 'owner' ? OWNER : undefined) as T | undefined
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
      address: ADDRESS.slice(4),
      blockHash: '0x',
      transactionHash: '0x',
      transactionIndex: 0,
      removed: false,
    }
  }
})

function getHash(source: PerContractSource) {
  if (source.hash === undefined) throw new Error('unverified')
  return source.hash
}
