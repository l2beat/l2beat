import { expect } from 'earl'
import { AbiIndex, sighash } from '../abi/AbiIndex'
import { loadFixture } from '../test/fixtures'
import type { DraftHandler } from './Draft'
import { readsOf } from './fieldReads'
import { resolveMethod } from './resolveMethod'

/**
 * Resolution goes through `readsOf`, which builds the request exactly as
 * the call and array handlers do (`method ?? field`, arity from `args`),
 * so each case is a handler as the model would write it.
 */
describe(resolveMethod.name, () => {
  const scroll = loadFixture('ScrollChain').abi
  const factory = loadFixture('DisputeGameFactory').abi
  const nitro = loadFixture('NitroEnclaveVerifier').abi

  function resolve(abi: string[], handler: DraftHandler, field = 'field') {
    const method = readsOf(field, handler, abi, AbiIndex.from(abi)).method
    return method?.fragment ? sighash(method.fragment) : String(method?.error)
  }

  const call = (method: string | undefined, args: unknown[], extra = {}) =>
    ({ type: 'call', method, args, ...extra }) as DraftHandler

  it('resolves a bare name by arity, and the field name when method is absent', () => {
    expect(
      resolve(scroll, call('isSequencer', ['0x' + '11'.repeat(20)])),
    ).toEqual('isSequencer(address)')
    expect(
      resolve(factory, call('games', [0, '0x' + '00'.repeat(32), '0x'])),
    ).toEqual('games(uint32,bytes32,bytes)')
    expect(resolve(factory, call(undefined, [0]), 'gameImpls')).toEqual(
      'gameImpls(uint32)',
    )
  })

  it('rejects a signature even where V1 would find it by luck', () => {
    // the merged ABI spells `isSequencer(address)` without a parameter name,
    // so V1's prefix match finds it; `isBatchFinalized(uint256 _batchIndex)` it would not
    expect(
      resolve(scroll, call('isSequencer(address)', ['0x' + '11'.repeat(20)])),
    ).toEqual(
      '"isSequencer(address)" is a signature, which V1 matches as the start of an ABI entry and so only finds while the ABI omits parameter names; write the bare name "isSequencer" (the number of args picks the overload) or the full fragment "function isSequencer(address) view returns (bool)"',
    )
    expect(
      resolve(scroll, call('isBatchFinalized(uint256)', [1])),
    ).toMatchRegex(/^"isBatchFinalized\(uint256\)" is a signature/)
  })

  it('names the arity V1 expects, the mutability it needs and the field-name default', () => {
    expect(resolve(factory, call('games', [0]))).toEqual(
      'games(uint32,bytes32,bytes) takes 3 argument(s) but `args` has 1',
    )
    expect(resolve(factory, call('admin', []))).toEqual(
      "admin() is nonpayable; V1's call handler only calls view or pure functions",
    )
    expect(
      resolve(scroll, call(undefined, ['0x' + '11'.repeat(20)]), 'sequencers'),
    ).toEqual(
      'no `method` is given, so V1 calls the function named like the field, and there is no function "sequencers" in the ABI; closest: isSequencer, owner, verifier',
    )
  })

  it('catches the prefix match: owner with one argument would call owners(uint256)', () => {
    const abi = [
      'function owners(uint256) view returns (address)',
      'function owner() view returns (address)',
    ]
    expect(resolve(abi, call('owner', [0]))).toEqual(
      'owner() takes 0 argument(s) but `args` has 1; V1 matches `method` as the start of an ABI entry, so it would silently call owners(uint256) instead',
    )
    const shadowed = [
      'function owners(uint256) view returns (address)',
      'function owner(uint256) view returns (address)',
    ]
    expect(resolve(shadowed, call('owner', [0]))).toEqual(
      'V1 matches `method` as the start of an ABI entry and resolves "owner" to owners(uint256), not owner(uint256); use the full fragment "function owner(uint256) view returns (address)"',
    )
    expect(
      resolve(
        shadowed,
        call('function owner(uint256) view returns (address)', [0]),
      ),
    ).toEqual('owner(uint256)')
  })

  it('requires a full fragment for overloads of one arity', () => {
    const abi = [
      'function limit(uint256) view returns (uint256)',
      'function limit(address) view returns (uint256)',
    ]
    expect(resolve(abi, call('limit', [1]))).toEqual(
      '"limit" matches 2 overloads with this many arguments and V1 would take whichever the ABI lists first; use the full fragment of the one you mean: "function limit(uint256) view returns (uint256)" or "function limit(address) view returns (uint256)"',
    )
  })

  it('accepts a foreign full fragment only together with address, and checks own fragments against the ABI', () => {
    const guardian = 'function guardian() view returns (address)'
    expect(
      resolve(scroll, call(guardian, [], { address: '{{ systemConfig }}' })),
    ).toEqual('guardian()')
    expect(
      resolve(scroll, call('guardian', [], { address: '{{ systemConfig }}' })),
    ).toEqual(
      '`address` points at another contract, whose ABI V1 does not have, so `method` must be a full fragment such as "function guardian() view returns (address)"',
    )
    expect(resolve(scroll, call(guardian, []))).toEqual(
      "guardian() is not in this contract's ABI; to read another contract set `address` to a reference holding its address, otherwise call a function this ABI declares (closest: miscData(), paused(), verifier())",
    )
    expect(
      resolve(scroll, call('function owner() view returns (uint256)', [])),
    ).toEqual(
      'owner() returns (address) in this ABI, not (uint256); copy "function owner() view returns (address)"',
    )
    expect(
      resolve(
        scroll,
        call('function guardian() returns (address)', [], {
          address: '{{ systemConfig }}',
        }),
      ),
    ).toEqual(
      "guardian() is nonpayable; V1's call handler only calls view or pure functions",
    )
    expect(
      resolve(scroll, call('owner() view returns (address)', [])),
    ).toMatchRegex(
      /^"owner\(\) view returns \(address\)" contains a space, so V1 parses it as a full fragment, and it does not parse/,
    )
  })

  it('rejects a function that returns nothing', () => {
    const abi = ['function ping(uint256) view']
    expect(resolve(abi, call('ping', [1]))).toEqual(
      'ping(uint256) returns nothing, so there is no value to read',
    )
  })

  it('applies the array predicate: one uint16, uint32, uint64 or uint256 index', () => {
    const array = (method: string) =>
      ({ type: 'array', method }) as DraftHandler
    expect(resolve(factory, array('gameImpls'))).toEqual('gameImpls(uint32)')
    expect(resolve(nitro, array('zkConfig'))).toEqual(
      "zkConfig(uint8) does not take a single uint16, uint32, uint64, uint256 index, which is all V1's array handler calls with; read fixed keys with one `call` field each, or skip it",
    )
  })
})
