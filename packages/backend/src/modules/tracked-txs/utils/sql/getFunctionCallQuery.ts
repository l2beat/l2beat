import { type EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { FunctionCallParameterProjection } from '../getFunctionCallParameterProjection'

export interface FunctionCallQueryTarget {
  address: EthereumAddress
  selector: string
  input: 'selector' | 'full'
  groupingProjection?: FunctionCallParameterProjection
}

export function getFunctionCallQuery(
  targets: readonly FunctionCallQueryTarget[],
  from: UnixTime,
  to: UnixTime,
): string {
  const fullInputCalls = targets.filter((c) => c.input === 'full')
  const groupingCalls = targets.filter(
    (
      c,
    ): c is FunctionCallQueryTarget & {
      groupingProjection: FunctionCallParameterProjection
    } => c.groupingProjection !== undefined,
  )
  const fromDate = UnixTime.toDate(from).toISOString()
  const toDate = UnixTime.toDate(to).toISOString()

  // To calculate the non-zero bytes we are grouping bytes by adding 'x' sign between each byte
  // and then removing all '00x' sequences. Next step is to divide length of result by 3 as this is length of '00x' sequence.
  const query = `
    WITH
      params AS (
        SELECT
          from_iso8601_timestamp('${fromDate}') AS t_start,
          from_iso8601_timestamp('${toDate}') AS t_end
      ),
      allowed_calls(to_addr, selector) AS (
        VALUES
          ${
            targets.length > 0
              ? targets
                  .map(
                    (c) =>
                      `(${c.address.toLowerCase()}, ${c.selector.toLowerCase()})`,
                  )
                  .join(',')
              : '(NULL, NULL)'
          }
      ),
      full_input_calls(to_addr, selector) AS (
        VALUES
          ${
            fullInputCalls.length > 0
              ? fullInputCalls
                  .map(
                    (c) =>
                      `(${c.address.toLowerCase()}, ${c.selector.toLowerCase()})`,
                  )
                  .join(',')
              : '(NULL, NULL)'
          }
      ),
      grouping_calls(to_addr, selector, grouping_start, grouping_length) AS (
        VALUES
          ${
            groupingCalls.length > 0
              ? groupingCalls
                  .map(
                    (c) =>
                      `(${c.address.toLowerCase()}, ${c.selector.toLowerCase()}, ${c.groupingProjection.start}, ${c.groupingProjection.length})`,
                  )
                  .join(',')
              : '(NULL, NULL, NULL, NULL)'
          }
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
        SELECT tr.*
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
        WHEN EXISTS (
          SELECT 1
          FROM full_input_calls fic
          WHERE tr.to = fic.to_addr
            AND tr.selector = fic.selector
        ) THEN tr.input
        ELSE tr.selector
      END AS input,
      CASE
        WHEN gc.grouping_start IS NOT NULL
        THEN varbinary_substring(
          tr.input,
          gc.grouping_start,
          gc.grouping_length
        )
        ELSE NULL
      END AS grouping_value
    FROM txs_filtered tx
    JOIN traces_allowed tr
      ON tx.hash = tr.tx_hash
    LEFT JOIN grouping_calls gc
      ON tr.to = gc.to_addr
      AND tr.selector = gc.selector;
  `

  return query
}
