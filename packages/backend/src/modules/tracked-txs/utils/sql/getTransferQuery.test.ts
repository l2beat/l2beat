import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { range } from 'lodash'

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
    CREATE TEMP FUNCTION CalculateCalldataGasUsed(hexString STRING)
    RETURNS INT64
    LANGUAGE js AS """
      var nonZeroBytes = 0;
      var zeroBytes = 0;

      for (var i = 2; i < hexString.length; i += 2) {
        if(hexString.substr(i, 2)==='00') {
          zeroBytes++;
        } else {
          nonZeroBytes++;
        }
      }

      return 16 * nonZeroBytes + 4 * zeroBytes;
    """;

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
      CalculateCalldataGasUsed(txs.input) AS calldata_gas_used,
      (LENGTH(SUBSTR(txs.input, 3)) / 2) AS data_length,
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
          .map(() => `(traces.from_address = ? AND traces.to_address = ?)`)
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
})
