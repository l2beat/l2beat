import { expect } from "earl";
import { calculateValue } from "./calculateValue";

describe(calculateValue.name, () => {
  const testCases = [
    {
      amount: 100_000_000n,
      priceUsd: 0.019,
      decimals: 6,
      expected: 190n // 1.9 USD
    },
    {
      amount: 1_000_000n,
      priceUsd: 0.00000019,
      decimals: 0,
      expected: 19n // 0.19 USD
    },
    {
      amount: 1_000_000n,
      priceUsd: 0.00000019,
      decimals: 1,
      expected: 1n // 0.019 USD
    },
    {
      amount: 1_000_000n,
      priceUsd: 0.00000019,
      decimals: 2,
      expected: 0n // 0.0019 USD
    },
  ]

  for (const t of testCases) {
    it(`amount: ${t.amount}, price: ${t.priceUsd}, decimals: ${t.decimals}`, () => {

      const result = calculateValue(t)

      expect(result).toEqual(t.expected)
    })
  }
})