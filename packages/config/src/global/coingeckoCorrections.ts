/**
 * Hours for which we publish a different price or circulating supply than
 * CoinGecko reports. TVS takes both from CoinGecko, and a wrong value there
 * becomes a wrong TVS on our pages, so each exception is listed here with the
 * evidence a reader needs to check it.
 *
 * The backend uses these values whenever it fetches the listed hours, and on
 * start overwrites what it already stored for them. A listed hour we no
 * longer keep, such as 03:00 on a day older than 100 days, gets no row. Every
 * other hour stays as fetched, because CoinGecko's history is not reliable
 * enough to replace all of a coin's stored data with it.
 *
 * Before adding an entry:
 * - It needs evidence, checkable without us, that CoinGecko's value is wrong.
 *   The same bar applies whoever proposes it and whichever way it moves TVS.
 * - Take the new value from CoinGecko's own data where that is sound (its
 *   later history, or the hours on both sides), otherwise from another
 *   market source, and name the source in `reason`.
 * - CoinGecko's public history reaches back one year, so links to it stop
 *   working. Also give a source that keeps its history, such as an exchange,
 *   or say in `reason` that there is none.
 * - List only hours where the value we store is wrong, and every one of
 *   them. An hour with no stored price or supply of its own is calculated
 *   from the latest older one, and is corrected only if it is listed too.
 * - Removing an entry does not bring back what CoinGecko reported. The stored
 *   value stays until that hour is fetched again.
 */
export interface CoingeckoCorrection {
  coingeckoId: string
  field: 'price' | 'circulatingSupply'
  /** What is wrong with CoinGecko's data, or with what we stored from it. */
  reason: string
  /** Sources that show the right value, each checkable without us. */
  evidence: string[]
  /** The value to use at each listed full hour. Other hours are untouched. */
  points: { at: string; value: number }[]
}

export const COINGECKO_CORRECTIONS: CoingeckoCorrection[] = [
  {
    coingeckoId: 'universal-btc',
    field: 'price',
    reason:
      "For 00:00 UTC on 22 days between 2026-03-27 and 2026-07-29 we stored a uniBTC price 7% to 51% above BTC, on seven of them the same $93,147. CoinGecko's history now has a price within 3% of BTC for each of those hours, so the values we fetched live were wrong. The values below are the ones CoinGecko reports now.",
    evidence: [
      'Until this correction, the stored price at each of those hours could be read from what we published: the uniBTC value for BOB, plus the value of the FBTC and WBTC held by 0x2ac98DB41Cbd3172CB7B8FD8A8Ab3b91cFe45dCf that it subtracts (under 0.002 BTC at those hours), divided by totalSupply() of 0x236f8c0a61dA474dB21B693fB2ea7AAB0c803894 on BOB.',
      'https://api.coingecko.com/api/v3/coins/universal-btc/market_chart/range?vs_currency=usd&from=1774483200&to=1781654400',
      'https://api.coingecko.com/api/v3/coins/universal-btc/market_chart/range?vs_currency=usd&from=1781654400&to=1785369600',
      'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&startTime=1774483200000&endTime=1785369600000',
    ],
    points: [
      { at: '2026-03-27T00:00:00Z', value: 68435.15 },
      { at: '2026-04-06T00:00:00Z', value: 68778.28 },
      { at: '2026-04-12T00:00:00Z', value: 72491.52 },
      { at: '2026-04-17T00:00:00Z', value: 74525.65 },
      { at: '2026-04-19T00:00:00Z', value: 75171.9 },
      { at: '2026-04-21T00:00:00Z', value: 75019.81 },
      { at: '2026-04-22T00:00:00Z', value: 74178.86 },
      { at: '2026-05-07T00:00:00Z', value: 80588.1 },
      { at: '2026-05-08T00:00:00Z', value: 80126.2 },
      { at: '2026-05-09T00:00:00Z', value: 80117.57 },
      { at: '2026-05-11T00:00:00Z', value: 81328.98 },
      { at: '2026-05-20T00:00:00Z', value: 76180.53 },
      { at: '2026-05-25T00:00:00Z', value: 76558.65 },
      { at: '2026-05-26T00:00:00Z', value: 77217.14 },
      { at: '2026-06-18T00:00:00Z', value: 63996.68 },
      { at: '2026-07-03T00:00:00Z', value: 60488.86 },
      { at: '2026-07-07T00:00:00Z', value: 63258.1 },
      { at: '2026-07-09T00:00:00Z', value: 62276.84 },
      { at: '2026-07-18T00:00:00Z', value: 63571.23 },
      { at: '2026-07-22T00:00:00Z', value: 65907.3 },
      { at: '2026-07-24T00:00:00Z', value: 64605.37 },
      { at: '2026-07-29T00:00:00Z', value: 63490.62 },
    ],
  },
  {
    coingeckoId: 'stakewise-v3-oseth',
    field: 'price',
    reason:
      "CoinGecko reports osETH at $1,545 from 2026-05-30 22:00 to 2026-05-31 01:00 UTC, and at $2,125 before and $2,128 after. ETH stayed between $2,022 and $2,034 through those hours and DefiLlama has osETH at $2,119 at 00:00, so the 27% drop is a feed error. We store one point a day that far back, so only 00:00 needs a value. CoinGecko's nearest sound hours are five hours apart, so the value is DefiLlama's.",
    evidence: [
      'https://api.coingecko.com/api/v3/coins/stakewise-v3-oseth/market_chart/range?vs_currency=usd&from=1780164000&to=1780207200',
      'https://coins.llama.fi/prices/historical/1780185600/ethereum:0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38',
      'https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=1h&startTime=1780164000000&endTime=1780207200000',
    ],
    points: [{ at: '2026-05-31T00:00:00Z', value: 2118.98 }],
  },
  {
    coingeckoId: 'geodnet',
    field: 'circulatingSupply',
    reason:
      "CoinGecko's market cap for GEOD doubles for the single hour 2026-06-27 00:00 UTC while its price stays at $0.197, which makes the circulating supply (market cap / price) 964M for that hour and 452M in the hours on both sides. The value below is the one from those neighboring hours. No other public source we found reports GEOD's circulating supply by the hour, and its total supply onchain is 1,000M, above both values, so once CoinGecko's public history no longer reaches this hour the value rests on this record.",
    evidence: [
      'https://api.coingecko.com/api/v3/coins/geodnet/market_chart/range?vs_currency=usd&from=1782432000&to=1782604800',
      'https://api.gateio.ws/api/v4/spot/candlesticks?currency_pair=GEOD_USDT&interval=1h&from=1782432000&to=1782604800',
    ],
    points: [{ at: '2026-06-27T00:00:00Z', value: 452_430_000 }],
  },
  {
    coingeckoId: 'nakamoto-games',
    field: 'price',
    reason:
      "From 2026-01-10 to 2026-03-27 CoinGecko reports NAKA at 1.5 to 4.7 times the price it traded at on KuCoin and Gate. On five days in that window (01-18, 02-10, 02-11, 03-12, 03-21) it matches them within 0.2%, so those are not listed. Before and after the window all three agree within 1%. The values below are KuCoin's daily opens at 00:00 UTC, which Gate's match within 1.3%.",
    evidence: [
      'https://api.coingecko.com/api/v3/coins/nakamoto-games/market_chart/range?vs_currency=usd&from=1767916800&to=1774742400',
      'https://api.kucoin.com/api/v1/market/candles?type=1day&symbol=NAKA-USDT&startAt=1767916800&endAt=1774742400',
      'https://api.gateio.ws/api/v4/spot/candlesticks?currency_pair=NAKA_USDT&interval=1d&from=1767916800&to=1774742400',
    ],
    points: [
      { at: '2026-01-10T00:00:00Z', value: 0.086 },
      { at: '2026-01-11T00:00:00Z', value: 0.1316 },
      { at: '2026-01-12T00:00:00Z', value: 0.1173 },
      { at: '2026-01-13T00:00:00Z', value: 0.101 },
      { at: '2026-01-14T00:00:00Z', value: 0.0991 },
      { at: '2026-01-15T00:00:00Z', value: 0.0978 },
      { at: '2026-01-16T00:00:00Z', value: 0.0928 },
      { at: '2026-01-17T00:00:00Z', value: 0.0961 },
      { at: '2026-01-19T00:00:00Z', value: 0.1063 },
      { at: '2026-01-20T00:00:00Z', value: 0.129 },
      { at: '2026-01-21T00:00:00Z', value: 0.1202 },
      { at: '2026-01-22T00:00:00Z', value: 0.1088 },
      { at: '2026-01-23T00:00:00Z', value: 0.1146 },
      { at: '2026-01-24T00:00:00Z', value: 0.1164 },
      { at: '2026-01-25T00:00:00Z', value: 0.0997 },
      { at: '2026-01-26T00:00:00Z', value: 0.0939 },
      { at: '2026-01-27T00:00:00Z', value: 0.1013 },
      { at: '2026-01-28T00:00:00Z', value: 0.0935 },
      { at: '2026-01-29T00:00:00Z', value: 0.0921 },
      { at: '2026-01-30T00:00:00Z', value: 0.0854 },
      { at: '2026-01-31T00:00:00Z', value: 0.086 },
      { at: '2026-02-01T00:00:00Z', value: 0.077 },
      { at: '2026-02-02T00:00:00Z', value: 0.0729 },
      { at: '2026-02-03T00:00:00Z', value: 0.0736 },
      { at: '2026-02-04T00:00:00Z', value: 0.0715 },
      { at: '2026-02-05T00:00:00Z', value: 0.0731 },
      { at: '2026-02-06T00:00:00Z', value: 0.072 },
      { at: '2026-02-07T00:00:00Z', value: 0.0767 },
      { at: '2026-02-08T00:00:00Z', value: 0.0727 },
      { at: '2026-02-09T00:00:00Z', value: 0.0737 },
      { at: '2026-02-12T00:00:00Z', value: 0.0693 },
      { at: '2026-02-13T00:00:00Z', value: 0.0684 },
      { at: '2026-02-14T00:00:00Z', value: 0.0738 },
      { at: '2026-02-15T00:00:00Z', value: 0.0785 },
      { at: '2026-02-16T00:00:00Z', value: 0.0739 },
      { at: '2026-02-17T00:00:00Z', value: 0.073 },
      { at: '2026-02-18T00:00:00Z', value: 0.0731 },
      { at: '2026-02-19T00:00:00Z', value: 0.0749 },
      { at: '2026-02-20T00:00:00Z', value: 0.0735 },
      { at: '2026-02-21T00:00:00Z', value: 0.077 },
      { at: '2026-02-22T00:00:00Z', value: 0.0788 },
      { at: '2026-02-23T00:00:00Z', value: 0.0736 },
      { at: '2026-02-24T00:00:00Z', value: 0.0679 },
      { at: '2026-02-25T00:00:00Z', value: 0.0649 },
      { at: '2026-02-26T00:00:00Z', value: 0.067 },
      { at: '2026-02-27T00:00:00Z', value: 0.065 },
      { at: '2026-02-28T00:00:00Z', value: 0.0633 },
      { at: '2026-03-01T00:00:00Z', value: 0.0639 },
      { at: '2026-03-02T00:00:00Z', value: 0.0605 },
      { at: '2026-03-03T00:00:00Z', value: 0.0619 },
      { at: '2026-03-04T00:00:00Z', value: 0.0629 },
      { at: '2026-03-05T00:00:00Z', value: 0.0633 },
      { at: '2026-03-06T00:00:00Z', value: 0.0629 },
      { at: '2026-03-07T00:00:00Z', value: 0.0614 },
      { at: '2026-03-08T00:00:00Z', value: 0.0594 },
      { at: '2026-03-09T00:00:00Z', value: 0.0593 },
      { at: '2026-03-10T00:00:00Z', value: 0.0603 },
      { at: '2026-03-11T00:00:00Z', value: 0.0603 },
      { at: '2026-03-13T00:00:00Z', value: 0.0599 },
      { at: '2026-03-14T00:00:00Z', value: 0.0596 },
      { at: '2026-03-15T00:00:00Z', value: 0.0595 },
      { at: '2026-03-16T00:00:00Z', value: 0.062 },
      { at: '2026-03-17T00:00:00Z', value: 0.0658 },
      { at: '2026-03-18T00:00:00Z', value: 0.065 },
      { at: '2026-03-19T00:00:00Z', value: 0.0622 },
      { at: '2026-03-20T00:00:00Z', value: 0.0608 },
      { at: '2026-03-22T00:00:00Z', value: 0.0597 },
      { at: '2026-03-23T00:00:00Z', value: 0.0581 },
      { at: '2026-03-24T00:00:00Z', value: 0.0591 },
      { at: '2026-03-25T00:00:00Z', value: 0.059 },
      { at: '2026-03-26T00:00:00Z', value: 0.0599 },
      { at: '2026-03-27T00:00:00Z', value: 0.0601 },
    ],
  },
]
