import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { ethers, BigNumber } from 'ethers';
import pLimit from 'p-limit';
// Assuming ProjectDiscovery is correctly located relative to the script's execution path
import { ProjectDiscovery } from '../../src/discovery/ProjectDiscovery';
import fetch from 'node-fetch'; // Import node-fetch for making HTTP requests

dotenv.config();

// --- Configuration ---
const CONCURRENCY = 5; // Concurrency for RPC call
const CG_CONCURRENCY = 2; // Lower concurrency for CoinGecko API
const OUTPUT_DIR = 'scripts/socketcrawl/outfiles';
const VS_CURRENCY = 'usd'; // Target currency for price fetching

// --- Environment Variables ---
const ETHERSCAN_API_KEY: string | undefined = process.env.ETHEREUM_ETHERSCAN_API_KEY;
const RPC_URL: string | undefined = process.env.ETHEREUM_RPC_URL;
const COINGECKO_API_KEY: string | undefined = process.env.COINGECKO_API_KEY;

if (!RPC_URL) {
  throw new Error('Missing required environment variable: ETHEREUM_RPC_URL');
}
if (!COINGECKO_API_KEY) {
  console.warn(
    'Warning: COINGECKO_API_KEY not found in .env. USD price data will not be fetched.',
  );
}

// --- Providers and Limits ---
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const limit = pLimit(CONCURRENCY);
const cgLimit = pLimit(CG_CONCURRENCY); // Separate limiter for CoinGecko

// --- Mappings ---
const chainSlugToName: Record<string, string> = {
  1: 'Ethereum',
  5: 'Goerli',
  10: 'Optimism',
  56: 'BNB Chain',
  89: 'Viction testnet',
  137: 'Polygon',
  420: 'Optimism Goerli',
  647: 'Stavanger testnet',
  901: 'Lyra testnet',
  919: 'Mode testnet',
  957: 'Derive',
  1024: 'Parallel',
  1729: 'Reya Cronos Testnet',
  2999: 'Aevo',
  4665: 'Hook',
  5000: 'Mantle',
  7887: 'Kinto',
  8453: 'Base',
  8008: 'Polynomial', // polynomial.fi
  34443: 'Mode',
  42161: 'Arbitrum',
  80001: 'Polygon Mumbai testnet',
  81457: 'Blast',
  421613: 'Arbitrum Goerli',
  421614: 'Arbitrum Sepolia',
  777777: 'Zora',
  11155111: 'Sepolia',
  11155112: 'Aevo testnet',
  11155420: 'Optimism Sepolia',
  46658378: 'Hook testnet',
  686669576: 'SX Network Testnet',
  28122024: 'Ancient8 testnet2',
  1324967486: 'Reya',
  1399904803: 'XAI Testnet',
};

const ownerAddressToName: Record<string, string> = {
  '0x246d38588b16Dd877c558b245e6D5a711C649fCF': 'LyraMultisig',
  '0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82': 'KintoMultisig',
  '0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c': 'KintoEOA',
  '0x3B88D6a4CCBD93c22c211C7f6e3ea8b1D30f81BF': 'HookOwnerEOA',
  '0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34': 'socketadmin.eth EOA',
  '0xC8C57e4C73c71f72cA0a7e043E5D2D144F98ef13': 'LooksRareMultisig',
  '0xAeBF1Bc19Ed4Fdf509c456ab6c28D25C9Ca3B332': 'PolynomialEOA',
  '0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836': 'Socket EOA',
  '0xeeF6520437A6545b4F325F6675C4CD49812d457b': 'Socket EOA 2',
  '0x7B5Ba9Df17Bc58F504B6Cf0D87d2f05B79a36cfF': 'Socket EOA 3',
};

// --- ABIs ---
const PLUG_ABI = [
  'function hub__() view returns (address)',
  'function bridge__() view returns (address)',
  'function siblingChainSlug() view returns (uint32)',
  'function owner() view returns (address)',
];

const HUB_BRIDGE_ABI = [
  'function token__() view returns (address)',
  'function token() view returns (address)',
];

const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address account) view returns (uint256)',
];

// --- Interfaces ---
interface Erc20Info {
  name: string | null;
  symbol: string | null;
  decimals: number | null;
}

interface TokenInfo extends Erc20Info {
  address: string;
  tvl: number;
  tvlRaw?: string;
  usdPrice?: number | null; // Added optional price
  usdValue?: number; // Added optional USD value (tvl * price)
}

interface Result {
  plugAddress: string;
  hubOrBridgeAddress: string | null;
  siblingChainSlug: number | 'unknown';
  token: TokenInfo | null;
  owner: string | null;
  ownerName?: string;
  tags?: string[];
}

interface CoinGeckoPriceResponse {
  [contractAddressLowercase: string]: {
    [currencyLowercase: string]: number;
  };
}

// --- Helper Functions ---

async function safeContractCall<T = unknown>(
  contract: ethers.Contract,
  functionName: string,
  args: unknown[] = [],
  logContext?: string,
): Promise<T | null> {
  const context = logContext ? ` (${logContext})` : '';
  try {
    const result = await contract[functionName](...args);
    return result as T;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (!errorMessage.includes('call revert exception')) {
      console.error(
        `Failed to call ${functionName} on ${contract.address}${context}: ${errorMessage}`,
      );
    }
    return null;
  }
}

async function getERC20TokenInfo(
  tokenAddress: string,
): Promise<Erc20Info> {
  if (!ethers.utils.isAddress(tokenAddress)) {
    console.warn(`Invalid token address format: ${tokenAddress}`);
    return { name: null, symbol: null, decimals: null };
  }
  console.log(`Fetching ERC20 info for token ${tokenAddress}`);
  const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

  const [nameResult, symbolResult, decimalsResult] = await Promise.allSettled([
    safeContractCall<string>(tokenContract, 'name'),
    safeContractCall<string>(tokenContract, 'symbol'),
    safeContractCall<number>(tokenContract, 'decimals'),
  ]);

  const name = nameResult.status === 'fulfilled' ? nameResult.value : null;
  const symbol = symbolResult.status === 'fulfilled' ? symbolResult.value : null;
  const decimals =
    decimalsResult.status === 'fulfilled' ? decimalsResult.value : null;

  if (name === null || symbol === null || decimals === null) {
    console.warn(
      `Could not fetch full ERC20 info for ${tokenAddress}. Name: ${name}, Symbol: ${symbol}, Decimals: ${decimals}`,
    );
  } else {
    console.log(` -> Fetched: ${symbol} (${name}), Decimals: ${decimals}`);
  }

  return { name, symbol, decimals };
}

async function getTokenTVL(
  tokenAddress: string,
  decimals: number | null,
  account: string,
): Promise<{ tvl: number; tvlRaw: string | undefined }> {
  if (decimals === null) {
    console.warn(
      `Cannot fetch TVL for ${tokenAddress} held by ${account} without decimals.`,
    );
    return { tvl: 0, tvlRaw: undefined };
  }
  if (
    !ethers.utils.isAddress(tokenAddress) ||
    !ethers.utils.isAddress(account)
  ) {
    console.warn(
      `Invalid address format for TVL check. Token: ${tokenAddress}, Account: ${account}`,
    );
    return { tvl: 0, tvlRaw: undefined };
  }

  const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  const balanceRaw = await safeContractCall<BigNumber>(
    tokenContract,
    'balanceOf',
    [account],
    `Token: ${tokenAddress}, Holder: ${account}`,
  );

  if (balanceRaw === null || balanceRaw.isZero()) {
    return { tvl: 0, tvlRaw: balanceRaw?.toString() };
  }

  try {
    const tvl = parseFloat(ethers.utils.formatUnits(balanceRaw, decimals));
    console.log(` -> Balance fetched for ${tokenAddress} at ${account}: ${tvl}`);
    return { tvl, tvlRaw: balanceRaw.toString() };
  } catch (error) {
    console.error(
      `Error formatting balance for ${tokenAddress} at ${account}: ${error}`,
    );
    return { tvl: 0, tvlRaw: balanceRaw.toString() };
  }
}

/**
 * Fetches token prices from CoinGecko API in batches.
 * @param tokensToFetch - A map where keys are CoinGecko platform IDs and values are sets of token addresses on that platform.
 * @returns A map where keys are `platformId-tokenAddress` and values are USD prices.
 */
async function fetchTokenPrices(
  tokensToFetch: Map<string, Set<string>>,
): Promise<Map<string, number>> {
  if (!COINGECKO_API_KEY) {
    console.log('Skipping price fetch as CoinGecko API key is not configured.');
    return new Map();
  }

  console.log(
    `\nFetching USD prices from CoinGecko for ${tokensToFetch.size} platforms...`,
  );
  const priceMap = new Map<string, number>();
  const BATCH_SIZE = 100; // CoinGecko might have limits on query param length

  const fetchPromises: Promise<void>[] = [];

  for (const [platformId, addressesSet] of tokensToFetch.entries()) {
    if (addressesSet.size === 0) continue;
    console.log(`  Platform: ${platformId}, Tokens: ${addressesSet.size}`);

    const addresses = Array.from(addressesSet);

    for (let i = 0; i < addresses.length; i += BATCH_SIZE) {
      const batch = addresses.slice(i, i + BATCH_SIZE);
      const contractAddressesParam = batch.join(',');
      const url = `https://pro-api.coingecko.com/api/v3/simple/token_price/${platformId}?contract_addresses=${contractAddressesParam}&vs_currencies=${VS_CURRENCY}`;

      const fetchJob = cgLimit(async () => {
        console.log(`    Fetching batch for ${platformId} (${i + 1}-${Math.min(i + BATCH_SIZE, addresses.length)})...`);
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              accept: 'application/json',
              'x-cg-pro-api-key': COINGECKO_API_KEY!, // Safe non-null assertion due to check above
            },
          });

          if (!response.ok) {
             // Try reading body for more details if API provides it
             let errorBody = '';
             try {
                errorBody = await response.text();
             } catch (_) { /* ignore */ }
             console.error(
                `    CoinGecko API error for ${platformId} (batch ${i/BATCH_SIZE+1}): ${response.status} ${response.statusText}. Body: ${errorBody.slice(0, 200)}...`
             );
            return; // Skip this batch on error
          }

          const data = (await response.json()) as CoinGeckoPriceResponse;

          for (const [contractAddress, priceData] of Object.entries(data)) {
            if (priceData && typeof priceData[VS_CURRENCY] === 'number') {
              // Keys in response are lowercase contract addresses
              // Find the original casing if needed, but lowercase key is fine for map
              const price = priceData[VS_CURRENCY];
              priceMap.set(`${platformId}-${contractAddress.toLowerCase()}`, price);
              // console.log(`      -> Price for ${contractAddress} on ${platformId}: ${price}`);
            } else {
               console.warn(`      -> Price not found for ${contractAddress} on ${platformId} in response.`);
            }
          }
        } catch (error) {
          console.error(
            `    Failed to fetch or process CoinGecko data for ${platformId} (batch ${i/BATCH_SIZE+1}): ${error instanceof Error ? error.message : error}`,
          );
        }
      });
      fetchPromises.push(fetchJob);
    }
  }

  await Promise.all(fetchPromises);
  console.log(`CoinGecko price fetching complete. Found prices for ${priceMap.size} tokens.`);
  return priceMap;
}

async function explorePlugContract(address: string): Promise<Result | null> {
  if (!ethers.utils.isAddress(address)) {
    console.warn(`Invalid plug address format provided: ${address}. Skipping.`);
    return null;
  }
  console.log(`\nExploring plug contract at ${address}`);
  const plugContract = new ethers.Contract(address, PLUG_ABI, provider);

  const [hub, bridge, siblingChainSlugRaw, owner] = await Promise.all([
    safeContractCall<string>(plugContract, 'hub__'),
    safeContractCall<string>(plugContract, 'bridge__'),
    safeContractCall<number>(plugContract, 'siblingChainSlug'),
    safeContractCall<string>(plugContract, 'owner'),
  ]);

  const hubOrBridgeAddress = hub ?? bridge;
  const siblingChainSlug = siblingChainSlugRaw ?? 'unknown';
  const ownerAddress = owner ?? null;
  const ownerName = ownerAddress ? ownerAddressToName[ownerAddress] : undefined;

  console.log(
    `  Plug ${address}: Hub/Bridge: ${hubOrBridgeAddress ?? 'Not Found'}, Slug: ${siblingChainSlug}, Owner: ${ownerAddress ?? 'Not Found'}${ownerName ? ` (${ownerName})` : ''}`,
  );

  let tokenInfo: TokenInfo | null = null;

  if (hubOrBridgeAddress && ethers.utils.isAddress(hubOrBridgeAddress)) {
    const hubOrBridgeContract = new ethers.Contract(
      hubOrBridgeAddress,
      HUB_BRIDGE_ABI,
      provider,
    );
    const tokenAddress =
      (await safeContractCall<string>(hubOrBridgeContract, 'token__')) ??
      (await safeContractCall<string>(hubOrBridgeContract, 'token'));

    if (tokenAddress && ethers.utils.isAddress(tokenAddress)) {
      console.log(
        `  Found Token Address: ${tokenAddress} via Hub/Bridge ${hubOrBridgeAddress}`,
      );
      const erc20Info = await getERC20TokenInfo(tokenAddress);

      if (erc20Info.decimals !== null) {
        const { tvl, tvlRaw } = await getTokenTVL(
          tokenAddress,
          erc20Info.decimals,
          hubOrBridgeAddress,
        );
        tokenInfo = {
          address: tokenAddress,
          ...erc20Info,
          tvl,
          tvlRaw,
          // usdPrice and usdValue will be added later
        };
      } else {
        tokenInfo = {
          address: tokenAddress,
          ...erc20Info,
          tvl: 0,
        };
        console.warn(
          `  Could not calculate TVL for ${tokenAddress} due to missing decimals.`,
        );
      }
    } else {
      console.log(`  No token found for Hub/Bridge ${hubOrBridgeAddress}`);
    }
  } else {
    console.log(`  No valid Hub or Bridge address found for plug ${address}`);
  }

  return {
    plugAddress: address,
    hubOrBridgeAddress,
    siblingChainSlug,
    token: tokenInfo,
    owner: ownerAddress,
    ownerName,
  };
}

// --- Main Execution ---
async function main(): Promise<void> {
  console.log('Starting Socket plug exploration...');

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const resultFilePath = path.join(OUTPUT_DIR, 'socket-crawl-result.json');
  const copypastaFilePath = path.join(
    OUTPUT_DIR,
    'socket-crawl-copypasta.txt',
  );

  let plugs: string[] = [];
  try {
    const discovery = new ProjectDiscovery('socket');
    const discoveredPlugs = discovery.getContractValue<string[]>('Socket', 'plugs');
    if (!Array.isArray(discoveredPlugs) || !discoveredPlugs.every((p) => typeof p === 'string')) {
      throw new Error("Discovered 'plugs' is not an array of strings.");
    }
    plugs = discoveredPlugs;
    console.log(`Found ${plugs.length} plugs via ProjectDiscovery.`);
  } catch (error) {
    console.error(
      `Failed to get plugs from ProjectDiscovery: ${error instanceof Error ? error.message : error}`,
    );
    console.error(
      "Please ensure 'socket' project discovery is configured correctly and has run.",
    );
    process.exit(1);
  }

  const settledResults = await Promise.allSettled(
    plugs.map((address) => limit(() => explorePlugContract(address))),
  );
  console.log('\nExploration phase completed.');

  const successfulResults: Result[] = [];
  settledResults.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value !== null) {
      successfulResults.push(result.value);
    } else if (result.status === 'rejected') {
      console.error(
        `Exploration failed for plug ${plugs[index]}: ${result.reason}`,
      );
    }
  });

  console.log(
    `Successfully processed ${successfulResults.length} out of ${plugs.length} plugs initially.`,
  );

  // --- Collect Tokens for Price Fetching ---
  const tokensForPriceFetch = new Map<string, Set<string>>();
  if (COINGECKO_API_KEY) {
      successfulResults.forEach((result) => {
          // We need the *Ethereum* token address, which is associated with the L1 hub/bridge
          // The platform ID corresponds to the *sibling chain* where the plug resides? No, that's wrong.
          // The plug is on L1 (Ethereum), the hub/bridge is on L1, the token is on L1.
          // We need the price of the L1 token. So the platform is always 'ethereum'.
          // Let's rethink: The script runs against L1. The `hubOrBridgeAddress` holds the L1 token.
          // So, we only need the price of the token on Ethereum.
          if (result.token && result.token.address) {
              const platformId = 'ethereum'; // Assuming all discovered tokens are on Ethereum (L1)
              if (!tokensForPriceFetch.has(platformId)) {
                  tokensForPriceFetch.set(platformId, new Set<string>());
              }
              // Add the L1 token address
              tokensForPriceFetch.get(platformId)!.add(result.token.address);
          }
      });
  }


  // --- Fetch Prices ---
  const priceData = await fetchTokenPrices(tokensForPriceFetch);

  // --- Update Results with Prices and Calculate USD Value ---
  if (priceData.size > 0) {
    console.log('\nUpdating results with fetched prices and calculating USD values...');
    successfulResults.forEach((result) => {
      if (result.token && result.token.address) {
        // Key should be platformId-tokenAddress (lowercase)
        const priceKey = `ethereum-${result.token.address.toLowerCase()}`;
        const price = priceData.get(priceKey);

        if (price !== undefined) {
          result.token.usdPrice = price;
          result.token.usdValue = result.token.tvl * price;
          // console.log(`  Updated ${result.token.symbol || result.token.address}: Price=${price}, Value=${result.token.usdValue}`);
        } else {
           result.token.usdPrice = null; // Explicitly set to null if not found
           result.token.usdValue = 0; // Treat as 0 value if price is missing
           // console.log(`  Price not found for ${result.token.symbol || result.token.address}`);
        }
      } else if (result.token) {
        // Ensure usdValue is 0 if there's no price
        result.token.usdValue = 0;
      }
    });
    console.log('Price update complete.');
  } else {
      console.log('\nSkipping price update step as no price data was fetched.');
      // Ensure usdValue is initialized to 0 if prices weren't fetched
      successfulResults.forEach((result) => {
          if (result.token) {
              result.token.usdValue = 0;
          }
      });
  }

  // --- Grouping and Sorting by USD Value ---
  console.log('\nGrouping results by sibling chain and sorting by USD value...');
  const groupedResults = successfulResults.reduce<{ [key: string]: Result[] }>(
    (acc, result) => {
      const slugKey = result.siblingChainSlug.toString();
      if (!acc[slugKey]) acc[slugKey] = [];
      acc[slugKey].push(result);
      return acc;
    },
    {},
  );

  // Sort within each group by USD TVL (descending)
  Object.keys(groupedResults).forEach((key) => {
    groupedResults[key].sort(
      (a, b) => (b.token?.usdValue ?? 0) - (a.token?.usdValue ?? 0),
    );
  });
  console.log('Grouping and sorting complete.');

  // --- Tagging (Multiplug/Multiproject) ---
  const hubUsage = new Map<string, { count: number; slugs: Set<number | 'unknown'> }>();
  successfulResults.forEach((result) => {
    if (result.hubOrBridgeAddress) {
      const addr = result.hubOrBridgeAddress;
      if (!hubUsage.has(addr)) {
        hubUsage.set(addr, { count: 0, slugs: new Set() });
      }
      const entry = hubUsage.get(addr)!;
      entry.count++;
      entry.slugs.add(result.siblingChainSlug);
    }
  });

  successfulResults.forEach((result) => {
    if (result.hubOrBridgeAddress) {
      const entry = hubUsage.get(result.hubOrBridgeAddress);
      if (entry) {
        result.tags = result.tags || [];
        if (entry.count > 1) result.tags.push('multiplug');
        if (entry.slugs.size > 1) result.tags.push('multiproject');
      }
    }
  });

  // --- Write Detailed JSON Output ---
  console.log(`Writing detailed results to ${resultFilePath}`);
  try {
    // Use replacer to handle BigInt serialization if tvlRaw is included
    // const replacer = (key: string, value: any) => typeof value === 'bigint' ? value.toString() : value;
    // fs.writeFileSync(resultFilePath, JSON.stringify(groupedResults, replacer, 2));
    // Simpler approach if tvlRaw is not critical in JSON:
    fs.writeFileSync(resultFilePath, JSON.stringify(groupedResults, null, 2));
    console.log('Detailed results successfully written.');
  } catch (error) {
    console.error(`Error writing ${resultFilePath}: ${error}`);
  }

  // --- Generate Copy-Pasta File ---
  console.log(`Generating copy-paste suggestions to ${copypastaFilePath}`);
  const copypastaSections: { [key: string]: string[] } = {
    initialAddresses: [],
    names: [],
    ignoreMethods: [],
    escrows: [],
  };
  // Use the already sorted keys from groupedResults based on USD value
  const projectOrder = Object.keys(groupedResults);

  const addedHubsPerProject = new Map<string, Set<string>>();

  for (const slug of projectOrder) {
    const resultsForSlug = groupedResults[slug];
    // Use name mapping, fallback to slug
    const slugName = chainSlugToName[slug] || `UnknownChain(${slug})`;
    const projectInitialAddresses: string[] = [];
    const projectNames: string[] = [];
    const projectIgnoreMethods: string[] = [];
    const projectEscrows: string[] = [];
    let projectCommentAdded = false;

    if (!addedHubsPerProject.has(slugName)) {
      addedHubsPerProject.set(slugName, new Set<string>());
    }
    const currentProjectAddedHubs = addedHubsPerProject.get(slugName)!;

    resultsForSlug.forEach((result) => {
      // Filter: Only include entries with a valid hub/bridge, a token, and positive *raw* TVL
      // We include based on token amount, not USD value, as some tokens might not have prices but still hold funds
      if (
        result.hubOrBridgeAddress &&
        result.token &&
        result.token.tvl > 0 // Filter based on non-zero token amount
      ) {
        if (currentProjectAddedHubs.has(result.hubOrBridgeAddress)) {
          return;
        }

        if (!projectCommentAdded) {
          const projectHeader = `\n    // --- ${slugName} ---`; // Keep this style
          projectInitialAddresses.push(projectHeader);
          projectNames.push(projectHeader);
          projectIgnoreMethods.push(projectHeader);
          projectEscrows.push(projectHeader);
          projectCommentAdded = true;
        }

        const hubAddr = result.hubOrBridgeAddress;
        const tokenSymbol = result.token.symbol ?? result.token.address.slice(0, 6);
        const tokenName = result.token.name ?? 'Unknown Token';
        const vaultName = `${tokenSymbol} Vault (${slugName})`;
        const ownerNameStr =
          result.ownerName ??
          (result.owner ? `Unknown Owner (${result.owner.slice(0, 6)}...)` : 'Unknown Owner');

        projectInitialAddresses.push(`    "${hubAddr}",`);
        projectNames.push(`    "${hubAddr}": "${vaultName}",`);
        projectIgnoreMethods.push(
          `    "${vaultName}": ${JSON.stringify({ ignoreMethods: ['token', 'token__', 'hook__'] })},`,
        );
        // Refined escrow string generation (no normal comments, no upgradableBy)
        projectEscrows.push(
          `    discovery.getEscrowDetails({
      address: EthereumAddress('${hubAddr}'),
      name: '${vaultName}',
      description: 'Socket Vault holding ${tokenName} (${tokenSymbol}) associated with ${slugName}. Owned by ${ownerNameStr}.',
      tokens: ['${tokenSymbol}'],
    }),`
        );

        currentProjectAddedHubs.add(hubAddr);
      }
    });

    if (projectInitialAddresses.length > 1) {
      copypastaSections.initialAddresses.push(...projectInitialAddresses);
      copypastaSections.names.push(...projectNames);
      copypastaSections.ignoreMethods.push(...projectIgnoreMethods);
      copypastaSections.escrows.push(...projectEscrows);
    }
  }

  // Assemble the final copypasta string
  const outputLines = [
    `// === config.jsonc additions ===`,
    `\n"initialAddresses": [`,
    ...copypastaSections.initialAddresses.map(line => line.replace(/,\s*$/, '')), // Remove trailing commas for last element
    `],`,

    `\n"names": {`,
    ...copypastaSections.names.map(line => line.replace(/,\s*$/, '')), // Remove trailing commas
    `},`,

    `\n"ignoreMethods": {`,
    ...copypastaSections.ignoreMethods.map(line => line.replace(/,\s*$/, '')), // Remove trailing commas
    `},`,

    `\n\n// === socket.ts additions (inside discovery object) ===`,
    `\nescrows: [`,
    ...copypastaSections.escrows.map(line => line.replace(/,\s*$/, '')), // Remove trailing commas
    `],`,
  ];

   // Fix trailing commas after headers before closing brackets/braces
  const cleanOutputLines = outputLines.map((line, index, arr) => {
      // If a line ends with a header comment and the next line is a closing bracket/brace, remove the comma
      if (line.trim().startsWith('// ---') && line.trim().endsWith(',')) {
          const nextLine = arr[index + 1]?.trim();
          if (nextLine === '],' || nextLine === '},') {
              return line.replace(/,\s*$/, '');
          }
      }
      // If the last actual entry line before a closing bracket/brace has a comma, remove it
      if (line.trim().endsWith(',')) {
          const nextLine = arr[index + 1]?.trim();
           if (nextLine === '],' || nextLine === '},' || nextLine === '],') { // Check for closing bracket/brace
               // Make sure the current line isn't JUST a header comment
               if (!line.trim().startsWith('// ---')) {
                   return line.replace(/,\s*$/, '');
               }
           }
      }

      return line;
  });


  try {
    fs.writeFileSync(copypastaFilePath, cleanOutputLines.join('\n'));
    console.log('Copy-paste suggestions successfully written.');
  } catch (error) {
    console.error(`Error writing ${copypastaFilePath}: ${error}`);
  }

  provider.removeAllListeners();
  console.log('\nScript finished.');
}

// --- Run Main ---
main().catch((error) => {
  console.error('\nUnhandled error in main execution:', error);
  process.exit(1);
});