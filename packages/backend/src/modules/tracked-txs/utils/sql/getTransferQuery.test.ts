import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import range from 'lodash/range'

import { getTransferQuery } from './getTransferQuery'

describe(getTransferQuery.name, () => {
  it('should return valid SQL query', () => {
    const ADDRESS_1 = EthereumAddress.random()
    const ADDRESS_2 = EthereumAddress.random()
    const ADDRESS_3 = EthereumAddress.random()
    const ADDRESS_4 = EthereumAddress.random()
    const query = getTransferQuery(
      [
        { from: ADDRESS_1, to: ADDRESS_2 },
        { from: ADDRESS_3, to: ADDRESS_4 },
      ],
      UnixTime.fromDate(new Date('2021-01-01Z')),
      UnixTime.fromDate(new Date('2021-01-02Z')),
    )

    expect(query.query).toEqual(`
    SELECT DISTINCT
      txs.hash,
      traces.from_address,
      traces.to_address,
      txs.block_number,
      txs.block_timestamp,
      txs.receipt_gas_used,
      txs.gas_price,
      txs.receipt_blob_gas_used,
      txs.receipt_blob_gas_price,
      (LENGTH(SUBSTR(txs.input, 3)) / 2) AS data_length,
      (LENGTH(REPLACE(REGEXP_REPLACE(SUBSTR(txs.input, 3), '([0-9A-Fa-f]{2})', '\\\\1x'), '00x', '')) / 3) AS non_zero_bytes,
    FROM
      bigquery-public-data.crypto_ethereum.transactions AS txs
    JOIN
      bigquery-public-data.crypto_ethereum.traces AS traces
    ON
      traces.status = 1
      AND txs.hash = traces.transaction_hash
      AND traces.call_type = 'call'
      AND traces.block_timestamp >= TIMESTAMP(?)
      AND traces.block_timestamp <= TIMESTAMP(?)
      AND (
        ${range(2)
          .map(() => '(traces.from_address = ? AND traces.to_address = ?)')
          .join(' OR ')}
      )
    WHERE
      txs.block_timestamp >= TIMESTAMP(?)
      AND txs.block_timestamp <= TIMESTAMP(?)
  `)
    expect(query.params).toEqual([
      new Date('2021-01-01Z').toISOString(),
      new Date('2021-01-02Z').toISOString(),
      ADDRESS_1.toLowerCase(),
      ADDRESS_2.toLowerCase(),
      ADDRESS_3.toLowerCase(),
      ADDRESS_4.toLowerCase(),
      new Date('2021-01-01Z').toISOString(),
      new Date('2021-01-02Z').toISOString(),
    ])

    expect(query.limitInGb).toEqual(10)
  })

  it('should return valid SQL query when from address empty', () => {
    const ADDRESS_1 = EthereumAddress.random()
    const ADDRESS_2 = EthereumAddress.random()
    const ADDRESS_3 = EthereumAddress.random()
    const query = getTransferQuery(
      [{ from: ADDRESS_1, to: ADDRESS_2 }, { to: ADDRESS_3 }],
      UnixTime.fromDate(new Date('2021-01-01Z')),
      UnixTime.fromDate(new Date('2021-01-02Z')),
    )

    expect(query.query).toEqual(`
    SELECT DISTINCT
      txs.hash,
      traces.from_address,
      traces.to_address,
      txs.block_number,
      txs.block_timestamp,
      txs.receipt_gas_used,
      txs.gas_price,
      txs.receipt_blob_gas_used,
      txs.receipt_blob_gas_price,
      (LENGTH(SUBSTR(txs.input, 3)) / 2) AS data_length,
      (LENGTH(REPLACE(REGEXP_REPLACE(SUBSTR(txs.input, 3), '([0-9A-Fa-f]{2})', '\\\\1x'), '00x', '')) / 3) AS non_zero_bytes,
    FROM
      bigquery-public-data.crypto_ethereum.transactions AS txs
    JOIN
      bigquery-public-data.crypto_ethereum.traces AS traces
    ON
      traces.status = 1
      AND txs.hash = traces.transaction_hash
      AND traces.call_type = 'call'
      AND traces.block_timestamp >= TIMESTAMP(?)
      AND traces.block_timestamp <= TIMESTAMP(?)
      AND (
        (traces.from_address = ? AND traces.to_address = ?) OR (traces.to_address = ?)
      )
    WHERE
      txs.block_timestamp >= TIMESTAMP(?)
      AND txs.block_timestamp <= TIMESTAMP(?)
  `)
    expect(query.params).toEqual([
      new Date('2021-01-01Z').toISOString(),
      new Date('2021-01-02Z').toISOString(),
      ADDRESS_1.toLowerCase(),
      ADDRESS_2.toLowerCase(),
      ADDRESS_3.toLowerCase(),
      new Date('2021-01-01Z').toISOString(),
      new Date('2021-01-02Z').toISOString(),
    ])

    expect(query.limitInGb).toEqual(10)
  })
})
