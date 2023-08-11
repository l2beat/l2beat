import { getOrCache, fetchJson } from "./utils";

export async function getOrderedTopTokens(pages) {
  const tokens = await getAllTokens();
  const topTokens = await getTopTokens(pages);

  return topTokens.map((x) => ({
    ...tokens.find((y) => y.id === x.id),
    rank: x.market_cap_rank,
    marketCap: x.market_cap,
  }));
}

async function getAllTokens() {
  return await getOrCache("cache/tokens.json", () =>
    fetchJson(
      "https://api.coingecko.com/api/v3/coins/list?include_platform=true"
    )
  );
}

async function getTopTokens(pages) {
  const topTokens = [];

  for (let i = 1; i <= pages; i++) {
    const from = (i - 1) * 250 + 1;
    const to = i * 250;

    const result = await getOrCache(`cache/coins-${from}-${to}.json`, () =>
      fetchJson(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${i}&sparkline=false&locale=en`
      )
    );

    topTokens.push(...result);
  }

  return topTokens;
}
