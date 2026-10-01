import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { buildWorklist } from '../worklist'
import { checkPrivilegedSkips } from './checkPrivilegedSkips'
import type { DraftSkip } from './Draft'
import type { ValidationContext } from './ruleContext'
import { contextFor, draftOf, runRule, scrollChainDraft } from './test/drafts'

describe(checkPrivilegedSkips.name, () => {
  const scroll = contextFor('ScrollChain')
  const nitro = contextFor('NitroEnclaveVerifier')
  const skipped = (skips: DraftSkip[], ctx: ValidationContext) =>
    runRule(checkPrivilegedSkips, draftOf({}, skips), ctx)

  it('accepts activity skips of events that unguarded code emits, and covered skips of any', () => {
    expect(runRule(checkPrivilegedSkips, scrollChainDraft(), scroll)).toEqual(
      [],
    )
    expect(
      skipped(
        [
          { item: 'CommitBatch', reason: 'user-activity' },
          { item: 'OwnershipTransferred', reason: 'not-state' },
          { item: 'RevertBatch', reason: 'covered' },
        ],
        scroll,
      ),
    ).toEqual([])
  })

  it('rejects an activity skip of an event only the owner emits, the benchmark misses', () => {
    expect(
      skipped(
        [
          { item: 'isSequencer(address)', reason: 'user-activity' },
          { item: 'RevertBatch', reason: 'user-activity' },
        ],
        scroll,
      ),
    ).toEqual([
      {
        severity: 'error',
        path: 'skips[1].reason',
        message:
          'RevertBatch is emitted only by privileged code (revertBatch (onlyOwner), commitAndFinalizeBatch (OnlyTopLevelCall)), so it records configuration, not user activity; fold it into an event field, or skip it as `covered` if a baseline getter or another field already exposes this state',
      },
    ])
    expect(
      skipped([{ item: 'ZkRouteWasFrozen', reason: 'not-state' }], nitro)[0]
        ?.message,
    ).toEqual(
      'ZkRouteWasFrozen is emitted only by privileged code (freezeVerifyRoute (onlyOwner)), so it records configuration, not something without state; fold it into an event field, or skip it as `covered` if a baseline getter or another field already exposes this state',
    )
  })

  it('only warns when the guards authenticate something other than an authority', () => {
    const address = ChainSpecificAddress(
      'eth:0x0000000000000000000000000000000000000001',
    )
    const abi = [
      'event FinalizeWithdrawERC20(address indexed to, uint256 amount)',
    ]
    const gateway: ValidationContext = {
      facts: {
        ...nitro.facts,
        abi,
        sources: [
          {
            address,
            name: 'L1Gateway',
            flattened:
              'contract L1Gateway { function finalizeWithdrawERC20(address to, uint256 amount) external onlyCallByCounterpart { emit FinalizeWithdrawERC20(to, amount); } }',
          },
        ],
      },
      worklist: buildWorklist(abi),
    }
    expect(
      skipped(
        [{ item: 'FinalizeWithdrawERC20', reason: 'user-activity' }],
        gateway,
      ),
    ).toEqual([
      {
        severity: 'warning',
        path: 'skips[0].reason',
        message:
          'FinalizeWithdrawERC20 is emitted only behind `only*` guards (finalizeWithdrawERC20 (onlyCallByCounterpart)); if they stand for an owner or role, it records configuration: fold it into an event field or skip it as `covered`; if they authenticate a messenger or allow-list acting for users, keep user-activity',
      },
    ])
  })
})
