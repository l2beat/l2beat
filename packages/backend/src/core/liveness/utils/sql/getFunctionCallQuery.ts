import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

export function getFunctionCallQuery(
  contracts: EthereumAddress[],
  selectors: string[],
  from: UnixTime,
  to: UnixTime,
) {
  return [
    'SELECT',
    'block_number,',
    'LEFT(input, 10) AS input,',
    'to_address,',
    'block_timestamp,',
    'transaction_hash,',
    'FROM',
    'bigquery-public-data.crypto_ethereum.traces',
    'WHERE',
    "call_type = 'call'",
    'AND status = 1',
    `AND block_timestamp >= TIMESTAMP("${from.toDate().toISOString()}")`,
    `AND block_timestamp < TIMESTAMP("${to.toDate().toISOString()}")`,
    'AND',
    '(',
    ...contracts.map((address, i) => getBatch(address, selectors[i], i)),
    ')',
    'ORDER BY',
    'block_timestamp ASC;',
  ].join('\n')
}

function getBatch(to: EthereumAddress, selector: string, i: number) {
  let batch = ''
  if (i > 0) {
    batch += 'OR\n'
  }
  batch += `(to_address = LOWER('${to.toLocaleLowerCase()}')
AND input LIKE '${selector.toLocaleLowerCase()}%')`
  return batch
}
