import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getTransferQuery } from './getTransferQuery'

const ADDRESS_1 = EthereumAddress('0x67e002f3a410029501eae397b63ec5f2b1f9fc96')
const ADDRESS_2 = EthereumAddress('0xe82a80c31a78f25c5dbe7ad7d035801f518653e6')
const ADDRESS_3 = EthereumAddress('0x1234567890123456789012345678901234567890')
const ADDRESS_4 = EthereumAddress('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')

const FROM = UnixTime.fromDate(new Date('2021-01-01Z'))
const TO = UnixTime.fromDate(new Date('2021-01-02Z'))

const CONFIGURATIONS = [
  { from: ADDRESS_1, to: ADDRESS_2 },
  { from: ADDRESS_3, to: ADDRESS_4 },
  { to: ADDRESS_2 },
]

describe(getTransferQuery.name, () => {
  it('returns valid SQL', () => {
    const query = getTransferQuery(CONFIGURATIONS, FROM, TO)
    expect(query).toEqual(`
    WITH
      params AS (
        SELECT
          from_iso8601_timestamp('2021-01-01T00:00:00.000Z') AS t_start,
          from_iso8601_timestamp('2021-01-02T00:00:00.000Z') AS t_end
      ),
      allowed_pairs(from_addr, to_addr) AS (
        VALUES
          (0x67e002f3a410029501eae397b63ec5f2b1f9fc96, 0xe82a80c31a78f25c5dbe7ad7d035801f518653e6),(0x1234567890123456789012345678901234567890, 0xabcdefabcdefabcdefabcdefabcdefabcdefabcd)
      ),
      allowed_to_only(to_addr) AS (
        VALUES
          (0xe82a80c31a78f25c5dbe7ad7d035801f518653e6)
      ),
      traces_filtered AS (
        SELECT
          tr.tx_hash,
          tr."from",
          tr.to
        FROM ethereum.traces tr
        CROSS JOIN params p
        WHERE tr.success = true
          AND tr.call_type = 'call'
          AND tr.block_time >= p.t_start
          AND tr.block_time <=  p.t_end
          AND (
            ROW(tr."from", tr.to) IN (SELECT from_addr, to_addr FROM allowed_pairs)
            OR tr.to IN (SELECT to_addr FROM allowed_to_only)
          )
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
      tr."from",
      tr.to,
      tx.block_number,
      tx.block_time,
      tx.gas_used,
      tx.gas_price,
      tx.blob_versioned_hashes,
      length(tx.data) AS data_length,
      length(replace(regexp_replace(to_hex(tx.data), '([0-9A-Fa-f]{2})', '$1x'), '00x', '')) / 3 AS non_zero_bytes
    FROM txs_filtered tx
    JOIN traces_filtered tr
      ON tx.hash = tr.tx_hash;
  `)
  })

  it('returns valid SQL with duplicate configurations', () => {
    const query = getTransferQuery(
      [...CONFIGURATIONS, ...CONFIGURATIONS],
      FROM,
      TO,
    )

    expect(query).toEqual(`
    WITH
      params AS (
        SELECT
          from_iso8601_timestamp('2021-01-01T00:00:00.000Z') AS t_start,
          from_iso8601_timestamp('2021-01-02T00:00:00.000Z') AS t_end
      ),
      allowed_pairs(from_addr, to_addr) AS (
        VALUES
          (0x67e002f3a410029501eae397b63ec5f2b1f9fc96, 0xe82a80c31a78f25c5dbe7ad7d035801f518653e6),(0x1234567890123456789012345678901234567890, 0xabcdefabcdefabcdefabcdefabcdefabcdefabcd)
      ),
      allowed_to_only(to_addr) AS (
        VALUES
          (0xe82a80c31a78f25c5dbe7ad7d035801f518653e6)
      ),
      traces_filtered AS (
        SELECT
          tr.tx_hash,
          tr."from",
          tr.to
        FROM ethereum.traces tr
        CROSS JOIN params p
        WHERE tr.success = true
          AND tr.call_type = 'call'
          AND tr.block_time >= p.t_start
          AND tr.block_time <=  p.t_end
          AND (
            ROW(tr."from", tr.to) IN (SELECT from_addr, to_addr FROM allowed_pairs)
            OR tr.to IN (SELECT to_addr FROM allowed_to_only)
          )
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
      tr."from",
      tr.to,
      tx.block_number,
      tx.block_time,
      tx.gas_used,
      tx.gas_price,
      tx.blob_versioned_hashes,
      length(tx.data) AS data_length,
      length(replace(regexp_replace(to_hex(tx.data), '([0-9A-Fa-f]{2})', '$1x'), '00x', '')) / 3 AS non_zero_bytes
    FROM txs_filtered tx
    JOIN traces_filtered tr
      ON tx.hash = tr.tx_hash;
  `)
  })

  it('handles empty helper tables', () => {
    const query = getTransferQuery([], FROM, TO)

    expect(query).toEqual(`
    WITH
      params AS (
        SELECT
          from_iso8601_timestamp('2021-01-01T00:00:00.000Z') AS t_start,
          from_iso8601_timestamp('2021-01-02T00:00:00.000Z') AS t_end
      ),
      allowed_pairs(from_addr, to_addr) AS (
        VALUES
          (NULL, NULL)
      ),
      allowed_to_only(to_addr) AS (
        VALUES
          (NULL)
      ),
      traces_filtered AS (
        SELECT
          tr.tx_hash,
          tr."from",
          tr.to
        FROM ethereum.traces tr
        CROSS JOIN params p
        WHERE tr.success = true
          AND tr.call_type = 'call'
          AND tr.block_time >= p.t_start
          AND tr.block_time <=  p.t_end
          AND (
            ROW(tr."from", tr.to) IN (SELECT from_addr, to_addr FROM allowed_pairs)
            OR tr.to IN (SELECT to_addr FROM allowed_to_only)
          )
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
      tr."from",
      tr.to,
      tx.block_number,
      tx.block_time,
      tx.gas_used,
      tx.gas_price,
      tx.blob_versioned_hashes,
      length(tx.data) AS data_length,
      length(replace(regexp_replace(to_hex(tx.data), '([0-9A-Fa-f]{2})', '$1x'), '00x', '')) / 3 AS non_zero_bytes
    FROM txs_filtered tx
    JOIN traces_filtered tr
      ON tx.hash = tr.tx_hash;
  `)
  })
})
