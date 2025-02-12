// SPDX-License-Identifier: Unknown
pragma solidity 0.8.24;

library Pool {
  // The tag used to signal support for the pool v1 standard
  // bytes4(keccak256("CCIP_POOL_V1"))
  bytes4 public constant CCIP_POOL_V1 = 0xaff2afbf;

  // The number of bytes in the return data for a pool v1 releaseOrMint call.
  // This should match the size of the ReleaseOrMintOutV1 struct.
  uint16 public constant CCIP_POOL_V1_RET_BYTES = 32;

  // The default max number of bytes in the return data for a pool v1 lockOrBurn call.
  // This data can be used to send information to the destination chain token pool. Can be overwritten
  // in the TokenTransferFeeConfig.destBytesOverhead if more data is required.
  uint32 public constant CCIP_LOCK_OR_BURN_V1_RET_BYTES = 32;

  struct LockOrBurnInV1 {
    bytes receiver; //  The recipient of the tokens on the destination chain, abi encoded
    uint64 remoteChainSelector; // ─╮ The chain ID of the destination chain
    address originalSender; // ─────╯ The original sender of the tx on the source chain
    uint256 amount; //  The amount of tokens to lock or burn, denominated in the source token's decimals
    address localToken; //  The address on this chain of the token to lock or burn
  }

  struct LockOrBurnOutV1 {
    // The address of the destination token, abi encoded in the case of EVM chains
    // This value is UNTRUSTED as any pool owner can return whatever value they want.
    bytes destTokenAddress;
    // Optional pool data to be transferred to the destination chain. Be default this is capped at
    // CCIP_LOCK_OR_BURN_V1_RET_BYTES bytes. If more data is required, the TokenTransferFeeConfig.destBytesOverhead
    // has to be set for the specific token.
    bytes destPoolData;
  }

  struct ReleaseOrMintInV1 {
    bytes originalSender; //          The original sender of the tx on the source chain
    uint64 remoteChainSelector; // ─╮ The chain ID of the source chain
    address receiver; // ───────────╯ The recipient of the tokens on the destination chain.
    uint256 amount; //                The amount of tokens to release or mint, denominated in the source token's decimals
    address localToken; //            The address on this chain of the token to release or mint
    /// @dev WARNING: sourcePoolAddress should be checked prior to any processing of funds. Make sure it matches the
    /// expected pool address for the given remoteChainSelector.
    bytes sourcePoolAddress; //       The address of the source pool, abi encoded in the case of EVM chains
    bytes sourcePoolData; //          The data received from the source pool to process the release or mint
    /// @dev WARNING: offchainTokenData is untrusted data.
    bytes offchainTokenData; //       The offchain data to process the release or mint
  }

  struct ReleaseOrMintOutV1 {
    // The number of tokens released or minted on the destination chain, denominated in the local token's decimals.
    // This value is expected to be equal to the ReleaseOrMintInV1.amount in the case where the source and destination
    // chain have the same number of decimals.
    uint256 destinationAmount;
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

library EnumerableSet {
    // To implement this library for multiple types with as little code
    // repetition as possible, we write it in terms of a generic Set type with
    // bytes32 values.
    // The Set implementation uses private functions, and user-facing
    // implementations (such as AddressSet) are just wrappers around the
    // underlying Set.
    // This means that we can only create new EnumerableSets for types that fit
    // in bytes32.

    struct Set {
        // Storage of set values
        bytes32[] _values;
        // Position is the index of the value in the `values` array plus 1.
        // Position 0 is used to mean a value is not in the set.
        mapping(bytes32 value => uint256) _positions;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function _add(Set storage set, bytes32 value) private returns (bool) {
        if (!_contains(set, value)) {
            set._values.push(value);
            // The value is stored at length-1, but we add 1 to all indexes
            // and use 0 as a sentinel value
            set._positions[value] = set._values.length;
            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function _remove(Set storage set, bytes32 value) private returns (bool) {
        // We cache the value's position to prevent multiple reads from the same storage slot
        uint256 position = set._positions[value];

        if (position != 0) {
            // Equivalent to contains(set, value)
            // To delete an element from the _values array in O(1), we swap the element to delete with the last one in
            // the array, and then remove the last element (sometimes called as 'swap and pop').
            // This modifies the order of the array, as noted in {at}.

            uint256 valueIndex = position - 1;
            uint256 lastIndex = set._values.length - 1;

            if (valueIndex != lastIndex) {
                bytes32 lastValue = set._values[lastIndex];

                // Move the lastValue to the index where the value to delete is
                set._values[valueIndex] = lastValue;
                // Update the tracked position of the lastValue (that was just moved)
                set._positions[lastValue] = position;
            }

            // Delete the slot where the moved value was stored
            set._values.pop();

            // Delete the tracked position for the deleted slot
            delete set._positions[value];

            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function _contains(Set storage set, bytes32 value) private view returns (bool) {
        return set._positions[value] != 0;
    }

    /**
     * @dev Returns the number of values on the set. O(1).
     */
    function _length(Set storage set) private view returns (uint256) {
        return set._values.length;
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function _at(Set storage set, uint256 index) private view returns (bytes32) {
        return set._values[index];
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function _values(Set storage set) private view returns (bytes32[] memory) {
        return set._values;
    }

    // Bytes32Set

    struct Bytes32Set {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(Bytes32Set storage set, bytes32 value) internal returns (bool) {
        return _add(set._inner, value);
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(Bytes32Set storage set, bytes32 value) internal returns (bool) {
        return _remove(set._inner, value);
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(Bytes32Set storage set, bytes32 value) internal view returns (bool) {
        return _contains(set._inner, value);
    }

    /**
     * @dev Returns the number of values in the set. O(1).
     */
    function length(Bytes32Set storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(Bytes32Set storage set, uint256 index) internal view returns (bytes32) {
        return _at(set._inner, index);
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function values(Bytes32Set storage set) internal view returns (bytes32[] memory) {
        bytes32[] memory store = _values(set._inner);
        bytes32[] memory result;

        /// @solidity memory-safe-assembly
        assembly {
            result := store
        }

        return result;
    }

    // AddressSet

    struct AddressSet {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(AddressSet storage set, address value) internal returns (bool) {
        return _add(set._inner, bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(AddressSet storage set, address value) internal returns (bool) {
        return _remove(set._inner, bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(AddressSet storage set, address value) internal view returns (bool) {
        return _contains(set._inner, bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Returns the number of values in the set. O(1).
     */
    function length(AddressSet storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(AddressSet storage set, uint256 index) internal view returns (address) {
        return address(uint160(uint256(_at(set._inner, index))));
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function values(AddressSet storage set) internal view returns (address[] memory) {
        bytes32[] memory store = _values(set._inner);
        address[] memory result;

        /// @solidity memory-safe-assembly
        assembly {
            result := store
        }

        return result;
    }

    // UintSet

    struct UintSet {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(UintSet storage set, uint256 value) internal returns (bool) {
        return _add(set._inner, bytes32(value));
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(UintSet storage set, uint256 value) internal returns (bool) {
        return _remove(set._inner, bytes32(value));
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(UintSet storage set, uint256 value) internal view returns (bool) {
        return _contains(set._inner, bytes32(value));
    }

    /**
     * @dev Returns the number of values in the set. O(1).
     */
    function length(UintSet storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(UintSet storage set, uint256 index) internal view returns (uint256) {
        return uint256(_at(set._inner, index));
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function values(UintSet storage set) internal view returns (uint256[] memory) {
        bytes32[] memory store = _values(set._inner);
        uint256[] memory result;

        /// @solidity memory-safe-assembly
        assembly {
            result := store
        }

        return result;
    }
}

library EnumerableMap {
    using EnumerableSet for EnumerableSet.Bytes32Set;

    // To implement this library for multiple types with as little code repetition as possible, we write it in
    // terms of a generic Map type with bytes32 keys and values. The Map implementation uses private functions,
    // and user-facing implementations such as `UintToAddressMap` are just wrappers around the underlying Map.
    // This means that we can only create new EnumerableMaps for types that fit in bytes32.

    /**
     * @dev Query for a nonexistent map key.
     */
    error EnumerableMapNonexistentKey(bytes32 key);

    struct Bytes32ToBytes32Map {
        // Storage of keys
        EnumerableSet.Bytes32Set _keys;
        mapping(bytes32 key => bytes32) _values;
    }

    /**
     * @dev Adds a key-value pair to a map, or updates the value for an existing
     * key. O(1).
     *
     * Returns true if the key was added to the map, that is if it was not
     * already present.
     */
    function set(Bytes32ToBytes32Map storage map, bytes32 key, bytes32 value) internal returns (bool) {
        map._values[key] = value;
        return map._keys.add(key);
    }

    /**
     * @dev Removes a key-value pair from a map. O(1).
     *
     * Returns true if the key was removed from the map, that is if it was present.
     */
    function remove(Bytes32ToBytes32Map storage map, bytes32 key) internal returns (bool) {
        delete map._values[key];
        return map._keys.remove(key);
    }

    /**
     * @dev Returns true if the key is in the map. O(1).
     */
    function contains(Bytes32ToBytes32Map storage map, bytes32 key) internal view returns (bool) {
        return map._keys.contains(key);
    }

    /**
     * @dev Returns the number of key-value pairs in the map. O(1).
     */
    function length(Bytes32ToBytes32Map storage map) internal view returns (uint256) {
        return map._keys.length();
    }

    /**
     * @dev Returns the key-value pair stored at position `index` in the map. O(1).
     *
     * Note that there are no guarantees on the ordering of entries inside the
     * array, and it may change when more entries are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(Bytes32ToBytes32Map storage map, uint256 index) internal view returns (bytes32, bytes32) {
        bytes32 key = map._keys.at(index);
        return (key, map._values[key]);
    }

    /**
     * @dev Tries to returns the value associated with `key`. O(1).
     * Does not revert if `key` is not in the map.
     */
    function tryGet(Bytes32ToBytes32Map storage map, bytes32 key) internal view returns (bool, bytes32) {
        bytes32 value = map._values[key];
        if (value == bytes32(0)) {
            return (contains(map, key), bytes32(0));
        } else {
            return (true, value);
        }
    }

    /**
     * @dev Returns the value associated with `key`. O(1).
     *
     * Requirements:
     *
     * - `key` must be in the map.
     */
    function get(Bytes32ToBytes32Map storage map, bytes32 key) internal view returns (bytes32) {
        bytes32 value = map._values[key];
        if (value == 0 && !contains(map, key)) {
            revert EnumerableMapNonexistentKey(key);
        }
        return value;
    }

    /**
     * @dev Return the an array containing all the keys
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the map grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function keys(Bytes32ToBytes32Map storage map) internal view returns (bytes32[] memory) {
        return map._keys.values();
    }

    // UintToUintMap

    struct UintToUintMap {
        Bytes32ToBytes32Map _inner;
    }

    /**
     * @dev Adds a key-value pair to a map, or updates the value for an existing
     * key. O(1).
     *
     * Returns true if the key was added to the map, that is if it was not
     * already present.
     */
    function set(UintToUintMap storage map, uint256 key, uint256 value) internal returns (bool) {
        return set(map._inner, bytes32(key), bytes32(value));
    }

    /**
     * @dev Removes a value from a map. O(1).
     *
     * Returns true if the key was removed from the map, that is if it was present.
     */
    function remove(UintToUintMap storage map, uint256 key) internal returns (bool) {
        return remove(map._inner, bytes32(key));
    }

    /**
     * @dev Returns true if the key is in the map. O(1).
     */
    function contains(UintToUintMap storage map, uint256 key) internal view returns (bool) {
        return contains(map._inner, bytes32(key));
    }

    /**
     * @dev Returns the number of elements in the map. O(1).
     */
    function length(UintToUintMap storage map) internal view returns (uint256) {
        return length(map._inner);
    }

    /**
     * @dev Returns the element stored at position `index` in the map. O(1).
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(UintToUintMap storage map, uint256 index) internal view returns (uint256, uint256) {
        (bytes32 key, bytes32 value) = at(map._inner, index);
        return (uint256(key), uint256(value));
    }

    /**
     * @dev Tries to returns the value associated with `key`. O(1).
     * Does not revert if `key` is not in the map.
     */
    function tryGet(UintToUintMap storage map, uint256 key) internal view returns (bool, uint256) {
        (bool success, bytes32 value) = tryGet(map._inner, bytes32(key));
        return (success, uint256(value));
    }

    /**
     * @dev Returns the value associated with `key`. O(1).
     *
     * Requirements:
     *
     * - `key` must be in the map.
     */
    function get(UintToUintMap storage map, uint256 key) internal view returns (uint256) {
        return uint256(get(map._inner, bytes32(key)));
    }

    /**
     * @dev Return the an array containing all the keys
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the map grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function keys(UintToUintMap storage map) internal view returns (uint256[] memory) {
        bytes32[] memory store = keys(map._inner);
        uint256[] memory result;

        /// @solidity memory-safe-assembly
        assembly {
            result := store
        }

        return result;
    }

    // UintToAddressMap

    struct UintToAddressMap {
        Bytes32ToBytes32Map _inner;
    }

    /**
     * @dev Adds a key-value pair to a map, or updates the value for an existing
     * key. O(1).
     *
     * Returns true if the key was added to the map, that is if it was not
     * already present.
     */
    function set(UintToAddressMap storage map, uint256 key, address value) internal returns (bool) {
        return set(map._inner, bytes32(key), bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Removes a value from a map. O(1).
     *
     * Returns true if the key was removed from the map, that is if it was present.
     */
    function remove(UintToAddressMap storage map, uint256 key) internal returns (bool) {
        return remove(map._inner, bytes32(key));
    }

    /**
     * @dev Returns true if the key is in the map. O(1).
     */
    function contains(UintToAddressMap storage map, uint256 key) internal view returns (bool) {
        return contains(map._inner, bytes32(key));
    }

    /**
     * @dev Returns the number of elements in the map. O(1).
     */
    function length(UintToAddressMap storage map) internal view returns (uint256) {
        return length(map._inner);
    }

    /**
     * @dev Returns the element stored at position `index` in the map. O(1).
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(UintToAddressMap storage map, uint256 index) internal view returns (uint256, address) {
        (bytes32 key, bytes32 value) = at(map._inner, index);
        return (uint256(key), address(uint160(uint256(value))));
    }

    /**
     * @dev Tries to returns the value associated with `key`. O(1).
     * Does not revert if `key` is not in the map.
     */
    function tryGet(UintToAddressMap storage map, uint256 key) internal view returns (bool, address) {
        (bool success, bytes32 value) = tryGet(map._inner, bytes32(key));
        return (success, address(uint160(uint256(value))));
    }

    /**
     * @dev Returns the value associated with `key`. O(1).
     *
     * Requirements:
     *
     * - `key` must be in the map.
     */
    function get(UintToAddressMap storage map, uint256 key) internal view returns (address) {
        return address(uint160(uint256(get(map._inner, bytes32(key)))));
    }

    /**
     * @dev Return the an array containing all the keys
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the map grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function keys(UintToAddressMap storage map) internal view returns (uint256[] memory) {
        bytes32[] memory store = keys(map._inner);
        uint256[] memory result;

        /// @solidity memory-safe-assembly
        assembly {
            result := store
        }

        return result;
    }

    // AddressToUintMap

    struct AddressToUintMap {
        Bytes32ToBytes32Map _inner;
    }

    /**
     * @dev Adds a key-value pair to a map, or updates the value for an existing
     * key. O(1).
     *
     * Returns true if the key was added to the map, that is if it was not
     * already present.
     */
    function set(AddressToUintMap storage map, address key, uint256 value) internal returns (bool) {
        return set(map._inner, bytes32(uint256(uint160(key))), bytes32(value));
    }

    /**
     * @dev Removes a value from a map. O(1).
     *
     * Returns true if the key was removed from the map, that is if it was present.
     */
    function remove(AddressToUintMap storage map, address key) internal returns (bool) {
        return remove(map._inner, bytes32(uint256(uint160(key))));
    }

    /**
     * @dev Returns true if the key is in the map. O(1).
     */
    function contains(AddressToUintMap storage map, address key) internal view returns (bool) {
        return contains(map._inner, bytes32(uint256(uint160(key))));
    }

    /**
     * @dev Returns the number of elements in the map. O(1).
     */
    function length(AddressToUintMap storage map) internal view returns (uint256) {
        return length(map._inner);
    }

    /**
     * @dev Returns the element stored at position `index` in the map. O(1).
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(AddressToUintMap storage map, uint256 index) internal view returns (address, uint256) {
        (bytes32 key, bytes32 value) = at(map._inner, index);
        return (address(uint160(uint256(key))), uint256(value));
    }

    /**
     * @dev Tries to returns the value associated with `key`. O(1).
     * Does not revert if `key` is not in the map.
     */
    function tryGet(AddressToUintMap storage map, address key) internal view returns (bool, uint256) {
        (bool success, bytes32 value) = tryGet(map._inner, bytes32(uint256(uint160(key))));
        return (success, uint256(value));
    }

    /**
     * @dev Returns the value associated with `key`. O(1).
     *
     * Requirements:
     *
     * - `key` must be in the map.
     */
    function get(AddressToUintMap storage map, address key) internal view returns (uint256) {
        return uint256(get(map._inner, bytes32(uint256(uint160(key)))));
    }

    /**
     * @dev Return the an array containing all the keys
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the map grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function keys(AddressToUintMap storage map) internal view returns (address[] memory) {
        bytes32[] memory store = keys(map._inner);
        address[] memory result;

        /// @solidity memory-safe-assembly
        assembly {
            result := store
        }

        return result;
    }

    // Bytes32ToUintMap

    struct Bytes32ToUintMap {
        Bytes32ToBytes32Map _inner;
    }

    /**
     * @dev Adds a key-value pair to a map, or updates the value for an existing
     * key. O(1).
     *
     * Returns true if the key was added to the map, that is if it was not
     * already present.
     */
    function set(Bytes32ToUintMap storage map, bytes32 key, uint256 value) internal returns (bool) {
        return set(map._inner, key, bytes32(value));
    }

    /**
     * @dev Removes a value from a map. O(1).
     *
     * Returns true if the key was removed from the map, that is if it was present.
     */
    function remove(Bytes32ToUintMap storage map, bytes32 key) internal returns (bool) {
        return remove(map._inner, key);
    }

    /**
     * @dev Returns true if the key is in the map. O(1).
     */
    function contains(Bytes32ToUintMap storage map, bytes32 key) internal view returns (bool) {
        return contains(map._inner, key);
    }

    /**
     * @dev Returns the number of elements in the map. O(1).
     */
    function length(Bytes32ToUintMap storage map) internal view returns (uint256) {
        return length(map._inner);
    }

    /**
     * @dev Returns the element stored at position `index` in the map. O(1).
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(Bytes32ToUintMap storage map, uint256 index) internal view returns (bytes32, uint256) {
        (bytes32 key, bytes32 value) = at(map._inner, index);
        return (key, uint256(value));
    }

    /**
     * @dev Tries to returns the value associated with `key`. O(1).
     * Does not revert if `key` is not in the map.
     */
    function tryGet(Bytes32ToUintMap storage map, bytes32 key) internal view returns (bool, uint256) {
        (bool success, bytes32 value) = tryGet(map._inner, key);
        return (success, uint256(value));
    }

    /**
     * @dev Returns the value associated with `key`. O(1).
     *
     * Requirements:
     *
     * - `key` must be in the map.
     */
    function get(Bytes32ToUintMap storage map, bytes32 key) internal view returns (uint256) {
        return uint256(get(map._inner, key));
    }

    /**
     * @dev Return the an array containing all the keys
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the map grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function keys(Bytes32ToUintMap storage map) internal view returns (bytes32[] memory) {
        bytes32[] memory store = keys(map._inner);
        bytes32[] memory result;

        /// @solidity memory-safe-assembly
        assembly {
            result := store
        }

        return result;
    }
}

library Address {
  /**
   * @dev Returns true if `account` is a contract.
   *
   * [IMPORTANT]
   * ====
   * It is unsafe to assume that an address for which this function returns
   * false is an externally-owned account (EOA) and not a contract.
   *
   * Among others, `isContract` will return false for the following
   * types of addresses:
   *
   *  - an externally-owned account
   *  - a contract in construction
   *  - an address where a contract will be created
   *  - an address where a contract lived, but was destroyed
   * ====
   *
   * [IMPORTANT]
   * ====
   * You shouldn't rely on `isContract` to protect against flash loan attacks!
   *
   * Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets
   * like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract
   * constructor.
   * ====
   */
  function isContract(address account) internal view returns (bool) {
    // This method relies on extcodesize/address.code.length, which returns 0
    // for contracts in construction, since the code is only stored at the end
    // of the constructor execution.

    return account.code.length > 0;
  }

  /**
   * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
   * `recipient`, forwarding all available gas and reverting on errors.
   *
   * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
   * of certain opcodes, possibly making contracts go over the 2300 gas limit
   * imposed by `transfer`, making them unable to receive funds via
   * `transfer`. {sendValue} removes this limitation.
   *
   * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
   *
   * IMPORTANT: because control is transferred to `recipient`, care must be
   * taken to not create reentrancy vulnerabilities. Consider using
   * {ReentrancyGuard} or the
   * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
   */
  function sendValue(address payable recipient, uint256 amount) internal {
    require(address(this).balance >= amount, "Address: insufficient balance");

    (bool success, ) = recipient.call{value: amount}("");
    require(success, "Address: unable to send value, recipient may have reverted");
  }

  /**
   * @dev Performs a Solidity function call using a low level `call`. A
   * plain `call` is an unsafe replacement for a function call: use this
   * function instead.
   *
   * If `target` reverts with a revert reason, it is bubbled up by this
   * function (like regular Solidity function calls).
   *
   * Returns the raw returned data. To convert to the expected return value,
   * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
   *
   * Requirements:
   *
   * - `target` must be a contract.
   * - calling `target` with `data` must not revert.
   *
   * _Available since v3.1._
   */
  function functionCall(address target, bytes memory data) internal returns (bytes memory) {
    return functionCallWithValue(target, data, 0, "Address: low-level call failed");
  }

  /**
   * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
   * `errorMessage` as a fallback revert reason when `target` reverts.
   *
   * _Available since v3.1._
   */
  function functionCall(address target, bytes memory data, string memory errorMessage) internal returns (bytes memory) {
    return functionCallWithValue(target, data, 0, errorMessage);
  }

  /**
   * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
   * but also transferring `value` wei to `target`.
   *
   * Requirements:
   *
   * - the calling contract must have an ETH balance of at least `value`.
   * - the called Solidity function must be `payable`.
   *
   * _Available since v3.1._
   */
  function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
    return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
  }

  /**
   * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
   * with `errorMessage` as a fallback revert reason when `target` reverts.
   *
   * _Available since v3.1._
   */
  function functionCallWithValue(
    address target,
    bytes memory data,
    uint256 value,
    string memory errorMessage
  ) internal returns (bytes memory) {
    require(address(this).balance >= value, "Address: insufficient balance for call");
    (bool success, bytes memory returndata) = target.call{value: value}(data);
    return verifyCallResultFromTarget(target, success, returndata, errorMessage);
  }

  /**
   * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
   * but performing a static call.
   *
   * _Available since v3.3._
   */
  function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
    return functionStaticCall(target, data, "Address: low-level static call failed");
  }

  /**
   * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
   * but performing a static call.
   *
   * _Available since v3.3._
   */
  function functionStaticCall(
    address target,
    bytes memory data,
    string memory errorMessage
  ) internal view returns (bytes memory) {
    (bool success, bytes memory returndata) = target.staticcall(data);
    return verifyCallResultFromTarget(target, success, returndata, errorMessage);
  }

  /**
   * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
   * but performing a delegate call.
   *
   * _Available since v3.4._
   */
  function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
    return functionDelegateCall(target, data, "Address: low-level delegate call failed");
  }

  /**
   * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
   * but performing a delegate call.
   *
   * _Available since v3.4._
   */
  function functionDelegateCall(
    address target,
    bytes memory data,
    string memory errorMessage
  ) internal returns (bytes memory) {
    (bool success, bytes memory returndata) = target.delegatecall(data);
    return verifyCallResultFromTarget(target, success, returndata, errorMessage);
  }

  /**
   * @dev Tool to verify that a low level call to smart-contract was successful, and revert (either by bubbling
   * the revert reason or using the provided one) in case of unsuccessful call or if target was not a contract.
   *
   * _Available since v4.8._
   */
  function verifyCallResultFromTarget(
    address target,
    bool success,
    bytes memory returndata,
    string memory errorMessage
  ) internal view returns (bytes memory) {
    if (success) {
      if (returndata.length == 0) {
        // only check isContract if the call was successful and the return data is empty
        // otherwise we already know that it was a contract
        require(isContract(target), "Address: call to non-contract");
      }
      return returndata;
    } else {
      _revert(returndata, errorMessage);
    }
  }

  /**
   * @dev Tool to verify that a low level call was successful, and revert if it wasn't, either by bubbling the
   * revert reason or using the provided one.
   *
   * _Available since v4.3._
   */
  function verifyCallResult(
    bool success,
    bytes memory returndata,
    string memory errorMessage
  ) internal pure returns (bytes memory) {
    if (success) {
      return returndata;
    } else {
      _revert(returndata, errorMessage);
    }
  }

  function _revert(bytes memory returndata, string memory errorMessage) private pure {
    // Look for revert reason and bubble it up if present
    if (returndata.length > 0) {
      // The easiest way to bubble the revert reason is using memory via assembly
      /// @solidity memory-safe-assembly
      assembly {
        let returndata_size := mload(returndata)
        revert(add(32, returndata), returndata_size)
      }
    } else {
      revert(errorMessage);
    }
  }
}

library SafeERC20 {
  using Address for address;

  function safeTransfer(IERC20 token, address to, uint256 value) internal {
    _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
  }

  function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
    _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
  }

  /**
   * @dev Deprecated. This function has issues similar to the ones found in
   * {IERC20-approve}, and its usage is discouraged.
   *
   * Whenever possible, use {safeIncreaseAllowance} and
   * {safeDecreaseAllowance} instead.
   */
  function safeApprove(IERC20 token, address spender, uint256 value) internal {
    // safeApprove should only be called when setting an initial allowance,
    // or when resetting it to zero. To increase and decrease it, use
    // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
    require(
      (value == 0) || (token.allowance(address(this), spender) == 0),
      "SafeERC20: approve from non-zero to non-zero allowance"
    );
    _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
  }

  function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {
    uint256 newAllowance = token.allowance(address(this), spender) + value;
    _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
  }

  function safeDecreaseAllowance(IERC20 token, address spender, uint256 value) internal {
    unchecked {
      uint256 oldAllowance = token.allowance(address(this), spender);
      require(oldAllowance >= value, "SafeERC20: decreased allowance below zero");
      uint256 newAllowance = oldAllowance - value;
      _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }
  }

  function safePermit(
    IERC20Permit token,
    address owner,
    address spender,
    uint256 value,
    uint256 deadline,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) internal {
    uint256 nonceBefore = token.nonces(owner);
    token.permit(owner, spender, value, deadline, v, r, s);
    uint256 nonceAfter = token.nonces(owner);
    require(nonceAfter == nonceBefore + 1, "SafeERC20: permit did not succeed");
  }

  /**
   * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
   * on the return value: the return value is optional (but if data is returned, it must not be false).
   * @param token The token targeted by the call.
   * @param data The call data (encoded using abi.encode or one of its variants).
   */
  function _callOptionalReturn(IERC20 token, bytes memory data) private {
    // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
    // we're implementing it ourselves. We use {Address-functionCall} to perform this call, which verifies that
    // the target address contains contract code and also asserts for success in the low-level call.

    bytes memory returndata = address(token).functionCall(data, "SafeERC20: low-level call failed");
    if (returndata.length > 0) {
      // Return data is optional
      require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
    }
  }
}

interface ITypeAndVersion {
  function typeAndVersion() external pure returns (string memory);
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

library RateLimiter {
  error BucketOverfilled();
  error OnlyCallableByAdminOrOwner();
  error TokenMaxCapacityExceeded(uint256 capacity, uint256 requested, address tokenAddress);
  error TokenRateLimitReached(uint256 minWaitInSeconds, uint256 available, address tokenAddress);
  error AggregateValueMaxCapacityExceeded(uint256 capacity, uint256 requested);
  error AggregateValueRateLimitReached(uint256 minWaitInSeconds, uint256 available);
  error InvalidRateLimitRate(Config rateLimiterConfig);
  error DisabledNonZeroRateLimit(Config config);
  error RateLimitMustBeDisabled();

  event TokensConsumed(uint256 tokens);
  event ConfigChanged(Config config);

  struct TokenBucket {
    uint128 tokens; // ──────╮ Current number of tokens that are in the bucket.
    uint32 lastUpdated; //   │ Timestamp in seconds of the last token refill, good for 100+ years.
    bool isEnabled; // ──────╯ Indication whether the rate limiting is enabled or not
    uint128 capacity; // ────╮ Maximum number of tokens that can be in the bucket.
    uint128 rate; // ────────╯ Number of tokens per second that the bucket is refilled.
  }

  struct Config {
    bool isEnabled; // Indication whether the rate limiting should be enabled
    uint128 capacity; // ────╮ Specifies the capacity of the rate limiter
    uint128 rate; //  ───────╯ Specifies the rate of the rate limiter
  }

  /// @notice _consume removes the given tokens from the pool, lowering the
  /// rate tokens allowed to be consumed for subsequent calls.
  /// @param requestTokens The total tokens to be consumed from the bucket.
  /// @param tokenAddress The token to consume capacity for, use 0x0 to indicate aggregate value capacity.
  /// @dev Reverts when requestTokens exceeds bucket capacity or available tokens in the bucket
  /// @dev emits removal of requestTokens if requestTokens is > 0
  function _consume(TokenBucket storage s_bucket, uint256 requestTokens, address tokenAddress) internal {
    // If there is no value to remove or rate limiting is turned off, skip this step to reduce gas usage
    if (!s_bucket.isEnabled || requestTokens == 0) {
      return;
    }

    uint256 tokens = s_bucket.tokens;
    uint256 capacity = s_bucket.capacity;
    uint256 timeDiff = block.timestamp - s_bucket.lastUpdated;

    if (timeDiff != 0) {
      if (tokens > capacity) revert BucketOverfilled();

      // Refill tokens when arriving at a new block time
      tokens = _calculateRefill(capacity, tokens, timeDiff, s_bucket.rate);

      s_bucket.lastUpdated = uint32(block.timestamp);
    }

    if (capacity < requestTokens) {
      // Token address 0 indicates consuming aggregate value rate limit capacity.
      if (tokenAddress == address(0)) revert AggregateValueMaxCapacityExceeded(capacity, requestTokens);
      revert TokenMaxCapacityExceeded(capacity, requestTokens, tokenAddress);
    }
    if (tokens < requestTokens) {
      uint256 rate = s_bucket.rate;
      // Wait required until the bucket is refilled enough to accept this value, round up to next higher second
      // Consume is not guaranteed to succeed after wait time passes if there is competing traffic.
      // This acts as a lower bound of wait time.
      uint256 minWaitInSeconds = ((requestTokens - tokens) + (rate - 1)) / rate;

      if (tokenAddress == address(0)) revert AggregateValueRateLimitReached(minWaitInSeconds, tokens);
      revert TokenRateLimitReached(minWaitInSeconds, tokens, tokenAddress);
    }
    tokens -= requestTokens;

    // Downcast is safe here, as tokens is not larger than capacity
    s_bucket.tokens = uint128(tokens);
    emit TokensConsumed(requestTokens);
  }

  /// @notice Gets the token bucket with its values for the block it was requested at.
  /// @return The token bucket.
  function _currentTokenBucketState(TokenBucket memory bucket) internal view returns (TokenBucket memory) {
    // We update the bucket to reflect the status at the exact time of the
    // call. This means we might need to refill a part of the bucket based
    // on the time that has passed since the last update.
    bucket.tokens =
      uint128(_calculateRefill(bucket.capacity, bucket.tokens, block.timestamp - bucket.lastUpdated, bucket.rate));
    bucket.lastUpdated = uint32(block.timestamp);
    return bucket;
  }

  /// @notice Sets the rate limited config.
  /// @param s_bucket The token bucket
  /// @param config The new config
  function _setTokenBucketConfig(TokenBucket storage s_bucket, Config memory config) internal {
    // First update the bucket to make sure the proper rate is used for all the time
    // up until the config change.
    uint256 timeDiff = block.timestamp - s_bucket.lastUpdated;
    if (timeDiff != 0) {
      s_bucket.tokens = uint128(_calculateRefill(s_bucket.capacity, s_bucket.tokens, timeDiff, s_bucket.rate));

      s_bucket.lastUpdated = uint32(block.timestamp);
    }

    s_bucket.tokens = uint128(_min(config.capacity, s_bucket.tokens));
    s_bucket.isEnabled = config.isEnabled;
    s_bucket.capacity = config.capacity;
    s_bucket.rate = config.rate;

    emit ConfigChanged(config);
  }

  /// @notice Validates the token bucket config
  function _validateTokenBucketConfig(Config memory config, bool mustBeDisabled) internal pure {
    if (config.isEnabled) {
      if (config.rate >= config.capacity || config.rate == 0) {
        revert InvalidRateLimitRate(config);
      }
      if (mustBeDisabled) {
        revert RateLimitMustBeDisabled();
      }
    } else {
      if (config.rate != 0 || config.capacity != 0) {
        revert DisabledNonZeroRateLimit(config);
      }
    }
  }

  /// @notice Calculate refilled tokens
  /// @param capacity bucket capacity
  /// @param tokens current bucket tokens
  /// @param timeDiff block time difference since last refill
  /// @param rate bucket refill rate
  /// @return the value of tokens after refill
  function _calculateRefill(
    uint256 capacity,
    uint256 tokens,
    uint256 timeDiff,
    uint256 rate
  ) private pure returns (uint256) {
    return _min(capacity, tokens + timeDiff * rate);
  }

  /// @notice Return the smallest of two integers
  /// @param a first int
  /// @param b second int
  /// @return smallest
  function _min(uint256 a, uint256 b) internal pure returns (uint256) {
    return a < b ? a : b;
  }
}

library USDPriceWith18Decimals {
  /// @notice Takes a price in USD, with 18 decimals per 1e18 token amount,
  /// and amount of the smallest token denomination,
  /// calculates the value in USD with 18 decimals.
  /// @param tokenPrice The USD price of the token.
  /// @param tokenAmount Amount of the smallest token denomination.
  /// @return USD value with 18 decimals.
  /// @dev this function assumes that no more than 1e59 US dollar worth of token is passed in.
  /// If more is sent, this function will overflow and revert.
  /// Since there isn't even close to 1e59 dollars, this is ok for all legit tokens.
  function _calcUSDValueFromTokenAmount(uint224 tokenPrice, uint256 tokenAmount) internal pure returns (uint256) {
    /// LINK Example:
    /// tokenPrice:         8e18 -> $8/LINK, as 1e18 token amount is 1 LINK, worth 8 USD, or 8e18 with 18 decimals
    /// tokenAmount:        2e18 -> 2 LINK
    /// result:             8e18 * 2e18 / 1e18 -> 16e18 with 18 decimals = $16

    /// USDC Example:
    /// tokenPrice:         1e30 -> $1/USDC, as 1e18 token amount is 1e12 USDC, worth 1e12 USD, or 1e30 with 18 decimals
    /// tokenAmount:        5e6  -> 5 USDC
    /// result:             1e30 * 5e6 / 1e18 -> 5e18 with 18 decimals = $5
    return (tokenPrice * tokenAmount) / 1e18;
  }

  /// @notice Takes a price in USD, with 18 decimals per 1e18 token amount,
  /// and USD value with 18 decimals,
  /// calculates amount of the smallest token denomination.
  /// @param tokenPrice The USD price of the token.
  /// @param usdValue USD value with 18 decimals.
  /// @return Amount of the smallest token denomination.
  function _calcTokenAmountFromUSDValue(uint224 tokenPrice, uint256 usdValue) internal pure returns (uint256) {
    /// LINK Example:
    /// tokenPrice:          8e18 -> $8/LINK, as 1e18 token amount is 1 LINK, worth 8 USD, or 8e18 with 18 decimals
    /// usdValue:           16e18 -> $16
    /// result:             16e18 * 1e18 / 8e18 -> 2e18 = 2 LINK

    /// USDC Example:
    /// tokenPrice:         1e30 -> $1/USDC, as 1e18 token amount is 1e12 USDC, worth 1e12 USD, or 1e30 with 18 decimals
    /// usdValue:           5e18 -> $5
    /// result:             5e18 * 1e18 / 1e30 -> 5e6 = 5 USDC
    return (usdValue * 1e18) / tokenPrice;
  }
}

contract AggregateRateLimiter is OwnerIsCreator {
  using RateLimiter for RateLimiter.TokenBucket;
  using USDPriceWith18Decimals for uint224;

  error PriceNotFoundForToken(address token);

  event AdminSet(address newAdmin);

  // The address of the token limit admin that has the same permissions as the owner.
  address internal s_admin;

  // The token bucket object that contains the bucket state.
  RateLimiter.TokenBucket private s_rateLimiter;

  /// @param config The RateLimiter.Config
  constructor(RateLimiter.Config memory config) {
    s_rateLimiter = RateLimiter.TokenBucket({
      rate: config.rate,
      capacity: config.capacity,
      tokens: config.capacity,
      lastUpdated: uint32(block.timestamp),
      isEnabled: config.isEnabled
    });
  }

  /// @notice Consumes value from the rate limiter bucket based on the token value given.
  function _rateLimitValue(uint256 value) internal {
    s_rateLimiter._consume(value, address(0));
  }

  function _getTokenValue(
    Client.EVMTokenAmount memory tokenAmount,
    IPriceRegistry priceRegistry
  ) internal view returns (uint256) {
    // not fetching validated price, as price staleness is not important for value-based rate limiting
    // we only need to verify the price is not 0
    uint224 pricePerToken = priceRegistry.getTokenPrice(tokenAmount.token).value;
    if (pricePerToken == 0) revert PriceNotFoundForToken(tokenAmount.token);
    return pricePerToken._calcUSDValueFromTokenAmount(tokenAmount.amount);
  }

  /// @notice Gets the token bucket with its values for the block it was requested at.
  /// @return The token bucket.
  function currentRateLimiterState() external view returns (RateLimiter.TokenBucket memory) {
    return s_rateLimiter._currentTokenBucketState();
  }

  /// @notice Sets the rate limited config.
  /// @param config The new rate limiter config.
  /// @dev should only be callable by the owner or token limit admin.
  function setRateLimiterConfig(RateLimiter.Config memory config) external onlyAdminOrOwner {
    s_rateLimiter._setTokenBucketConfig(config);
  }

  // ================================================================
  // │                           Access                             │
  // ================================================================

  /// @notice Gets the token limit admin address.
  /// @return the token limit admin address.
  function getTokenLimitAdmin() external view returns (address) {
    return s_admin;
  }

  /// @notice Sets the token limit admin address.
  /// @param newAdmin the address of the new admin.
  /// @dev setting this to address(0) indicates there is no active admin.
  function setAdmin(address newAdmin) external onlyAdminOrOwner {
    s_admin = newAdmin;
    emit AdminSet(newAdmin);
  }

  /// @notice a modifier that allows the owner or the s_tokenLimitAdmin call the functions
  /// it is applied to.
  modifier onlyAdminOrOwner() {
    if (msg.sender != owner() && msg.sender != s_admin) revert RateLimiter.OnlyCallableByAdminOrOwner();
    _;
  }
}

interface ILinkAvailable {
  function linkAvailableForPayment() external view returns (int256 availableBalance);
}

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

interface IEVM2AnyOnRampClient {
  /// @notice Get the fee for a given ccip message
  /// @param destChainSelector The destination chain selector
  /// @param message The message to calculate the cost for
  /// @return fee The calculated fee
  function getFee(uint64 destChainSelector, Client.EVM2AnyMessage calldata message) external view returns (uint256 fee);

  /// @notice Get the pool for a specific token
  /// @param destChainSelector The destination chain selector
  /// @param sourceToken The source chain token to get the pool for
  /// @return pool Token pool
  function getPoolBySourceToken(uint64 destChainSelector, IERC20 sourceToken) external view returns (IPoolV1);

  /// @notice Gets a list of all supported source chain tokens.
  /// @param destChainSelector The destination chain selector
  /// @return tokens The addresses of all tokens that this onRamp supports the given destination chain
  function getSupportedTokens(uint64 destChainSelector) external view returns (address[] memory tokens);

  /// @notice Send a message to the remote chain
  /// @dev only callable by the Router
  /// @dev approve() must have already been called on the token using the this ramp address as the spender.
  /// @dev if the contract is paused, this function will revert.
  /// @param destChainSelector The destination chain selector
  /// @param message Message struct to send
  /// @param feeTokenAmount Amount of fee tokens for payment
  /// @param originalSender The original initiator of the CCIP request
  function forwardFromRouter(
    uint64 destChainSelector,
    Client.EVM2AnyMessage memory message,
    uint256 feeTokenAmount,
    address originalSender
  ) external returns (bytes32);
}

interface IEVM2AnyOnRamp is IEVM2AnyOnRampClient {
  /// @notice Gets the next sequence number to be used in the onRamp
  /// @return the next sequence number to be used
  function getExpectedNextSequenceNumber() external view returns (uint64);

  /// @notice Get the next nonce for a given sender
  /// @param sender The sender to get the nonce for
  /// @return nonce The next nonce for the sender
  function getSenderNonce(address sender) external view returns (uint64 nonce);
}

contract EVM2EVMOnRamp is IEVM2AnyOnRamp, ILinkAvailable, AggregateRateLimiter, ITypeAndVersion {
  using SafeERC20 for IERC20;
  using EnumerableMap for EnumerableMap.AddressToUintMap;
  using USDPriceWith18Decimals for uint224;

  error InvalidExtraArgsTag();
  error ExtraArgOutOfOrderExecutionMustBeTrue();
  error OnlyCallableByOwnerOrAdmin();
  error OnlyCallableByOwnerOrAdminOrNop();
  error InvalidWithdrawParams();
  error NoFeesToPay();
  error NoNopsToPay();
  error InsufficientBalance();
  error TooManyNops();
  error MaxFeeBalanceReached();
  error MessageTooLarge(uint256 maxSize, uint256 actualSize);
  error MessageGasLimitTooHigh();
  error UnsupportedNumberOfTokens();
  error UnsupportedToken(address token);
  error MustBeCalledByRouter();
  error RouterMustSetOriginalSender();
  error InvalidConfig();
  error CursedByRMN();
  error LinkBalanceNotSettled();
  error InvalidNopAddress(address nop);
  error NotAFeeToken(address token);
  error CannotSendZeroTokens();
  error SourceTokenDataTooLarge(address token);
  error InvalidChainSelector(uint64 chainSelector);
  error GetSupportedTokensFunctionalityRemovedCheckAdminRegistry();
  error InvalidDestBytesOverhead(address token, uint32 destBytesOverhead);

  event ConfigSet(StaticConfig staticConfig, DynamicConfig dynamicConfig);
  event NopPaid(address indexed nop, uint256 amount);
  event FeeConfigSet(FeeTokenConfigArgs[] feeConfig);
  event TokenTransferFeeConfigSet(TokenTransferFeeConfigArgs[] transferFeeConfig);
  event TokenTransferFeeConfigDeleted(address[] tokens);
  /// RMN depends on this event, if changing, please notify the RMN maintainers.
  event CCIPSendRequested(Internal.EVM2EVMMessage message);
  event NopsSet(uint256 nopWeightsTotal, NopAndWeight[] nopsAndWeights);

  /// @dev Struct that contains the static configuration
  /// RMN depends on this struct, if changing, please notify the RMN maintainers.
  //solhint-disable gas-struct-packing
  struct StaticConfig {
    address linkToken; // ────────╮ Link token address
    uint64 chainSelector; // ─────╯ Source chainSelector
    uint64 destChainSelector; // ─╮ Destination chainSelector
    uint64 defaultTxGasLimit; //  │ Default gas limit for a tx
    uint96 maxNopFeesJuels; // ───╯ Max nop fee balance onramp can have
    address prevOnRamp; //          Address of previous-version OnRamp
    address rmnProxy; //            Address of RMN proxy
    address tokenAdminRegistry; //  Address of the token admin registry
  }

  /// @dev Struct to contains the dynamic configuration
  struct DynamicConfig {
    address router; // ──────────────────────────╮ Router address
    uint16 maxNumberOfTokensPerMsg; //           │ Maximum number of distinct ERC20 token transferred per message
    uint32 destGasOverhead; //                   │ Gas charged on top of the gasLimit to cover destination chain costs
    uint16 destGasPerPayloadByte; //             │ Destination chain gas charged for passing each byte of `data` payload to receiver
    uint32 destDataAvailabilityOverheadGas; // ──╯ Extra data availability gas charged on top of the message, e.g. for OCR
    uint16 destGasPerDataAvailabilityByte; // ───╮ Amount of gas to charge per byte of message data that needs availability
    uint16 destDataAvailabilityMultiplierBps; // │ Multiplier for data availability gas, multiples of bps, or 0.0001
    address priceRegistry; //                    │ Price registry address
    uint32 maxDataBytes; //                      │ Maximum payload data size in bytes
    uint32 maxPerMsgGasLimit; // ────────────────╯ Maximum gas limit for messages targeting EVMs
    //                                           │
    // The following three properties are defaults, they can be overridden by setting the TokenTransferFeeConfig for a token
    uint16 defaultTokenFeeUSDCents; // ──────────╮ Default token fee charged per token transfer
    uint32 defaultTokenDestGasOverhead; //       │ Default gas charged to execute the token transfer on the destination chain
    bool enforceOutOfOrder; // ──────────────────╯ Whether to enforce the allowOutOfOrderExecution extraArg value to be true.
  }

  /// @dev Struct to hold the execution fee configuration for a fee token
  struct FeeTokenConfig {
    uint32 networkFeeUSDCents; // ─────────╮ Flat network fee to charge for messages,  multiples of 0.01 USD
    uint64 gasMultiplierWeiPerEth; //      │ Multiplier for gas costs, 1e18 based so 11e17 = 10% extra cost.
    uint64 premiumMultiplierWeiPerEth; //  │ Multiplier for fee-token-specific premiums
    bool enabled; // ──────────────────────╯ Whether this fee token is enabled
  }

  /// @dev Struct to hold the fee configuration for a fee token, same as the FeeTokenConfig but with
  /// token included so that an array of these can be passed in to setFeeTokenConfig to set the mapping
  struct FeeTokenConfigArgs {
    address token; // ─────────────────────╮ Token address
    uint32 networkFeeUSDCents; //          │ Flat network fee to charge for messages,  multiples of 0.01 USD
    uint64 gasMultiplierWeiPerEth; // ─────╯ Multiplier for gas costs, 1e18 based so 11e17 = 10% extra cost
    uint64 premiumMultiplierWeiPerEth; // ─╮ Multiplier for fee-token-specific premiums, 1e18 based
    bool enabled; // ──────────────────────╯ Whether this fee token is enabled
  }

  /// @dev Struct to hold the transfer fee configuration for token transfers
  struct TokenTransferFeeConfig {
    uint32 minFeeUSDCents; // ──────────╮ Minimum fee to charge per token transfer, multiples of 0.01 USD
    uint32 maxFeeUSDCents; //           │ Maximum fee to charge per token transfer, multiples of 0.01 USD
    uint16 deciBps; //                  │ Basis points charged on token transfers, multiples of 0.1bps, or 1e-5
    uint32 destGasOverhead; //          │ Gas charged to execute the token transfer on the destination chain
    //                                  │ Extra data availability bytes that are returned from the source pool and sent
    uint32 destBytesOverhead; //        │ to the destination pool. Must be >= Pool.CCIP_LOCK_OR_BURN_V1_RET_BYTES
    bool aggregateRateLimitEnabled; //  │ Whether this transfer token is to be included in Aggregate Rate Limiting
    bool isEnabled; // ─────────────────╯ Whether this token has custom transfer fees
  }

  /// @dev Same as TokenTransferFeeConfig
  /// token included so that an array of these can be passed in to setTokenTransferFeeConfig
  struct TokenTransferFeeConfigArgs {
    address token; // ──────────────────╮ Token address
    uint32 minFeeUSDCents; //           │ Minimum fee to charge per token transfer, multiples of 0.01 USD
    uint32 maxFeeUSDCents; //           │ Maximum fee to charge per token transfer, multiples of 0.01 USD
    uint16 deciBps; // ─────────────────╯ Basis points charged on token transfers, multiples of 0.1bps, or 1e-5
    uint32 destGasOverhead; // ─────────╮ Gas charged to execute the token transfer on the destination chain
    //                                  │ Extra data availability bytes that are returned from the source pool and sent
    uint32 destBytesOverhead; //        │ to the destination pool. Must be >= Pool.CCIP_LOCK_OR_BURN_V1_RET_BYTES
    bool aggregateRateLimitEnabled; // ─╯ Whether this transfer token is to be included in Aggregate Rate Limiting
  }

  /// @dev Nop address and weight, used to set the nops and their weights
  struct NopAndWeight {
    address nop; // ────╮ Address of the node operator
    uint16 weight; // ──╯ Weight for nop rewards
  }

  // STATIC CONFIG
  string public constant override typeAndVersion = "EVM2EVMOnRamp 1.5.0";
  /// @dev metadataHash is a lane-specific prefix for a message hash preimage which ensures global uniqueness
  /// Ensures that 2 identical messages sent to 2 different lanes will have a distinct hash.
  /// Must match the metadataHash used in computing leaf hashes offchain for the root committed in
  /// the commitStore and i_metadataHash in the offRamp.
  bytes32 internal immutable i_metadataHash;
  /// @dev Default gas limit for a transactions that did not specify
  /// a gas limit in the extraArgs.
  uint64 internal immutable i_defaultTxGasLimit;
  /// @dev Maximum nop fee that can accumulate in this onramp
  uint96 internal immutable i_maxNopFeesJuels;
  /// @dev The link token address - known to pay nops for their work
  address internal immutable i_linkToken;
  /// @dev The chain ID of the source chain that this contract is deployed to
  uint64 internal immutable i_chainSelector;
  /// @dev The chain ID of the destination chain
  uint64 internal immutable i_destChainSelector;
  /// @dev The address of previous-version OnRamp for this lane
  /// Used to be able to provide sequencing continuity during a zero downtime upgrade.
  address internal immutable i_prevOnRamp;
  /// @dev The address of the RMN proxy
  address internal immutable i_rmnProxy;
  /// @dev The address of the token admin registry
  address internal immutable i_tokenAdminRegistry;
  /// @dev the maximum number of nops that can be configured at the same time.
  /// Used to bound gas for loops over nops.
  uint256 private constant MAX_NUMBER_OF_NOPS = 64;

  // DYNAMIC CONFIG
  /// @dev The config for the onRamp
  DynamicConfig internal s_dynamicConfig;
  /// @dev (address nop => uint256 weight)
  EnumerableMap.AddressToUintMap internal s_nops;

  /// @dev The execution fee token config that can be set by the owner or fee admin
  mapping(address token => FeeTokenConfig feeTokenConfig) internal s_feeTokenConfig;
  /// @dev The token transfer fee config that can be set by the owner or fee admin
  mapping(address token => TokenTransferFeeConfig tranferFeeConfig) internal s_tokenTransferFeeConfig;

  // STATE
  /// @dev The current nonce per sender.
  /// The offramp has a corresponding s_senderNonce mapping to ensure messages
  /// are executed in the same order they are sent.
  mapping(address sender => uint64 nonce) internal s_senderNonce;
  /// @dev The amount of LINK available to pay NOPS
  uint96 internal s_nopFeesJuels;
  /// @dev The combined weight of all NOPs weights
  uint32 internal s_nopWeightsTotal;
  /// @dev The last used sequence number. This is zero in the case where no
  /// messages has been sent yet. 0 is not a valid sequence number for any
  /// real transaction.
  uint64 internal s_sequenceNumber;

  constructor(
    StaticConfig memory staticConfig,
    DynamicConfig memory dynamicConfig,
    RateLimiter.Config memory rateLimiterConfig,
    FeeTokenConfigArgs[] memory feeTokenConfigs,
    TokenTransferFeeConfigArgs[] memory tokenTransferFeeConfigArgs,
    NopAndWeight[] memory nopsAndWeights
  ) AggregateRateLimiter(rateLimiterConfig) {
    if (
      staticConfig.linkToken == address(0) || staticConfig.chainSelector == 0 || staticConfig.destChainSelector == 0
        || staticConfig.defaultTxGasLimit == 0 || staticConfig.rmnProxy == address(0)
        || staticConfig.tokenAdminRegistry == address(0)
    ) revert InvalidConfig();

    i_metadataHash = keccak256(
      abi.encode(
        Internal.EVM_2_EVM_MESSAGE_HASH, staticConfig.chainSelector, staticConfig.destChainSelector, address(this)
      )
    );
    i_linkToken = staticConfig.linkToken;
    i_chainSelector = staticConfig.chainSelector;
    i_destChainSelector = staticConfig.destChainSelector;
    i_defaultTxGasLimit = staticConfig.defaultTxGasLimit;
    i_maxNopFeesJuels = staticConfig.maxNopFeesJuels;
    i_prevOnRamp = staticConfig.prevOnRamp;
    i_rmnProxy = staticConfig.rmnProxy;
    i_tokenAdminRegistry = staticConfig.tokenAdminRegistry;

    _setDynamicConfig(dynamicConfig);
    _setFeeTokenConfig(feeTokenConfigs);
    _setTokenTransferFeeConfig(tokenTransferFeeConfigArgs, new address[](0));
    _setNops(nopsAndWeights);
  }

  // ================================================================
  // │                          Messaging                           │
  // ================================================================

  /// @inheritdoc IEVM2AnyOnRamp
  function getExpectedNextSequenceNumber() external view returns (uint64) {
    return s_sequenceNumber + 1;
  }

  /// @inheritdoc IEVM2AnyOnRamp
  function getSenderNonce(address sender) external view returns (uint64) {
    uint256 senderNonce = s_senderNonce[sender];

    if (i_prevOnRamp != address(0)) {
      if (senderNonce == 0) {
        // If OnRamp was upgraded, check if sender has a nonce from the previous OnRamp.
        return IEVM2AnyOnRamp(i_prevOnRamp).getSenderNonce(sender);
      }
    }
    return uint64(senderNonce);
  }

  /// @inheritdoc IEVM2AnyOnRampClient
  function forwardFromRouter(
    uint64 destChainSelector,
    Client.EVM2AnyMessage calldata message,
    uint256 feeTokenAmount,
    address originalSender
  ) external returns (bytes32) {
    if (IRMN(i_rmnProxy).isCursed(bytes16(uint128(destChainSelector)))) revert CursedByRMN();
    // Validate message sender is set and allowed. Not validated in `getFee` since it is not user-driven.
    if (originalSender == address(0)) revert RouterMustSetOriginalSender();
    // Router address may be zero intentionally to pause.
    if (msg.sender != s_dynamicConfig.router) revert MustBeCalledByRouter();
    if (destChainSelector != i_destChainSelector) revert InvalidChainSelector(destChainSelector);

    Client.EVMExtraArgsV2 memory extraArgs = _fromBytes(message.extraArgs);
    // Validate the message with various checks
    uint256 numberOfTokens = message.tokenAmounts.length;
    _validateMessage(message.data.length, extraArgs.gasLimit, numberOfTokens, extraArgs.allowOutOfOrderExecution);

    // Only check token value if there are tokens
    if (numberOfTokens > 0) {
      uint256 value;
      for (uint256 i = 0; i < numberOfTokens; ++i) {
        if (message.tokenAmounts[i].amount == 0) revert CannotSendZeroTokens();
        if (s_tokenTransferFeeConfig[message.tokenAmounts[i].token].aggregateRateLimitEnabled) {
          value += _getTokenValue(message.tokenAmounts[i], IPriceRegistry(s_dynamicConfig.priceRegistry));
        }
      }
      // Rate limit on aggregated token value
      if (value > 0) _rateLimitValue(value);
    }

    // Convert feeToken to link if not already in link
    if (message.feeToken == i_linkToken) {
      // Since there is only 1b link this is safe
      s_nopFeesJuels += uint96(feeTokenAmount);
    } else {
      // the cast from uint256 to uint96 is considered safe, uint96 can store more than max supply of link token
      s_nopFeesJuels += uint96(
        IPriceRegistry(s_dynamicConfig.priceRegistry).convertTokenAmount(message.feeToken, feeTokenAmount, i_linkToken)
      );
    }
    if (s_nopFeesJuels > i_maxNopFeesJuels) revert MaxFeeBalanceReached();

    // Get the current nonce if the message is an ordered message. If it's not ordered, we don't have to make the
    // external call.
    if (!extraArgs.allowOutOfOrderExecution) {
      if (i_prevOnRamp != address(0)) {
        if (s_senderNonce[originalSender] == 0) {
          // If this is first time send for a sender in new OnRamp, check if they have a nonce
          // from the previous OnRamp and start from there instead of zero.
          s_senderNonce[originalSender] = IEVM2AnyOnRamp(i_prevOnRamp).getSenderNonce(originalSender);
        }
      }
    }

    // We need the next available sequence number so we increment before we use the value
    Internal.EVM2EVMMessage memory newMessage = Internal.EVM2EVMMessage({
      sourceChainSelector: i_chainSelector,
      sender: originalSender,
      // EVM destination addresses should be abi encoded and therefore always 32 bytes long
      // Not duplicately validated in `getFee`. Invalid address is uncommon, gas cost outweighs UX gain.
      receiver: Internal._validateEVMAddress(message.receiver),
      sequenceNumber: ++s_sequenceNumber,
      gasLimit: extraArgs.gasLimit,
      strict: false,
      // Only bump nonce for messages that specify allowOutOfOrderExecution == false. Otherwise, we
      // may block ordered message nonces, which is not what we want.
      nonce: extraArgs.allowOutOfOrderExecution ? 0 : ++s_senderNonce[originalSender],
      feeToken: message.feeToken,
      feeTokenAmount: feeTokenAmount,
      data: message.data,
      tokenAmounts: message.tokenAmounts,
      sourceTokenData: new bytes[](numberOfTokens), // will be populated below
      messageId: ""
    });

    // Lock the tokens as last step. TokenPools may not always be trusted.
    // There should be no state changes after external call to TokenPools.
    for (uint256 i = 0; i < numberOfTokens; ++i) {
      Client.EVMTokenAmount memory tokenAndAmount = message.tokenAmounts[i];
      IPoolV1 sourcePool = getPoolBySourceToken(destChainSelector, IERC20(tokenAndAmount.token));
      // We don't have to check if it supports the pool version in a non-reverting way here because
      // if we revert here, there is no effect on CCIP. Therefore we directly call the supportsInterface
      // function and not through the ERC165Checker.
      if (address(sourcePool) == address(0) || !sourcePool.supportsInterface(Pool.CCIP_POOL_V1)) {
        revert UnsupportedToken(tokenAndAmount.token);
      }

      Pool.LockOrBurnOutV1 memory poolReturnData = sourcePool.lockOrBurn(
        Pool.LockOrBurnInV1({
          receiver: message.receiver,
          remoteChainSelector: i_destChainSelector,
          originalSender: originalSender,
          amount: tokenAndAmount.amount,
          localToken: tokenAndAmount.token
        })
      );

      // Since the DON has to pay for the extraData to be included on the destination chain, we cap the length of the
      // extraData. This prevents gas bomb attacks on the NOPs. As destBytesOverhead accounts for both
      // extraData and offchainData, this caps the worst case abuse to the number of bytes reserved for offchainData.
      if (poolReturnData.destPoolData.length > Pool.CCIP_LOCK_OR_BURN_V1_RET_BYTES) {
        // If TokenTransferFeeConfig.enabled is false, there is no config. That means destBytesOverhead is zero and
        // this check is always true. That ensures that a pool without config cannot send more than
        // Pool.CCIP_LOCK_OR_BURN_V1_RET_BYTES bytes of data.
        if (poolReturnData.destPoolData.length > s_tokenTransferFeeConfig[tokenAndAmount.token].destBytesOverhead) {
          revert SourceTokenDataTooLarge(tokenAndAmount.token);
        }
      }

      // We validate the token address to ensure it is a valid EVM address
      Internal._validateEVMAddress(poolReturnData.destTokenAddress);

      newMessage.sourceTokenData[i] = abi.encode(
        Internal.SourceTokenData({
          sourcePoolAddress: abi.encode(sourcePool),
          destTokenAddress: poolReturnData.destTokenAddress,
          extraData: poolReturnData.destPoolData,
          // The user will be billed either the default or the override, so we send the exact amount that we billed for
          // to the destination chain to be used for the token releaseOrMint and transfer.
          destGasAmount: s_tokenTransferFeeConfig[tokenAndAmount.token].isEnabled
            ? s_tokenTransferFeeConfig[tokenAndAmount.token].destGasOverhead
            : s_dynamicConfig.defaultTokenDestGasOverhead
        })
      );
    }

    // Hash only after the sourceTokenData has been set
    newMessage.messageId = Internal._hash(newMessage, i_metadataHash);

    // Emit message request
    // This must happen after any pool events as some tokens (e.g. USDC) emit events that we expect to precede this
    // event in the offchain code.
    emit CCIPSendRequested(newMessage);
    return newMessage.messageId;
  }

  /// @dev Convert the extra args bytes into a struct
  /// @param extraArgs The extra args bytes
  /// @return The extra args struct
  function _fromBytes(bytes calldata extraArgs) internal view returns (Client.EVMExtraArgsV2 memory) {
    if (extraArgs.length == 0) {
      return Client.EVMExtraArgsV2({gasLimit: i_defaultTxGasLimit, allowOutOfOrderExecution: false});
    }

    bytes4 extraArgsTag = bytes4(extraArgs);
    if (extraArgsTag == Client.EVM_EXTRA_ARGS_V2_TAG) {
      return abi.decode(extraArgs[4:], (Client.EVMExtraArgsV2));
    } else if (extraArgsTag == Client.EVM_EXTRA_ARGS_V1_TAG) {
      // EVMExtraArgsV1 originally included a second boolean (strict) field which has been deprecated.
      // Clients may still include it but it will be ignored.
      return Client.EVMExtraArgsV2({gasLimit: abi.decode(extraArgs[4:], (uint256)), allowOutOfOrderExecution: false});
    }

    revert InvalidExtraArgsTag();
  }

  /// @notice Validate the forwarded message with various checks.
  /// @dev This function can be called multiple times during a CCIPSend,
  /// only common user-driven mistakes are validated here to minimize duplicate validation cost.
  /// @param dataLength The length of the data field of the message.
  /// @param gasLimit The gasLimit set in message for destination execution.
  /// @param numberOfTokens The number of tokens to be sent.
  function _validateMessage(
    uint256 dataLength,
    uint256 gasLimit,
    uint256 numberOfTokens,
    bool allowOutOfOrderExecution
  ) internal view {
    uint256 maxDataBytes = uint256(s_dynamicConfig.maxDataBytes);
    if (dataLength > maxDataBytes) revert MessageTooLarge(maxDataBytes, dataLength);
    if (gasLimit > uint256(s_dynamicConfig.maxPerMsgGasLimit)) revert MessageGasLimitTooHigh();
    if (numberOfTokens > uint256(s_dynamicConfig.maxNumberOfTokensPerMsg)) revert UnsupportedNumberOfTokens();
    if (!allowOutOfOrderExecution) {
      if (s_dynamicConfig.enforceOutOfOrder) {
        revert ExtraArgOutOfOrderExecutionMustBeTrue();
      }
    }
  }

  // ================================================================
  // │                           Config                             │
  // ================================================================

  /// @notice Returns the static onRamp config.
  /// @dev RMN depends on this function, if changing, please notify the RMN maintainers.
  /// @return the configuration.
  function getStaticConfig() external view returns (StaticConfig memory) {
    return StaticConfig({
      linkToken: i_linkToken,
      chainSelector: i_chainSelector,
      destChainSelector: i_destChainSelector,
      defaultTxGasLimit: i_defaultTxGasLimit,
      maxNopFeesJuels: i_maxNopFeesJuels,
      prevOnRamp: i_prevOnRamp,
      rmnProxy: i_rmnProxy,
      tokenAdminRegistry: i_tokenAdminRegistry
    });
  }

  /// @notice Returns the dynamic onRamp config.
  /// @return dynamicConfig the configuration.
  function getDynamicConfig() external view returns (DynamicConfig memory dynamicConfig) {
    return s_dynamicConfig;
  }

  /// @notice Sets the dynamic configuration.
  /// @param dynamicConfig The configuration.
  function setDynamicConfig(DynamicConfig memory dynamicConfig) external onlyOwner {
    _setDynamicConfig(dynamicConfig);
  }

  /// @notice Internal version of setDynamicConfig to allow for reuse in the constructor.
  function _setDynamicConfig(DynamicConfig memory dynamicConfig) internal {
    // We permit router to be set to zero as a way to pause the contract.
    if (dynamicConfig.priceRegistry == address(0)) revert InvalidConfig();
    s_dynamicConfig = dynamicConfig;

    emit ConfigSet(
      StaticConfig({
        linkToken: i_linkToken,
        chainSelector: i_chainSelector,
        destChainSelector: i_destChainSelector,
        defaultTxGasLimit: i_defaultTxGasLimit,
        maxNopFeesJuels: i_maxNopFeesJuels,
        prevOnRamp: i_prevOnRamp,
        rmnProxy: i_rmnProxy,
        tokenAdminRegistry: i_tokenAdminRegistry
      }),
      dynamicConfig
    );
  }

  // ================================================================
  // │                      Tokens and pools                        │
  // ================================================================

  /// @inheritdoc IEVM2AnyOnRampClient
  function getPoolBySourceToken(uint64, /*destChainSelector*/ IERC20 sourceToken) public view returns (IPoolV1) {
    return IPoolV1(ITokenAdminRegistry(i_tokenAdminRegistry).getPool(address(sourceToken)));
  }

  /// @inheritdoc IEVM2AnyOnRampClient
  function getSupportedTokens(uint64) external pure returns (address[] memory) {
    revert GetSupportedTokensFunctionalityRemovedCheckAdminRegistry();
  }

  // ================================================================
  // │                             Fees                             │
  // ================================================================

  /// @inheritdoc IEVM2AnyOnRampClient
  /// @dev getFee MUST revert if the feeToken is not listed in the fee token config, as the router assumes it does.
  /// @param destChainSelector The destination chain selector.
  /// @param message The message to get quote for.
  /// @return feeTokenAmount The amount of fee token needed for the fee, in smallest denomination of the fee token.
  function getFee(
    uint64 destChainSelector,
    Client.EVM2AnyMessage calldata message
  ) external view returns (uint256 feeTokenAmount) {
    if (destChainSelector != i_destChainSelector) revert InvalidChainSelector(destChainSelector);

    Client.EVMExtraArgsV2 memory extraArgs = _fromBytes(message.extraArgs);
    // Validate the message with various checks
    _validateMessage(
      message.data.length, extraArgs.gasLimit, message.tokenAmounts.length, extraArgs.allowOutOfOrderExecution
    );

    FeeTokenConfig memory feeTokenConfig = s_feeTokenConfig[message.feeToken];
    if (!feeTokenConfig.enabled) revert NotAFeeToken(message.feeToken);

    (uint224 feeTokenPrice, uint224 packedGasPrice) =
      IPriceRegistry(s_dynamicConfig.priceRegistry).getTokenAndGasPrices(message.feeToken, destChainSelector);

    // Calculate premiumFee in USD with 18 decimals precision first.
    // If message-only and no token transfers, a flat network fee is charged.
    // If there are token transfers, premiumFee is calculated from token transfer fee.
    // If there are both token transfers and message, premiumFee is only calculated from token transfer fee.
    uint256 premiumFee = 0;
    uint32 tokenTransferGas = 0;
    uint32 tokenTransferBytesOverhead = 0;
    if (message.tokenAmounts.length > 0) {
      (premiumFee, tokenTransferGas, tokenTransferBytesOverhead) =
        _getTokenTransferCost(message.feeToken, feeTokenPrice, message.tokenAmounts);
    } else {
      // Convert USD cents with 2 decimals to 18 decimals.
      premiumFee = uint256(feeTokenConfig.networkFeeUSDCents) * 1e16;
    }

    // Calculate data availability cost in USD with 36 decimals. Data availability cost exists on rollups that need to post
    // transaction calldata onto another storage layer, e.g. Eth mainnet, incurring additional storage gas costs.
    uint256 dataAvailabilityCost = 0;
    // Only calculate data availability cost if data availability multiplier is non-zero.
    // The multiplier should be set to 0 if destination chain does not charge data availability cost.
    if (s_dynamicConfig.destDataAvailabilityMultiplierBps > 0) {
      dataAvailabilityCost = _getDataAvailabilityCost(
        // Parse the data availability gas price stored in the higher-order 112 bits of the encoded gas price.
        uint112(packedGasPrice >> Internal.GAS_PRICE_BITS),
        message.data.length,
        message.tokenAmounts.length,
        tokenTransferBytesOverhead
      );
    }

    // Calculate execution gas fee on destination chain in USD with 36 decimals.
    // We add the message gas limit, the overhead gas, the gas of passing message data to receiver, and token transfer gas together.
    // We then multiply this gas total with the gas multiplier and gas price, converting it into USD with 36 decimals.
    // uint112(packedGasPrice) = executionGasPrice
    uint256 executionCost = uint112(packedGasPrice)
      * (
        extraArgs.gasLimit + s_dynamicConfig.destGasOverhead
          + (message.data.length * s_dynamicConfig.destGasPerPayloadByte) + tokenTransferGas
      ) * feeTokenConfig.gasMultiplierWeiPerEth;

    // Calculate number of fee tokens to charge.
    // Total USD fee is in 36 decimals, feeTokenPrice is in 18 decimals USD for 1e18 smallest token denominations.
    // Result of the division is the number of smallest token denominations.
    return
      ((premiumFee * feeTokenConfig.premiumMultiplierWeiPerEth) + executionCost + dataAvailabilityCost) / feeTokenPrice;
  }

  /// @notice Returns the estimated data availability cost of the message.
  /// @dev To save on gas, we use a single destGasPerDataAvailabilityByte value for both zero and non-zero bytes.
  /// @param dataAvailabilityGasPrice USD per data availability gas in 18 decimals.
  /// @param messageDataLength length of the data field in the message.
  /// @param numberOfTokens number of distinct token transfers in the message.
  /// @param tokenTransferBytesOverhead additional token transfer data passed to destination, e.g. USDC attestation.
  /// @return dataAvailabilityCostUSD36Decimal total data availability cost in USD with 36 decimals.
  function _getDataAvailabilityCost(
    uint112 dataAvailabilityGasPrice,
    uint256 messageDataLength,
    uint256 numberOfTokens,
    uint32 tokenTransferBytesOverhead
  ) internal view returns (uint256 dataAvailabilityCostUSD36Decimal) {
    // dataAvailabilityLengthBytes sums up byte lengths of fixed message fields and dynamic message fields.
    // Fixed message fields do account for the offset and length slot of the dynamic fields.
    uint256 dataAvailabilityLengthBytes = Internal.MESSAGE_FIXED_BYTES + messageDataLength
      + (numberOfTokens * Internal.MESSAGE_FIXED_BYTES_PER_TOKEN) + tokenTransferBytesOverhead;

    // destDataAvailabilityOverheadGas is a separate config value for flexibility to be updated independently of message cost.
    // Its value is determined by CCIP lane implementation, e.g. the overhead data posted for OCR.
    uint256 dataAvailabilityGas = (dataAvailabilityLengthBytes * s_dynamicConfig.destGasPerDataAvailabilityByte)
      + s_dynamicConfig.destDataAvailabilityOverheadGas;

    // dataAvailabilityGasPrice is in 18 decimals, destDataAvailabilityMultiplierBps is in 4 decimals
    // We pad 14 decimals to bring the result to 36 decimals, in line with token bps and execution fee.
    return ((dataAvailabilityGas * dataAvailabilityGasPrice) * s_dynamicConfig.destDataAvailabilityMultiplierBps) * 1e14;
  }

  /// @notice Returns the token transfer cost parameters.
  /// A basis point fee is calculated from the USD value of each token transfer.
  /// For each individual transfer, this fee is between [minFeeUSD, maxFeeUSD].
  /// Total transfer fee is the sum of each individual token transfer fee.
  /// @dev Assumes that tokenAmounts are validated to be listed tokens elsewhere.
  /// @dev Splitting one token transfer into multiple transfers is discouraged,
  /// as it will result in a transferFee equal or greater than the same amount aggregated/de-duped.
  /// @param feeToken address of the feeToken.
  /// @param feeTokenPrice price of feeToken in USD with 18 decimals.
  /// @param tokenAmounts token transfers in the message.
  /// @return tokenTransferFeeUSDWei total token transfer bps fee in USD with 18 decimals.
  /// @return tokenTransferGas total execution gas of the token transfers.
  /// @return tokenTransferBytesOverhead additional token transfer data passed to destination, e.g. USDC attestation.
  function _getTokenTransferCost(
    address feeToken,
    uint224 feeTokenPrice,
    Client.EVMTokenAmount[] calldata tokenAmounts
  ) internal view returns (uint256 tokenTransferFeeUSDWei, uint32 tokenTransferGas, uint32 tokenTransferBytesOverhead) {
    uint256 numberOfTokens = tokenAmounts.length;

    for (uint256 i = 0; i < numberOfTokens; ++i) {
      Client.EVMTokenAmount memory tokenAmount = tokenAmounts[i];

      // Validate if the token is supported, do not calculate fee for unsupported tokens.
      if (address(getPoolBySourceToken(i_destChainSelector, IERC20(tokenAmount.token))) == address(0)) {
        revert UnsupportedToken(tokenAmount.token);
      }

      TokenTransferFeeConfig memory transferFeeConfig = s_tokenTransferFeeConfig[tokenAmount.token];

      // If the token has no specific overrides configured, we use the global defaults.
      if (!transferFeeConfig.isEnabled) {
        tokenTransferFeeUSDWei += uint256(s_dynamicConfig.defaultTokenFeeUSDCents) * 1e16;
        tokenTransferGas += s_dynamicConfig.defaultTokenDestGasOverhead;
        tokenTransferBytesOverhead += Pool.CCIP_POOL_V1_RET_BYTES;
        continue;
      }

      uint256 bpsFeeUSDWei = 0;
      // Only calculate bps fee if ratio is greater than 0. Ratio of 0 means no bps fee for a token.
      // Useful for when the PriceRegistry cannot return a valid price for the token.
      if (transferFeeConfig.deciBps > 0) {
        uint224 tokenPrice = 0;
        if (tokenAmount.token != feeToken) {
          tokenPrice = IPriceRegistry(s_dynamicConfig.priceRegistry).getValidatedTokenPrice(tokenAmount.token);
        } else {
          tokenPrice = feeTokenPrice;
        }

        // Calculate token transfer value, then apply fee ratio
        // ratio represents multiples of 0.1bps, or 1e-5
        bpsFeeUSDWei = (tokenPrice._calcUSDValueFromTokenAmount(tokenAmount.amount) * transferFeeConfig.deciBps) / 1e5;
      }

      tokenTransferGas += transferFeeConfig.destGasOverhead;
      tokenTransferBytesOverhead += transferFeeConfig.destBytesOverhead;

      // Bps fees should be kept within range of [minFeeUSD, maxFeeUSD].
      // Convert USD values with 2 decimals to 18 decimals.
      uint256 minFeeUSDWei = uint256(transferFeeConfig.minFeeUSDCents) * 1e16;
      if (bpsFeeUSDWei < minFeeUSDWei) {
        tokenTransferFeeUSDWei += minFeeUSDWei;
        continue;
      }

      uint256 maxFeeUSDWei = uint256(transferFeeConfig.maxFeeUSDCents) * 1e16;
      if (bpsFeeUSDWei > maxFeeUSDWei) {
        tokenTransferFeeUSDWei += maxFeeUSDWei;
        continue;
      }

      tokenTransferFeeUSDWei += bpsFeeUSDWei;
    }

    return (tokenTransferFeeUSDWei, tokenTransferGas, tokenTransferBytesOverhead);
  }

  /// @notice Gets the fee configuration for a token
  /// @param token The token to get the fee configuration for
  /// @return feeTokenConfig FeeTokenConfig struct
  function getFeeTokenConfig(address token) external view returns (FeeTokenConfig memory feeTokenConfig) {
    return s_feeTokenConfig[token];
  }

  /// @notice Sets the fee configuration for a token
  /// @param feeTokenConfigArgs Array of FeeTokenConfigArgs structs.
  function setFeeTokenConfig(FeeTokenConfigArgs[] memory feeTokenConfigArgs) external {
    _onlyOwnerOrAdmin();
    _setFeeTokenConfig(feeTokenConfigArgs);
  }

  /// @dev Set the fee config
  /// @param feeTokenConfigArgs The fee token configs.
  function _setFeeTokenConfig(FeeTokenConfigArgs[] memory feeTokenConfigArgs) internal {
    for (uint256 i = 0; i < feeTokenConfigArgs.length; ++i) {
      FeeTokenConfigArgs memory configArg = feeTokenConfigArgs[i];

      s_feeTokenConfig[configArg.token] = FeeTokenConfig({
        networkFeeUSDCents: configArg.networkFeeUSDCents,
        gasMultiplierWeiPerEth: configArg.gasMultiplierWeiPerEth,
        premiumMultiplierWeiPerEth: configArg.premiumMultiplierWeiPerEth,
        enabled: configArg.enabled
      });
    }
    emit FeeConfigSet(feeTokenConfigArgs);
  }

  /// @notice Gets the transfer fee config for a given token.
  function getTokenTransferFeeConfig(address token)
    external
    view
    returns (TokenTransferFeeConfig memory tokenTransferFeeConfig)
  {
    return s_tokenTransferFeeConfig[token];
  }

  /// @notice Sets the transfer fee config.
  /// @dev only callable by the owner or admin.
  function setTokenTransferFeeConfig(
    TokenTransferFeeConfigArgs[] memory tokenTransferFeeConfigArgs,
    address[] memory tokensToUseDefaultFeeConfigs
  ) external {
    _onlyOwnerOrAdmin();
    _setTokenTransferFeeConfig(tokenTransferFeeConfigArgs, tokensToUseDefaultFeeConfigs);
  }

  /// @notice internal helper to set the token transfer fee config.
  function _setTokenTransferFeeConfig(
    TokenTransferFeeConfigArgs[] memory tokenTransferFeeConfigArgs,
    address[] memory tokensToUseDefaultFeeConfigs
  ) internal {
    for (uint256 i = 0; i < tokenTransferFeeConfigArgs.length; ++i) {
      TokenTransferFeeConfigArgs memory configArg = tokenTransferFeeConfigArgs[i];

      if (configArg.destBytesOverhead < Pool.CCIP_LOCK_OR_BURN_V1_RET_BYTES) {
        revert InvalidDestBytesOverhead(configArg.token, configArg.destBytesOverhead);
      }

      s_tokenTransferFeeConfig[configArg.token] = TokenTransferFeeConfig({
        minFeeUSDCents: configArg.minFeeUSDCents,
        maxFeeUSDCents: configArg.maxFeeUSDCents,
        deciBps: configArg.deciBps,
        destGasOverhead: configArg.destGasOverhead,
        destBytesOverhead: configArg.destBytesOverhead,
        aggregateRateLimitEnabled: configArg.aggregateRateLimitEnabled,
        isEnabled: true
      });
    }
    emit TokenTransferFeeConfigSet(tokenTransferFeeConfigArgs);

    // Remove the custom fee configs for the tokens that are in the tokensToUseDefaultFeeConfigs array
    for (uint256 i = 0; i < tokensToUseDefaultFeeConfigs.length; ++i) {
      delete s_tokenTransferFeeConfig[tokensToUseDefaultFeeConfigs[i]];
    }
    if (tokensToUseDefaultFeeConfigs.length > 0) {
      emit TokenTransferFeeConfigDeleted(tokensToUseDefaultFeeConfigs);
    }
  }

  // ================================================================
  // │                         NOP payments                         │
  // ================================================================

  /// @notice Get the total amount of fees to be paid to the Nops (in LINK)
  /// @return totalNopFees
  function getNopFeesJuels() external view returns (uint96) {
    return s_nopFeesJuels;
  }

  /// @notice Gets the Nops and their weights
  /// @return nopsAndWeights Array of NopAndWeight structs
  /// @return weightsTotal The sum weight of all Nops
  function getNops() external view returns (NopAndWeight[] memory nopsAndWeights, uint256 weightsTotal) {
    uint256 length = s_nops.length();
    nopsAndWeights = new NopAndWeight[](length);
    for (uint256 i = 0; i < length; ++i) {
      (address nopAddress, uint256 nopWeight) = s_nops.at(i);
      nopsAndWeights[i] = NopAndWeight({nop: nopAddress, weight: uint16(nopWeight)});
    }
    weightsTotal = s_nopWeightsTotal;
    return (nopsAndWeights, weightsTotal);
  }

  /// @notice Sets the Nops and their weights
  /// @param nopsAndWeights Array of NopAndWeight structs
  function setNops(NopAndWeight[] calldata nopsAndWeights) external {
    _onlyOwnerOrAdmin();
    _setNops(nopsAndWeights);
  }

  /// @param nopsAndWeights New set of nops and weights
  /// @dev Clears existing nops, sets new nops and weights
  /// @dev We permit fees to accrue before nops are configured, in which case
  /// they will go to the first set of configured nops.
  function _setNops(NopAndWeight[] memory nopsAndWeights) internal {
    uint256 numberOfNops = nopsAndWeights.length;
    if (numberOfNops > MAX_NUMBER_OF_NOPS) revert TooManyNops();

    // Make sure all nops have been paid before removing nops
    // We only have to pay when there are nops and there is enough
    // outstanding NOP balance to trigger a payment.
    if (s_nopWeightsTotal > 0) {
      if (s_nopFeesJuels >= s_nopWeightsTotal) {
        payNops();
      }
    }

    // Remove all previous nops, move from end to start to avoid shifting
    for (uint256 i = s_nops.length(); i > 0; --i) {
      (address nop,) = s_nops.at(i - 1);
      s_nops.remove(nop);
    }

    // Add new
    uint32 nopWeightsTotal = 0;
    // nopWeightsTotal is bounded by the MAX_NUMBER_OF_NOPS and the weight of
    // a single nop being of type uint16. This ensures nopWeightsTotal will
    // always fit into the uint32 type.
    for (uint256 i = 0; i < numberOfNops; ++i) {
      // Make sure the LINK token is not a nop because the link token doesn't allow
      // self transfers. If set as nop, payNops would always revert. Since setNops
      // calls payNops, we can never remove the LINK token as a nop.
      address nop = nopsAndWeights[i].nop;
      uint16 weight = nopsAndWeights[i].weight;
      if (nop == i_linkToken || nop == address(0)) revert InvalidNopAddress(nop);
      s_nops.set(nop, weight);
      nopWeightsTotal += weight;
    }
    s_nopWeightsTotal = nopWeightsTotal;
    emit NopsSet(nopWeightsTotal, nopsAndWeights);
  }

  /// @notice Pays the Node Ops their outstanding balances.
  /// @dev some balance can remain after payments are done. This is at most the sum
  /// of the weight of all nops. Since nop weights are uint16s and we can have at
  /// most MAX_NUMBER_OF_NOPS NOPs, the highest possible value is 2**22 or 0.04 gjuels.
  function payNops() public {
    if (msg.sender != owner()) {
      if (msg.sender != s_admin) {
        if (!s_nops.contains(msg.sender)) {
          revert OnlyCallableByOwnerOrAdminOrNop();
        }
      }
    }
    uint256 weightsTotal = s_nopWeightsTotal;
    if (weightsTotal == 0) revert NoNopsToPay();

    uint96 totalFeesToPay = s_nopFeesJuels;
    if (totalFeesToPay < weightsTotal) revert NoFeesToPay();
    if (linkAvailableForPayment() < 0) revert InsufficientBalance();

    uint96 fundsLeft = totalFeesToPay;
    uint256 numberOfNops = s_nops.length();
    for (uint256 i = 0; i < numberOfNops; ++i) {
      (address nop, uint256 weight) = s_nops.at(i);
      // amount can never be higher than totalFeesToPay so the cast to uint96 is safe
      uint96 amount = uint96((totalFeesToPay * weight) / weightsTotal);
      fundsLeft -= amount;
      IERC20(i_linkToken).safeTransfer(nop, amount);
      emit NopPaid(nop, amount);
    }
    // Some funds can remain, since this is an incredibly small
    // amount we consider this OK.
    s_nopFeesJuels = fundsLeft;
  }

  /// @notice Allows the owner to withdraw any ERC20 token from the contract.
  /// The NOP link balance is not withdrawable.
  /// @param feeToken The token to withdraw
  /// @param to The address to send the tokens to
  function withdrawNonLinkFees(address feeToken, address to) external {
    _onlyOwnerOrAdmin();
    if (to == address(0)) revert InvalidWithdrawParams();

    // We require the link balance to be settled before allowing withdrawal of non-link fees.
    int256 linkAfterNopFees = linkAvailableForPayment();
    if (linkAfterNopFees < 0) revert LinkBalanceNotSettled();

    if (feeToken == i_linkToken) {
      // Withdraw only the left over link balance
      IERC20(feeToken).safeTransfer(to, uint256(linkAfterNopFees));
    } else {
      // Withdrawal all non-link tokens in the contract
      IERC20(feeToken).safeTransfer(to, IERC20(feeToken).balanceOf(address(this)));
    }
  }

  // ================================================================
  // │                        Link monitoring                       │
  // ================================================================

  /// @notice Calculate remaining LINK balance after paying nops
  /// @dev Allow keeper to monitor funds available for paying nops
  /// @return balance if nops were to be paid
  function linkAvailableForPayment() public view returns (int256) {
    // Since LINK caps at uint96, casting to int256 is safe
    return int256(IERC20(i_linkToken).balanceOf(address(this))) - int256(uint256(s_nopFeesJuels));
  }

  // ================================================================
  // │                           Access                             │
  // ================================================================

  /// @dev Require that the sender is the owner or the fee admin
  /// Not a modifier to save on contract size
  function _onlyOwnerOrAdmin() internal view {
    if (msg.sender != owner()) {
      if (msg.sender != s_admin) {
        revert OnlyCallableByOwnerOrAdmin();
      }
    }
  }
}