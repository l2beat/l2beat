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
import { HandlerExecutor } from '../handlers/HandlerExecutor'
import type { IProvider } from '../provider/IProvider'
import type { PerContractSource } from '../source/SourceCodeService'
import type { Draft } from './draft/Draft'
import { FakeModelClient } from './model/FakeModelClient'
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
  ): TemplatizeRequest {
    const address = bundles[0]?.address ?? ChainSpecificAddress(ADDRESS)
    return {
      provider: provider(),
      address,
      sources: contractSources(bundles, abi),
      proxyValues: {},
      implementationNames: {},
      values: { owner: `eth:${OWNER}` },
      errors: {},
      ignoreMethods: [],
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
      '    // empty at block 100: no logs yet for ValidatorUpdated\n    "validators": {',
    )
  })

  it('writes the advisories the model kept into the template for the reviewer', async () => {
    const activitySkip: Draft = {
      fields: {},
      skips: [
        { item: 'isValidator(address)', reason: 'unbounded' },
        { item: 'ValidatorUpdated', reason: 'user-activity' },
        { item: 'OwnershipTransferred', reason: 'covered' },
      ],
    }
    const model = new FakeModelClient([
      JSON.stringify(activitySkip),
      JSON.stringify(activitySkip),
    ])

    const templateId = await templatizer(model).templateFor(
      request([bundle('Registry', ADDRESS, BODY)]),
    )

    expect(templateId).toEqual('proj/Registry')
    expect(model.calls.length).toEqual(2)
    expect(model.prompts[1] ?? '').toInclude('judgments, not errors')
    expect(templateText('proj/Registry')).toInclude(
      '  // review: ValidatorUpdated is emitted only by privileged code (setValidator (onlyOwner))',
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

  it('writes nothing and returns undefined when no draft passes', async () => {
    const invalid = JSON.stringify({ ...DRAFT, skips: [] })
    const model = new FakeModelClient([invalid, invalid, invalid])

    const templateId = await templatizer(model).templateFor(
      request([bundle('Registry', ADDRESS, BODY)]),
    )

    expect(templateId).toEqual(undefined)
    expect(templateService.exists('proj/Registry')).toEqual(false)
    expect(model.calls.length).toEqual(3)
  })

  it('never throws out of templateFor, whatever fails inside', async () => {
    const model = new FakeModelClient([])
    const unparsableAbi = ['this is not a fragment']

    const templateId = templatizer(model).templateFor(
      request([bundle('Registry', ADDRESS, BODY)], unparsableAbi),
    )

    await expect(templateId).not.toBeRejected()
    expect(await templateId).toEqual(undefined)
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
  }
}
`

    function writeOldTemplate() {
      const directory = join(root, '_templates', 'proj', 'Registry')
      mkdirSync(directory, { recursive: true })
      writeFileSync(join(directory, 'template.jsonc'), OLD_TEMPLATE)
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

    it('keeps the fields that still execute byte for byte and asks only about the rest', async () => {
      writeOldTemplate()
      const draft: Draft = {
        fields: {},
        skips: [
          { item: 'isValidator(address)', reason: 'covered' },
          { item: 'OwnershipTransferred', reason: 'covered' },
        ],
      }
      const model = new FakeModelClient([JSON.stringify(draft)])
      const req = request([bundle('Registry', ADDRESS, BODY)])

      const templateId = await templatizer(model, {
        [ADDRESS]: 'proj/Registry',
      }).templateFor(req)

      expect(templateId).toEqual('proj/Registry')
      const text = templateText('proj/Registry')
      const lockedEntry = OLD_TEMPLATE.slice(
        OLD_TEMPLATE.indexOf('    // written by a researcher'),
        OLD_TEMPLATE.indexOf('    },\n    "threshold"') + '    }'.length,
      )
      expect(text).toInclude(lockedEntry)
      expect(text).toInclude('"description": "Keeps the validator set."')
      expect(text).not.toInclude('"threshold"')
      expect(text).toInclude(
        'removed 1 that broke on the new shape (threshold)',
      )
      expect(model.prompts[0] ?? '').toInclude('Locked fields')
      expect(model.prompts[0] ?? '').not.toInclude('- `ValidatorUpdated`')
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

    it('adds only the shape, without a model call, when every field still executes', async () => {
      writeOldTemplate()
      const oldText = OLD_TEMPLATE.replace(
        /,\n {4}"threshold": \{\n.*\n {4}\}/,
        '',
      )
      writeFileSync(
        join(root, '_templates', 'proj', 'Registry', 'template.jsonc'),
        oldText,
      )
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
  })

  describe('with --ai-revisit, for a template that still matches', () => {
    const MATCHING_TEMPLATE = `{
  "$schema": "../../../../../discovery/schemas/contract.v2.schema.json",
  "description": "Keeps the validator set.",
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

    function writeMatchingTemplate(): TemplatizeRequest {
      const directory = join(root, '_templates', 'proj', 'Registry')
      mkdirSync(directory, { recursive: true })
      writeFileSync(join(directory, 'template.jsonc'), MATCHING_TEMPLATE)
      const req = request([bundle('Registry', ADDRESS, BODY)])
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

    it('asks the model although every field executes, keeps them verbatim and adds no shape', async () => {
      const req = writeMatchingTemplate()
      const model = new FakeModelClient([JSON.stringify(OWNER_HISTORY)])

      await revisiting(model).revisit(req, 'proj/Registry')

      const text = templateText('proj/Registry')
      expect(model.calls.length).toEqual(1)
      expect(model.prompts[0] ?? '').toInclude('Locked fields')
      expect(text).toInclude(
        '// Revisited by fake-model via l2b discover --ai-revisit on 2026-09-29, 1 round(s). Review before committing. Kept 1 field(s) that still execute.',
      )
      expect(text).toInclude(
        MATCHING_TEMPLATE.slice(
          MATCHING_TEMPLATE.indexOf('    // written by a researcher'),
          MATCHING_TEMPLATE.indexOf('\n  }\n}'),
        ),
      )
      expect(text).toInclude('"ownershipHistory": {')
      expect(Object.keys(shapes()).length).toEqual(1)
      expect(
        Object.keys(
          templateService.loadContractTemplate('proj/Registry').fields,
        ),
      ).toEqual(['validators', 'ownershipHistory'])
    })

    it('leaves the template untouched when the model finds nothing to add', async () => {
      const req = writeMatchingTemplate()
      const nothing: Draft = {
        fields: {},
        skips: [
          { item: 'isValidator(address)', reason: 'covered' },
          { item: 'OwnershipTransferred', reason: 'covered' },
        ],
      }
      const model = new FakeModelClient([JSON.stringify(nothing)])

      await revisiting(model).revisit(req, 'proj/Registry')

      expect(model.calls.length).toEqual(1)
      expect(templateText('proj/Registry')).toEqual(MATCHING_TEMPLATE)
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

    function shapes(): Record<string, unknown> {
      return JSON.parse(
        readFileSync(
          join(root, '_templates', 'proj', 'Registry', 'shapes.json'),
          'utf8',
        ),
      )
    }
  })

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
