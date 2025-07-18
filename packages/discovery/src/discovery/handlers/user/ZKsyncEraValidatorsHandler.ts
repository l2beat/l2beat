import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { utils } from 'ethers'
import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'

export type ZKsyncEraValidatorsHandlerDefinition = v.infer<
  typeof ZKsyncEraValidatorsHandlerDefinition
>
export const ZKsyncEraValidatorsHandlerDefinition = v.strictObject({
  type: v.literal('zksynceraValidators'),
})

const upgradeCompleteSignature1 =
  'UpgradeComplete(uint256 indexed newProtocolVersion, bytes32 indexed l2UpgradeTxHash, tuple(tuple(uint256 txType, uint256 from, uint256 to, uint256 gasLimit, uint256 gasPerPubdataByteLimit, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, uint256 paymaster, uint256 nonce, uint256 value, uint256[4] reserved, bytes data, bytes signature, uint256[] factoryDeps, bytes paymasterInput, bytes reservedDynamic) l2ProtocolUpgradeTx, bytes[] factoryDeps, bytes32 bootloaderHash, bytes32 defaultAccountHash, address verifier, tuple(bytes32 recursionNodeLevelVkHash, bytes32 recursionLeafLevelVkHash, bytes32 recursionCircuitsSetVksHash) verifierParams, bytes l1ContractsUpgradeCalldata, bytes postUpgradeCalldata, uint256 upgradeTimestamp, uint256 newProtocolVersion) upgrade)'

// new UpgradeComplete event since 2025-03-12 (emitted [here](https://app.blocksec.com/explorer/tx/eth/0x2c6aa40efd0500a015b036cf03de961b6e2aa2c726d21b5b8cede9a91964c12f?line=28)
const upgradeCompleteSignature2 =
  'UpgradeComplete(uint256 indexed newProtocolVersion, bytes32 indexed l2UpgradeTxHash, tuple(tuple(uint256 txType, uint256 from, uint256 to, uint256 gasLimit, uint256 gasPerPubdataByteLimit, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, uint256 paymaster, uint256 nonce, uint256 value, uint256[4] reserved, bytes data, bytes signature, uint256[] factoryDeps, bytes paymasterInput, bytes reservedDynamic) l2ProtocolUpgradeTx, bytes32 bootloaderHash, bytes32 defaultAccountHash, address verifier, tuple(bytes32 recursionNodeLevelVkHash, bytes32 recursionLeafLevelVkHash, bytes32 recursionCircuitsSetVksHash) verifierParams, bytes l1ContractsUpgradeCalldata, bytes postUpgradeCalldata, uint256 upgradeTimestamp, uint256 newProtocolVersion) upgrade)'

// NOTE(radomski): The DiamondCut interface allows the initialize function to
// be anything. It changes from time to time and has to be manually updated.
const initializeFunctions = [
  'initialize(tuple(uint256 chainId, address bridgehub, address stateTransitionManager, uint256 protocolVersion, address admin, address validatorTimelock, address baseToken, address baseTokenBridge, bytes32 storedBatchZero, address verifier, tuple(bytes32 recursionNodeLevelVkHash, bytes32 recursionLeafLevelVkHash, bytes32 recursionCircuitsSetVksHash) verifierParams, bytes32 l2BootloaderBytecodeHash, bytes32 l2DefaultAccountBytecodeHash, uint256 priorityTxMaxGasLimit, tuple(uint8 pubdataPricingMode, uint32 batchOverheadL1Gas, uint32 maxPubdataPerBatch, uint32 maxL2GasPerBatch, uint32 priorityTxMaxPubdata, uint64 minimalL2GasPrice) feeParams, address blobVersionedHashRetriever) _initializeData) returns (bytes32)',

  // Taken from: https://etherscan.io/address/0x877a3c97705c5d1a6fd7f3ed84d9a74de737c64a
  'initialize(tuple(uint256 chainId, address bridgehub, address chainTypeManager, uint256 protocolVersion, address admin, address validatorTimelock, bytes32 baseTokenAssetId, bytes32 storedBatchZero, address verifier, tuple(bytes32 recursionNodeLevelVkHash, bytes32 recursionLeafLevelVkHash, bytes32 recursionCircuitsSetVksHash) verifierParams, bytes32 l2BootloaderBytecodeHash, bytes32 l2DefaultAccountBytecodeHash, bytes32 l2EvmEmulatorBytecodeHash, uint256 priorityTxMaxGasLimit, tuple(uint8 pubdataPricingMode, uint32 batchOverheadL1Gas, uint32 maxPubdataPerBatch, uint32 maxL2GasPerBatch, uint32 priorityTxMaxPubdata, uint64 minimalL2GasPrice) feeParams, address blobVersionedHashRetriever) _initializeData) returns (bytes32)',
]

const abi = new utils.Interface([
  'event ValidatorStatusUpdate(address indexed validatorAddress, bool isActive)',
  'event DiamondCut(tuple(address facet, uint8 action, bool isFreezable, bytes4[] selectors)[] facetCuts, address initAddress, bytes initCalldata)',
  `event ${upgradeCompleteSignature1}`,
  `event ${upgradeCompleteSignature2}`,

  ...initializeFunctions.map((f) => `function ${f}`),
])

export class ZKsyncEraValidatorsHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly abi: string[],
  ) {}

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const logs = await provider.getLogs(address, [
      [
        abi.getEventTopic('ValidatorStatusUpdate'),
        abi.getEventTopic(upgradeCompleteSignature1),
        abi.getEventTopic(upgradeCompleteSignature2),
        abi.getEventTopic('DiamondCut'),
      ],
    ])

    const validators: Set<string> = new Set()

    for (const rawLog of logs) {
      const log = abi.parseLog(rawLog)
      if (log.name === 'ValidatorStatusUpdate') {
        const validatorAddress = log.args.validatorAddress
        if (log.args.isActive) {
          validators.add(validatorAddress)
        } else {
          validators.delete(validatorAddress)
        }
      } else if (log.name === 'UpgradeComplete') {
        const postUpgradeCalldata = log.args.upgrade.postUpgradeCalldata

        // NOTE(radomski): Upgrades can go through a contract that will
        // actually execute it. The contract is based on BaseZkSyncUpgrade. At
        // the time of writing this, there were two UpgradeComplete events
        // emitted. The first one was emitted from a contract
        // UpgradeHyperchains (0xd719fca4433646cbd86f6b073ee364d36b856b1d) and
        // the second was emitted from DefaultUpgrade
        // (0x4d376798ba8f69ced59642c3ae8687c7457e855d). Only the
        // UpgradeHyperchains has data in `postUpgradeCalldata` and it uses
        // that calldata to set the validator address as valid. In theory there
        // can be more types of Upgrades that will do different things in the
        // post-pass but it will always require manual intervention.

        // NOTE(radomski): Taken from:
        // https://etherscan.io/address/0xd719fca4433646cbd86f6b073ee364d36b856b1d
        const UPGRADE_HYPERCHAINS_POST_UPGRADE_CALLDATA_LENGTH = 386

        // NOTE(radomski): Taken from:
        // https://etherscan.io/address/0x516fa73908963ae2072647b8a0c053327389d7c2
        const UPGRADE_GATEWAYS_POST_UPGRADE_CALL_DATA_LENGTH = 18498

        switch (postUpgradeCalldata.length) {
          case UPGRADE_HYPERCHAINS_POST_UPGRADE_CALLDATA_LENGTH: {
            const decoded = utils.defaultAbiCoder.decode(
              [
                'uint256 chainId',
                'address bridgehubAddress',
                'address stateTransitionManager',
                'address sharedBridgeAddress',
                'address chainAdmin',
                'address validatorTimelock',
              ],
              postUpgradeCalldata,
            )
            const validatorTimelock = decoded.validatorTimelock as string
            validators.add(validatorTimelock)
            break
          }
          case UPGRADE_GATEWAYS_POST_UPGRADE_CALL_DATA_LENGTH: {
            const decoded = utils.defaultAbiCoder.decode(
              [
                [
                  'tuple(',
                  'tuple(bytes32,address,bool,uint256,bytes)[] forceDeployments,',
                  'uint256 l2GatewayUpgradePosition,',
                  'bytes fixedForceDeploymentsData,',
                  'address ctmDeployer,',
                  'address oldValidatorTimelock,',
                  'address newValidatorTimelock,',
                  'address wrappedBaseTokenStore',
                  ')',
                ].join(''),
              ],
              postUpgradeCalldata,
            )

            const oldValidatorTimelock = decoded[0].oldValidatorTimelock
            const newValidatorTimelock = decoded[0].newValidatorTimelock

            validators.add(oldValidatorTimelock)
            validators.add(newValidatorTimelock)
            break
          }
          default: {
            break
          }
        }
      } else if (log.name === 'DiamondCut') {
        for (const initializeFunction of initializeFunctions) {
          try {
            const result = abi.decodeFunctionData(
              initializeFunction,
              log.args.initCalldata,
            )
            validators.add(result._initializeData.validatorTimelock as string)
            break
          } catch {
            // Do nothing, unsupported
          }
        }
      }
    }

    return {
      field: this.field,
      value: [...validators],
      ignoreRelative: false,
    }
  }
}
