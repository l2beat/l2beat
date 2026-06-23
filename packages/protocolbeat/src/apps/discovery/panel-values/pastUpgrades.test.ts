import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { AddressFieldValue, FieldValue } from '../../../api/types'
import { buildPastUpgradeRows } from './pastUpgrades'

const A = ChainSpecificAddress.random()
const B = ChainSpecificAddress.random()
const C = ChainSpecificAddress.random()
const D = ChainSpecificAddress.random()
const E = ChainSpecificAddress.random()
const F = ChainSpecificAddress.random()

function address(addr: string): AddressFieldValue {
  return { type: 'address', addressType: 'Unknown', address: addr }
}

function entry(
  date: string,
  txHash: string,
  implementations: string[],
): FieldValue {
  return {
    type: 'array',
    values: [
      { type: 'string', value: date },
      { type: 'hex', value: txHash },
      { type: 'array', values: implementations.map(address) },
    ],
  }
}

describe('buildPastUpgradeRows', () => {
  it('returns an empty list for non-array values', () => {
    expect(buildPastUpgradeRows({ type: 'empty' })).toEqual([])
  })

  it('returns an empty list when there are no implementations', () => {
    const value: FieldValue = {
      type: 'array',
      values: [
        {
          type: 'array',
          values: [
            { type: 'string', value: '2024-01-20T02:02:25.000Z' },
            { type: 'hex', value: '0xabc' },
            { type: 'array', values: [] },
          ],
        },
      ],
    }
    expect(buildPastUpgradeRows(value)).toEqual([])
  })

  it('orders rows newest first and diffs against the previous implementation', () => {
    const value: FieldValue = {
      type: 'array',
      // Intentionally out of order to prove sorting.
      values: [
        entry('2025-10-07T00:00:00.000Z', '0xold', [C]),
        entry('2026-05-26T00:00:00.000Z', '0xnew', [A]),
        entry('2026-02-10T00:00:00.000Z', '0xmid', [B]),
      ],
    }

    const rows = buildPastUpgradeRows(value)

    expect(rows.map((r) => r.formattedDate)).toEqual([
      '2026-05-26',
      '2026-02-10',
      '2025-10-07',
    ])
    expect(rows.map((r) => r.cells[0]?.address)).toEqual([A, B, C])
    // Each row diffs against the next (older) implementation.
    expect(rows[0]?.cells[0]?.diffUrl).toEqual(`/diff/${B}/${A}`)
    expect(rows[1]?.cells[0]?.diffUrl).toEqual(`/diff/${C}/${B}`)
    // The oldest entry has no previous implementation to diff against.
    expect(rows[2]?.cells[0]?.diffUrl).toEqual(undefined)
  })

  it('builds the explorer transaction url from the implementation chain', () => {
    const value = {
      type: 'array',
      values: [entry('2024-01-20T02:02:25.000Z', '0xdeadbeef', [A])],
    } satisfies FieldValue

    const [row] = buildPastUpgradeRows(value)

    expect(row?.txHash).toEqual('0xdeadbeef')
    expect(row?.txUrl).toEqual('https://etherscan.io/tx/0xdeadbeef')
  })

  it('keeps the transaction hash even when the chain has no explorer', () => {
    // zircuit has no EXPLORER_URLS entry, but the hash must stay inspectable.
    const onZircuit = ChainSpecificAddress.random('zircuit')
    const value = {
      type: 'array',
      values: [entry('2024-01-20T02:02:25.000Z', '0xdeadbeef', [onZircuit])],
    } satisfies FieldValue

    const [row] = buildPastUpgradeRows(value)

    expect(row?.txHash).toEqual('0xdeadbeef')
    expect(row?.txUrl).toEqual(undefined)
  })

  it('exposes one cell per facet for diamond upgrades', () => {
    const value: FieldValue = {
      type: 'array',
      values: [
        entry('2024-02-01T00:00:00.000Z', '0xnew', [A, D]),
        entry('2024-01-01T00:00:00.000Z', '0xold', [B, C]),
      ],
    }

    const rows = buildPastUpgradeRows(value)

    expect(rows.length).toEqual(2)
    expect(rows[0]?.cells.length).toEqual(2)
    // Facets are diffed against the same-position facet of the previous upgrade.
    expect(rows[0]?.cells[0]?.diffUrl).toEqual(`/diff/${B}/${A}`)
    expect(rows[0]?.cells[1]?.diffUrl).toEqual(`/diff/${C}/${D}`)
    expect(rows[1]?.cells[0]?.diffUrl).toEqual(undefined)
    expect(rows[1]?.cells[1]?.diffUrl).toEqual(undefined)
  })

  it('only emits a diff for facets that changed from the previous snapshot', () => {
    const value: FieldValue = {
      type: 'array',
      values: [
        // Only the last facet changed; the first two are unchanged.
        entry('2024-02-01T00:00:00.000Z', '0xnew', [A, B, D]),
        entry('2024-01-01T00:00:00.000Z', '0xold', [A, B, E]),
      ],
    }

    const rows = buildPastUpgradeRows(value)

    expect(rows[0]?.cells[0]?.diffUrl).toEqual(undefined)
    expect(rows[0]?.cells[1]?.diffUrl).toEqual(undefined)
    expect(rows[0]?.cells[2]?.diffUrl).toEqual(`/diff/${E}/${D}`)
  })

  it('collapses entries that share a transaction hash and implementation set', () => {
    const value: FieldValue = {
      type: 'array',
      // A diamond emits one DiamondCut event per cut; repeated events within a
      // single tx resolve to the same cumulative facet set.
      values: [
        entry('2024-01-01T00:00:00.000Z', '0xdeploy', [F]),
        entry('2024-01-01T00:00:00.000Z', '0xdeploy', [F]),
        entry('2024-01-01T00:00:00.000Z', '0xdeploy', [F]),
        entry('2024-03-01T00:00:00.000Z', '0xupgrade', [A]),
      ],
    }

    const rows = buildPastUpgradeRows(value)

    expect(rows.length).toEqual(2)
    expect(rows.map((r) => r.cells[0]?.address)).toEqual([A, F])
    expect(rows[0]?.cells[0]?.diffUrl).toEqual(`/diff/${F}/${A}`)
    expect(rows[1]?.cells[0]?.diffUrl).toEqual(undefined)
  })

  it('keeps distinct implementations changed within one transaction', () => {
    // OP Stack upgrades go proxy -> StorageSetter (B) -> new impl (A) in a
    // single tx, emitting two `Upgraded` events that share a hash and block
    // timestamp. Both are real upgrades and must be shown, newest (A) first.
    const value: FieldValue = {
      type: 'array',
      values: [
        entry('2024-12-16T10:59:11.000Z', '0xfirst', [C]),
        entry('2026-05-25T00:00:00.000Z', '0xsecond', [B]),
        entry('2026-05-25T00:00:00.000Z', '0xsecond', [A]),
      ],
    }

    const rows = buildPastUpgradeRows(value)

    expect(rows.length).toEqual(3)
    expect(rows.map((r) => r.cells[0]?.address)).toEqual([A, B, C])
    expect(rows.map((r) => r.txHash)).toEqual([
      '0xsecond',
      '0xsecond',
      '0xfirst',
    ])
    expect(rows[0]?.cells[0]?.diffUrl).toEqual(`/diff/${B}/${A}`)
    expect(rows[1]?.cells[0]?.diffUrl).toEqual(`/diff/${C}/${B}`)
    expect(rows[2]?.cells[0]?.diffUrl).toEqual(undefined)
  })
})
