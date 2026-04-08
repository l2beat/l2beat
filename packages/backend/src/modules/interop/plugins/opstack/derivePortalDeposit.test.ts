import { expect } from 'earl'
import { derivePortalDeposit } from './derivePortalDeposit'

describe(derivePortalDeposit.name, () => {
  it('derives the source hash and L2 tx hash from the worked example', () => {
    const derived = derivePortalDeposit({
      from: WORKED_EXAMPLE.from,
      to: WORKED_EXAMPLE.to,
      version: 0n,
      opaqueData: WORKED_EXAMPLE.opaqueData,
      blockHash: WORKED_EXAMPLE.blockHash,
      logIndex: WORKED_EXAMPLE.logIndex,
    })

    expect(derived).not.toEqual(undefined)
    if (!derived) {
      return
    }

    expect(derived.sourceHash).toEqual(WORKED_EXAMPLE.sourceHash)
    expect(derived.l2TxHash).toEqual(WORKED_EXAMPLE.l2TxHash)
    expect(derived.mint).toEqual(82180496084697442374n)
    expect(derived.value).toEqual(82180496084697442374n)
    expect(derived.gasLimit).toEqual(100000n)
    expect(derived.data).toEqual('0x')
  })
})

const WORKED_EXAMPLE = {
  l2TxHash:
    '0x95e44b32a03c8e146a9b4a70b3934b4efb48f3f2188e4304dc6e66f52ce4d8b8',
  sourceHash:
    '0xb613781250a490c408694b600c1443b4b0f12e13792551b9aa12703dfb17f879',
  blockHash:
    '0x55102b6e8f5ceb9803bfd78b9ec84ffd3e34156c821b7690f4c2b045a9696944',
  logIndex: 514,
  from: '0xf70da97812CB96acDF810712Aa562db8dfA3dbEF',
  to: '0xf70da97812CB96acDF810712Aa562db8dfA3dbEF',
  opaqueData:
    '0x000000000000000000000000000000000000000000000004747bc5c731c56846000000000000000000000000000000000000000000000004747bc5c731c5684600000000000186a000',
} as const
