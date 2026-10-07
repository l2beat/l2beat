import { Logger } from '@l2beat/backend-tools'
import { Bytes, ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
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
import { sha2_256bit } from '../../flatten/utils'
import type { Analysis } from '../analysis/AddressAnalyzer'
import { TemplateService } from '../analysis/TemplateService'
import { StructureContract } from '../config/StructureConfig'
import { makeEntryStructureConfig } from '../config/structureUtils'
import { HandlerExecutor } from '../handlers/HandlerExecutor'
import type { IProvider } from '../provider/IProvider'
import type { PerContractSource } from '../source/SourceCodeService'
import type { PreviousTemplate } from './existingTemplate'
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
  const VALIDATORS_HANDLER = {
    type: 'event',
    select: 'validator',
    add: { event: 'ValidatorUpdated', where: ['=', '#active', true] },
    remove: { event: 'ValidatorUpdated', where: ['!=', '#active', true] },
  }
  const DRAFT = {
    fields: {
      validators: {
        reason:
          'isValidator is written only by setValidator (onlyOwner), which emits ValidatorUpdated',
        handler: VALIDATORS_HANDLER,
      },
    },
  }
  const OWNER_HISTORY = {
    fields: {
      ownershipHistory: {
        reason: 'transferOwnership (onlyOwner) emits OwnershipTransferred',
        handler: {
          type: 'event',
          select: 'newOwner',
          add: { event: 'OwnershipTransferred' },
        },
      },
    },
  }
  /** Fails the checks every round: a field without its reason. */
  const INVALID = JSON.stringify({
    fields: { validators: { handler: VALIDATORS_HANDLER } },
  })

  let root: string
  let templateService: TemplateService

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'templatizer-'))
    templateService = new TemplateService(root)
  })
  afterEach(() => rmSync(root, { recursive: true, force: true }))

  /** A bare template id stands for a `Registry` none of whose fields failed on the old code. */
  function templatizer(
    model: FakeModelClient,
    previousTemplates: Record<string, string | PreviousTemplate> = {},
    settings: Partial<TemplatizerSettings> = {},
    logger: Logger = Logger.SILENT,
  ) {
    return new Templatizer(
      templateService,
      new HandlerExecutor(),
      {
        project: 'proj',
        model,
        modelLabel: 'fake default',
        artifactsRoot: join(root, 'trail'),
        previousTemplates: Object.fromEntries(
          Object.entries(previousTemplates).map(([address, previous]) => [
            address,
            typeof previous === 'string'
              ? { templateId: previous, names: ['Registry'], failingFields: [] }
              : previous,
          ]),
        ),
        now: () => new Date('2026-09-29T12:00:00Z'),
        ...settings,
      },
      logger,
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
    }
  }

  /**
   * One pass over contracts as discovery left them: `matched` names the
   * template a contract matched by its shape, none when it matched nothing.
   */
  function pass(
    instance: Templatizer,
    contracts: { request: TemplatizeRequest; matched?: string }[],
  ): Promise<boolean> {
    const requests = new Map(
      contracts.map(({ request }) => [request.address.toString(), request]),
    )
    const analyses = contracts.map(
      ({ request, matched }) =>
        ({
          type: 'Contract',
          address: request.address,
          extendedTemplate:
            matched === undefined
              ? undefined
              : { template: matched, reason: 'byShapeMatch' },
        }) as Analysis,
    )
    return instance.templatizeDiscovered(analyses, (address) => {
      const found = requests.get(address.toString())
      return found === undefined
        ? Promise.reject(new Error(`no request for ${address}`))
        : Promise.resolve(found)
    })
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
    expect(text).toInclude(`// ${DRAFT.fields.validators.reason}`)
    expect(templateService.loadContractTemplate('proj/Registry')).toEqual(
      expect.subset({
        fields: {
          validators: { handler: VALIDATORS_HANDLER as never },
        },
      }),
    )
    expect(
      templateService.findMatchingTemplates(req.sources, req.address),
    ).toEqual(['proj/Registry'])
    const trail = join(root, 'trail', 'proj', ADDRESS)
    expect(existsSync(join(trail, 'summary.json'))).toEqual(true)
  })

  it('replaces the trail an earlier run left for the address', async () => {
    const trail = join(root, 'trail', 'proj', ADDRESS)
    mkdirSync(trail, { recursive: true })
    writeFileSync(join(trail, 'round-3.response.txt'), 'from an earlier run')
    const model = new FakeModelClient([JSON.stringify(DRAFT)])

    await templatizer(model).templateFor(
      request([bundle('Registry', ADDRESS, BODY)]),
    )

    expect(existsSync(join(trail, 'round-3.response.txt'))).toEqual(false)
    expect(existsSync(join(trail, 'round-1.response.txt'))).toEqual(true)
  })

  it('authors one template in a pass for two contracts with the same code, in address order, and asks about each contract once per run', async () => {
    const model = new FakeModelClient([JSON.stringify(DRAFT)])
    const instance = templatizer(model)
    const contracts = [
      { request: request([bundle('Registry', TWIN, BODY)]) },
      { request: request([bundle('Registry', ADDRESS, BODY)]) },
    ]

    expect(await pass(instance, contracts)).toEqual(true)
    expect(await pass(instance, contracts)).toEqual(false)

    expect(model.calls.length).toEqual(1)
    expect(existsSync(join(root, 'trail', 'proj', ADDRESS))).toEqual(true)
    expect(existsSync(join(root, 'trail', 'proj', TWIN))).toEqual(false)
    for (const { request: req } of contracts) {
      expect(
        templateService.findMatchingTemplates(req.sources, req.address),
      ).toEqual(['proj/Registry'])
    }
  })

  it('passes over a contract discovery applied a template to', async () => {
    const model = new FakeModelClient([])

    const wrote = await pass(templatizer(model), [
      {
        request: request([bundle('Registry', ADDRESS, BODY)]),
        matched: 'proj/Other',
      },
    ])

    expect(wrote).toEqual(false)
    expect(model.calls.length).toEqual(0)
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
    const invalid = INVALID
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

  it('stops the pass at the first turn the model does not answer, and starts no other turn', async () => {
    const model = new FakeModelClient([
      new Error('opencode reported an error: rate_limit_exceeded'),
      JSON.stringify(DRAFT),
    ])

    const failure = await failureOf(
      pass(templatizer(model), [
        { request: request([bundle('Registry', ADDRESS, BODY)]) },
        {
          request: request([
            bundle('Other', TWIN, `${BODY}\n  uint256 public other;`),
          ]),
        },
      ]),
    )

    expect(failure.failure).toEqual('model-unavailable')
    expect(failure.message).toInclude(
      'the model did not answer: opencode reported an error: rate_limit_exceeded',
    )
    expect(failure.message).toInclude('the quota is not spent')
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

  it('refuses unverified code, code known only by a manual source link, and EIP-2535 diamonds', () => {
    const instance = templatizer(new FakeModelClient([]))
    const sources = contractSources([bundle('Registry', ADDRESS, BODY)])
    // `manualSourcePaths` makes the analysis count the contract as verified
    // and hashes the link in place of the code; the explorer holds none.
    const linked = (address: string): PerContractSource => {
      const explorer = bundle('Registry', address, BODY)
      return {
        ...explorer,
        hash: sha2_256bit(`https://explorer.example/address/${address}`),
        source: { ...explorer.source, isVerified: false, files: {} },
      }
    }

    expect(instance.canTemplatize(sources, 'EIP1967 proxy')).toEqual(true)
    expect(instance.canTemplatize(sources, 'EIP2535 diamond proxy')).toEqual(
      false,
    )
    expect(
      instance.canTemplatize({ ...sources, isVerified: false }, undefined),
    ).toEqual(false)
    expect(
      instance.canTemplatize(contractSources([linked(ADDRESS)]), undefined),
    ).toEqual(false)
    expect(
      instance.canTemplatize(
        contractSources([bundle('Proxy', ADDRESS, BODY), linked(TWIN)]),
        'EIP1967 proxy',
      ),
    ).toEqual(false)
    // Only the bundles V1 matches on need explorer source: not the proxy.
    expect(
      instance.canTemplatize(
        contractSources([linked(ADDRESS), bundle('Registry', TWIN, BODY)]),
        'EIP1967 proxy',
      ),
    ).toEqual(true)
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
    // The same template without `threshold`, which the new code no longer has.
    const FITTING_TEMPLATE = OLD_TEMPLATE.replace(
      /,\n {4}"threshold": \{\n.*\n {4}\}/,
      '',
    )
    const THRESHOLD_FAILS =
      'threshold fails on the new code: Cannot find a matching method for threshold'

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

    it('keeps a template that still fits, asks the model what it leaves undecided and adds the shape', async () => {
      writeOldTemplate(FITTING_TEMPLATE)
      const model = new FakeModelClient([JSON.stringify(OWNER_HISTORY)])
      const req = request([bundle('Registry', ADDRESS, BODY)])

      const templateId = await templatizer(model, {
        [ADDRESS]: 'proj/Registry',
      }).templateFor(req)

      expect(templateId).toEqual('proj/Registry')
      expect(model.calls.length).toEqual(1)
      expect(model.prompts[0] ?? '').toInclude(
        '### The template this contract already has (`proj/Registry`)',
      )
      expect(model.prompts[0] ?? '').toInclude('// written by a researcher')
      expect(templateText('proj/Registry')).toInclude(
        '    // Added by fake-model via l2b discover --ai on 2026-09-29, 1 round(s). Review before committing.',
      )
      expect(
        Object.keys(
          templateService.loadContractTemplate('proj/Registry').fields,
        ),
      ).toEqual(['validators', 'ownershipHistory'])
      expect(Object.keys(shapes()).length).toEqual(2)
      expect(
        templateService.findMatchingTemplates(req.sources, req.address),
      ).toEqual(['proj/Registry'])
    })

    it('adds only the shape, without a model call, when the contract has nothing discovery cannot read by itself', async () => {
      const deciding = '{\n  "description": "Keeps the owner."\n}\n'
      writeOldTemplate(deciding)
      const model = new FakeModelClient([])
      const req = request(
        [bundle('Registry', ADDRESS, BODY)],
        ['function owner() view returns (address)'],
      )

      const templateId = await templatizer(model, {
        [ADDRESS]: 'proj/Registry',
      }).templateFor(req)

      expect(templateId).toEqual('proj/Registry')
      expect(model.calls).toEqual([])
      expect(templateText('proj/Registry')).toEqual(deciding)
      expect(
        templateService.findMatchingTemplates(req.sources, req.address),
      ).toEqual(['proj/Registry'])
    })

    it('gives the contract a template of its own when a field of the old one fails on the new code, and leaves the old one as it is', async () => {
      writeOldTemplate()
      const model = new FakeModelClient([JSON.stringify(DRAFT)])
      const req = request([bundle('Registry', ADDRESS, BODY)])

      const templateId = await templatizer(model, {
        [ADDRESS]: 'proj/Registry',
      }).templateFor(req)

      expect(templateId?.startsWith('proj/Registry-')).toEqual(true)
      expect(model.calls.length).toEqual(1)
      expect(model.prompts[0] ?? '').not.toInclude('### Existing fields')
      expect(templateText(templateId ?? '')).toInclude(
        `  // review: ${ADDRESS} had proj/Registry, which no longer fits: ${THRESHOLD_FAILS}. proj/Registry is left as it is.`,
      )
      expect(templateText('proj/Registry')).toEqual(OLD_TEMPLATE)
      expect(Object.keys(shapes()).length).toEqual(1)
      expect(
        templateService.findMatchingTemplates(req.sources, req.address),
      ).toEqual([templateId ?? ''])
    })

    it('gives the contract a template of its own when it is no longer the same contract', async () => {
      writeOldTemplate(FITTING_TEMPLATE)
      const model = new FakeModelClient([JSON.stringify(DRAFT)])
      const req = request([bundle('Registry', ADDRESS, BODY)])

      const templateId = await templatizer(model, {
        [ADDRESS]: {
          templateId: 'proj/Registry',
          names: ['RegistryV1'],
          failingFields: [],
        },
      }).templateFor(req)

      expect(templateId?.startsWith('proj/Registry-')).toEqual(true)
      expect(templateText(templateId ?? '')).toInclude(
        'which no longer fits: the contract was RegistryV1 and is now Registry.',
      )
      expect(templateText('proj/Registry')).toEqual(FITTING_TEMPLATE)
    })

    it('gives the contract a template of its own when the old one has no shapes, because only a referrer applies it', async () => {
      const directory = join(root, '_templates', 'proj', 'Registry')
      mkdirSync(directory, { recursive: true })
      writeFileSync(join(directory, 'template.jsonc'), FITTING_TEMPLATE)
      const model = new FakeModelClient([JSON.stringify(DRAFT)])
      const req = request([bundle('Registry', ADDRESS, BODY)])

      const templateId = await templatizer(model, {
        [ADDRESS]: 'proj/Registry',
      }).templateFor(req)

      expect(templateId?.startsWith('proj/Registry-')).toEqual(true)
      expect(templateText(templateId ?? '')).toInclude(
        'which no longer fits: it has no shapes, so only a referrer applies it.',
      )
      expect(templateText('proj/Registry')).toEqual(FITTING_TEMPLATE)
      expect(templateService.readShapeFile('proj/Registry')).toEqual(undefined)
    })

    it('gives the contract a template of its own when the old one holds its shape but its criteria.json does not list it', async () => {
      const directory = join(root, '_templates', 'proj', 'Registry')
      mkdirSync(directory, { recursive: true })
      writeFileSync(join(directory, 'template.jsonc'), FITTING_TEMPLATE)
      const current = bundle('Registry', ADDRESS, BODY)
      addShape(templateService, 'proj/Registry', {
        facts: {
          chain: 'ethereum',
          blockNumber: 50,
          name: 'Registry',
          shapeHash: getHash(current),
          address: current.address,
        } as never,
        sources: contractSources([current], ABI),
      })
      writeFileSync(
        join(directory, 'criteria.json'),
        JSON.stringify({ validAddresses: [TWIN] }),
      )
      templateService.reload()
      const model = new FakeModelClient([JSON.stringify(DRAFT)])
      const req = request([current])
      expect(
        templateService.findMatchingTemplates(req.sources, req.address),
      ).toEqual([])

      const templateId = await templatizer(model, {
        [ADDRESS]: 'proj/Registry',
      }).templateFor(req)

      expect(templateId?.startsWith('proj/Registry-')).toEqual(true)
      expect(templateText(templateId ?? '')).toInclude(
        `  // review: ${ADDRESS} had proj/Registry, which no longer fits: its criteria.json does not list the contract. proj/Registry is left as it is.`,
      )
      expect(templateText('proj/Registry')).toEqual(FITTING_TEMPLATE)
      expect(Object.keys(shapes()).length).toEqual(1)
      expect(
        templateService.findMatchingTemplates(req.sources, req.address),
      ).toEqual([templateId ?? ''])
    })

    it('gives the contract a template of its own when its criteria.json does not list it and its code is new, and adds nothing to the old one', async () => {
      writeOldTemplate(FITTING_TEMPLATE)
      writeFileSync(
        join(root, '_templates', 'proj', 'Registry', 'criteria.json'),
        JSON.stringify({ validAddresses: [TWIN] }),
      )
      templateService.reload()
      const model = new FakeModelClient([JSON.stringify(DRAFT)])
      const req = request([bundle('Registry', ADDRESS, BODY)])

      const templateId = await templatizer(model, {
        [ADDRESS]: 'proj/Registry',
      }).templateFor(req)

      expect(templateId?.startsWith('proj/Registry-')).toEqual(true)
      expect(model.calls.length).toEqual(1)
      expect(model.prompts[0] ?? '').not.toInclude('### Existing fields')
      expect(templateText(templateId ?? '')).toInclude(
        `  // review: ${ADDRESS} had proj/Registry, which no longer fits: its criteria.json does not list the contract. proj/Registry is left as it is.`,
      )
      expect(templateText('proj/Registry')).toEqual(FITTING_TEMPLATE)
      expect(Object.keys(shapes()).length).toEqual(1)
      expect(
        templateService.findMatchingTemplates(req.sources, req.address),
      ).toEqual([templateId ?? ''])
    })

    it('gives a contract of the same shape its own template when the template another one extended excludes it by criteria', async () => {
      writeOldTemplate(FITTING_TEMPLATE)
      writeFileSync(
        join(root, '_templates', 'proj', 'Registry', 'criteria.json'),
        JSON.stringify({ validAddresses: [ADDRESS] }),
      )
      templateService.reload()
      const model = new FakeModelClient([
        JSON.stringify(OWNER_HISTORY),
        JSON.stringify(DRAFT),
      ])
      const instance = templatizer(model, { [ADDRESS]: 'proj/Registry' })
      const changed = request([bundle('Registry', ADDRESS, BODY)])
      const twin = request([bundle('Registry', TWIN, BODY)])

      await pass(instance, [{ request: changed }, { request: twin }])

      const [own] = templateService.findMatchingTemplates(
        twin.sources,
        twin.address,
      )
      expect(own?.startsWith('proj/Registry-')).toEqual(true)
      expect(model.calls.length).toEqual(2)
      expect(
        templateService.findMatchingTemplates(changed.sources, changed.address),
      ).toEqual(['proj/Registry'])
    })

    it('keeps the template when the failing field already failed on the old code, and leaves that field as it is', async () => {
      writeOldTemplate()
      const model = new FakeModelClient([JSON.stringify(OWNER_HISTORY)])
      const req = request([bundle('Registry', ADDRESS, BODY)])

      const templateId = await templatizer(model, {
        [ADDRESS]: {
          templateId: 'proj/Registry',
          names: ['Registry'],
          failingFields: ['threshold'],
        },
      }).templateFor(req)

      const text = templateText('proj/Registry')
      expect(templateId).toEqual('proj/Registry')
      // What was added sits between the last field and the trailing comment.
      const added =
        /,\n {4}\/\/ Added by[\s\S]*\n {4}}(?=\n {4}\/\/ a trailing)/
      expect(text).toMatchRegex(added)
      expect(text.replace(added, '')).toEqual(OLD_TEMPLATE)
      expect(text).toInclude('"ownershipHistory": {')
      expect(Object.keys(shapes()).length).toEqual(2)
    })

    it('does not revisit a template a changed contract kept and extended in the same pass', async () => {
      writeOldTemplate(FITTING_TEMPLATE)
      const model = new FakeModelClient([JSON.stringify(OWNER_HISTORY)])
      const instance = templatizer(
        model,
        { [ADDRESS]: 'proj/Registry' },
        { revisit: true },
      )
      const changed = request([bundle('Registry', ADDRESS, BODY)])
      const unchanged = request(
        [bundle('Registry', TWIN, `${BODY}\n  uint public threshold;`)],
        [...ABI, 'function threshold() view returns (uint256)'],
      )

      await pass(instance, [
        { request: changed },
        { request: unchanged, matched: 'proj/Registry' },
      ])

      expect(model.calls.length).toEqual(1)
      expect(templateText('proj/Registry')).toInclude('"ownershipHistory": {')
    })

    it('still revisits the old template when the changed contract left it', async () => {
      writeOldTemplate()
      const model = new FakeModelClient([
        JSON.stringify(DRAFT),
        JSON.stringify(OWNER_HISTORY),
      ])
      const instance = templatizer(
        model,
        { [ADDRESS]: 'proj/Registry' },
        { revisit: true },
      )
      const changed = request([bundle('Registry', ADDRESS, BODY)])
      const unchanged = request(
        [bundle('Registry', TWIN, `${BODY}\n  uint public threshold;`)],
        [...ABI, 'function threshold() view returns (uint256)'],
      )

      await pass(instance, [
        { request: changed },
        { request: unchanged, matched: 'proj/Registry' },
      ])

      const [own] = templateService.findMatchingTemplates(
        changed.sources,
        changed.address,
      )
      expect(own?.startsWith('proj/Registry-')).toEqual(true)
      expect(model.calls.length).toEqual(2)
      expect(templateText('proj/Registry')).toInclude('"ownershipHistory": {')
    })

    it('extends a template two changed contracts share one contract at a time, the second seeing what the first added', async () => {
      writeOldTemplate(FITTING_TEMPLATE)
      const model = new FakeModelClient([
        JSON.stringify(OWNER_HISTORY),
        JSON.stringify({ fields: {} }),
      ])
      const instance = templatizer(model, {
        [ADDRESS]: 'proj/Registry',
        [TWIN]: 'proj/Registry',
      })
      const requests = [
        request([bundle('Registry', ADDRESS, `${BODY}\n  uint256 a;`)]),
        request([bundle('Registry', TWIN, `${BODY}\n  uint256 b;`)]),
      ]

      await pass(
        instance,
        requests.map((req) => ({ request: req })),
      )

      expect(model.calls.length).toEqual(2)
      // The second prompt is built after the first contract's additions.
      expect(model.prompts[1] ?? '').toInclude('"ownershipHistory": {')
      for (const req of requests) {
        expect(
          templateService.findMatchingTemplates(req.sources, req.address),
        ).toEqual(['proj/Registry'])
      }
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
      expect(model.prompts[0] ?? '').toInclude(
        ['```jsonc', MATCHING_TEMPLATE.trimEnd(), '```'].join('\n'),
      )
      expect(
        text.startsWith(MATCHING_TEMPLATE.slice(0, -'\n  }\n}\n'.length)),
      ).toEqual(true)
      expect(text).toInclude(
        [
          '    },',
          '    // Added by fake-model via l2b discover --ai-revisit on 2026-09-29, 1 round(s). Review before committing.',
          '    // transferOwnership (onlyOwner) emits OwnershipTransferred',
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

    it('leaves the template untouched when the model finds nothing to add', async () => {
      const req = writeMatchingTemplate()
      const model = new FakeModelClient([JSON.stringify({ fields: {} })])

      await revisiting(model).revisit(req, 'proj/Registry')

      expect(model.calls.length).toEqual(1)
      expect(templateText('proj/Registry')).toEqual(MATCHING_TEMPLATE)
    })

    it('keeps a failing field as it is, tells the model about it and still asks', async () => {
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
        '- `threshold` fails at block 100: Execution reverted',
      )
      expect(text.startsWith(broken.slice(0, -'\n  }\n}\n'.length))).toEqual(
        true,
      )
      expect(text).toInclude('"ownershipHistory": {')
      expect(
        Object.keys(
          templateService.loadContractTemplate('proj/Registry').fields,
        ),
      ).toEqual(['threshold', 'validators', 'ownershipHistory'])
    })

    it('dry-runs with the project types discovery has, so a template field using one does not fail', async () => {
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

    it('reads overrides that depend on template fields using the effective config', async () => {
      const text = MATCHING_TEMPLATE.replace(
        '  "fields": {',
        '  "fields": {\n    "slot": { "handler": { "type": "hardcoded", "value": 0 } },',
      )
      const req = writeMatchingTemplate(text)
      req.config = makeEntryStructureConfig(
        {
          overrides: {
            [req.address]: StructureContract.parse({
              fields: {
                secret: {
                  handler: {
                    type: 'storage',
                    slot: '{{ slot }}',
                    returnType: 'number',
                  },
                },
              },
            }),
          },
        },
        req.address,
      )
      const model = new FakeModelClient([JSON.stringify(OWNER_HISTORY)])

      await revisiting(model).revisit(req, 'proj/Registry')

      expect(model.prompts[0] ?? '').toInclude(
        '`secret` (from the project config) = 1',
      )
      // `slot` is the template's own field, shown under Existing fields.
      expect(model.prompts[0] ?? '').not.toInclude('- `slot` (from')
      expect(model.prompts[0] ?? '').not.toInclude('- `slot` =')
      expect(model.prompts[0] ?? '').toInclude('"slot": {')
      expect(req.config.fields.slot).toEqual(undefined)
      expect(templateText('proj/Registry')).toInclude('"ownershipHistory": {')
    })

    it('revisits a template once however many contracts share it', async () => {
      const req = writeMatchingTemplate()
      const twin = request([bundle('Registry', TWIN, BODY)])
      const model = new FakeModelClient([JSON.stringify(OWNER_HISTORY)])
      const instance = revisiting(model)

      await pass(instance, [
        { request: req, matched: 'proj/Registry' },
        { request: twin, matched: 'proj/Registry' },
      ])

      expect(model.calls.length).toEqual(1)
    })

    it('does not revisit a template this run authored', async () => {
      const model = new FakeModelClient([JSON.stringify(DRAFT)])
      const instance = revisiting(model)

      await pass(instance, [
        { request: request([bundle('Registry', ADDRESS, BODY)]) },
      ])
      await pass(instance, [
        {
          request: request([bundle('Registry', TWIN, BODY)]),
          matched: 'proj/Registry',
        },
      ])

      expect(model.calls.length).toEqual(1)
    })

    it('stops discovery when the revisit fails, naming the template it would have changed', async () => {
      const req = writeMatchingTemplate()
      const invalid = INVALID
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
  })

  function shapes(): Record<string, unknown> {
    return JSON.parse(
      readFileSync(
        join(root, '_templates', 'proj', 'Registry', 'shapes.json'),
        'utf8',
      ),
    )
  }

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
      getStorage: async () => Bytes.fromHex('0x' + '00'.repeat(31) + '01'),
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
