// NOTE(radomski): This should be removed. It's only here because config is in
// a transitional period where the way it works is not yet where we would want
// it to be. In ProjectDiscovery we need to have access to the url of the
// explorer for different chains but we can't access layer2s/layer3s/bridges
// since entries of these arrays are being built by ProjectDiscovery.
//
// The ideal solution that config will employ is a three pass approach.
//
// - The first pass reads in the data required for operation.
// - The second pass builds each project
// - The third pass links up projects between each other, e.g. DA Bridges used
// by projects.
//
// In the third pass we'll understand what projects are available and we can
// inline the explorer url at that time.

export const EXPLORER_URLS: Record<string, string> = {
  ethereum: 'https://etherscan.io',
  zksync2: 'https://era.zksync.network',
  arbitrum: 'https://arbiscan.io',
  nova: 'https://nova.arbiscan.io',
  optimism: 'https://optimistic.etherscan.io',
  base: 'https://basescan.org',
  linea: 'https://lineascan.build',
  mantapacific: 'https://pacific-explorer.manta.network',
  mantle: 'https://explorer.mantle.xyz',
  scroll: 'https://scrollscan.com',
  blast: 'https://blastscan.io',
  unichain: 'https://uniscan.xyz',
  ink: 'https://explorer.inkonchain.com',
  everclear: 'https://scan.everclear.org',
  kinto: 'https://explorer.kinto.xyz',
  taiko: 'https://taikoscan.io',
  facet: 'https://explorer.facet.org',
  gateway: 'https://gateway.explorer.zksync.io',
  gnosis: 'https://gnosisscan.io',
  zircuit: 'https://explorer.zircuit.com',
  metis: 'https://andromeda-explorer.metis.io',
  ethereal: 'https://explorer.ethereal.trade',
  sepolia: 'https://sepolia.etherscan.io',
}
