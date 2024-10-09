// SPDX-License-Identifier: Unknown
pragma solidity 0.8.24;

library Client {
  /// @dev RMN depends on this struct, if changing, please notify the RMN maintainers.
  struct EVMTokenAmount {
    address token; // token address on the local chain.
    uint256 amount; // Amount of tokens.
  }

  struct Any2EVMMessage {
    bytes32 messageId; // MessageId corresponding to ccipSend on source.
    uint64 sourceChainSelector; // Source chain selector.
    bytes sender; // abi.decode(sender) if coming from an EVM chain.
    bytes data; // payload sent in original message.
    EVMTokenAmount[] destTokenAmounts; // Tokens and their amounts in their destination chain representation.
  }

  // If extraArgs is empty bytes, the default is 200k gas limit.
  struct EVM2AnyMessage {
    bytes receiver; // abi.encode(receiver address) for dest EVM chains
    bytes data; // Data payload
    EVMTokenAmount[] tokenAmounts; // Token transfers
    address feeToken; // Address of feeToken. address(0) means you will send msg.value.
    bytes extraArgs; // Populate this with _argsToBytes(EVMExtraArgsV2)
  }

  // bytes4(keccak256("CCIP EVMExtraArgsV1"));
  bytes4 public constant EVM_EXTRA_ARGS_V1_TAG = 0x97a657c9;

  struct EVMExtraArgsV1 {
    uint256 gasLimit;
  }

  function _argsToBytes(EVMExtraArgsV1 memory extraArgs) internal pure returns (bytes memory bts) {
    return abi.encodeWithSelector(EVM_EXTRA_ARGS_V1_TAG, extraArgs);
  }

  // bytes4(keccak256("CCIP EVMExtraArgsV2"));
  bytes4 public constant EVM_EXTRA_ARGS_V2_TAG = 0x181dcf10;

  /// @param gasLimit: gas limit for the callback on the destination chain.
  /// @param allowOutOfOrderExecution: if true, it indicates that the message can be executed in any order relative to other messages from the same sender.
  /// This value's default varies by chain. On some chains, a particular value is enforced, meaning if the expected value
  /// is not set, the message request will revert.
  struct EVMExtraArgsV2 {
    uint256 gasLimit;
    bool allowOutOfOrderExecution;
  }

  function _argsToBytes(EVMExtraArgsV2 memory extraArgs) internal pure returns (bytes memory bts) {
    return abi.encodeWithSelector(EVM_EXTRA_ARGS_V2_TAG, extraArgs);
  }
}

library MerkleMultiProof {
  /// @notice Leaf domain separator, should be used as the first 32 bytes of a leaf's preimage.
  bytes32 internal constant LEAF_DOMAIN_SEPARATOR = 0x0000000000000000000000000000000000000000000000000000000000000000;
  /// @notice Internal domain separator, should be used as the first 32 bytes of an internal node's preiimage.
  bytes32 internal constant INTERNAL_DOMAIN_SEPARATOR =
    0x0000000000000000000000000000000000000000000000000000000000000001;

  uint256 internal constant MAX_NUM_HASHES = 256;

  error InvalidProof();
  error LeavesCannotBeEmpty();

  /// @notice Computes the root based on provided pre-hashed leaf nodes in
  /// leaves, internal nodes in proofs, and using proofFlagBits' i-th bit to
  /// determine if an element of proofs or one of the previously computed leafs
  /// or internal nodes will be used for the i-th hash.
  /// @param leaves Should be pre-hashed and the first 32 bytes of a leaf's
  /// preimage should match LEAF_DOMAIN_SEPARATOR.
  /// @param proofs The hashes to be used instead of a leaf hash when the proofFlagBits
  ///  indicates a proof should be used.
  /// @param proofFlagBits A single uint256 of which each bit indicates whether a leaf or
  ///  a proof needs to be used in a hash operation.
  /// @dev the maximum number of hash operations it set to 256. Any input that would require
  ///  more than 256 hashes to get to a root will revert.
  /// @dev For given input `leaves` = [a,b,c] `proofs` = [D] and `proofFlagBits` = 5
  ///     totalHashes = 3 + 1 - 1 = 3
  ///  ** round 1 **
  ///    proofFlagBits = (5 >> 0) & 1 = true
  ///    hashes[0] = hashPair(a, b)
  ///    (leafPos, hashPos, proofPos) = (2, 0, 0);
  ///
  ///  ** round 2 **
  ///    proofFlagBits = (5 >> 1) & 1 = false
  ///    hashes[1] = hashPair(D, c)
  ///    (leafPos, hashPos, proofPos) = (3, 0, 1);
  ///
  ///  ** round 3 **
  ///    proofFlagBits = (5 >> 2) & 1 = true
  ///    hashes[2] = hashPair(hashes[0], hashes[1])
  ///    (leafPos, hashPos, proofPos) = (3, 2, 1);
  ///
  ///    i = 3 and no longer < totalHashes. The algorithm is done
  ///    return hashes[totalHashes - 1] = hashes[2]; the last hash we computed.
  // We mark this function as internal to force it to be inlined in contracts
  // that use it, but semantically it is public.
  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function merkleRoot(
    bytes32[] memory leaves,
    bytes32[] memory proofs,
    uint256 proofFlagBits
  ) internal pure returns (bytes32) {
    unchecked {
      uint256 leavesLen = leaves.length;
      uint256 proofsLen = proofs.length;
      if (leavesLen == 0) revert LeavesCannotBeEmpty();
      if (!(leavesLen <= MAX_NUM_HASHES + 1 && proofsLen <= MAX_NUM_HASHES + 1)) revert InvalidProof();
      uint256 totalHashes = leavesLen + proofsLen - 1;
      if (!(totalHashes <= MAX_NUM_HASHES)) revert InvalidProof();
      if (totalHashes == 0) {
        return leaves[0];
      }
      bytes32[] memory hashes = new bytes32[](totalHashes);
      (uint256 leafPos, uint256 hashPos, uint256 proofPos) = (0, 0, 0);

      for (uint256 i = 0; i < totalHashes; ++i) {
        // Checks if the bit flag signals the use of a supplied proof or a leaf/previous hash.
        bytes32 a;
        if (proofFlagBits & (1 << i) == (1 << i)) {
          // Use a leaf or a previously computed hash.
          if (leafPos < leavesLen) {
            a = leaves[leafPos++];
          } else {
            a = hashes[hashPos++];
          }
        } else {
          // Use a supplied proof.
          a = proofs[proofPos++];
        }

        // The second part of the hashed pair is never a proof as hashing two proofs would result in a
        // hash that can already be computed offchain.
        bytes32 b;
        if (leafPos < leavesLen) {
          b = leaves[leafPos++];
        } else {
          b = hashes[hashPos++];
        }

        if (!(hashPos <= i)) revert InvalidProof();

        hashes[i] = _hashPair(a, b);
      }
      if (!(hashPos == totalHashes - 1 && leafPos == leavesLen && proofPos == proofsLen)) revert InvalidProof();
      // Return the last hash.
      return hashes[totalHashes - 1];
    }
  }

  /// @notice Hashes two bytes32 objects in their given order, prepended by the
  /// INTERNAL_DOMAIN_SEPARATOR.
  function _hashInternalNode(bytes32 left, bytes32 right) private pure returns (bytes32 hash) {
    return keccak256(abi.encode(INTERNAL_DOMAIN_SEPARATOR, left, right));
  }

  /// @notice Hashes two bytes32 objects. The order is taken into account,
  /// using the lower value first.
  function _hashPair(bytes32 a, bytes32 b) private pure returns (bytes32) {
    return a < b ? _hashInternalNode(a, b) : _hashInternalNode(b, a);
  }
}

library Internal {
  error InvalidEVMAddress(bytes encodedAddress);

  /// @dev The minimum amount of gas to perform the call with exact gas.
  /// We include this in the offramp so that we can redeploy to adjust it
  /// should a hardfork change the gas costs of relevant opcodes in callWithExactGas.
  uint16 internal constant GAS_FOR_CALL_EXACT_CHECK = 5_000;
  // @dev We limit return data to a selector plus 4 words. This is to avoid
  // malicious contracts from returning large amounts of data and causing
  // repeated out-of-gas scenarios.
  uint16 internal constant MAX_RET_BYTES = 4 + 4 * 32;
  /// @dev The expected number of bytes returned by the balanceOf function.
  uint256 internal constant MAX_BALANCE_OF_RET_BYTES = 32;

  /// @notice A collection of token price and gas price updates.
  /// @dev RMN depends on this struct, if changing, please notify the RMN maintainers.
  struct PriceUpdates {
    TokenPriceUpdate[] tokenPriceUpdates;
    GasPriceUpdate[] gasPriceUpdates;
  }

  /// @notice Token price in USD.
  /// @dev RMN depends on this struct, if changing, please notify the RMN maintainers.
  struct TokenPriceUpdate {
    address sourceToken; // Source token
    uint224 usdPerToken; // 1e18 USD per 1e18 of the smallest token denomination.
  }

  /// @notice Gas price for a given chain in USD, its value may contain tightly packed fields.
  /// @dev RMN depends on this struct, if changing, please notify the RMN maintainers.
  struct GasPriceUpdate {
    uint64 destChainSelector; // Destination chain selector
    uint224 usdPerUnitGas; // 1e18 USD per smallest unit (e.g. wei) of destination chain gas
  }

  /// @notice A timestamped uint224 value that can contain several tightly packed fields.
  struct TimestampedPackedUint224 {
    uint224 value; // ───────╮ Value in uint224, packed.
    uint32 timestamp; // ────╯ Timestamp of the most recent price update.
  }

  /// @dev Gas price is stored in 112-bit unsigned int. uint224 can pack 2 prices.
  /// When packing L1 and L2 gas prices, L1 gas price is left-shifted to the higher-order bits.
  /// Using uint8 type, which cannot be higher than other bit shift operands, to avoid shift operand type warning.
  uint8 public constant GAS_PRICE_BITS = 112;

  struct PoolUpdate {
    address token; // The IERC20 token address
    address pool; // The token pool address
  }

  struct SourceTokenData {
    // The source pool address, abi encoded. This value is trusted as it was obtained through the onRamp. It can be
    // relied upon by the destination pool to validate the source pool.
    bytes sourcePoolAddress;
    // The address of the destination token, abi encoded in the case of EVM chains
    // This value is UNTRUSTED as any pool owner can return whatever value they want.
    bytes destTokenAddress;
    // Optional pool data to be transferred to the destination chain. Be default this is capped at
    // CCIP_LOCK_OR_BURN_V1_RET_BYTES bytes. If more data is required, the TokenTransferFeeConfig.destBytesOverhead
    // has to be set for the specific token.
    bytes extraData;
    uint32 destGasAmount; // The amount of gas available for the releaseOrMint and balanceOf calls on the offRamp
  }

  /// @notice Report that is submitted by the execution DON at the execution phase. (including chain selector data)
  /// @dev RMN depends on this struct, if changing, please notify the RMN maintainers.
  struct ExecutionReportSingleChain {
    uint64 sourceChainSelector; // Source chain selector for which the report is submitted
    Any2EVMRampMessage[] messages;
    // Contains a bytes array for each message, each inner bytes array contains bytes per transferred token
    bytes[][] offchainTokenData;
    bytes32[] proofs;
    uint256 proofFlagBits;
  }

  /// @notice Report that is submitted by the execution DON at the execution phase.
  /// @dev RMN depends on this struct, if changing, please notify the RMN maintainers.
  struct ExecutionReport {
    EVM2EVMMessage[] messages;
    // Contains a bytes array for each message, each inner bytes array contains bytes per transferred token
    bytes[][] offchainTokenData;
    bytes32[] proofs;
    uint256 proofFlagBits;
  }

  /// @notice The cross chain message that gets committed to EVM chains.
  /// @dev RMN depends on this struct, if changing, please notify the RMN maintainers.
  struct EVM2EVMMessage {
    uint64 sourceChainSelector; // ────────╮ the chain selector of the source chain, note: not chainId
    address sender; // ────────────────────╯ sender address on the source chain
    address receiver; // ──────────────────╮ receiver address on the destination chain
    uint64 sequenceNumber; // ─────────────╯ sequence number, not unique across lanes
    uint256 gasLimit; //                     user supplied maximum gas amount available for dest chain execution
    bool strict; // ───────────────────────╮ DEPRECATED
    uint64 nonce; //                       │ nonce for this lane for this sender, not unique across senders/lanes
    address feeToken; // ──────────────────╯ fee token
    uint256 feeTokenAmount; //               fee token amount
    bytes data; //                           arbitrary data payload supplied by the message sender
    Client.EVMTokenAmount[] tokenAmounts; // array of tokens and amounts to transfer
    bytes[] sourceTokenData; //              array of token data, one per token
    bytes32 messageId; //                    a hash of the message data
  }

  /// @dev EVM2EVMMessage struct has 13 fields, including 3 variable arrays.
  /// Each variable array takes 1 more slot to store its length.
  /// When abi encoded, excluding array contents,
  /// EVM2EVMMessage takes up a fixed number of 16 lots, 32 bytes each.
  /// For structs that contain arrays, 1 more slot is added to the front, reaching a total of 17.
  uint256 public constant MESSAGE_FIXED_BYTES = 32 * 17;

  /// @dev Each token transfer adds 1 EVMTokenAmount and 3 bytes at 3 slots each and one slot for the destGasAmount.
  /// When abi encoded, each EVMTokenAmount takes 2 slots, each bytes takes 1 slot for length, one slot of data and one
  /// slot for the offset. This results in effectively 3*3 slots per SourceTokenData.
  /// 0x20
  /// destGasAmount
  /// sourcePoolAddress_offset
  /// destTokenAddress_offset
  /// extraData_offset
  /// sourcePoolAddress_length
  /// sourcePoolAddress_content // assume 1 slot
  /// destTokenAddress_length
  /// destTokenAddress_content // assume 1 slot
  /// extraData_length // contents billed separately
  uint256 public constant MESSAGE_FIXED_BYTES_PER_TOKEN = 32 * ((1 + 3 * 3) + 2);

  /// @dev Any2EVMRampMessage struct has 10 fields, including 3 variable unnested arrays (data, receiver and tokenAmounts).
  /// Each variable array takes 1 more slot to store its length.
  /// When abi encoded, excluding array contents,
  /// Any2EVMMessage takes up a fixed number of 13 slots, 32 bytes each.
  /// For structs that contain arrays, 1 more slot is added to the front, reaching a total of 14.
  /// The fixed bytes does not cover struct data (this is represented by ANY_2_EVM_MESSAGE_FIXED_BYTES_PER_TOKEN)
  uint256 public constant ANY_2_EVM_MESSAGE_FIXED_BYTES = 32 * 14;

  /// @dev Each token transfer adds 1 RampTokenAmount
  /// RampTokenAmount has 4 fields, including 3 bytes.
  /// Each bytes takes 1 more slot to store its length, and one slot to store the offset.
  /// When abi encoded, each token transfer takes up 10 slots, excl bytes contents.
  uint256 public constant ANY_2_EVM_MESSAGE_FIXED_BYTES_PER_TOKEN = 32 * 10;

  bytes32 internal constant EVM_2_EVM_MESSAGE_HASH = keccak256("EVM2EVMMessageHashV2");

  /// @dev Used to hash messages for single-lane ramps.
  /// OnRamp hash(EVM2EVMMessage) = OffRamp hash(EVM2EVMMessage)
  /// The EVM2EVMMessage's messageId is expected to be the output of this hash function
  /// @param original Message to hash
  /// @param metadataHash Immutable metadata hash representing a lane with a fixed OnRamp
  /// @return hashedMessage hashed message as a keccak256
  function _hash(EVM2EVMMessage memory original, bytes32 metadataHash) internal pure returns (bytes32) {
    // Fixed-size message fields are included in nested hash to reduce stack pressure.
    // This hashing scheme is also used by RMN. If changing it, please notify the RMN maintainers.
    return keccak256(
      abi.encode(
        MerkleMultiProof.LEAF_DOMAIN_SEPARATOR,
        metadataHash,
        keccak256(
          abi.encode(
            original.sender,
            original.receiver,
            original.sequenceNumber,
            original.gasLimit,
            original.strict,
            original.nonce,
            original.feeToken,
            original.feeTokenAmount
          )
        ),
        keccak256(original.data),
        keccak256(abi.encode(original.tokenAmounts)),
        keccak256(abi.encode(original.sourceTokenData))
      )
    );
  }

  bytes32 internal constant ANY_2_EVM_MESSAGE_HASH = keccak256("Any2EVMMessageHashV1");
  bytes32 internal constant EVM_2_ANY_MESSAGE_HASH = keccak256("EVM2AnyMessageHashV1");

  /// @dev Used to hash messages for multi-lane family-agnostic OffRamps.
  /// OnRamp hash(EVM2AnyMessage) != Any2EVMRampMessage.messageId
  /// OnRamp hash(EVM2AnyMessage) != OffRamp hash(Any2EVMRampMessage)
  /// @param original OffRamp message to hash
  /// @param onRamp OnRamp to hash the message with - used to compute the metadataHash
  /// @return hashedMessage hashed message as a keccak256
  function _hash(Any2EVMRampMessage memory original, bytes memory onRamp) internal pure returns (bytes32) {
    // Fixed-size message fields are included in nested hash to reduce stack pressure.
    // This hashing scheme is also used by RMN. If changing it, please notify the RMN maintainers.
    return keccak256(
      abi.encode(
        MerkleMultiProof.LEAF_DOMAIN_SEPARATOR,
        // Implicit metadata hash
        keccak256(
          abi.encode(
            ANY_2_EVM_MESSAGE_HASH, original.header.sourceChainSelector, original.header.destChainSelector, onRamp
          )
        ),
        keccak256(
          abi.encode(
            original.header.messageId,
            original.sender,
            original.receiver,
            original.header.sequenceNumber,
            original.gasLimit,
            original.header.nonce
          )
        ),
        keccak256(original.data),
        keccak256(abi.encode(original.tokenAmounts))
      )
    );
  }

  function _hash(EVM2AnyRampMessage memory original, bytes32 metadataHash) internal pure returns (bytes32) {
    // Fixed-size message fields are included in nested hash to reduce stack pressure.
    // This hashing scheme is also used by RMN. If changing it, please notify the RMN maintainers.
    return keccak256(
      abi.encode(
        MerkleMultiProof.LEAF_DOMAIN_SEPARATOR,
        metadataHash,
        keccak256(
          abi.encode(
            original.sender,
            original.receiver,
            original.header.sequenceNumber,
            original.header.nonce,
            original.feeToken,
            original.feeTokenAmount
          )
        ),
        keccak256(original.data),
        keccak256(abi.encode(original.tokenAmounts)),
        keccak256(original.extraArgs)
      )
    );
  }

  /// @dev We disallow the first 1024 addresses to avoid calling into a range known for hosting precompiles. Calling
  /// into precompiles probably won't cause any issues, but to be safe we can disallow this range. It is extremely
  /// unlikely that anyone would ever be able to generate an address in this range. There is no official range of
  /// precompiles, but EIP-7587 proposes to reserve the range 0x100 to 0x1ff. Our range is more conservative, even
  /// though it might not be exhaustive for all chains, which is OK. We also disallow the zero address, which is a
  /// common practice.
  uint256 public constant PRECOMPILE_SPACE = 1024;

  /// @notice This methods provides validation for parsing abi encoded addresses by ensuring the
  /// address is within the EVM address space. If it isn't it will revert with an InvalidEVMAddress error, which
  /// we can catch and handle more gracefully than a revert from abi.decode.
  /// @return The address if it is valid, the function will revert otherwise.
  function _validateEVMAddress(bytes memory encodedAddress) internal pure returns (address) {
    if (encodedAddress.length != 32) revert InvalidEVMAddress(encodedAddress);
    uint256 encodedAddressUint = abi.decode(encodedAddress, (uint256));
    if (encodedAddressUint > type(uint160).max || encodedAddressUint < PRECOMPILE_SPACE) {
      revert InvalidEVMAddress(encodedAddress);
    }
    return address(uint160(encodedAddressUint));
  }

  /// @notice Enum listing the possible message execution states within
  /// the offRamp contract.
  /// UNTOUCHED never executed
  /// IN_PROGRESS currently being executed, used a replay protection
  /// SUCCESS successfully executed. End state
  /// FAILURE unsuccessfully executed, manual execution is now enabled.
  /// @dev RMN depends on this enum, if changing, please notify the RMN maintainers.
  enum MessageExecutionState {
    UNTOUCHED,
    IN_PROGRESS,
    SUCCESS,
    FAILURE
  }

  /// @notice CCIP OCR plugin type, used to separate execution & commit transmissions and configs
  enum OCRPluginType {
    Commit,
    Execution
  }

  /// @notice Family-agnostic token amounts used for both OnRamp & OffRamp messages
  struct RampTokenAmount {
    // The source pool address, abi encoded. This value is trusted as it was obtained through the onRamp. It can be
    // relied upon by the destination pool to validate the source pool.
    bytes sourcePoolAddress;
    // The address of the destination token, abi encoded in the case of EVM chains
    // This value is UNTRUSTED as any pool owner can return whatever value they want.
    bytes destTokenAddress;
    // Optional pool data to be transferred to the destination chain. Be default this is capped at
    // CCIP_LOCK_OR_BURN_V1_RET_BYTES bytes. If more data is required, the TokenTransferFeeConfig.destBytesOverhead
    // has to be set for the specific token.
    bytes extraData;
    uint256 amount; // Amount of tokens.
  }

  /// @notice Family-agnostic header for OnRamp & OffRamp messages.
  /// The messageId is not expected to match hash(message), since it may originate from another ramp family
  struct RampMessageHeader {
    bytes32 messageId; // Unique identifier for the message, generated with the source chain's encoding scheme (i.e. not necessarily abi.encoded)
    uint64 sourceChainSelector; // ──╮ the chain selector of the source chain, note: not chainId
    uint64 destChainSelector; //     | the chain selector of the destination chain, note: not chainId
    uint64 sequenceNumber; //        │ sequence number, not unique across lanes
    uint64 nonce; // ────────────────╯ nonce for this lane for this sender, not unique across senders/lanes
  }

  /// @notice Family-agnostic message routed to an OffRamp
  /// Note: hash(Any2EVMRampMessage) != hash(EVM2AnyRampMessage), hash(Any2EVMRampMessage) != messageId
  /// due to encoding & parameter differences
  struct Any2EVMRampMessage {
    RampMessageHeader header; // Message header
    bytes sender; // sender address on the source chain
    bytes data; // arbitrary data payload supplied by the message sender
    address receiver; // receiver address on the destination chain
    uint256 gasLimit; // user supplied maximum gas amount available for dest chain execution
    RampTokenAmount[] tokenAmounts; // array of tokens and amounts to transfer
  }

  /// @notice Family-agnostic message emitted from the OnRamp
  /// Note: hash(Any2EVMRampMessage) != hash(EVM2AnyRampMessage) due to encoding & parameter differences
  /// messageId = hash(EVM2AnyRampMessage) using the source EVM chain's encoding format
  struct EVM2AnyRampMessage {
    RampMessageHeader header; // Message header
    address sender; // sender address on the source chain
    bytes data; // arbitrary data payload supplied by the message sender
    bytes receiver; // receiver address on the destination chain
    bytes extraArgs; // destination-chain specific extra args, such as the gasLimit for EVM chains
    address feeToken; // fee token
    uint256 feeTokenAmount; // fee token amount
    RampTokenAmount[] tokenAmounts; // array of tokens and amounts to transfer
  }

  // bytes4(keccak256("CCIP ChainFamilySelector EVM"))
  bytes4 public constant CHAIN_FAMILY_SELECTOR_EVM = 0x2812d52c;
}

interface IOwnable {
  function owner() external returns (address);

  function transferOwnership(address recipient) external;

  function acceptOwnership() external;
}

contract ConfirmedOwnerWithProposal is IOwnable {
  address private s_owner;
  address private s_pendingOwner;

  event OwnershipTransferRequested(address indexed from, address indexed to);
  event OwnershipTransferred(address indexed from, address indexed to);

  constructor(address newOwner, address pendingOwner) {
    // solhint-disable-next-line gas-custom-errors
    require(newOwner != address(0), "Cannot set owner to zero");

    s_owner = newOwner;
    if (pendingOwner != address(0)) {
      _transferOwnership(pendingOwner);
    }
  }

  /// @notice Allows an owner to begin transferring ownership to a new address.
  function transferOwnership(address to) public override onlyOwner {
    _transferOwnership(to);
  }

  /// @notice Allows an ownership transfer to be completed by the recipient.
  function acceptOwnership() external override {
    // solhint-disable-next-line gas-custom-errors
    require(msg.sender == s_pendingOwner, "Must be proposed owner");

    address oldOwner = s_owner;
    s_owner = msg.sender;
    s_pendingOwner = address(0);

    emit OwnershipTransferred(oldOwner, msg.sender);
  }

  /// @notice Get the current owner
  function owner() public view override returns (address) {
    return s_owner;
  }

  /// @notice validate, transfer ownership, and emit relevant events
  function _transferOwnership(address to) private {
    // solhint-disable-next-line gas-custom-errors
    require(to != msg.sender, "Cannot transfer to self");

    s_pendingOwner = to;

    emit OwnershipTransferRequested(s_owner, to);
  }

  /// @notice validate access
  function _validateOwnership() internal view {
    // solhint-disable-next-line gas-custom-errors
    require(msg.sender == s_owner, "Only callable by owner");
  }

  /// @notice Reverts if called by anyone other than the contract owner.
  modifier onlyOwner() {
    _validateOwnership();
    _;
  }
}

contract ConfirmedOwner is ConfirmedOwnerWithProposal {
  constructor(address newOwner) ConfirmedOwnerWithProposal(newOwner, address(0)) {}
}

contract OwnerIsCreator is ConfirmedOwner {
  constructor() ConfirmedOwner(msg.sender) {}
}

abstract contract OCR2Abstract is ITypeAndVersion {
  // Maximum number of oracles the offchain reporting protocol is designed for
  uint256 internal constant MAX_NUM_ORACLES = 31;

  /// @notice triggers a new run of the offchain reporting protocol
  /// @param previousConfigBlockNumber block in which the previous config was set, to simplify historic analysis
  /// @param configDigest configDigest of this configuration
  /// @param configCount ordinal number of this config setting among all config settings over the life of this contract
  /// @param signers ith element is address ith oracle uses to sign a report
  /// @param transmitters ith element is address ith oracle uses to transmit a report via the transmit method
  /// @param f maximum number of faulty/dishonest oracles the protocol can tolerate while still working correctly
  /// @param onchainConfig serialized configuration used by the contract (and possibly oracles)
  /// @param offchainConfigVersion version of the serialization format used for "offchainConfig" parameter
  /// @param offchainConfig serialized configuration used by the oracles exclusively and only passed through the contract
  event ConfigSet(
    uint32 previousConfigBlockNumber,
    bytes32 configDigest,
    uint64 configCount,
    address[] signers,
    address[] transmitters,
    uint8 f,
    bytes onchainConfig,
    uint64 offchainConfigVersion,
    bytes offchainConfig
  );

  /// @notice sets offchain reporting protocol configuration incl. participating oracles
  /// @param signers addresses with which oracles sign the reports
  /// @param transmitters addresses oracles use to transmit the reports
  /// @param f number of faulty oracles the system can tolerate
  /// @param onchainConfig serialized configuration used by the contract (and possibly oracles)
  /// @param offchainConfigVersion version number for offchainEncoding schema
  /// @param offchainConfig serialized configuration used by the oracles exclusively and only passed through the contract
  function setOCR2Config(
    address[] memory signers,
    address[] memory transmitters,
    uint8 f,
    bytes memory onchainConfig,
    uint64 offchainConfigVersion,
    bytes memory offchainConfig
  ) external virtual;

  /// @notice information about current offchain reporting protocol configuration
  /// @return configCount ordinal number of current config, out of all configs applied to this contract so far
  /// @return blockNumber block at which this config was set
  /// @return configDigest domain-separation tag for current config (see _configDigestFromConfigData)
  function latestConfigDetails()
    external
    view
    virtual
    returns (uint32 configCount, uint32 blockNumber, bytes32 configDigest);

  function _configDigestFromConfigData(
    uint256 chainId,
    address contractAddress,
    uint64 configCount,
    address[] memory signers,
    address[] memory transmitters,
    uint8 f,
    bytes memory onchainConfig,
    uint64 offchainConfigVersion,
    bytes memory offchainConfig
  ) internal pure returns (bytes32) {
    uint256 h = uint256(
      keccak256(
        abi.encode(
          chainId,
          contractAddress,
          configCount,
          signers,
          transmitters,
          f,
          onchainConfig,
          offchainConfigVersion,
          offchainConfig
        )
      )
    );
    uint256 prefixMask = type(uint256).max << (256 - 16); // 0xFFFF00..00
    uint256 prefix = 0x0001 << (256 - 16); // 0x000100..00
    return bytes32((prefix & prefixMask) | (h & ~prefixMask));
  }

  /// @notice optionally emitted to indicate the latest configDigest and epoch for
  /// which a report was successfully transmitted. Alternatively, the contract may
  /// use latestConfigDigestAndEpoch with scanLogs set to false.
  event Transmitted(bytes32 configDigest, uint32 epoch);

  /// @notice optionally returns the latest configDigest and epoch for which a
  /// report was successfully transmitted. Alternatively, the contract may return
  /// scanLogs set to true and use Transmitted events to provide this information
  /// to offchain watchers.
  /// @return scanLogs indicates whether to rely on the configDigest and epoch
  /// returned or whether to scan logs for the Transmitted event instead.
  /// @return configDigest
  /// @return epoch
  function latestConfigDigestAndEpoch()
    external
    view
    virtual
    returns (bool scanLogs, bytes32 configDigest, uint32 epoch);

  /// @notice transmit is called to post a new report to the contract
  /// @param report serialized report, which the signatures are signing.
  /// @param rs ith element is the R components of the ith signature on report. Must have at most MAX_NUM_ORACLES entries
  /// @param ss ith element is the S components of the ith signature on report. Must have at most MAX_NUM_ORACLES entries
  /// @param rawVs ith element is the the V component of the ith signature
  function transmit(
    // NOTE: If these parameters are changed, expectedMsgDataLength and/or
    // TRANSMIT_MSGDATA_CONSTANT_LENGTH_COMPONENT need to be changed accordingly
    bytes32[3] calldata reportContext,
    bytes calldata report,
    bytes32[] calldata rs,
    bytes32[] calldata ss,
    bytes32 rawVs // signatures
  ) external virtual;
}

abstract contract OCR2Base is OwnerIsCreator, OCR2Abstract {
  error InvalidConfig(InvalidConfigErrorType errorType);
  error WrongMessageLength(uint256 expected, uint256 actual);
  error ConfigDigestMismatch(bytes32 expected, bytes32 actual);
  error ForkedChain(uint256 expected, uint256 actual);
  error WrongNumberOfSignatures();
  error SignaturesOutOfRegistration();
  error UnauthorizedTransmitter();
  error UnauthorizedSigner();
  error NonUniqueSignatures();
  error OracleCannotBeZeroAddress();

  enum InvalidConfigErrorType {
    F_MUST_BE_POSITIVE,
    TOO_MANY_SIGNERS,
    F_TOO_HIGH,
    REPEATED_ORACLE_ADDRESS,
    NUM_SIGNERS_NOT_NUM_TRANSMITTERS
  }

  // Packing these fields used on the hot path in a ConfigInfo variable reduces the
  // retrieval of all of them to a minimum number of SLOADs.
  struct ConfigInfo {
    bytes32 latestConfigDigest;
    uint8 f;
    uint8 n;
  }

  // Used for s_oracles[a].role, where a is an address, to track the purpose
  // of the address, or to indicate that the address is unset.
  enum Role {
    // No oracle role has been set for address a
    Unset,
    // Signing address for the s_oracles[a].index'th oracle. I.e., report
    // signatures from this oracle should ecrecover back to address a.
    Signer,
    // Transmission address for the s_oracles[a].index'th oracle. I.e., if a
    // report is received by OCR2Aggregator.transmit in which msg.sender is
    // a, it is attributed to the s_oracles[a].index'th oracle.
    Transmitter
  }

  struct Oracle {
    uint8 index; // Index of oracle in s_signers/s_transmitters
    Role role; // Role of the address which mapped to this struct
  }

  // The current config
  ConfigInfo internal s_configInfo;

  // incremented each time a new config is posted. This count is incorporated
  // into the config digest, to prevent replay attacks.
  uint32 internal s_configCount;
  // makes it easier for offchain systems to extract config from logs.
  uint32 internal s_latestConfigBlockNumber;

  // signer OR transmitter address
  mapping(address signerOrTransmitter => Oracle oracle) internal s_oracles;

  // s_signers contains the signing address of each oracle
  address[] internal s_signers;

  // s_transmitters contains the transmission address of each oracle,
  // i.e. the address the oracle actually sends transactions to the contract from
  address[] internal s_transmitters;

  // The constant-length components of the msg.data sent to transmit.
  // See the "If we wanted to call sam" example on for example reasoning
  // https://solidity.readthedocs.io/en/v0.7.2/abi-spec.html
  uint16 private constant TRANSMIT_MSGDATA_CONSTANT_LENGTH_COMPONENT = 4 // function selector
    + 32 * 3 // 3 words containing reportContext
    + 32 // word containing start location of abiencoded report value
    + 32 // word containing location start of abiencoded rs value
    + 32 // word containing start location of abiencoded ss value
    + 32 // rawVs value
    + 32 // word containing length of report
    + 32 // word containing length rs
    + 32; // word containing length of ss

  bool internal immutable i_uniqueReports;
  uint256 internal immutable i_chainID;

  constructor(bool uniqueReports) {
    i_uniqueReports = uniqueReports;
    i_chainID = block.chainid;
  }

  // Reverts transaction if config args are invalid
  modifier checkConfigValid(uint256 numSigners, uint256 numTransmitters, uint256 f) {
    if (numSigners > MAX_NUM_ORACLES) revert InvalidConfig(InvalidConfigErrorType.TOO_MANY_SIGNERS);
    if (f == 0) revert InvalidConfig(InvalidConfigErrorType.F_MUST_BE_POSITIVE);
    if (numSigners != numTransmitters) revert InvalidConfig(InvalidConfigErrorType.NUM_SIGNERS_NOT_NUM_TRANSMITTERS);
    if (numSigners <= 3 * f) revert InvalidConfig(InvalidConfigErrorType.F_TOO_HIGH);
    _;
  }

  /// @notice sets offchain reporting protocol configuration incl. participating oracles
  /// @param signers addresses with which oracles sign the reports
  /// @param transmitters addresses oracles use to transmit the reports
  /// @param f number of faulty oracles the system can tolerate
  /// @param onchainConfig encoded on-chain contract configuration
  /// @param offchainConfigVersion version number for offchainEncoding schema
  /// @param offchainConfig encoded off-chain oracle configuration
  function setOCR2Config(
    address[] memory signers,
    address[] memory transmitters,
    uint8 f,
    bytes memory onchainConfig,
    uint64 offchainConfigVersion,
    bytes memory offchainConfig
  ) external override checkConfigValid(signers.length, transmitters.length, f) onlyOwner {
    _beforeSetConfig(onchainConfig);
    uint256 oldSignerLength = s_signers.length;
    for (uint256 i = 0; i < oldSignerLength; ++i) {
      delete s_oracles[s_signers[i]];
      delete s_oracles[s_transmitters[i]];
    }

    uint256 newSignersLength = signers.length;
    for (uint256 i = 0; i < newSignersLength; ++i) {
      // add new signer/transmitter addresses
      address signer = signers[i];
      if (s_oracles[signer].role != Role.Unset) revert InvalidConfig(InvalidConfigErrorType.REPEATED_ORACLE_ADDRESS);
      if (signer == address(0)) revert OracleCannotBeZeroAddress();
      s_oracles[signer] = Oracle(uint8(i), Role.Signer);

      address transmitter = transmitters[i];
      if (s_oracles[transmitter].role != Role.Unset) {
        revert InvalidConfig(InvalidConfigErrorType.REPEATED_ORACLE_ADDRESS);
      }
      if (transmitter == address(0)) revert OracleCannotBeZeroAddress();
      s_oracles[transmitter] = Oracle(uint8(i), Role.Transmitter);
    }

    s_signers = signers;
    s_transmitters = transmitters;

    s_configInfo.f = f;
    s_configInfo.n = uint8(newSignersLength);
    s_configInfo.latestConfigDigest = _configDigestFromConfigData(
      block.chainid,
      address(this),
      ++s_configCount,
      signers,
      transmitters,
      f,
      onchainConfig,
      offchainConfigVersion,
      offchainConfig
    );

    uint32 previousConfigBlockNumber = s_latestConfigBlockNumber;
    s_latestConfigBlockNumber = uint32(block.number);

    emit ConfigSet(
      previousConfigBlockNumber,
      s_configInfo.latestConfigDigest,
      s_configCount,
      signers,
      transmitters,
      f,
      onchainConfig,
      offchainConfigVersion,
      offchainConfig
    );
  }

  /// @dev Hook that is run from setOCR2Config() right after validating configuration.
  /// Empty by default, please provide an implementation in a child contract if you need additional configuration processing
  function _beforeSetConfig(bytes memory _onchainConfig) internal virtual;

  /// @return list of addresses permitted to transmit reports to this contract
  /// @dev The list will match the order used to specify the transmitter during setConfig
  function getTransmitters() external view returns (address[] memory) {
    return s_transmitters;
  }

  /// @notice transmit is called to post a new report to the contract
  /// @param report serialized report, which the signatures are signing.
  /// @param rs ith element is the R components of the ith signature on report. Must have at most MAX_NUM_ORACLES entries
  /// @param ss ith element is the S components of the ith signature on report. Must have at most MAX_NUM_ORACLES entries
  /// @param rawVs ith element is the the V component of the ith signature
  function transmit(
    // NOTE: If these parameters are changed, expectedMsgDataLength and/or
    // TRANSMIT_MSGDATA_CONSTANT_LENGTH_COMPONENT need to be changed accordingly
    bytes32[3] calldata reportContext,
    bytes calldata report,
    bytes32[] calldata rs,
    bytes32[] calldata ss,
    bytes32 rawVs // signatures
  ) external override {
    // Scoping this reduces stack pressure and gas usage
    {
      // report and epochAndRound
      _report(report, uint40(uint256(reportContext[1])));
    }

    // reportContext consists of:
    // reportContext[0]: ConfigDigest
    // reportContext[1]: 27 byte padding, 4-byte epoch and 1-byte round
    // reportContext[2]: ExtraHash
    bytes32 configDigest = reportContext[0];
    ConfigInfo memory configInfo = s_configInfo;

    if (configInfo.latestConfigDigest != configDigest) {
      revert ConfigDigestMismatch(configInfo.latestConfigDigest, configDigest);
    }
    // If the cached chainID at time of deployment doesn't match the current chainID, we reject all signed reports.
    // This avoids a (rare) scenario where chain A forks into chain A and A', A' still has configDigest
    // calculated from chain A and so OCR reports will be valid on both forks.
    if (i_chainID != block.chainid) revert ForkedChain(i_chainID, block.chainid);

    emit Transmitted(configDigest, uint32(uint256(reportContext[1]) >> 8));

    uint256 expectedNumSignatures;
    if (i_uniqueReports) {
      expectedNumSignatures = (configInfo.n + configInfo.f) / 2 + 1;
    } else {
      expectedNumSignatures = configInfo.f + 1;
    }
    if (rs.length != expectedNumSignatures) revert WrongNumberOfSignatures();
    if (rs.length != ss.length) revert SignaturesOutOfRegistration();

    // Scoping this reduces stack pressure and gas usage
    {
      Oracle memory transmitter = s_oracles[msg.sender];
      // Check that sender is authorized to report
      if (!(transmitter.role == Role.Transmitter && msg.sender == s_transmitters[transmitter.index])) {
        revert UnauthorizedTransmitter();
      }
    }
    // Scoping this reduces stack pressure and gas usage
    {
      uint256 expectedDataLength = uint256(TRANSMIT_MSGDATA_CONSTANT_LENGTH_COMPONENT) + report.length // one byte pure entry in _report
        + rs.length * 32 // 32 bytes per entry in _rs
        + ss.length * 32; // 32 bytes per entry in _ss)
      if (msg.data.length != expectedDataLength) revert WrongMessageLength(expectedDataLength, msg.data.length);
    }

    // Verify signatures attached to report
    bytes32 h = keccak256(abi.encodePacked(keccak256(report), reportContext));
    bool[MAX_NUM_ORACLES] memory signed;

    uint256 numberOfSignatures = rs.length;
    for (uint256 i = 0; i < numberOfSignatures; ++i) {
      // Safe from ECDSA malleability here since we check for duplicate signers.
      address signer = ecrecover(h, uint8(rawVs[i]) + 27, rs[i], ss[i]);
      // Since we disallow address(0) as a valid signer address, it can
      // never have a signer role.
      Oracle memory oracle = s_oracles[signer];
      if (oracle.role != Role.Signer) revert UnauthorizedSigner();
      if (signed[oracle.index]) revert NonUniqueSignatures();
      signed[oracle.index] = true;
    }
  }

  /// @notice information about current offchain reporting protocol configuration
  /// @return configCount ordinal number of current config, out of all configs applied to this contract so far
  /// @return blockNumber block at which this config was set
  /// @return configDigest domain-separation tag for current config (see _configDigestFromConfigData)
  function latestConfigDetails()
    external
    view
    override
    returns (uint32 configCount, uint32 blockNumber, bytes32 configDigest)
  {
    return (s_configCount, s_latestConfigBlockNumber, s_configInfo.latestConfigDigest);
  }

  /// @inheritdoc OCR2Abstract
  function latestConfigDigestAndEpoch()
    external
    view
    virtual
    override
    returns (bool scanLogs, bytes32 configDigest, uint32 epoch)
  {
    return (true, bytes32(0), uint32(0));
  }

  function _report(bytes calldata report, uint40 epochAndRound) internal virtual;
}

interface ITypeAndVersion {
  function typeAndVersion() external pure returns (string memory);
}

interface ICommitStore {
  /// @notice Returns timestamp of when root was accepted or 0 if verification fails.
  /// @dev This method uses a merkle tree within a merkle tree, with the hashedLeaves,
  /// proofs and proofFlagBits being used to get the root of the inner tree.
  /// This root is then used as the singular leaf of the outer tree.
  function verify(
    bytes32[] calldata hashedLeaves,
    bytes32[] calldata proofs,
    uint256 proofFlagBits
  ) external view returns (uint256 timestamp);

  /// @notice Returns the expected next sequence number
  function getExpectedNextSequenceNumber() external view returns (uint64 sequenceNumber);
}

contract CommitStore is ICommitStore, ITypeAndVersion, OCR2Base {
  error StaleReport();
  error PausedError();
  error InvalidInterval(Interval interval);
  error InvalidRoot();
  error InvalidCommitStoreConfig();
  error CursedByRMN();
  error RootAlreadyCommitted();

  event Paused(address account);
  event Unpaused(address account);
  /// @dev RMN depends on this event, if changing, please notify the RMN maintainers.
  event ReportAccepted(CommitReport report);
  event ConfigSet(StaticConfig staticConfig, DynamicConfig dynamicConfig);
  event RootRemoved(bytes32 root);
  event SequenceNumberSet(uint64 oldSeqNum, uint64 newSeqNum);
  event LatestPriceEpochAndRoundSet(uint40 oldEpochAndRound, uint40 newEpochAndRound);

  /// @notice Static commit store config
  /// @dev RMN depends on this struct, if changing, please notify the RMN maintainers.
  //solhint-disable gas-struct-packing
  struct StaticConfig {
    uint64 chainSelector; // ───────╮  Destination chainSelector
    uint64 sourceChainSelector; // ─╯  Source chainSelector
    address onRamp; // OnRamp address on the source chain
    address rmnProxy; // RMN proxy address
  }

  /// @notice Dynamic commit store config
  struct DynamicConfig {
    address priceRegistry; // Price registry address on the destination chain
  }

  /// @notice a sequenceNumber interval
  /// @dev RMN depends on this struct, if changing, please notify the RMN maintainers.
  struct Interval {
    uint64 min; // ───╮ Minimum sequence number, inclusive
    uint64 max; // ───╯ Maximum sequence number, inclusive
  }

  /// @notice Report that is committed by the observing DON at the committing phase
  /// @dev RMN depends on this struct, if changing, please notify the RMN maintainers.
  struct CommitReport {
    Internal.PriceUpdates priceUpdates;
    Interval interval;
    bytes32 merkleRoot;
  }

  // STATIC CONFIG
  string public constant override typeAndVersion = "CommitStore 1.5.0";
  // Chain ID of this chain
  uint64 internal immutable i_chainSelector;
  // Chain ID of the source chain
  uint64 internal immutable i_sourceChainSelector;
  // The onRamp address on the source chain
  address internal immutable i_onRamp;
  // The address of the rmn proxy
  address internal immutable i_rmnProxy;

  // DYNAMIC CONFIG
  // The dynamic commitStore config
  DynamicConfig internal s_dynamicConfig;

  // STATE
  // The min sequence number expected for future messages
  uint64 private s_minSeqNr = 1;
  /// @dev The epoch and round of the last report
  uint40 private s_latestPriceEpochAndRound;
  /// @dev Whether this CommitStore is paused or not
  bool private s_paused = false;
  // merkleRoot => timestamp when received
  mapping(bytes32 merkleRoot => uint256 timestamp) private s_roots;

  /// @param staticConfig Containing the static part of the commitStore config
  /// @dev When instantiating OCR2Base we set UNIQUE_REPORTS to false, which means
  /// that we do not require 2f+1 signatures on a report, only f+1 to save gas. 2f+1 is required
  /// only if one must strictly ensure that for a given round there is only one valid report ever generated by
  /// the DON. In our case additional valid reports (i.e. approved by >= f+1 oracles) are not a problem, as they will
  /// will either be ignored (reverted as an invalid interval) or will be accepted as an additional valid price update.
  constructor(StaticConfig memory staticConfig) OCR2Base(false) {
    if (
      staticConfig.onRamp == address(0) || staticConfig.chainSelector == 0 || staticConfig.sourceChainSelector == 0
        || staticConfig.rmnProxy == address(0)
    ) revert InvalidCommitStoreConfig();

    i_chainSelector = staticConfig.chainSelector;
    i_sourceChainSelector = staticConfig.sourceChainSelector;
    i_onRamp = staticConfig.onRamp;
    i_rmnProxy = staticConfig.rmnProxy;
  }

  // ================================================================
  // │                        Verification                          │
  // ================================================================

  /// @notice Returns the next expected sequence number.
  /// @return the next expected sequenceNumber.
  function getExpectedNextSequenceNumber() external view returns (uint64) {
    return s_minSeqNr;
  }

  /// @notice Sets the minimum sequence number.
  /// @param minSeqNr The new minimum sequence number.
  function setMinSeqNr(uint64 minSeqNr) external onlyOwner {
    uint64 oldSeqNum = s_minSeqNr;

    s_minSeqNr = minSeqNr;

    emit SequenceNumberSet(oldSeqNum, minSeqNr);
  }

  /// @notice Returns the epoch and round of the last price update.
  /// @return the latest price epoch and round.
  function getLatestPriceEpochAndRound() external view returns (uint64) {
    return s_latestPriceEpochAndRound;
  }

  /// @notice Sets the latest epoch and round for price update.
  /// @param latestPriceEpochAndRound The new epoch and round for prices.
  function setLatestPriceEpochAndRound(uint40 latestPriceEpochAndRound) external onlyOwner {
    uint40 oldEpochAndRound = s_latestPriceEpochAndRound;

    s_latestPriceEpochAndRound = latestPriceEpochAndRound;

    emit LatestPriceEpochAndRoundSet(oldEpochAndRound, latestPriceEpochAndRound);
  }

  /// @notice Returns the timestamp of a potentially previously committed merkle root.
  /// If the root was never committed 0 will be returned.
  /// @param root The merkle root to check the commit status for.
  /// @return the timestamp of the committed root or zero in the case that it was never
  /// committed.
  function getMerkleRoot(bytes32 root) external view returns (uint256) {
    return s_roots[root];
  }

  /// @notice Returns if a root is blessed or not.
  /// @param root The merkle root to check the blessing status for.
  /// @return whether the root is blessed or not.
  function isBlessed(bytes32 root) public view returns (bool) {
    return IRMN(i_rmnProxy).isBlessed(IRMN.TaggedRoot({commitStore: address(this), root: root}));
  }

  /// @notice Used by the owner in case an invalid sequence of roots has been
  /// posted and needs to be removed. The interval in the report is trusted.
  /// @param rootToReset The roots that will be reset. This function will only
  /// reset roots that are not blessed.
  function resetUnblessedRoots(bytes32[] calldata rootToReset) external onlyOwner {
    for (uint256 i = 0; i < rootToReset.length; ++i) {
      bytes32 root = rootToReset[i];
      if (!isBlessed(root)) {
        delete s_roots[root];
        emit RootRemoved(root);
      }
    }
  }

  /// @inheritdoc ICommitStore
  function verify(
    bytes32[] calldata hashedLeaves,
    bytes32[] calldata proofs,
    uint256 proofFlagBits
  ) external view override whenNotPaused returns (uint256 timestamp) {
    bytes32 root = MerkleMultiProof.merkleRoot(hashedLeaves, proofs, proofFlagBits);
    // Only return non-zero if present and blessed.
    if (!isBlessed(root)) {
      return 0;
    }
    return s_roots[root];
  }

  /// @inheritdoc OCR2Base
  /// @dev A commitReport can have two distinct parts (batched together to amortize the cost of checking sigs):
  /// 1. Price updates
  /// 2. A merkle root and sequence number interval
  /// Both have their own, separate, staleness checks, with price updates using the epoch and round
  /// number of the latest price update. The merkle root checks for staleness based on the seqNums.
  /// They need to be separate because a price report for round t+2 might be included before a report
  /// containing a merkle root for round t+1. This merkle root report for round t+1 is still valid
  /// and should not be rejected. When a report with a stale root but valid price updates is submitted,
  /// we are OK to revert to preserve the invariant that we always revert on invalid sequence number ranges.
  /// If that happens, prices will be updates in later rounds.
  function _report(bytes calldata encodedReport, uint40 epochAndRound) internal override whenNotPaused {
    if (IRMN(i_rmnProxy).isCursed(bytes16(uint128(i_sourceChainSelector)))) revert CursedByRMN();

    CommitReport memory report = abi.decode(encodedReport, (CommitReport));

    // Check if the report contains price updates
    if (report.priceUpdates.tokenPriceUpdates.length > 0 || report.priceUpdates.gasPriceUpdates.length > 0) {
      // Check for price staleness based on the epoch and round
      if (s_latestPriceEpochAndRound < epochAndRound) {
        // If prices are not stale, update the latest epoch and round
        s_latestPriceEpochAndRound = epochAndRound;
        // And update the prices in the price registry
        IPriceRegistry(s_dynamicConfig.priceRegistry).updatePrices(report.priceUpdates);

        // If there is no root, the report only contained fee updated and
        // we return to not revert on the empty root check below.
        if (report.merkleRoot == bytes32(0)) return;
      } else {
        // If prices are stale and the report doesn't contain a root, this report
        // does not have any valid information and we revert.
        // If it does contain a merkle root, continue to the root checking section.
        if (report.merkleRoot == bytes32(0)) revert StaleReport();
      }
    }

    // If we reached this section, the report should contain a valid root
    if (s_minSeqNr != report.interval.min || report.interval.min > report.interval.max) {
      revert InvalidInterval(report.interval);
    }

    if (report.merkleRoot == bytes32(0)) revert InvalidRoot();
    // Disallow duplicate roots as that would reset the timestamp and
    // delay potential manual execution.
    if (s_roots[report.merkleRoot] != 0) revert RootAlreadyCommitted();

    s_minSeqNr = report.interval.max + 1;
    s_roots[report.merkleRoot] = block.timestamp;
    emit ReportAccepted(report);
  }

  // ================================================================
  // │                           Config                             │
  // ================================================================

  /// @notice Returns the static commit store config.
  /// @dev RMN depends on this function, if changing, please notify the RMN maintainers.
  /// @return the configuration.
  function getStaticConfig() external view returns (StaticConfig memory) {
    return StaticConfig({
      chainSelector: i_chainSelector,
      sourceChainSelector: i_sourceChainSelector,
      onRamp: i_onRamp,
      rmnProxy: i_rmnProxy
    });
  }

  /// @notice Returns the dynamic commit store config.
  /// @return the configuration.
  function getDynamicConfig() external view returns (DynamicConfig memory) {
    return s_dynamicConfig;
  }

  /// @notice Sets the dynamic config. This function is called during `setOCR2Config` flow
  function _beforeSetConfig(bytes memory onchainConfig) internal override {
    DynamicConfig memory dynamicConfig = abi.decode(onchainConfig, (DynamicConfig));

    if (dynamicConfig.priceRegistry == address(0)) revert InvalidCommitStoreConfig();

    s_dynamicConfig = dynamicConfig;
    // When the OCR config changes, we reset the price epoch and round
    // since epoch and rounds are scoped per config digest.
    // Note that s_minSeqNr/roots do not need to be reset as the roots persist
    // across reconfigurations and are de-duplicated separately.
    s_latestPriceEpochAndRound = 0;

    emit ConfigSet(
      StaticConfig({
        chainSelector: i_chainSelector,
        sourceChainSelector: i_sourceChainSelector,
        onRamp: i_onRamp,
        rmnProxy: i_rmnProxy
      }),
      dynamicConfig
    );
  }

  // ================================================================
  // │                        Access and RMN                        │
  // ================================================================

  /// @notice Single function to check the status of the commitStore.
  function isUnpausedAndNotCursed() external view returns (bool) {
    return !IRMN(i_rmnProxy).isCursed(bytes16(uint128(i_sourceChainSelector))) && !s_paused;
  }

  /// @notice Modifier to make a function callable only when the contract is not paused.
  modifier whenNotPaused() {
    if (paused()) revert PausedError();
    _;
  }

  /// @notice Returns true if the contract is paused, and false otherwise.
  function paused() public view returns (bool) {
    return s_paused;
  }

  /// @notice Pause the contract
  /// @dev only callable by the owner
  function pause() external onlyOwner {
    s_paused = true;
    emit Paused(msg.sender);
  }

  /// @notice Unpause the contract
  /// @dev only callable by the owner
  function unpause() external onlyOwner {
    s_paused = false;
    emit Unpaused(msg.sender);
  }
}