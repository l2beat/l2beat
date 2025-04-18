// commands/ZkGovProposal.ts
import { command, option, positional } from "cmd-ts";
import { ZkGovProposalAnalyzer } from "../implementations/zkgovproposal";
import { getProvider } from "../implementations/common/GetProvider";
import * as path from "path";

export const ZkGovProposal = command({
  name: "zkgovproposal",
  description: "Analyze ZKsync governance proposals and track them in their various stages.",
  args: {
    proposalId: positional({
      type: {
        async from(str) {
          return str;
        },
      },
      displayName: "proposalId",
      description: "The ZKsync proposal ID to analyze",
    }),
    outputMarkdown: option({
      type: {
        async from(str) {
          return str;
        },
      },
      long: "output",
      short: "o",
      description: "Optional. Path to write markdown output",
      defaultValue: () => "",
      defaultValueIsSerializable: true,
    }),
    executionDelay: option({
      type: {
        async from(str) {
          return parseInt(str, 10);
        },
      },
      long: "delay",
      short: "d",
      description: "Optional. Execution delay in hours from L2 to L1 (default: 3)",
      defaultValue: () => 3,
      defaultValueIsSerializable: true,
    }),
    zkSyncRpc: option({
      type: {
        async from(str) {
          return str;
        },
      },
      env: "ZKSYNC2_RPC_URL",
      long: "zksync-rpc",
      description: "ZKsync Era RPC URL",
      defaultValue: () => process.env.ZKSYNC2_RPC_URL || "",
      defaultValueIsSerializable: true,
    }),
    ethereumRpc: option({
      type: {
        async from(str) {
          return str;
        },
      },
      env: "ETHEREUM_RPC_URL",
      long: "ethereum-rpc",
      description: "Ethereum RPC URL",
      defaultValue: () => process.env.ETHEREUM_RPC_URL || "",
      defaultValueIsSerializable: true,
    }),
  },
  // commands/ZkGovProposal.ts - Improved provider initialization
handler: async (args) => {
  if (!args.zkSyncRpc) {
    console.error("ZKSYNC2_RPC_URL environment variable or --zksync-rpc option is required");
    process.exit(1);
  }

  if (!args.ethereumRpc) {
    console.error("ETHEREUM_RPC_URL environment variable or --ethereum-rpc option is required");
    process.exit(1);
  }

  console.log("Connecting to ZKSync RPC:", args.zkSyncRpc);
  console.log("Connecting to Ethereum RPC:", args.ethereumRpc);

  try {
    // Get providers with explicit network configuration
    const zkSyncConfig = {
      name: "zksync",
      rpcUrl: args.zkSyncRpc,
      chainId: 324, // ZKSync Era mainnet chainId
      explorer: {
        type: "etherscan" as const,
        url: "https://explorer.zksync.io",
        apiKey: "dummy", // Not needed for our use case
      }
    };

    const ethereumConfig = {
      name: "ethereum",
      rpcUrl: args.ethereumRpc,
      chainId: 1, // Ethereum mainnet chainId
      explorer: {
        type: "etherscan" as const,
        url: "https://etherscan.io",
        apiKey: "dummy", // Not needed for our use case
      }
    };

    console.log("Initializing L2 provider...");
    const l2Provider = await getProvider(args.zkSyncRpc, zkSyncConfig.explorer);

    console.log("Initializing L1 provider...");
    const l1Provider = await getProvider(args.ethereumRpc, ethereumConfig.explorer);

    // Verify connection
    console.log("Testing provider connections...");
    try {
      // Simple RPC call to test connections
      await l2Provider.raw("test-connection", async (providers) => {
        const blockNumber = await providers.baseProvider.getBlockNumber();
        console.log("Successfully connected to ZKSync (block height:", blockNumber, ")");
        return blockNumber;
      });

      await l1Provider.raw("test-connection", async (providers) => {
        const blockNumber = await providers.baseProvider.getBlockNumber();
        console.log("Successfully connected to Ethereum (block height:", blockNumber, ")");
        return blockNumber;
      });
    } catch (error) {
      console.error("Connection test failed:", error);
      process.exit(1);
    }

    // Initialize analyzer
    const analyzer = new ZkGovProposalAnalyzer(
      l2Provider,
      l1Provider,
      args.executionDelay
    );

    // Process the proposal
    await analyzer.analyzeProposal(args.proposalId, args.outputMarkdown);

  } catch (error) {
    console.error("Failed to initialize providers:", error);
    process.exit(1);
  }
}

});
