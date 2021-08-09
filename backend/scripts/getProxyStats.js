const { utils, providers } = require('ethers')

// EIP-1967 Transparent Proxy
const IMPLEMENTATION_SLOT =
  '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'
const ADMIN_SLOT =
  '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103'

const ADDRESS = '0xC12BA48c781F6e392B49Db2E25Cd0c28cD77531A'

main()
async function main() {
  const provider = new providers.AlchemyProvider()

  const resultA = await provider.getStorageAt(ADDRESS, IMPLEMENTATION_SLOT)
  const resultB = await provider.getStorageAt(ADDRESS, ADMIN_SLOT)

  const implementation = toAddress(resultA)
  const admin = toAddress(resultB)

  console.log('address:', ADDRESS)
  console.log('implementation:', implementation)
  console.log('admin:', admin)
}

function toAddress(uint256) {
  return utils.getAddress('0x' + uint256.slice(26))
}
