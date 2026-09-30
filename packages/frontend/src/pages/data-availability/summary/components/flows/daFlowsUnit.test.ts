import { expect } from 'earl'
import { formatBlobs, getDaFlowsUnit } from './daFlowsUnit'

describe(formatBlobs.name, () => {
  it('keeps one decimal below ten blobs', () => {
    expect(formatBlobs(8.13)).toEqual('8.1 blobs')
    expect(formatBlobs(0.46)).toEqual('0.5 blobs')
  })

  it('drops the decimal from ten blobs on', () => {
    expect(formatBlobs(12.4)).toEqual('12 blobs')
    expect(formatBlobs(9.96)).toEqual('10 blobs')
  })

  it('counts a single blob as one', () => {
    expect(formatBlobs(1)).toEqual('1 blob')
    expect(formatBlobs(1.04)).toEqual('1 blob')
  })
})

describe(getDaFlowsUnit.name, () => {
  it('counts what is posted to Ethereum in blobs', () => {
    const unit = getDaFlowsUnit('ethereum')

    expect(unit.scale.base).toEqual(131_072)
    expect(unit.format(5 * 131_072)).toEqual('5 blobs')
  })

  it('counts what is posted elsewhere in bytes', () => {
    const unit = getDaFlowsUnit('celestia')

    expect(unit.scale.base).toEqual(256)
    expect(unit.format(2048)).toEqual('2.00 KiB')
  })
})
