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
    { name: "polygon-zkevm", key: "polygon-zkevm" },
    { name: "arbitrum", key: "arbitrum-one" },
    { name: "optimism", key: "optimistic-ethereum" },
    { name: "zksync-era", key: "zksync" },
    { name: "base", key: "base" },
    { name: "mantle", key: "mantle" },
    { name: "metis", key: "metis-andromeda" },
    { name: "linea", key: "linea" },
    { name: "boba", key: "boba" },
  ];

  for (const { name, key } of toCheck) {
    const externalTokens = getExternalTokens(tokens, topTokens, key);
    await fs.writeFile(`out/${name}.csv`, Papa.unparse(externalTokens));
  }
}

function getExternalTokens(tokens, topTokens, platform) {
  const platformTokens = [];
  for (const entry of tokens) {
    if (entry.platforms[platform]) {
      platformTokens.push({
        id: entry.id,
        address: entry.platforms[platform],
        ethAddress: entry.platforms.ethereum,
        rank: topTokens.find((coin) => coin.id === entry.id)?.market_cap_rank,
      });
    }
  }

  return platformTokens
    .filter((x) => x.ethAddress === undefined)
    .sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity))
    .map((x) => ({ id: x.id, rank: x.rank, address: x.address }));
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
