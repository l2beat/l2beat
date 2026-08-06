import { assert, type EthereumAddress, UnixTime } from '@l2beat/shared-pure'

interface FunctionCallQueryConfig {
  address: EthereumAddress
  selector: string
  inputBytes: number | 'full'
}

export function getFunctionCallQuery(
  configs: readonly FunctionCallQueryConfig[],
  from: UnixTime,
  to: UnixTime,
): string {
  const calls = mergeCalls(configs)
  const fromDate = UnixTime.toDate(from).toISOString()
  const toDate = UnixTime.toDate(to).toISOString()

  // To calculate the non-zero bytes we are grouping bytes by adding 'x' sign between each byte
  // and then removing all '00x' sequences. Next step is to divide length of result by 3 as this is length of '00x' sequence.
  return `
    WITH
      params AS (
        SELECT
          from_iso8601_timestamp('${fromDate}') AS t_start,
          from_iso8601_timestamp('${toDate}') AS t_end
      ),
      allowed_calls(to_addr, selector, input_bytes) AS (
        VALUES
          ${
            calls.length > 0
              ? calls
                  .map(
                    (call) =>
                      `(${call.address.toLowerCase()}, ${call.selector}, ${call.inputBytes === 'full' ? 'CAST(NULL AS bigint)' : call.inputBytes})`,
                  )
                  .join(',')
              : '(CAST(NULL AS varbinary), CAST(NULL AS varbinary), CAST(NULL AS bigint))'
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
}

function mergeCalls(configs: readonly FunctionCallQueryConfig[]) {
  const calls = new Map<string, FunctionCallQueryConfig>()

  for (const config of configs) {
    assert(
      config.inputBytes === 'full' ||
        (Number.isInteger(config.inputBytes) && config.inputBytes >= 4),
      'inputBytes must cover at least the selector',
    )

    const address = config.address.toLowerCase()
    const selector = config.selector.toLowerCase()
    const key = `${address}-${selector}`
    const previous = calls.get(key)

    calls.set(key, {
      address: config.address,
      selector,
      inputBytes:
        previous === undefined
          ? config.inputBytes
          : widestInput(previous.inputBytes, config.inputBytes),
    })
  }

  return [...calls.values()]
}

function widestInput(
  left: number | 'full',
  right: number | 'full',
): number | 'full' {
  return left === 'full' || right === 'full' ? 'full' : Math.max(left, right)
}
