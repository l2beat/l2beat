import { expect } from 'earl'
import { type FixtureName, loadFixture } from '../test/fixtures'
import {
  type ValidationContext,
  validateDraft,
  validateDraftText,
} from './validateDraft'

/**
 * End to end over the suite contracts. Each full draft mirrors the committed
 * V1 template of its contract (event folds, literal-key calls, arrays over
 * index getters), so passing with zero findings shows the checks accept
 * what researchers write.
 */
describe(validateDraft.name, () => {
  const REASON = 'written only by the owner'

  function newTemplate(name: FixtureName): ValidationContext {
    return { facts: loadFixture(name), templateText: '{}', isNew: true }
  }

  function withReasons(
    fields: Record<string, Record<string, unknown>>,
  ): Record<string, Record<string, unknown>> {
    return Object.fromEntries(
      Object.entries(fields).map(([name, entry]) => [
        name,
        { reason: REASON, ...entry },
      ]),
    )
  }

  function paths(value: unknown, ctx: ValidationContext): string[] {
    return validateDraft(value, ctx).findings.map((finding) => finding.path)
  }

  it('accepts the committed templates of four suite contracts, as the template the file will hold', () => {
    const scroll = validateDraft(
      { fields: withReasons(SCROLL_CHAIN) },
      newTemplate('ScrollChain'),
    )
    expect(scroll.findings).toEqual([])
    expect(scroll.checked?.draft.reasons.sequencers).toEqual(REASON)
    expect(scroll.checked?.added).toEqual([
      'sequencers',
      'provers',
      'revertedBatches',
    ])
    expect(Object.keys(scroll.checked?.template.fields ?? {}).sort()).toEqual([
      'provers',
      'revertedBatches',
      'sequencers',
    ])
    expect(
      'reason' in (scroll.checked?.template.fields.sequencers ?? {}),
    ).toEqual(false)

    for (const [name, fields] of [
      ['NitroEnclaveVerifier', NITRO_ENCLAVE_VERIFIER],
      ['DisputeGameFactory', DISPUTE_GAME_FACTORY],
      ['SequencerInbox', SEQUENCER_INBOX],
    ] as const) {
      expect(
        validateDraft({ fields: withReasons(fields) }, newTemplate(name))
          .findings,
      ).toEqual([])
    }
  })

  it('adds to an existing template: new fields with their reasons, and severity on a field it has', () => {
    const ctx: ValidationContext = {
      ...newTemplate('ScrollChain'),
      templateText: `{
  "fields": {
    // the researcher's
    "sequencers": {
      "handler": { "type": "event", "select": "account", "add": { "event": "UpdateSequencer" } }
    }
  }
}`,
      isNew: false,
    }
    const result = validateDraft(
      {
        fields: {
          sequencers: { severity: 'HIGH' },
          provers: { reason: REASON, ...SCROLL_CHAIN.provers },
        },
      },
      ctx,
    )
    expect(result.findings).toEqual([])
    expect(result.checked?.added).toEqual(['provers'])
    expect(result.checked?.template.fields.sequencers?.handler?.type).toEqual(
      'event',
    )

    expect(
      validateDraft(
        {
          ignoreMethods: ['x'],
          fields: { sequencers: { handler: { type: 'hardcoded', value: 1 } } },
        },
        ctx,
      ).findings,
    ).toEqual([
      {
        path: 'ignoreMethods',
        message:
          'this template is shared by every contract of its shapes, so nothing is added at its top level: add new entries under `fields`, and to a field it already has only severity, description, permissions',
      },
      {
        path: 'fields.sequencers.handler',
        message:
          'sequencers already has handler, which keeps its value; leave handler out',
      },
    ])
  })

  it('refuses a field named like a property every object has, also next to existing fields', () => {
    const ctx: ValidationContext = {
      ...newTemplate('ScrollChain'),
      templateText: '{ "fields": {} }',
      isNew: false,
    }
    expect(
      paths(
        {
          fields: { constructor: { handler: { type: 'hardcoded', value: 1 } } },
        },
        ctx,
      ),
    ).toEqual(['fields.constructor'])
  })

  it('reports every mistake of shape at once against V1’s own schema, by the handler’s type', () => {
    const result = validateDraft(
      {
        feilds: {},
        fields: {
          a: { reason: REASON, hanlder: { type: 'call', args: [] } },
          b: { reason: REASON, handler: { type: 'cal', args: [] } },
          c: { reason: REASON, handler: { type: 'call' } },
          d: {
            reason: REASON,
            handler: {
              type: 'event',
              select: 'account',
              add: { event: 'UpdateProver', wher: ['=', '#status', true] },
            },
          },
          e: {
            reason: REASON,
            handler: { type: 'call', method: 'owner', args: [] },
            edit: ['formatt', 'FormatSeconds'],
          },
        },
      },
      newTemplate('ScrollChain'),
    )
    expect(result.checked).toEqual(undefined)
    expect(result.findings).toEqual([
      {
        path: 'feilds',
        message: expect.includes('unexpected key (did you mean "fields"?)'),
      },
      {
        path: 'fields.a.hanlder',
        message: expect.includes('unexpected key (did you mean "handler"?)'),
      },
      {
        path: 'fields.b.handler.type',
        message: expect.includes('(did you mean "call"?), got "cal"'),
      },
      {
        path: 'fields.c.handler.args',
        message:
          'missing; expected an array, each element a string or a number',
      },
      {
        path: 'fields.d.handler.add.wher',
        message: expect.includes('unexpected key (did you mean "where"?)'),
      },
      {
        path: 'fields.e.edit',
        message:
          'expected a blip program discovery parses: an array whose first element is an operator, such as ["format", "FormatSeconds"] or ["=", "#status", true], got ["formatt","FormatSeconds"]',
      },
    ])
  })

  it('requires a reason on every field it adds', () => {
    expect(
      validateDraft(
        {
          fields: {
            provers: SCROLL_CHAIN.provers,
            blank: { reason: ' ', handler: { type: 'hardcoded', value: 1 } },
          },
        },
        newTemplate('ScrollChain'),
      ).findings.map(({ path, message }) => [path, message.slice(0, 40)]),
    ).toEqual([
      ['fields.blank.reason', 'one sentence naming the function that wr'],
      ['fields.provers.reason', 'missing; one sentence naming the functio'],
    ])
  })

  it('refuses a field that would replace a baseline value, and a handler V1 cannot construct, once the shape holds', () => {
    expect(
      paths(
        {
          fields: withReasons({
            owner: { handler: { type: 'hardcoded', value: 1 } },
            args: { handler: { type: 'constructorArgs' } },
          }),
        },
        newTemplate('ScrollChain'),
      ),
    ).toEqual(['fields.owner', 'fields.args.handler'])
  })

  it('says why an array over a getter keyed by a uint8 cannot be constructed, for a bare name and a full fragment', () => {
    const ctx = newTemplate('NitroEnclaveVerifier')
    const hint =
      '; array reads only a getter keyed by uint16, uint32, uint64, uint256, and getZkConfig(uint8) is keyed by uint8, an enum in the source: write one call field per key value with that value in args, or leave it out'
    const messages = (method: string) =>
      validateDraft(
        {
          fields: withReasons({
            zkConfigs: { handler: { type: 'array', method, indices: [1, 2] } },
          }),
        },
        ctx,
      ).findings.map((finding) => finding.message)

    expect(messages('getZkConfig')).toEqual([
      `V1 cannot construct this handler: Cannot find a matching method for getZkConfig${hint}`,
    ])
    expect(
      messages(
        'function getZkConfig(uint8 zkCoProcessor) view returns (tuple(bytes32 verifierId, bytes32 aggregatorId, address zkVerifier))',
      ),
    ).toEqual([`V1 cannot construct this handler: Invalid method abi${hint}`])
  })

  it('compares the return types of a full fragment for a function of this contract with the ABI, and leaves a function the ABI lacks to the dry run', () => {
    const result = validateDraft(
      {
        fields: withReasons({
          verifierKey: {
            handler: {
              type: 'call',
              method: 'function verifier() view returns (bytes32)',
              args: [],
            },
          },
          batchHashes: {
            handler: {
              type: 'array',
              method:
                'function committedBatches(uint256) view returns (address)',
              indices: [0],
            },
          },
          missing: {
            handler: {
              type: 'call',
              method: 'function foo(uint256) view returns (address)',
              args: [1],
            },
          },
          theVerifier: {
            handler: {
              type: 'call',
              method: 'function verifier() view returns (address)',
              args: [],
            },
          },
          elsewhere: {
            handler: {
              type: 'call',
              method: 'function foo() view returns (address)',
              args: [],
              address: '{{ verifier }}',
            },
          },
        }),
      },
      newTemplate('ScrollChain'),
    )
    expect(result.findings).toEqual([
      {
        path: 'fields.verifierKey.handler.method',
        message:
          "the ABI declares verifier() as `function verifier() view returns (address)`, returning (address), and this fragment returns (bytes32): write `method` as the ABI's fragment",
      },
      {
        path: 'fields.batchHashes.handler.method',
        message:
          "the ABI declares committedBatches(uint256) as `function committedBatches(uint256) view returns (bytes32)`, returning (bytes32), and this fragment returns (address): write `method` as the ABI's fragment",
      },
    ])
  })

  it('finds the function of a signature an error of the merged ABI shares', () => {
    const ctx = newTemplate('ScrollChain')
    const result = validateDraft(
      {
        fields: withReasons({
          verifierKey: {
            handler: {
              type: 'call',
              method: 'function verifier() view returns (bytes32)',
              args: [],
            },
          },
        }),
      },
      {
        ...ctx,
        facts: { ...ctx.facts, abi: ['error verifier()', ...ctx.facts.abi] },
      },
    )
    expect(result.findings.map((finding) => finding.path)).toEqual([
      'fields.verifierKey.handler.method',
    ])
  })
})

describe(validateDraftText.name, () => {
  const ctx: ValidationContext = {
    facts: loadFixture('ScrollChain'),
    templateText: '{}',
    isNew: true,
  }

  it('reads the JSON out of the reply, fenced or not', () => {
    const reply = {
      fields: { provers: { reason: 'r', ...SCROLL_CHAIN.provers } },
    }
    const text = `Here it is:\n\`\`\`json\n${JSON.stringify(reply)}\n\`\`\``
    expect(validateDraftText(text, ctx).findings).toEqual([])
  })

  it('asks for exactly one JSON object when the reply does not parse', () => {
    const result = validateDraftText('I could not find any state.', ctx)
    expect(result.checked).toEqual(undefined)
    expect(result.findings).toHaveLength(1)
    expect(result.findings[0]?.path).toEqual('draft')
    expect(String(result.findings[0]?.message)).toMatchRegex(
      /^reply with exactly one JSON object \{ "fields": \{ … \} \} and nothing else; the reply does not parse as JSON \(.+\)$/,
    )
  })
})

/** `_templates/scroll/ScrollChain`: membership folds and an event-only list. */
const SCROLL_CHAIN = {
  sequencers: {
    handler: {
      type: 'event',
      select: 'account',
      add: { event: 'UpdateSequencer', where: ['=', '#status', true] },
      remove: { event: 'UpdateSequencer', where: ['!=', '#status', true] },
    },
  },
  provers: {
    handler: {
      type: 'event',
      select: 'account',
      add: { event: 'UpdateProver', where: ['=', '#status', true] },
      remove: { event: 'UpdateProver', where: ['!=', '#status', true] },
    },
  },
  revertedBatches: {
    handler: {
      type: 'event',
      select: 'batchIndex',
      add: { event: 'RevertBatch' },
    },
  },
}

/** `_templates/base/NitroEnclaveVerifier`: literal-key calls and the zkVerifierRoutes fold. */
const NITRO_ENCLAVE_VERIFIER = {
  zkConfigRiscZero: {
    handler: { type: 'call', method: 'getZkConfig', args: [1] },
  },
  zkConfigSuccinct: {
    handler: { type: 'call', method: 'getZkConfig', args: [2] },
  },
  verifierProofIdRiscZero: {
    handler: { type: 'call', method: 'getVerifierProofId', args: [1] },
  },
  zkVerifierRoutes: {
    handler: {
      type: 'event',
      add: { event: 'ZkRouteAdded' },
      remove: { event: 'ZkRouteWasFrozen' },
      dedupBy: ['zkCoProcessor', 'selector'],
    },
  },
}

/** `_templates/opstack/DisputeGameFactory`: arrays over uint32 keys and single-key calls. */
const DISPUTE_GAME_FACTORY = {
  gameImpls: { handler: { type: 'array', length: 7 } },
  game1337: { handler: { type: 'call', method: 'gameImpls', args: [1337] } },
  initBonds: { handler: { type: 'array', length: 5 } },
  initBondGame42: {
    handler: { type: 'call', method: 'initBonds', args: [42] },
  },
  permissionedGameArgs: {
    handler: { type: 'call', method: 'gameArgs', args: [1] },
  },
}

/** Arbitrum SequencerInbox: membership mappings folded from their setters' events. */
const SEQUENCER_INBOX = {
  batchPosters: {
    handler: {
      type: 'event',
      select: 'batchPoster',
      add: { event: 'BatchPosterSet', where: ['=', '#isBatchPoster', true] },
      remove: {
        event: 'BatchPosterSet',
        where: ['!=', '#isBatchPoster', true],
      },
    },
  },
  sequencers: {
    handler: {
      type: 'event',
      select: 'addr',
      add: { event: 'SequencerSet', where: ['=', '#isSequencer', true] },
      remove: { event: 'SequencerSet', where: ['!=', '#isSequencer', true] },
    },
  },
  validKeysets: {
    handler: {
      type: 'event',
      select: 'keysetHash',
      add: { event: 'SetValidKeyset' },
      remove: { event: 'InvalidateKeyset' },
    },
  },
}
