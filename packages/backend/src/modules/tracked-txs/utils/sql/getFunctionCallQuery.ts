import { assert, type EthereumAddress, UnixTime } from '@l2beat/shared-pure'

export function getFunctionCallQuery(
  configs: {
    address: EthereumAddress
    selector: string
    /** How many bytes of the input to fetch, or all of them. */
    inputBytes: number | 'full'
  }[],
  from: UnixTime,
  to: UnixTime,
): string {
  const fromDate = UnixTime.toDate(from).toISOString()
  const toDate = UnixTime.toDate(to).toISOString()
  const uniqueConfigs = new Map<
    string,
    { address: string; selector: string; inputBytes: number | 'full' }
  >()
  for (const config of configs) {
    assert(
      config.inputBytes === 'full' ||
        (Number.isInteger(config.inputBytes) && config.inputBytes >= 4),
      'inputBytes must cover at least the selector',
    )
    const address = config.address.toLowerCase()
    const selector = config.selector.toLowerCase()
    const existing = uniqueConfigs.get(`${address}-${selector}`)
    if (existing === undefined) {
      uniqueConfigs.set(`${address}-${selector}`, {
        address,
        selector,
        inputBytes: config.inputBytes,
      })
    } else if (existing.inputBytes !== 'full') {
      existing.inputBytes =
        config.inputBytes === 'full'
          ? 'full'
          : Math.max(existing.inputBytes, config.inputBytes)
    }
  }

  // To calculate the non-zero bytes we are grouping bytes by adding 'x' sign between each byte
  // and then removing all '00x' sequences. Next step is to divide length of result by 3 as this is length of '00x' sequence.
  const query = `
    WITH
      params AS (
        SELECT
          from_iso8601_timestamp('${fromDate}') AS t_start,
          from_iso8601_timestamp('${toDate}') AS t_end
      ),
      allowed_calls(to_addr, selector, input_bytes) AS (
        VALUES
          ${
            uniqueConfigs.size > 0
              ? [...uniqueConfigs.values()]
                  // NULL input_bytes selects the full input in the CASE below.
                  .map(
                    (c) =>
                      `(${c.address}, ${c.selector}, ${c.inputBytes === 'full' ? 'NULL' : c.inputBytes})`,
                  )
                  .join(',')
              : '(NULL, NULL, NULL)'
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

  return query
}
