import { Layer2 } from "../types/Layer2";

const shibarium: Layer2 = {
  name: "Shibarium",
  id: "shibarium",
  chain: "Shibarium",
  slug: "shibarium",
  layer1: "Ethereum",
  chainId: 109,
  website: "https://shib.io/",
  rpc: "https://shibrpc.com",
  explorer: "https://shibariumscan.io",
  supportsEIP1559: true,
  stakingAPI: "https://shibarium-api.shib.io",
  subgraphUrl: "https://thegraph.com/explorer/subgraphs/CWHxeaQWCSchW1BX5JHivrjythBwJYCxgkjGV6EhKwcs?v=0&view=Playground&chain=mainnet",
  contracts: {
    childChain: "0x32262DDD01fFF9bb367586317A5e40Dbe2bCcbe2",
    tokens: {
      WBONE: "0xC76F4c819D820369Fb2d7C1531aB3Bb18e6fE8d8",
      USDC: "0xf010f12dcA0b96D2d6685bf4dB3dbB4Ad500B6Ad",
      USDT: "0xaB082b8ad96c7f47ED70ED971Ce2116469954cFB",
      DAI: "0x0726959d22361B79e4D50A5D157b044A83eC870d",
      WBTC: "0xE984D89fb00D0B44E798A55dc41EA598B0b0899d",
      BONE: "0x0000000000000000000000000000000000001010",
      LEASH: "0x65218A41Fb92637254B4f8c97448d3dF343A3064",
      SHIB: "0x495eea66B0f8b636D441dC6a98d8F5C3D455C4c0",
    },
    heimdall: {
      chainId: "heimdall-109",
      api: "https://heimdall-api.shibrpc.com",
    },
    posContracts: {
      childChainManager: "0x5822EDe90177d2A4888379EEb0f2d39520914Cac",
      childChainManagerProxy: "0xc107664eeEEA2c84e51D56F1B7a479EbCf9541c4",
    },
    genesisContracts: {
      borValidatorSet: "0x0000000000000000000000000000000000001000",
      stateReceiver: "0x0000000000000000000000000000000000001001",
    },
    shibaswapContracts: {
      router: "0xEF83bbB63E8A7442E3a4a5d28d9bBf32D7c813c8",
      factory: "0xc2b4218F137e3A5A9B98ab3AE804108F0D312CBC",
    },
  },
  blockExplorers: [
    {
      name: "Shibarium Explorer",
      url: "https://shibariumscan.io",
    },
    {
      name: "Ethereum Explorer",
      url: "https://etherscan.io",
    },
  ],
  description: "Shibarium is a Layer 2 blockchain solution designed for the Shiba Inu ecosystem, providing fast and low-cost transactions for its users.",
  verification: {
    project: {
      name: "Shibarium",
      url: "https://shibarium.shib.io/",
    },
  },
  icon: "/icons/shibarium.png", // Add the PNG icon to the appropriate directory
};

export default shibarium;
