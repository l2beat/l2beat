import { expect } from 'earl'
import { GetRequestsResponse } from './RelayApiClient'

describe('GetRequestsResponse', () => {
  it('normalizes null app fee fields', () => {
    const result = GetRequestsResponse.parse(RESPONSE_WITH_NULL_APP_FEES)

    expect(result.requests[0]?.data.appFees).toEqual([EMPTY_APP_FEE])
    expect(result.requests[0]?.data.paidAppFees).toEqual([EMPTY_APP_FEE])
  })
})

const EMPTY_APP_FEE = {
  recipient: undefined,
  bps: undefined,
  amount: undefined,
  amountUsd: undefined,
  amountUsdCurrent: undefined,
}

const RESPONSE_WITH_NULL_APP_FEES = {
  requests: [
    {
      id: '0x7dccf8381df9cd420b00f2cb336997a37ff68909dbee198fb9cecd7fecd957f8',
      data: {
        appFees: [
          {
            recipient: null,
            bps: null,
            amount: null,
            amountUsd: null,
            amountUsdCurrent: null,
          },
        ],
        paidAppFees: [
          {
            recipient: null,
            bps: null,
            amount: null,
            amountUsd: null,
            amountUsdCurrent: null,
          },
        ],
      },
      createdAt: '2026-08-18T17:51:19.308Z',
      updatedAt: '2026-08-18T17:52:03.279Z',
    },
  ],
}
