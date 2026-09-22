import { expect } from 'earl'
import solc from 'solc'
import type { Prepared } from '../types/Prepared'
import { extractRelations } from './astFacts'
import { buildFacts } from './buildFacts'
import { compileAst, type SolcCompiler } from './solc'
import { souffleAvailable } from './souffle'

/**
 * One small contract exercises every path the rules must follow: a write
 * behind an internal call, a write in a modifier, a write through a storage
 * pointer, a `push`, a constructor write, an event emitted by the setter, an
 * event declared but never emitted, a library and an unrelated contract in
 * the same file that must not leak into scope. The bundled solc-js
 * (0.8.34) compiles it, so the test needs no download; Soufflé must be on
 * PATH, otherwise the derived-facts test is skipped and says so.
 */
const SOURCE = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library Unrelated { function noop() internal pure {} }
contract Elsewhere { uint256 public other; function poke() external { other++; } }

abstract contract Ownable {
  address public owner;
  event OwnershipTransferred(address previousOwner, address newOwner);
  event NeverUsed(uint256 x);
  modifier onlyOwner() { require(msg.sender == owner, "no"); _; }
  event Deployed(address by);
  constructor() { owner = msg.sender; emit Deployed(msg.sender); }
  function transferOwnership(address next) external onlyOwner {
    emit OwnershipTransferred(owner, next);
    owner = next;
  }
}

contract Registry is Ownable {
  struct Entry { address verifier; uint256 since; }
  mapping(address => bool) public isSequencer;
  mapping(uint256 => Entry) internal entries;
  uint256[] public history;
  uint256 public counter;
  event UpdateSequencer(address indexed account, bool status);
  event VerifierSet(uint256 indexed version, address verifier);
  modifier counting() { counter += 1; _; }

  function addSequencer(address a) external onlyOwner { _setSequencer(a, true); }
  function removeSequencer(address a) external onlyOwner { _setSequencer(a, false); }
  function _setSequencer(address a, bool s) internal { isSequencer[a] = s; emit UpdateSequencer(a, s); }

  function setVerifier(uint256 version, address verifier) external onlyOwner counting {
    Entry storage entry = entries[version];
    entry.verifier = verifier;
    entry.since = block.number;
    history.push(version);
    emit VerifierSet(version, verifier);
  }

  function getVerifier(uint256 version) external view returns (address) { return entries[version].verifier; }
  function historyLength() external view returns (uint256) { return history.length; }
}
`

const bundled: SolcCompiler = solc as unknown as SolcCompiler

describe(extractRelations.name, () => {
  it('records writes through internal calls, storage pointers, push and modifiers as compiler observations', () => {
    const { ast } = compileAst(bundled, 'Registry.sol', SOURCE)
    const relations = extractRelations(ast)
    const names = new Map(relations.stateVariable.map((v) => [v[0], v[1]]))
    const written = new Set(
      relations.writes
        .map(([, declaration]) => names.get(declaration))
        .filter((name) => name !== undefined),
    )
    expect(written).toEqual(
      new Set(['owner', 'isSequencer', 'history', 'counter', 'other']),
    )
    // entries is written only through the `entry` storage pointer.
    const pointerTargets = relations.storagePointer.map(([, v]) => names.get(v))
    expect(pointerTargets).toEqual(['entries'])
    expect(relations.emits.length).toEqual(4)
    expect(relations.internalCall.length).toEqual(2)
    // onlyOwner on three setters and transferOwnership, counting on setVerifier.
    expect(relations.modifierInvocation.length).toEqual(5)
  })
})

describe(buildFacts.name, () => {
  const prepared = {
    name: 'Registry',
    abi: [
      'function addSequencer(address a)',
      'function removeSequencer(address a)',
      'function setVerifier(uint256 version, address verifier)',
      'function getVerifier(uint256 version) view returns (address)',
      'function transferOwnership(address next)',
      'function isSequencer(address) view returns (bool)',
      'function history(uint256) view returns (uint256)',
    ],
    abis: {},
    sources: [
      {
        address: 'eth:0x0000000000000000000000000000000000000001',
        name: 'Registry',
        solidityVersion: 'bundled',
        constructorArguments: '',
        flattened: SOURCE,
      },
    ],
  } as unknown as Prepared

  const run = () =>
    buildFacts(prepared, { loadCompiler: () => Promise.resolve(bundled) })

  it('names writers with their guards and events, readers, constructor writes and never-emitted events', async function () {
    if (!souffleAvailable()) {
      this.skip()
    }
    const facts = await run()
    const source = facts.sources[0]
    if (source === undefined) throw new Error('one source')
    expect(source.error).toEqual(undefined)
    const byName = Object.fromEntries(source.variables.map((v) => [v.name, v]))

    expect(byName.isSequencer?.writers).toEqual([
      {
        function: 'addSequencer(address)',
        modifiers: ['onlyOwner'],
        events: ['UpdateSequencer(address,bool)'],
      },
      {
        function: 'removeSequencer(address)',
        modifiers: ['onlyOwner'],
        events: ['UpdateSequencer(address,bool)'],
      },
    ])
    // Written through a storage pointer; read by the explicit getter.
    expect(byName.entries?.writers.map((w) => w.function)).toEqual([
      'setVerifier(uint256,address)',
    ])
    expect(byName.entries?.readers).toEqual([
      'getVerifier(uint256)',
      'setVerifier(uint256,address)',
    ])
    // Written in a modifier the setter declares.
    expect(byName.counter?.writers.map((w) => w.function)).toEqual([
      'setVerifier(uint256,address)',
    ])
    expect(byName.history?.writers[0]?.events).toEqual([
      'VerifierSet(uint256,address)',
    ])
    expect(byName.owner?.writtenInConstructor).toEqual(true)
    expect(byName.owner?.writers.map((w) => w.function)).toEqual([
      'transferOwnership(address)',
    ])
    // Out of scope: the unrelated contract's variable never appears.
    expect(byName.other).toEqual(undefined)
    expect(source.neverEmitted).toEqual(['NeverUsed(uint256)'])
    // Emitted only at deployment: not "never", and called out so a fold includes it.
    expect(source.constructorEmits).toEqual(['Deployed(address)'])
  })

  it('records a compile failure on the source instead of throwing', async () => {
    const [source] = prepared.sources
    if (source === undefined) throw new Error('one source')
    const broken: Prepared = {
      ...prepared,
      sources: [{ ...source, flattened: 'contract X { uint a = ; }' }],
    }
    const facts = await buildFacts(broken, {
      loadCompiler: () => Promise.resolve(bundled),
    })
    expect(facts.sources[0]?.error ?? '').toInclude('could not compile')
    expect(facts.sources[0]?.variables).toEqual([])
  })
})
