export interface NetworkConfig {
  addressManager: string
  fromBlock: number
}

export const config: Record<string, NetworkConfig> = {
  optimism: {
    addressManager: '0xdE1FCfB0851916CA5101820A69b13a4E276bd81F',
    fromBlock: 12686687,
  },
  boba: {
    addressManager: '0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089',
    fromBlock: 13011797,
  },
  metis: {
    addressManager: '0x918778e825747a892b17C66fe7D24C618262867d',
    fromBlock: 13625248,
  },
  nahmii: {
    addressManager: '0x7934915C03eA2E2C4D69c269F45598B738ddee08',
    fromBlock: 13308621,
  },
}
