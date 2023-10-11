import { expect } from 'earl'

import { getMethodQuery } from './getMethodQuery'

describe('getMethodQuery', () => {
  it('should return valid SQL query', () => {
    const to_address = ['0x1234567890abcdef', '0xabcdef1234567890']
    const method_id = ['0xabcdef', '0x123456']
    const startTimestamp = '2022-01-01T00:00:00Z'
    const endTimestamp = '2022-01-02T00:00:00Z'
    const expectedQuery = `
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
    (to_address = LOWER('0x1234567890abcdef')
    AND input LIKE '0xabcdef%')
 OR
    (to_address = LOWER('0xabcdef1234567890')
    AND input LIKE '0x123456%')
  )
ORDER BY 
  block_timestamp ASC;
  `
    const result = getMethodQuery(
      to_address,
      method_id,
      startTimestamp,
      endTimestamp,
    )
    expect(result).toEqual(expectedQuery)
  })
})
