import { expect } from 'earl'
import { computeAmbire, parseMetaMask, parseRabby } from './wallets'

describe('wallet tips', () => {
  it("reads MetaMask's options, in gwei", () => {
    const option = (tip: string) => ({ suggestedMaxPriorityFeePerGas: tip })

    expect(
      parseMetaMask({
        low: option('0.001'),
        medium: option('1.5'),
        high: option('2'),
        estimatedBaseFee: '0.3',
      }).map((t) => [t.wallet, t.option, t.tier, t.tipGwei]),
    ).toEqual([
      ['MetaMask', 'low', 'slow', 0.001],
      ['MetaMask', 'medium', 'medium', 1.5],
      ['MetaMask', 'high', 'fast', 2],
    ])
  })

  it("reads Rabby's options, in wei", () => {
    const tips = parseRabby([
      { level: 'slow', priority_price: 1e8 },
      { level: 'normal', priority_price: 1e9 },
      { level: 'fast', priority_price: 2e9 },
      { level: 'custom' },
    ])

    expect(tips.map((t) => [t.option, t.tier, t.tipGwei])).toEqual([
      ['slow', 'slow', 0.1],
      ['normal', 'medium', 1],
      ['fast', 'fast', 2],
    ])
  })

  it('fails when Rabby leaves out an option', () => {
    expect(() => parseRabby([{ level: 'slow', priority_price: 1 }])).toThrow(
      'Wallet option missing',
    )
  })

  it("runs Ambire's rule: medians, the node's tip, 25% steps", () => {
    const tips = computeAmbire(
      [
        [0.1, 0.2, 0.3],
        [0, 0.4, 0.5],
        [0.3, 0.6, 0.7],
      ],
      0.15,
    )

    // Slow: median of 0.1 and 0.3 (zeros left out) is 0.2, above the node's 0.15
    expect(tips.map((t) => t.tipGwei)).toEqual([0.2, 0.4, 0.5])
  })
})
