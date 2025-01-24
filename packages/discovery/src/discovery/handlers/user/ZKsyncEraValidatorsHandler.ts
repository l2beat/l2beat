import type { EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import * as z from 'zod'
import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'

export type ZKsyncEraValidatorsHandlerDefinition = z.infer<
  typeof ZKsyncEraValidatorsHandlerDefinition
>
export const ZKsyncEraValidatorsHandlerDefinition = z.strictObject({
  type: z.literal('zksynceraValidators'),
})

const abi = new utils.Interface([
  'event ValidatorStatusUpdate(address indexed validatorAddress, bool isActive)',
  'event DiamondCut(tuple(address facet, uint8 action, bool isFreezable, bytes4[] selectors)[] facetCuts, address initAddress, bytes initCalldata)',
  'event UpgradeComplete(uint256 indexed newProtocolVersion, bytes32 indexed l2UpgradeTxHash, tuple(tuple(uint256 txType, uint256 from, uint256 to, uint256 gasLimit, uint256 gasPerPubdataByteLimit, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, uint256 paymaster, uint256 nonce, uint256 value, uint256[4] reserved, bytes data, bytes signature, uint256[] factoryDeps, bytes paymasterInput, bytes reservedDynamic) l2ProtocolUpgradeTx, bytes[] factoryDeps, bytes32 bootloaderHash, bytes32 defaultAccountHash, address verifier, tuple(bytes32 recursionNodeLevelVkHash, bytes32 recursionLeafLevelVkHash, bytes32 recursionCircuitsSetVksHash) verifierParams, bytes l1ContractsUpgradeCalldata, bytes postUpgradeCalldata, uint256 upgradeTimestamp, uint256 newProtocolVersion) upgrade)',

  'function initialize(tuple(uint256 chainId, address bridgehub, address stateTransitionManager, uint256 protocolVersion, address admin, address validatorTimelock, address baseToken, address baseTokenBridge, bytes32 storedBatchZero, address verifier, tuple(bytes32 recursionNodeLevelVkHash, bytes32 recursionLeafLevelVkHash, bytes32 recursionCircuitsSetVksHash) verifierParams, bytes32 l2BootloaderBytecodeHash, bytes32 l2DefaultAccountBytecodeHash, uint256 priorityTxMaxGasLimit, tuple(uint8 pubdataPricingMode, uint32 batchOverheadL1Gas, uint32 maxPubdataPerBatch, uint32 maxL2GasPerBatch, uint32 priorityTxMaxPubdata, uint64 minimalL2GasPrice) feeParams, address blobVersionedHashRetriever) _initializeData) returns (bytes32)',
])

export class ZKsyncEraValidatorsHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly abi: string[],
  ) {}

  async execute(
    provider: IProvider,
    address: EthereumAddress,
  ): Promise<HandlerResult> {
    const logs = await provider.getLogs(address, [
      [
        abi.getEventTopic('ValidatorStatusUpdate'),
        abi.getEventTopic('UpgradeComplete'),
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
        let validatorTimelock: string | undefined

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
        // post-pass but it will always require manuall intervention.

        // NOTE(radomski): Taken from:
        // https://etherscan.io/address/0xd719fca4433646cbd86f6b073ee364d36b856b1d
        const UPGRADE_HYPERCHAINS_POST_UPGRADE_CALLDATA_LENGTH = 386
        if (
          postUpgradeCalldata.length ===
          UPGRADE_HYPERCHAINS_POST_UPGRADE_CALLDATA_LENGTH
        ) {
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
          validatorTimelock = decoded.validatorTimelock as string
          validators.add(validatorTimelock)
        }
      } else if (log.name === 'DiamondCut') {
        try {
          const result = abi.decodeFunctionData(
            'initialize',
            log.args.initCalldata,
          )
          validators.add(result._initializeData.validatorTimelock as string)
        } catch {
          // Do nothing, unsupported
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
