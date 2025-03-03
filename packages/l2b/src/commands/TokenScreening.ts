import { command, restPositionals } from 'cmd-ts'
import dotenv from 'dotenv'
import { Contract, utils as ethersUtils, providers } from 'ethers'
import { rpcUrl } from './args'
import { EthereumAddressValue } from './types'

dotenv.config()

const utils = {
    getRpcUrl(chain: string): string {
    const envVar = `${chain.toUpperCase()}_RPC_URL`
    const rpcUrl = process.env[envVar]
    if (!rpcUrl) {
        throw new Error(`RPC URL for chain ${chain} not found in .env file`)
    }
    return rpcUrl
    },

  getEtherscanUrl(chainName: string, contractAddress: string, apiKey: string): string | null {
    const envKey = `${chainName.toUpperCase()}_ETHERSCAN_API_URL`;
    const baseUrl = process.env[envKey];
    
    if (!baseUrl) {
      console.error(`No Etherscan API URL found for ${chainName}`);
      return null;
    }

    return `${baseUrl}/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`;
  },

  async getContractABIAndName(contractAddress: string, chainName: string) {
    const apiKey = this.getApiKey(chainName);
    if (!apiKey) {
      throw new Error('Missing API key');
    }
    const url = this.getEtherscanUrl(chainName, contractAddress, apiKey);
    try {
      if (!url) {
        throw new Error('Invalid chain name');
      }
      const response = await fetch(url);
      const rawData: unknown = await response.json();
      
      function isEtherscanApiResponse(data: unknown): data is EtherscanApiResponse {
        return (
          typeof data === 'object' && 
          data !== null &&
          'status' in data &&
          'message' in data &&
          'result' in data &&
          Array.isArray((data as any).result) &&
          (data as any).result.length > 0 &&
          'ABI' in (data as any).result[0]
        );
      }

      if (!isEtherscanApiResponse(rawData)) {
        throw new Error('Invalid API response format');
      }

      const data = rawData; 
      if (data?.status === '1' && data?.message === 'OK') {
        const abi = JSON.parse(data.result[0].ABI);
        return data.result[0];
      } else {
        throw new Error('ABI not found.');
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  getApiKey(chainName: string): string | null {
    const envKey = `${chainName.toUpperCase()}_ETHERSCAN_API_KEY`;
    const apiKey = process.env[envKey];
    return apiKey || null;
  },
}

interface DiscoveredContract {
  name: string;
  address: string;
}

interface DiscoveredJson {
  contracts: DiscoveredContract[];
}

// Add interface for Etherscan API response
interface EtherscanApiResponse {
  status: string;
  message: string;
  result: Array<{
    ABI: string;
    ContractName?: string;
  }>;
}

export const TokenScreening = command({
  name: 'token-screening',
  description: 'Finds L2 token classification for L1 tokens',
  args: {
    tokenAddresses: restPositionals({
      type: EthereumAddressValue,
      displayName: 'tokenAddresses',
    }),
    rpcUrl,
  },
  handler: async (args) => {
    const chains = ['arbitrum', 'optimism']
    
    // Load discovered.json files to get escrow addresses
    const escrows: { [key: string]: string[] } = {};
    for (const chain of chains) {
      const discoveredPath = `../../../config/discovery/${chain}/ethereum/discovered.json`;
      const discovered = require(discoveredPath);
      escrows[chain] = [getCanonicalEscrow(discovered, chain)];
    }

    for (const tokenAddress of args.tokenAddresses) {
      console.log(`\nL1 Token: ${tokenAddress}`)
      for (const chain of chains) {
        const l2Address = await getL2TokenAddress(tokenAddress.toString(), chain, args.rpcUrl, escrows)
        console.log(`${chain.charAt(0).toUpperCase() + chain.slice(1)}: ${l2Address || 'Not Found'}`)
        
        if (l2Address) {
          const supplyInfo = await getTokenSupplyInfo(tokenAddress.toString(), l2Address, chain, escrows, args.rpcUrl)
          console.log(supplyInfo)
          if (supplyInfo) {
            console.log(`  L1 Supply: ${supplyInfo.l1Supply}`)
            console.log(`  L2 Supply: ${supplyInfo.l2Supply}`)
            console.log(`  Escrow Balance: ${supplyInfo.escrowBalance}`)
            console.log(`  Type: ${supplyInfo.type}`)
          }
        }
      }
    }
  },
})

function getCanonicalEscrow(discovered: DiscoveredJson, network: string): string {
  // Find either L1ERC20Gateway or L1StandardBridge contract
  const gatewayContract = discovered.contracts.find(
    (contract: { name: string }) => 
      contract.name === 'L1ERC20Gateway' || contract.name === 'L1StandardBridge'
  )

  if (!gatewayContract) {
    throw new Error(`No L1ERC20Gateway or L1StandardBridge contract found for ${network}`)
  }

  return gatewayContract.address
}

async function getL2TokenAddress(
  l1TokenAddress: string,
  network: string,
  baseRpcUrl: string,
  escrows?: { [key: string]: string[] }
): Promise<string | null> {
  try {
    let canonicalEscrowAddress: string;
    
    if (escrows && escrows[network]?.[0]) {
      canonicalEscrowAddress = escrows[network][0];
    } else {
      // Dynamically load the discovered.json file based on network
      const discoveredPath = `../../../config/discovery/${network}/ethereum/discovered.json`
      const discovered = require(discoveredPath)
      canonicalEscrowAddress = getCanonicalEscrow(discovered, network)
    }

    const escrowInterface = new ethersUtils.Interface([
      'function calculateL2TokenAddress(address l1Token) view returns (address)',
      'function getTokenWrappedAddress(uint256 chainId, address l1Token) view returns (address)',
      'event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)',
    ])

    const provider = new providers.JsonRpcProvider(utils.getRpcUrl('ethereum'))
    const escrowContract = new Contract(canonicalEscrowAddress, escrowInterface, provider)

    try {
      if (network === 'arbitrum') {
        const result = await escrowContract.calculateL2TokenAddress(l1TokenAddress)
        return result;
      } else if (network === 'optimism') {
        const result = await escrowContract.getTokenWrappedAddress(1, l1TokenAddress)
        return result;
      }
    } catch (error) {
      // Fallback to events if direct call fails
    }

    const filter = escrowContract.filters.ERC20DepositInitiated(
      l1TokenAddress,
      null,
      null,
      null,
      null,
      null,
    )
    const events = await escrowContract.queryFilter(filter)
    if (events && events.length > 0 && events[0].args) {
      return events[0].args[1]
    }

    throw new Error('Could not determine L2 token address')
  } catch (error) {
    // console.error(`Error getting L2 token address: ${error}`)
    return null
  }
}

async function getTokenSupplyInfo(l1Address: string, l2Address: string, network: string, escrows: { [key: string]: string[] }, rpcUrl: string) {
    try {
        const l1Provider = new providers.JsonRpcProvider(utils.getRpcUrl('ethereum'));
        const l2Provider = new providers.JsonRpcProvider(utils.getRpcUrl(network));
        
        const tokenInterface = new ethersUtils.Interface([
            "function totalSupply() view returns (uint256)",
            "function balanceOf(address) view returns (uint256)",
            "function decimals() view returns (uint8)"
        ]);

        const l2Token = new Contract(l2Address, tokenInterface, l2Provider);
        const l2Supply = await l2Token.totalSupply();
        const l1Token = new Contract(l1Address, tokenInterface, l1Provider);
        const l1Supply = await l1Token.totalSupply();
        const decimals = await l1Token.decimals();
        const escrowAddress = escrows[network]?.[0];
        const escrowBalance = await l1Token.balanceOf(escrowAddress);
        
        const adjustedL2Supply = ethersUtils.formatUnits(l2Supply, decimals);
        const adjustedEscrowBalance = ethersUtils.formatUnits(escrowBalance, decimals);
        
        return {
            l1Supply: ethersUtils.formatUnits(l1Supply, decimals),
            l2Supply: adjustedL2Supply,
            escrowBalance: adjustedEscrowBalance,
            type: Number(adjustedL2Supply) > 1 && Number(adjustedL2Supply) <= Number(adjustedEscrowBalance) ? 
                  "Canonical Token" : "Weird Token"
        };
    } catch (error) {
        return null;
    }
}

export { utils }
