export function getTransferQuery(
  from_address: string[],
  to_address: string[],
  startTimestamp: string,
  endTimestamp: string,
) {
  return `
SELECT
  block_number,
  to_address,
  block_timestamp,
  transaction_hash,
FROM 
  bigquery-public-data.crypto_ethereum.traces
WHERE
  call_type = 'call'  -- 'call' type indicates an internal call
  AND status = 1  -- successful calls
  AND block_timestamp >= TIMESTAMP("${startTimestamp}")
  AND block_timestamp < TIMESTAMP("${endTimestamp}")
  AND 
  (
${from_address
  .map((address, i) => getBatch(address, to_address[i], i))
  .join('\n')}
  )
ORDER BY 
  block_timestamp ASC;
  `
}

function getBatch(from_address: string, to_address: string, i: number) {
  let batch = ''
  if (i > 0) {
    batch += ' OR\n'
  }
  batch += `    (from_address = LOWER('${from_address}')
  AND to_address = LOWER('${to_address}'))`
  return batch
}
