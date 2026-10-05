import { expect } from 'earl'
import type { Draft } from './Draft'
import type { Finding } from './Finding'
import { contextFor, draftOf, field, scrollChainDraft } from './test/drafts'
import { validateDraft, validateDraftText } from './validateDraft'

/**
 * End to end over the four suite contracts. Each full draft mirrors the
 * committed V1 template of its contract (event folds, literal-key calls,
 * arrays over index getters) and rules on every other worklist token, so
 * passing with zero errors shows the rules accept what researchers write.
 */
describe(validateDraft.name, () => {
  it('accepts the ScrollChain template as a draft', () => {
    const draft = scrollChainDraft()
    const result = validateDraft(draft, contextFor('ScrollChain'))
    expect(result.draft).toEqual(draft)
    expect(result.findings).toEqual([])
  })

  it('accepts drafts of the other suite contracts', () => {
    expect(
      validateDraft(nitroDraft(), contextFor('NitroEnclaveVerifier')).findings,
    ).toEqual([])
    expect(
      validateDraft(factoryDraft(), contextFor('DisputeGameFactory')).findings,
    ).toEqual([])
    expect(
      validateDraft(inboxDraft(), contextFor('SequencerInbox')).findings,
    ).toEqual([])
  })

  it('returns schema findings alone and no draft when the shape is wrong', () => {
    const broken = {
      fields: { x: { handler: { type: 'call' }, covers: [], reason: 'r' } },
      skips: [],
    }
    const result = validateDraft(broken, contextFor('ScrollChain'))
    expect(result.draft).toEqual(undefined)
    expect(result.findings).toEqual([
      {
        path: 'fields.x.handler.args',
        message:
          'missing; expected an array, each element a string or a number',
      },
    ])
  })

  it('runs every later rule once the shape holds', () => {
    const draft = scrollChainDraft()
    draft.fields.owner = field({ type: 'hardcoded', value: 1 }, [
      'UpdateProver',
    ])
    draft.skips = draft.skips.filter((skip) => skip.item !== 'CommitBatch')
    draft.skips.push({ item: 'RevertBatch', reason: 'user-activity' })
    expect(
      validateDraft(draft, contextFor('ScrollChain')).findings.map(
        (finding) => finding.path,
      ),
    ).toEqual([
      'fields.owner.covers[0]', // UpdateProver has two verdicts
      'skips[14].item', // RevertBatch has two verdicts
      'draft', // CommitBatch has no verdict
      'fields.owner', // a baseline getter's name
      'fields.owner.covers[0]', // a hardcoded field reads no events
    ])
  })

  it('says why an array over a getter keyed by a uint8 cannot be constructed, for a bare name and a full fragment', () => {
    const ctx = contextFor('NitroEnclaveVerifier')
    const bare = validateDraft(
      draftOf({
        zkConfigs: field(
          { type: 'array', method: 'getZkConfig', indices: [1, 2] },
          ['getZkConfig(uint8)'],
        ),
      }),
      ctx,
    )
    const construction = bare.findings.filter(
      (finding) => finding.path === 'fields.zkConfigs.handler',
    )
    expect(construction.map((finding) => finding.message)).toEqual([
      'V1 cannot construct this handler: Cannot find a matching method for getZkConfig; array reads only a getter keyed by uint16, uint32, uint64, uint256, and getZkConfig(uint8) is keyed by uint8, an enum in the source: write one call field per key value with that value in args, or skip it',
    ])

    const full = validateDraft(
      draftOf({
        zkConfigs: field(
          {
            type: 'array',
            method:
              'function getZkConfig(uint8 zkCoProcessor) view returns (tuple(bytes32 verifierId, bytes32 aggregatorId, address zkVerifier))',
            indices: [1, 2],
          },
          ['getZkConfig(uint8)'],
        ),
      }),
      ctx,
    )
    expect(
      full.findings
        .filter((finding) => finding.path === 'fields.zkConfigs.handler')
        .map((finding) => finding.message),
    ).toEqual([
      'V1 cannot construct this handler: Invalid method abi; array reads only a getter keyed by uint16, uint32, uint64, uint256, and getZkConfig(uint8) is keyed by uint8, an enum in the source: write one call field per key value with that value in args, or skip it',
    ])

    const perLiteral = validateDraft(
      draftOf({
        zkConfigRiscZero: field(
          { type: 'call', method: 'getZkConfig', args: [1] },
          ['getZkConfig(uint8)'],
        ),
        zkConfigSuccinct: field(
          { type: 'call', method: 'getZkConfig', args: [2] },
          ['getZkConfig(uint8)'],
        ),
      }),
      ctx,
    )
    expect(
      perLiteral.findings.filter((finding) =>
        finding.path.startsWith('fields.'),
      ),
    ).toEqual([])
  })

  it('refuses a handler V1 cannot construct, with V1’s own reason', () => {
    const draft = scrollChainDraft()
    draft.fields.args = field({ type: 'constructorArgs' })
    const result = validateDraft(draft, contextFor('ScrollChain'))
    expect(result.findings.map((finding) => finding.path)).toEqual([
      'fields.args.handler',
    ])
    expect(result.findings[0]?.message ?? '').toInclude(
      'V1 cannot construct this handler:',
    )
  })
})

describe(validateDraftText.name, () => {
  const ctx = contextFor('ScrollChain')

  it('reads the JSON out of the reply, fenced or not', () => {
    const text = `Here it is:\n\`\`\`json\n${JSON.stringify(scrollChainDraft())}\n\`\`\``
    expect(errorsOf(validateDraftText(text, ctx).findings)).toEqual([])
  })

  it('asks for exactly one JSON object when the reply does not parse', () => {
    const result = validateDraftText('I could not find any state.', ctx)
    expect(result.draft).toEqual(undefined)
    expect(result.findings).toHaveLength(1)
    expect(result.findings[0]?.path).toEqual('draft')
    expect(String(result.findings[0]?.message)).toMatchRegex(
      /^reply with exactly one JSON object \{ "fields": \{ … \}, "skips": \[ … \] \} and nothing else; the reply does not parse as JSON \(.+\)$/,
    )
  })

  function errorsOf(findings: Finding[]): Finding[] {
    return findings
  }
})

/** `_templates/base/NitroEnclaveVerifier`: literal-key calls and the zkVerifierRoutes fold. */
function nitroDraft(): Draft {
  return {
    fields: {
      zkConfigRiscZero: field(
        { type: 'call', method: 'getZkConfig', args: [1] },
        ['getZkConfig(uint8)'],
      ),
      zkConfigSuccinct: field({
        type: 'call',
        method: 'getZkConfig',
        args: [2],
      }),
      verifierProofIdRiscZero: field(
        { type: 'call', method: 'getVerifierProofId', args: [1] },
        ['getVerifierProofId(uint8)'],
      ),
      zkVerifierRoutes: field(
        {
          type: 'event',
          add: { event: 'ZkRouteAdded' },
          remove: { event: 'ZkRouteWasFrozen' },
          dedupBy: ['zkCoProcessor', 'selector'],
        },
        ['getZkVerifier(uint8,bytes4)', 'ZkRouteAdded', 'ZkRouteWasFrozen'],
      ),
    },
    skips: [
      {
        item: 'checkTrustedIntermediateCerts(bytes32[][])',
        reason: 'computation',
      },
      { item: 'ownershipHandoverExpiresAt(address)', reason: 'user-activity' },
      { item: 'trustedIntermediateCerts(bytes32)', reason: 'unbounded' },
      { item: 'zkConfig(uint8)', reason: 'covered' },
      {
        item: 'constructor(address,uint64,bytes32[],uint64[],bytes32,address,address,uint8,(bytes32,bytes32,address),bytes32)',
        reason: 'covered',
      },
      { item: 'AggregatorIdUpdated', reason: 'covered' },
      { item: 'AttestationSubmitted', reason: 'user-activity' },
      { item: 'BatchAttestationSubmitted', reason: 'user-activity' },
      { item: 'CertRevoked', reason: 'unbounded' },
      { item: 'MaxTimeDiffUpdated', reason: 'covered' },
      { item: 'OwnershipHandoverCanceled', reason: 'user-activity' },
      { item: 'OwnershipHandoverRequested', reason: 'user-activity' },
      { item: 'OwnershipTransferred', reason: 'covered' },
      { item: 'ProofSubmitterChanged', reason: 'covered' },
      { item: 'RevokerUpdated', reason: 'covered' },
      { item: 'RootCertChanged', reason: 'covered' },
      { item: 'VerifierIdUpdated', reason: 'covered' },
      { item: 'ZKConfigurationUpdated', reason: 'covered' },
    ],
  }
}

/** `_templates/opstack/DisputeGameFactory`: arrays over uint32 keys and single-key calls. */
function factoryDraft(): Draft {
  return {
    fields: {
      gameImpls: field({ type: 'array', length: 7 }, ['gameImpls(uint32)']),
      game1337: field({ type: 'call', method: 'gameImpls', args: [1337] }),
      initBonds: field({ type: 'array', length: 5 }, ['initBonds(uint32)']),
      initBondGame42: field({ type: 'call', method: 'initBonds', args: [42] }),
      permissionedGameArgs: field(
        { type: 'call', method: 'gameArgs', args: [1] },
        ['gameArgs(uint32)'],
      ),
    },
    skips: [
      {
        item: 'findLatestGames(uint32,uint256,uint256)',
        reason: 'computation',
      },
      { item: 'gameAtIndex(uint256)', reason: 'unbounded' },
      { item: 'games(uint32,bytes32,bytes)', reason: 'user-activity' },
      { item: 'getGameUUID(uint32,bytes32,bytes)', reason: 'computation' },
      { item: 'constructor(address)', reason: 'covered' },
      { item: 'AdminChanged', reason: 'covered' },
      { item: 'DisputeGameCreated', reason: 'user-activity' },
      { item: 'ImplementationArgsSet', reason: 'covered' },
      { item: 'ImplementationSet', reason: 'covered' },
      { item: 'InitBondUpdated', reason: 'covered' },
      { item: 'Initialized', reason: 'not-state' },
      { item: 'OwnershipTransferred', reason: 'covered' },
      { item: 'Upgraded', reason: 'covered' },
    ],
  }
}

/** Arbitrum SequencerInbox: membership mappings folded from their setters' events. */
function inboxDraft(): Draft {
  const membership = (event: string, select: string, flag: string) => ({
    type: 'event' as const,
    select,
    add: { event, where: ['=', `#${flag}`, true] },
    remove: { event, where: ['!=', `#${flag}`, true] },
  })
  return {
    fields: {
      batchPosters: field(
        membership('BatchPosterSet', 'batchPoster', 'isBatchPoster'),
        ['isBatchPoster(address)', 'BatchPosterSet'],
      ),
      sequencers: field(membership('SequencerSet', 'addr', 'isSequencer'), [
        'isSequencer(address)',
        'SequencerSet',
      ]),
      validKeysets: field(
        {
          type: 'event',
          select: 'keysetHash',
          add: { event: 'SetValidKeyset' },
          remove: { event: 'InvalidateKeyset' },
        },
        [
          'isValidKeysetHash(bytes32)',
          'dasKeySetInfo(bytes32)',
          'SetValidKeyset',
          'InvalidateKeyset',
        ],
      ),
    },
    skips: [
      { item: 'forceInclusionDeadline(uint64)', reason: 'computation' },
      { item: 'getKeysetCreationBlock(bytes32)', reason: 'covered' },
      { item: 'inboxAccs(uint256)', reason: 'unbounded' },
      { item: 'constructor(address,address,bytes)', reason: 'covered' },
      { item: 'AdminChanged', reason: 'covered' },
      { item: 'BatchPosterManagerSet', reason: 'covered' },
      { item: 'BeaconUpgraded', reason: 'not-state' },
      { item: 'BufferConfigSet', reason: 'covered' },
      { item: 'FeeTokenPricerSet', reason: 'covered' },
      { item: 'InboxMessageDelivered', reason: 'user-activity' },
      { item: 'InboxMessageDeliveredFromOrigin', reason: 'user-activity' },
      { item: 'MaxTimeVariationSet', reason: 'covered' },
      { item: 'OwnerFunctionCalled', reason: 'covered' },
      { item: 'SequencerBatchData', reason: 'unbounded' },
      { item: 'SequencerBatchDelivered', reason: 'unbounded' },
      { item: 'Upgraded', reason: 'covered' },
    ],
  }
}
