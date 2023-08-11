import fetch from "node-fetch";
import fs from "fs/promises";
import Papa from "papaparse";

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  await initCache();

  const tokens = await getAllTokens();
  const topTokens = await getTopTokens(8);

  // const platforms = new Set();
  // for (const entry of tokens) {
  //   for (const platform of Object.keys(entry.platforms)) {
  //     platforms.add(platform);
  //   }
  // }
  // console.log([...platforms].filter((x) => x.includes("p")).sort());

  const toCheck = [
    {
      name: "polygon-zkevm",
      key: "polygon-zkevm",
      explorer: "https://zkevm.polygonscan.com/address/",
    },
    {
      name: "arbitrum",
      key: "arbitrum-one",
      explorer: "https://arbiscan.io/address/",
    },
    {
      name: "optimism",
      key: "optimistic-ethereum",
      explorer: "https://optimistic.etherscan.io/address/",
    },
    {
      name: "zksync-era",
      key: "zksync",
      explorer: "https://explorer.zksync.io/address/",
    },
    { name: "base", key: "base", explorer: "https://basescan.org/address/" },
    {
      name: "mantle",
      key: "mantle",
      explorer: "https://explorer.mantle.xyz/address/",
    },
    {
      name: "metis",
      key: "metis-andromeda",
      explorer: "https://andromeda-explorer.metis.io/address/",
    },
    {
      name: "linea",
      key: "linea",
      explorer: "https://explorer.linea.build/address/",
    },
    { name: "boba", key: "boba", explorer: "https://bobascan.com/address/" },
  ];

  const relevantTokens = [];

  for (const platform of toCheck) {
    const externalTokens = getExternalTokens(
      tokens,
      topTokens,
      platform
    ).filter((x) => x.rank !== undefined);

    relevantTokens.push(
      ...externalTokens
        .filter((x) => x.rank < 1000)
        .map((x) => {
          const ogPlatform =
            Object.entries(
              tokens.find((y) => y.id === x.id)?.platforms ?? {}
            )[0] ?? [];
          return {
            ...x,
            platform: platform.key,
            ogPlatform: ogPlatform[0],
            ogAddress: ogPlatform[1],
          };
        })
    );

    await fs.writeFile(
      `out/chains/${platform.name}.csv`,
      Papa.unparse(externalTokens)
    );
  }

  await fs.writeFile(`out/version-2.csv`, Papa.unparse(relevantTokens));
}

function getExternalTokens(tokens, topTokens, platform) {
  const platformTokens = [];
  for (const entry of tokens) {
    if (entry.platforms[platform.key]) {
      platformTokens.push({
        id: entry.id,
        address: entry.platforms[platform.key],
        ethAddress: entry.platforms.ethereum,
        rank: topTokens.find((coin) => coin.id === entry.id)?.market_cap_rank,
      });
    }
  }

  return platformTokens
    .filter((x) => x.ethAddress === undefined)
    .sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity))
    .map((x) => ({
      id: x.id,
      link: "https://www.coingecko.com/en/coins/" + x.id,
      rank: x.rank,
      address: platform.explorer + x.address,
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

async function initCache() {
  try {
    await fs.mkdir("cache");
  } catch {}
}

async function getOrCache(fileName, get) {
  try {
    const data = await fs.readFile(fileName, "utf8");
    return JSON.parse(data);
  } catch {
    const data = await get();
    await fs.writeFile(fileName, JSON.stringify(data));
    return data;
  }
}

async function fetchJson(url) {
  const res = await fetch(url);
  return res.json();
}
