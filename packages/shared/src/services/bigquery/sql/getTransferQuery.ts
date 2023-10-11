import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

export function getTransferQuery(
  senders: EthereumAddress[],
  receivers: EthereumAddress[],
  from: UnixTime,
  to: UnixTime,
) {
  return [
    'SELECT',
    'block_number,',
    'from_address,',
    'to_address,',
    'block_timestamp,',
    'transaction_hash,',
    'FROM',
    'bigquery-public-data.crypto_ethereum.traces',
    'WHERE',
    "call_type = 'call'",
    'AND status = 1',
    `AND block_timestamp >= TIMESTAMP('${from.toDate().toISOString()}')`,
    `AND block_timestamp < TIMESTAMP('${to.toDate().toISOString()}')`,
    'AND ',
    '(',
    ...senders.map((address, i) => getBatch(address, receivers[i], i)),
    ')',
    'ORDER BY ',
    'block_timestamp ASC;',
  ].join('\n')
}

function getBatch(from: EthereumAddress, to: EthereumAddress, i: number) {
  let batch = ''
  if (i > 0) {
    batch += 'OR\n'
  }
  batch += `(from_address = LOWER('${from.toLocaleLowerCase()}')
AND to_address = LOWER('${to.toLocaleLowerCase()}'))`
  return batch
}
