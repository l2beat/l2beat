import { expect } from 'earl'
import { checkHandlers, checkV1Construction } from './checkHandlers'
import type { Draft, DraftHandler } from './Draft'
import { type Finding, Findings } from './Finding'
import { buildRuleContext, type ValidationContext } from './ruleContext'
import { contextFor, draftOf, field, runRule } from './test/drafts'

describe(checkHandlers.name, () => {
  const scroll = contextFor('ScrollChain')
  const factory = contextFor('DisputeGameFactory')
  const nitro = contextFor('NitroEnclaveVerifier')
  const inbox = contextFor('SequencerInbox')
  const poster = '0x798576400F7D662961BA15C6b3F3d813447a26a6'

  function check(
    handler: DraftHandler,
    ctx: ValidationContext,
    name = 'x',
  ): Finding[] {
    return runRule(checkHandlers, draftOf({ [name]: field(handler) }), ctx)
  }

  function withAbi(ctx: ValidationContext, extra: string[]): ValidationContext {
    return {
      ...ctx,
      facts: { ...ctx.facts, abi: [...ctx.facts.abi, ...extra] },
    }
  }

  describe('call', () => {
    it('accepts literal args that encode as the resolved inputs', () => {
      expect(
        check(
          {
            type: 'call',
            method: 'games',
            args: [1, `0x${'00'.repeat(32)}`, '0x'],
          },
          factory,
        ),
      ).toEqual([])
      expect(
        check({ type: 'call', method: 'isBatchPoster', args: [poster] }, inbox),
      ).toEqual([])
    })

    it('reports the method at its path, or at the handler when it defaulted to the field name', () => {
      expect(
        check({ type: 'call', method: 'games', args: [1] }, factory),
      ).toEqual([
        {
          severity: 'error',
          path: 'fields.x.handler.method',
          message:
            'games(uint32,bytes32,bytes) takes 3 argument(s) but `args` has 1',
        },
      ])
      expect(
        check({ type: 'call', args: [1] }, factory, 'gameImpl')[0]?.path,
      ).toEqual('fields.gameImpl.handler')
    })

    it('spells args as ethers needs them: plain addresses, 0/1 for bools, references for arrays', () => {
      expect(
        check(
          { type: 'call', method: 'isBatchPoster', args: [`eth:${poster}`] },
          inbox,
        ),
      ).toEqual([
        {
          severity: 'error',
          path: 'fields.x.handler.args[0]',
          message: `V1 passes call args to ethers unchanged, and ethers rejects a chain-prefixed address; write "${poster}"`,
        },
      ])
      expect(
        check({ type: 'call', method: 'gameImpls', args: ['one'] }, factory)[0]
          ?.message,
      ).toEqual(
        'expected uint32 as an integer number or a decimal string, got "one"',
      )
      const flags = withAbi(nitro, [
        'function flagged(bool) view returns (uint256)',
      ])
      expect(
        check({ type: 'call', method: 'flagged', args: [1] }, flags),
      ).toEqual([])
      expect(
        check({ type: 'call', method: 'flagged', args: ['false'] }, flags)[0]
          ?.message,
      ).toEqual(
        'V1\'s call args are strings or numbers and ethers encodes a bool by truthiness (so "false" would be sent as true); write 1 for true or 0 for false, got "false"',
      )
      expect(
        check(
          {
            type: 'call',
            method: 'checkTrustedIntermediateCerts',
            args: ['0x'],
          },
          nitro,
        )[0]?.message,
      ).toEqual(
        'V1\'s call args are strings or numbers, so a bytes32[][] argument can only come from a "{{ field }}" reference to a value of that shape',
      )
    })

    it('takes a literal address of this chain or a reference', () => {
      const guardian = 'function guardian() view returns (address)'
      expect(
        check(
          {
            type: 'call',
            method: guardian,
            args: [],
            address: `eth:${poster}`,
          },
          scroll,
        ),
      ).toEqual([])
      expect(
        check(
          {
            type: 'call',
            method: guardian,
            args: [],
            address: `arb1:${poster}`,
          },
          scroll,
        ),
      ).toEqual([
        {
          severity: 'error',
          path: 'fields.x.handler.address',
          message: `arb1:${poster} is on another chain; V1 calls it through the ethereum provider, so write an address of this chain`,
        },
      ])
      expect(
        check(
          { type: 'call', method: guardian, args: [], address: 'registry' },
          scroll,
        )[0]?.message,
      ).toEqual(
        '`address` must be a reference to a field holding the other contract\'s address, such as "{{ registry }}", or a literal address; got "registry"',
      )
    })
  })

  describe('array', () => {
    it('accepts an index getter with literal indices or a length', () => {
      expect(
        check(
          { type: 'array', method: 'gameImpls', indices: [0, 1, 1337] },
          factory,
        ),
      ).toEqual([])
      expect(check({ type: 'array', length: 5 }, factory, 'initBonds')).toEqual(
        [],
      )
    })

    it('predicts what ArrayHandler refuses at run time', () => {
      expect(
        check({ type: 'array', method: 'zkConfig', indices: [1] }, nitro)[0]
          ?.path,
      ).toEqual('fields.x.handler.method')
      expect(
        check(
          { type: 'array', method: 'gameImpls', indices: [0], length: 2 },
          factory,
        ),
      ).toEqual([
        {
          severity: 'error',
          path: 'fields.x.handler',
          message:
            'V1 refuses `indices` together with `length` ("Cannot define both indices and length"); keep `indices` for fixed keys or `length` for a prefix 0…length-1',
        },
      ])
      expect(
        check(
          { type: 'array', method: 'gameImpls', indices: [-1, 1.5] },
          factory,
        ),
      ).toEqual([
        {
          severity: 'error',
          path: 'fields.x.handler.indices[0]',
          message: 'expected a non-negative integer index, got -1',
        },
        {
          severity: 'error',
          path: 'fields.x.handler.indices[1]',
          message: 'expected a non-negative integer index, got 1.5',
        },
      ])
      expect(
        check(
          { type: 'array', method: 'gameImpls', indices: '1,2' },
          factory,
        )[0]?.message,
      ).toEqual(
        'a string `indices` must be a reference to a field holding the keys, such as "{{ supportedParams }}"; otherwise list the keys as numbers',
      )
      expect(
        check({ type: 'array', method: 'gameImpls', length: 150 }, factory),
      ).toEqual([
        {
          severity: 'error',
          path: 'fields.x.handler.length',
          message:
            'V1 reads at most `maxLength` (100) elements and reports "Too many values" when `length` is larger; set "maxLength" to at least 150',
        },
      ])
    })
  })

  describe('accessControl', () => {
    const roles = withAbi(nitro, [
      'function hasRole(bytes32 role, address account) view returns (bool)',
      'function PROPOSER_ROLE() view returns (bytes32)',
      'event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)',
    ])
    const hash = `0x${'ab'.repeat(32)}`

    it('accepts an AccessControl contract with lowercase role hashes and a known picked role', () => {
      expect(
        check(
          { type: 'accessControl', roleNames: { [hash]: 'GOBLIN_ROLE' } },
          roles,
        ),
      ).toEqual([])
      expect(
        check(
          { type: 'accessControl', pickRoleMembers: 'PROPOSER_ROLE' },
          roles,
        ),
      ).toEqual([])
    })

    it('rejects a contract without AccessControl, uppercase hashes and unknown role names', () => {
      expect(check({ type: 'accessControl' }, scroll)[0]?.message).toEqual(
        'this contract is not OpenZeppelin AccessControl: its ABI has neither hasRole(bytes32,address) nor the RoleGranted event, so V1 would find no roles; drop the field',
      )
      expect(
        check(
          {
            type: 'accessControl',
            roleNames: {
              [hash.toUpperCase().replace('0X', '0x')]: 'GOBLIN_ROLE',
            },
          },
          roles,
        )[0],
      ).toEqual({
        severity: 'error',
        path: `fields.x.handler.roleNames["0x${'AB'.repeat(32)}"]`,
        message: `V1 looks role hashes up as logs render them, in lowercase; write "${hash}"`,
      })
      expect(
        check(
          { type: 'accessControl', pickRoleMembers: 'GOBLIN_ROLE' },
          roles,
        )[0]?.message,
      ).toEqual(
        'V1 names roles DEFAULT_ADMIN_ROLE, after the *_ROLE getters of the ABI and after roleNames, and fails with "No role (GOBLIN_ROLE) found" for any other name; known here: DEFAULT_ADMIN_ROLE, PROPOSER_ROLE',
      )
    })
  })

  describe('storage and constructorArgs', () => {
    it('rejects slots JSON cannot hold exactly', () => {
      expect(
        check({ type: 'storage', slot: '0x10', offset: 1 }, scroll),
      ).toEqual([])
      expect(check({ type: 'storage', slot: [2 ** 60, 1] }, scroll)).toEqual([
        {
          severity: 'error',
          path: 'fields.x.handler.slot[0]',
          message:
            '1152921504606847000 is beyond 2^53, where JSON numbers lose digits; write it as a 0x hex string',
        },
      ])
    })

    it('needs a constructor, and warns that a proxy decodes its own', () => {
      expect(
        check({ type: 'constructorArgs' }, nitro, 'constructorArgs'),
      ).toEqual([])
      expect(
        check({ type: 'constructorArgs' }, scroll, 'constructorArgs'),
      ).toEqual([
        {
          severity: 'warning',
          path: 'fields.constructorArgs.handler',
          message:
            "V1 decodes \"constructor(address _logic, address admin_, bytes _data) payable\", the first constructor of the merged ABI, from this address's deployment; behind a EIP1967 proxy that is usually the proxy's own constructor, not the implementation's",
        },
      ])
      const noConstructor = {
        ...nitro,
        facts: {
          ...nitro.facts,
          abi: nitro.facts.abi.filter(
            (entry) => !entry.startsWith('constructor'),
          ),
        },
      }
      expect(
        check({ type: 'constructorArgs' }, noConstructor, 'constructorArgs')[0]
          ?.message,
      ).toEqual(
        'the ABI declares no constructor, so there are no constructor arguments to decode; drop the field',
      )
    })
  })
})

describe(checkV1Construction.name, () => {
  const factory = contextFor('DisputeGameFactory')

  function construct(draft: Draft, preexisting: Finding[] = []): Finding[] {
    const findings = new Findings()
    findings.list.push(...preexisting)
    checkV1Construction(buildRuleContext(draft, factory, findings))
    return findings.list.slice(preexisting.length)
  }

  it('turns what V1 throws while constructing into an error at the handler', () => {
    expect(
      construct(draftOf({ gameType: field({ type: 'call', args: [1] }) })),
    ).toEqual([
      {
        severity: 'error',
        path: 'fields.gameType.handler',
        message:
          'V1 cannot construct this handler: Cannot find a matching method for gameType',
      },
    ])
    // V1 constructs this one by prefix match (gameImpls); R5 is what catches it
    expect(
      construct(draftOf({ gameImpl: field({ type: 'call', args: [1] }) })),
    ).toEqual([])
    expect(
      construct(
        draftOf({ constructorArgs: field({ type: 'constructorArgs' }) }),
      ),
    ).toEqual([])
  })

  it('leaves fields that already have an error to the specific finding', () => {
    const draft = draftOf({ gameType: field({ type: 'call', args: [1] }) })
    const specific: Finding = {
      severity: 'error',
      path: 'fields.gameType.handler',
      message: 'specific',
    }
    expect(construct(draft, [specific])).toEqual([])
  })
})
