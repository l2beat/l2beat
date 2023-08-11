import dotenv from "dotenv";

dotenv.config();

export const platforms = {
  "polygon-zkevm": {
    explorer: "https://zkevm.polygonscan.com/address/",
    apiUrl: "https://api-zkevm.polygonscan.com/api",
    apiKey: process.env.ZKEVM_POLYGONSCAN_API_KEY,
  },
  "arbitrum-one": {
    explorer: "https://arbiscan.io/address/",
    apiUrl: "https://api.arbiscan.io/api",
    apiKey: process.env.ARBISCAN_API_KEY,
  },
  "optimistic-ethereum": {
    explorer: "https://optimistic.etherscan.io/address/",
    apiUrl: "https://api-optimistic.etherscan.io/api",
    apiKey: process.env.OPTIMISTIC_ETHERSCAN_API_KEY,
  },
  zksync: {
    explorer: "https://explorer.zksync.io/address/",
  },
  mantle: {
    explorer: "https://explorer.mantle.xyz/address/",
  },
  "metis-andromeda": {
    explorer: "https://andromeda-explorer.metis.io/address/",
  },
  linea: {
    explorer: "https://explorer.linea.build/address/",
  },
};
