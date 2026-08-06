import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getFunctionCallQuery } from './getFunctionCallQuery'

const ADDRESS_1 = EthereumAddress('0x67e002f3a410029501eae397b63ec5f2b1f9fc96')
const ADDRESS_2 = EthereumAddress('0xe82a80c31a78f25c5dbe7ad7d035801f518653e6')
const SELECTOR_1 = '0x' + 'A'.repeat(8)
const SELECTOR_2 = '0x' + 'B'.repeat(8)
const FROM = UnixTime.fromDate(new Date('2021-01-01Z'))
const TO = UnixTime.fromDate(new Date('2021-01-02Z'))

const CONFIGURATIONS = [
  {
    address: ADDRESS_1,
    selector: SELECTOR_1,
    inputBytes: 4,
  },
  {
    address: ADDRESS_2,
    selector: SELECTOR_2,
    inputBytes: 'full' as const,
  },
]

const EXPECTED_SQL = `
    WITH
      params AS (
        SELECT
          from_iso8601_timestamp('2021-01-01T00:00:00.000Z') AS t_start,
          from_iso8601_timestamp('2021-01-02T00:00:00.000Z') AS t_end
      ),
      allowed_calls(to_addr, selector, input_bytes) AS (
        VALUES
          (0x67e002f3a410029501eae397b63ec5f2b1f9fc96, 0xaaaaaaaa, 4),(0xe82a80c31a78f25c5dbe7ad7d035801f518653e6, 0xbbbbbbbb, CAST(NULL AS bigint))
      ),
      traces_filtered AS (
        SELECT
          tr.tx_hash,
          tr.to,
          tr.block_time,
          tr.input,
          substr(tr.input, 1, 4) AS selector
        FROM ethereum.traces tr
        CROSS JOIN params p
        WHERE tr.call_type = 'call'
          AND tr.success = true
          AND tr.block_time >= p.t_start
          AND tr.block_time <=  p.t_end
      ),
      traces_allowed AS (
        SELECT tr.*, ac.input_bytes
        FROM traces_filtered tr
        JOIN allowed_calls ac
          ON tr.to = ac.to_addr
        AND tr.selector = ac.selector
      ),
      txs_filtered AS (
        SELECT
          tx.hash,
          tx.block_number,
          tx.block_time,
          tx.gas_used,
          tx.gas_price,
          tx.blob_versioned_hashes,
          tx.data
        FROM ethereum.transactions tx
        CROSS JOIN params p
        WHERE tx.block_time >= p.t_start
          AND tx.block_time <=  p.t_end
      )

    SELECT DISTINCT
      tx.hash,
      tr.to,
      tx.block_number,
      tx.block_time,
      tx.gas_used,
      tx.gas_price,
      tx.blob_versioned_hashes,
      length(tx.data) AS data_length,
      length(replace(regexp_replace(to_hex(tx.data), '([0-9A-Fa-f]{2})', '$1x'), '00x', '')) / 3 AS non_zero_bytes,
      CASE
        WHEN tr.input_bytes IS NULL THEN tr.input
        ELSE substr(tr.input, 1, tr.input_bytes)
      END AS input
    FROM txs_filtered tx
    JOIN traces_allowed tr
      ON tx.hash = tr.tx_hash;
  `

describe(getFunctionCallQuery.name, () => {
  it('returns valid SQL', () => {
    const query = getFunctionCallQuery(CONFIGURATIONS, FROM, TO)
    expect(query).toEqual(EXPECTED_SQL)
  })

  it('returns valid SQL with duplicate configurations', () => {
    const query = getFunctionCallQuery(
      [...CONFIGURATIONS, ...CONFIGURATIONS],
      FROM,
      TO,
    )

    expect(query).toEqual(EXPECTED_SQL)
  })

  it('merges duplicates to the widest input request', () => {
    const query = getFunctionCallQuery(
      [
        { address: ADDRESS_1, selector: SELECTOR_1, inputBytes: 4 },
        { address: ADDRESS_1, selector: SELECTOR_1, inputBytes: 68 },
        {
          address: ADDRESS_2,
          selector: SELECTOR_2,
          inputBytes: 'full' as const,
        },
        { address: ADDRESS_2, selector: SELECTOR_2, inputBytes: 4 },
      ],
      FROM,
      TO,
    )

    expect(query).toEqual(
      getFunctionCallQuery(
        [
          { address: ADDRESS_1, selector: SELECTOR_1, inputBytes: 68 },
          {
            address: ADDRESS_2,
            selector: SELECTOR_2,
            inputBytes: 'full' as const,
          },
        ],
        FROM,
        TO,
      ),
    )
  })

  it('handles empty helper tables', () => {
    const query = getFunctionCallQuery([], FROM, TO)

    expect(query).toEqual(`
    WITH
      params AS (
        SELECT
          from_iso8601_timestamp('2021-01-01T00:00:00.000Z') AS t_start,
          from_iso8601_timestamp('2021-01-02T00:00:00.000Z') AS t_end
      ),
      allowed_calls(to_addr, selector, input_bytes) AS (
        VALUES
          (CAST(NULL AS varbinary), CAST(NULL AS varbinary), CAST(NULL AS bigint))
      ),
      traces_filtered AS (
        SELECT
          tr.tx_hash,
          tr.to,
          tr.block_time,
          tr.input,
          substr(tr.input, 1, 4) AS selector
        FROM ethereum.traces tr
        CROSS JOIN params p
        WHERE tr.call_type = 'call'
          AND tr.success = true
          AND tr.block_time >= p.t_start
          AND tr.block_time <=  p.t_end
      ),
      traces_allowed AS (
        SELECT tr.*, ac.input_bytes
        FROM traces_filtered tr
        JOIN allowed_calls ac
          ON tr.to = ac.to_addr
        AND tr.selector = ac.selector
      ),
      txs_filtered AS (
        SELECT
          tx.hash,
          tx.block_number,
          tx.block_time,
          tx.gas_used,
          tx.gas_price,
          tx.blob_versioned_hashes,
          tx.data
        FROM ethereum.transactions tx
        CROSS JOIN params p
        WHERE tx.block_time >= p.t_start
          AND tx.block_time <=  p.t_end
      )

    SELECT DISTINCT
      tx.hash,
      tr.to,
      tx.block_number,
      tx.block_time,
      tx.gas_used,
      tx.gas_price,
      tx.blob_versioned_hashes,
      length(tx.data) AS data_length,
      length(replace(regexp_replace(to_hex(tx.data), '([0-9A-Fa-f]{2})', '$1x'), '00x', '')) / 3 AS non_zero_bytes,
      CASE
        WHEN tr.input_bytes IS NULL THEN tr.input
        ELSE substr(tr.input, 1, tr.input_bytes)
      END AS input
    FROM txs_filtered tx
    JOIN traces_allowed tr
      ON tx.hash = tr.tx_hash;
  `)
  })
})
