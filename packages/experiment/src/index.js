import Papa from "papaparse";
import { platforms } from "./platforms";
import { fetchJson, getOrCache, initDirectories } from "./utils";
import { getOrderedTopTokens } from "./tokens";
import { setTimeout } from "timers/promises";
import { writeFile } from "fs/promises";

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  await initDirectories();

  const tokens = await getOrderedTopTokens(8);

  const results = [];

  for (const [platform, platformInfo] of Object.entries(platforms)) {
    const platformTokens = tokens
      .filter((x) => x.platforms[platform] !== undefined)
      .map((x) => {
        const origin = Object.entries(x.platforms)[0];
        return {
          id: x.id,
          name: x.name,
          rank: x.rank,
          marketCap: x.marketCap,
          platform,
          address: x.platforms[platform],
          originPlatform: origin[0],
          originAddress: origin[1],
        };
      })
      .filter((x) => x.originPlatform !== "ethereum");

    for (const token of platformTokens) {
      if (platformInfo.apiKey) {
        const result = await getOrCache(
          `cache/contracts/${token.platform}-${token.address}.json`,
          async () => {
            const result = await fetchJson(
              `${platformInfo.apiUrl}?module=contract&action=getsourcecode&address=${token.address}&apikey=${platformInfo.apiKey}`
            );
            if (result.message !== "OK") {
              throw new Error(result.message);
            }
            await setTimeout(2000);
            return result.result;
          }
        );

        const data = Array.isArray(result) ? result[0] : result;
        token.contractName = data.ContractName;
      }

      results.push({
        Name: token.name,
        Coingecko: `https://www.coingecko.com/en/coins/${token.id}`,
        Rank: token.rank,
        "Market Cap": token.marketCap,
        Platform: token.platform,
        Contract: token.contractName,
        Address: `${platformInfo.explorer}/${token.address}`,
        Origin: token.originPlatform,
        "Origin Address": token.originAddress,
      });
    }

    await writeFile("out/version-3.csv", Papa.unparse(results));
  }
}
