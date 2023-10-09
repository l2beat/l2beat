export function getMethodQuery(
  to_address: string[],
  method_id: string[],
  startTimestamp: string,
  endTimestamp: string,
) {
  return `
  SELECT
  block_number,
  input,
  to_address,
  block_timestamp,
  transaction_hash,
FROM 
  bigquery-public-data.crypto_ethereum.traces
WHERE
  call_type = 'call'
  AND status = 1  -- successful calls
  AND block_timestamp >= TIMESTAMP("${startTimestamp}")
  AND block_timestamp < TIMESTAMP("${endTimestamp}")
  AND 
  (
${to_address.map((address, i) => getBatch(address, method_id[i], i)).join('\n')}
  )
ORDER BY 
  block_timestamp ASC;
  `
}

function getBatch(to_address: string, method_id: string, i: number) {
  let batch = ''
  if (i > 0) {
    batch += ' OR\n'
  }
  batch += `    (to_address = LOWER('${to_address}')
    AND input LIKE '${method_id}%')`
  return batch
}
