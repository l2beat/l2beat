import { expect } from 'earl'

import { getTransferQuery } from './getTransferQuery'

describe('getTransferQuery', () => {
  it('should return valid SQL query', () => {
    const from_address = ['0x1234567890abcdef', '0xabcdef1234567890']
    const to_address = ['0xabcdef1234567890', '0x1234567890abcdef']
    const startTimestamp = '2022-01-01T00:00:00Z'
    const endTimestamp = '2022-01-02T00:00:00Z'
    const expectedQuery = `
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
    (from_address = LOWER('0x1234567890abcdef')
  AND to_address = LOWER('0xabcdef1234567890'))
 OR
    (from_address = LOWER('0xabcdef1234567890')
  AND to_address = LOWER('0x1234567890abcdef'))
  )
ORDER BY 
  block_timestamp ASC;
  `
    const result = getTransferQuery(
      from_address,
      to_address,
      startTimestamp,
      endTimestamp,
    )
    expect(result).toEqual(expectedQuery)
  })
})
