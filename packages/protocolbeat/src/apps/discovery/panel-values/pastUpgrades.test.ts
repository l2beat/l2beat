import { expect } from 'earl'
import type { AddressFieldValue, FieldValue } from '../../../api/types'
import { buildPastUpgradeRows } from './pastUpgrades'

// Real, checksum-valid addresses (getChain validates via ChainSpecificAddress).
const A = 'eth:0xf9DD56364E3878056654C756cEBA692e577f8466'
const B = 'eth:0xB0D33d94aD4048070f510eF0086F12d20595dd07'
const C = 'eth:0xFA565846c217Bc0bA0f75027D4eECccdD68a9708'
const D = 'eth:0x56767eB2E3197A1dfa030faaD4A65cF38E807c81'
const E = 'eth:0x8991bF7Ed45ad2B8352efbaB83aD6e00c056a61c'
const F = 'eth:0x8C653b99f18Eb3bAb927519990bfC281500b0De6'

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

    expect(row?.txUrl).toEqual('https://etherscan.io/tx/0xdeadbeef')
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

  it('collapses entries that share a transaction hash', () => {
    const value: FieldValue = {
      type: 'array',
      // A diamond deployment emits the same tx several times.
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
})
