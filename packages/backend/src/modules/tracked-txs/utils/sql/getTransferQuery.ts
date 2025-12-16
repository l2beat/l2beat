import { type EthereumAddress, UnixTime, unique } from '@l2beat/shared-pure'

export function getTransferQuery(
  transfersConfig: { from?: EthereumAddress; to: EthereumAddress }[],
  from: UnixTime,
  to: UnixTime,
): string {
  const uniqueTransfersConfigs = unique(
    transfersConfig,
    (tc) => `${tc.from}-${tc.to}`,
  )

  const query = `
    WITH
      params AS (
        SELECT
          from_iso8601_timestamp('${UnixTime.toDate(from).toISOString()}') AS t_start,
          from_iso8601_timestamp('${UnixTime.toDate(to).toISOString()}') AS t_end
      ),
      allowed_pairs(from_addr, to_addr) AS (
        VALUES
          ${
            uniqueTransfersConfigs.length > 0
              ? uniqueTransfersConfigs
                  .filter((tc) => tc.from)
                  .map(
                    (tc) =>
                      `(${tc.from?.toLowerCase()}, ${tc.to.toLowerCase()})`,
                  )
                  .join(',')
              : '(NULL, NULL)'
          }
      ),
      allowed_to_only(to_addr) AS (
        VALUES
          ${
            uniqueTransfersConfigs.length > 0
              ? uniqueTransfersConfigs
                  .filter((tc) => !tc.from)
                  .map((tc) => `(${tc.to.toLowerCase()})`)
                  .join(',')
              : '(NULL)'
          }
      ),
      traces_filtered AS (
        SELECT
          tr.tx_hash,
          tr."from",
          tr.to,
          tr.block_time,
          tr.input,
          to_hex(tr.input) AS input_hex
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
      blobs AS (
        SELECT
            blobs.tx_hash,
            blobs.blob_base_fee
        FROM ethereum.blobs as blobs
        CROSS JOIN params p
        WHERE blobs.beacon_slot_time >= p.t_start
          AND blobs.beacon_slot_time <= p.t_end
      ),
      txs_filtered AS (
        SELECT
          tx.hash,
          tx.block_number,
          tx.block_time,
          tx.gas_used,
          tx.gas_price,
          tx.blob_versioned_hashes
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
      blobs.blob_base_fee,
      length(tr.input) AS data_length,
      length(replace(regexp_replace(to_hex(tr.input), '([0-9A-Fa-f]{2})', '$1x'), '00x', '')) / 3 AS non_zero_bytes
    FROM txs_filtered tx
    JOIN traces_filtered tr
      ON tx.hash = tr.tx_hash
    LEFT JOIN blobs
      ON tx.hash = blobs.tx_hash;     
  `

  return query
}
