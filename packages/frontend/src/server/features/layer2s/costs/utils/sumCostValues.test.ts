import { expect } from 'earl'
import { sumCostValues } from './sumCostValues'

describe('sumValues', () => {
  it('should sum single record correctly', () => {
    const records = [
      {
        overheadGas: 100,
        calldataGas: 200,
        computeGas: 300,
        blobsGas: 400,
        overheadGasEth: 1.1,
        calldataGasEth: 2.2,
        computeGasEth: 3.3,
        blobsGasEth: 4.4,
        overheadGasUsd: 10.1,
        calldataGasUsd: 20.2,
        computeGasUsd: 30.3,
        blobsGasUsd: 40.4,
      },
    ]

    const result = sumCostValues(records)

    expect(result).toEqual({
      gas: {
        overhead: 100,
        calldata: 200,
        compute: 300,
        blobs: 400,
      },
      eth: {
        overhead: 1.1,
        calldata: 2.2,
        compute: 3.3,
        blobs: 4.4,
      },
      usd: {
        overhead: 10.1,
        calldata: 20.2,
        compute: 30.3,
        blobs: 40.4,
      },
    })
  })

  it('should sum multiple records correctly', () => {
    const records = [
      {
        overheadGas: 100,
        calldataGas: 200,
        computeGas: 300,
        blobsGas: 400,
        overheadGasEth: 1.1,
        calldataGasEth: 2.5,
        computeGasEth: 3.3,
        blobsGasEth: 4.4,
        overheadGasUsd: 10.1,
        calldataGasUsd: 20.2,
        computeGasUsd: 30.3,
        blobsGasUsd: 40.4,
      },
      {
        overheadGas: 50,
        calldataGas: 60,
        computeGas: 70,
        blobsGas: 80,
        overheadGasEth: 0.5,
        calldataGasEth: 0.6,
        computeGasEth: 0.7,
        blobsGasEth: 0.8,
        overheadGasUsd: 5.0,
        calldataGasUsd: 6.0,
        computeGasUsd: 7.0,
        blobsGasUsd: 8.0,
      },
    ]

    const result = sumCostValues(records)

    expect(result).toEqual({
      gas: {
        overhead: 150,
        calldata: 260,
        compute: 370,
        blobs: 480,
      },
      eth: {
        overhead: 1.6,
        calldata: 3.1,
        compute: 4.0,
        blobs: 5.2,
      },
      usd: {
        overhead: 15.1,
        calldata: 26.2,
        compute: 37.3,
        blobs: 48.4,
      },
    })
  })

  it('should handle empty records array', () => {
    const result = sumCostValues([])

    expect(result).toEqual({
      gas: {
        overhead: 0,
        calldata: 0,
        compute: 0,
        blobs: null,
      },
      eth: {
        overhead: 0,
        calldata: 0,
        compute: 0,
        blobs: null,
      },
      usd: {
        overhead: 0,
        calldata: 0,
        compute: 0,
        blobs: null,
      },
    })
  })

  it('should handle null blob values correctly', () => {
    const records = [
      {
        overheadGas: 100,
        calldataGas: 200,
        computeGas: 300,
        blobsGas: null,
        overheadGasEth: 1.1,
        calldataGasEth: 2.2,
        computeGasEth: 3.3,
        blobsGasEth: null,
        overheadGasUsd: 10.1,
        calldataGasUsd: 20.2,
        computeGasUsd: 30.3,
        blobsGasUsd: null,
      },
    ]

    const result = sumCostValues(records)

    expect(result).toEqual({
      gas: {
        overhead: 100,
        calldata: 200,
        compute: 300,
        blobs: null,
      },
      eth: {
        overhead: 1.1,
        calldata: 2.2,
        compute: 3.3,
        blobs: null,
      },
      usd: {
        overhead: 10.1,
        calldata: 20.2,
        compute: 30.3,
        blobs: null,
      },
    })
  })

  it('should handle mixed null and defined blob values', () => {
    const records = [
      {
        overheadGas: 100,
        calldataGas: 200,
        computeGas: 300,
        blobsGas: 400,
        overheadGasEth: 1.1,
        calldataGasEth: 2.5,
        computeGasEth: 3.3,
        blobsGasEth: 4.4,
        overheadGasUsd: 10.1,
        calldataGasUsd: 20.2,
        computeGasUsd: 30.3,
        blobsGasUsd: 40.4,
      },
      {
        overheadGas: 50,
        calldataGas: 60,
        computeGas: 70,
        blobsGas: null,
        overheadGasEth: 0.5,
        calldataGasEth: 0.6,
        computeGasEth: 0.7,
        blobsGasEth: null,
        overheadGasUsd: 5.0,
        calldataGasUsd: 6.0,
        computeGasUsd: 7.0,
        blobsGasUsd: null,
      },
    ]

    const result = sumCostValues(records)

    expect(result).toEqual({
      gas: {
        overhead: 150,
        calldata: 260,
        compute: 370,
        blobs: 400,
      },
      eth: {
        overhead: 1.6,
        calldata: 3.1,
        compute: 4.0,
        blobs: 4.4,
      },
      usd: {
        overhead: 15.1,
        calldata: 26.2,
        compute: 37.3,
        blobs: 40.4,
      },
    })
  })
})
