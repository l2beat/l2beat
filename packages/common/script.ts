import { providers } from 'ethers'
import { solidityKeccak256 } from 'ethers/lib/utils'

const ALCHEMY_KEY = 'eW0p8v0ghrgWPOwvVtuHdiH4g-Pr35LB'
const STARK_EXCHANGE = '0x82123571C8a5e0910280C066bc634c4945FFcbC8'
const SLOTS = [
  'governanceInfo', // mapping(string => GovernanceInfoStruct)
  'initializationHash_DEPRECATED', // mapping(address => bytes32)
  'enabledTime', // mapping(bytes32 => uint256)
  'initialized', // mapping(bytes32 => bool)
  'escapeVerifierAddress_and_stateFrozen', // address + bool
  'unFreezeTime', // uint256
  'pendingDeposits', // mapping(uint256 => mapping(uint256 => mapping(uint256 => uint256)))
  'cancellationRequests', // mapping(uint256 => mapping(uint256 => mapping(uint256 => uint256)))
  'pendingWithdrawals', // mapping(uint256 => mapping(uint256 => uint256))
  'escapesUsed', // mapping(uint256 => bool)
  'escapesUsedCount', // uint256
  'fullWithdrawalRequests_DEPRECATED', // mapping(uint256 => mapping(uint256 => uint256))
  'sequenceNumber', // uint256
  'vaultRoot', // uint256
  'vaultTreeHeight', // uint256
  'orderRoot', // uint256
  'orderTreeHeight', // uint256
  'tokenAdmins', // mapping(address => bool)
  'userAdmins_DEPRECATED', // mapping(address => bool)
  'operators', // mapping(address => bool)
  'assetTypeToAssetInfo', // mapping(uint256 => bytes)
  'registeredAssetType', // mapping(uint256 => bool)
  'assetTypeToQuantum', // mapping(uint256 => uint256)
  'starkKeys_DEPRECATED', // mapping(address => uint256)
  'ethKeys', // mapping(uint256 => address)
  'verifiersChain_list', // address[]
  'verifiersChain_unlockedForRemovalTime', // mapping(address => uint256)
  'availabilityVerifiersChain_list', // address[]
  'availabilityVerifiersChain_unlockedForRemovalTime', // mapping(address => uint256)
  'lastBatchId', // uint256
  'subContracts', // mapping(uint256 => address)
  'permissiveAssetType_DEPRECATED', // mapping(uint256 => bool)
  'onchainDataVersion', // uint256
  'forcedRequestsInBlock', // mapping(uint256 => uint256)
  'forcedActionRequests', // mapping(bytes32 => uint256)
  'actionsTimeLock', // mapping(bytes32 => uint256)
  'actionHashList', // bytes32[]
  '__endGap', // uint256[LAYOUT_LENGTH - 37] private
]

main()
async function main() {
  const provider = new providers.AlchemyProvider('mainnet', ALCHEMY_KEY)
  // for (const [i, name] of SLOTS.entries()) {
  //   const value = await provider.getStorageAt(STARK_EXCHANGE, i)
  //   console.log(i.toString().padStart(3, '0'), name, value)
  // }

  function getUintMappingSlot(variable: string, index: number) {
    const bytes = '0x' + BigInt(index).toString(16).padStart(64, '0')
    return solidityKeccak256(
      ['bytes32', 'uint256'],
      [bytes, SLOTS.indexOf(variable)]
    )
  }

  const slot = getUintMappingSlot('subContracts', 6)
  const value = await provider.getStorageAt(STARK_EXCHANGE, slot)
  console.log(value)
}
