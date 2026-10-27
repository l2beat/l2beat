import { expect } from 'earl'
import { getDepositChains } from './depositChains'

describe(getDepositChains.name, () => {
  it('maps each portal to the L2 chain id of its SystemConfig', () => {
    expect(
      getDepositChains([
        {
          values: {
            optimismPortal: 'eth:0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2',
            l2ChainId: 130,
          },
        },
        {
          values: {
            optimismPortal: 'eth:0x1111111111111111111111111111111111111111',
          },
        },
        { values: { optimismPortal: 'UNRESOLVED', l2ChainId: 10 } },
        {
          values: {
            optimismPortal: 'eth:0x2222222222222222222222222222222222222222',
            l2ChainId: 0,
          },
        },
        {},
      ]),
    ).toEqual({ 'eth:0x0bd48f6b86a26d3a217d0fa6ffe2b491b956a7a2': 130 })
  })
})
