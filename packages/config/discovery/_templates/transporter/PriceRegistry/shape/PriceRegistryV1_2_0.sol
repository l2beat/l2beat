// SPDX-License-Identifier: Unknown
pragma solidity 0.8.19;

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
    // Position of the value in the `values` array, plus 1 because index 0
    // means a value is not in the set.
    mapping(bytes32 => uint256) _indexes;
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
      set._indexes[value] = set._values.length;
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
    // We read and store the value's index to prevent multiple reads from the same storage slot
    uint256 valueIndex = set._indexes[value];

    if (valueIndex != 0) {
      // Equivalent to contains(set, value)
      // To delete an element from the _values array in O(1), we swap the element to delete with the last one in
      // the array, and then remove the last element (sometimes called as 'swap and pop').
      // This modifies the order of the array, as noted in {at}.

      uint256 toDeleteIndex = valueIndex - 1;
      uint256 lastIndex = set._values.length - 1;

      if (lastIndex != toDeleteIndex) {
        bytes32 lastValue = set._values[lastIndex];

        // Move the last value to the index where the value to delete is
        set._values[toDeleteIndex] = lastValue;
        // Update the index for the moved value
        set._indexes[lastValue] = valueIndex; // Replace lastValue's index to valueIndex
      }

      // Delete the slot where the moved value was stored
      set._values.pop();

      // Delete the index for the deleted slot
      delete set._indexes[value];

      return true;
    } else {
      return false;
    }
  }

  /**
   * @dev Returns true if the value is in the set. O(1).
   */
  function _contains(Set storage set, bytes32 value) private view returns (bool) {
    return set._indexes[value] != 0;
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
    // solhint-disable-next-line custom-errors
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
    // solhint-disable-next-line custom-errors
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
    // solhint-disable-next-line custom-errors
    require(to != msg.sender, "Cannot transfer to self");

    s_pendingOwner = to;

    emit OwnershipTransferRequested(s_owner, to);
  }

  /// @notice validate access
  function _validateOwnership() internal view {
    // solhint-disable-next-line custom-errors
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
    bytes extraArgs; // Populate this with _argsToBytes(EVMExtraArgsV1)
  }

  // bytes4(keccak256("CCIP EVMExtraArgsV1"));
  bytes4 public constant EVM_EXTRA_ARGS_V1_TAG = 0x97a657c9;
  struct EVMExtraArgsV1 {
    uint256 gasLimit;
  }

  function _argsToBytes(EVMExtraArgsV1 memory extraArgs) internal pure returns (bytes memory bts) {
    return abi.encodeWithSelector(EVM_EXTRA_ARGS_V1_TAG, extraArgs);
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
  /// @dev The minimum amount of gas to perform the call with exact gas.
  /// We include this in the offramp so that we can redeploy to adjust it
  /// should a hardfork change the gas costs of relevant opcodes in callWithExactGas.
  uint16 internal constant GAS_FOR_CALL_EXACT_CHECK = 5_000;
  // @dev We limit return data to a selector plus 4 words. This is to avoid
  // malicious contracts from returning large amounts of data and causing
  // repeated out-of-gas scenarios.
  uint16 internal constant MAX_RET_BYTES = 4 + 4 * 32;

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
    uint224 usdPerToken; // 1e18 USD per smallest unit of token
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
    uint64 sourceChainSelector; // ─────────╮ the chain selector of the source chain, note: not chainId
    address sender; // ─────────────────────╯ sender address on the source chain
    address receiver; // ───────────────────╮ receiver address on the destination chain
    uint64 sequenceNumber; // ──────────────╯ sequence number, not unique across lanes
    uint256 gasLimit; //                      user supplied maximum gas amount available for dest chain execution
    bool strict; // ────────────────────────╮ DEPRECATED
    uint64 nonce; //                        │ nonce for this lane for this sender, not unique across senders/lanes
    address feeToken; // ───────────────────╯ fee token
    uint256 feeTokenAmount; //                fee token amount
    bytes data; //                            arbitrary data payload supplied by the message sender
    Client.EVMTokenAmount[] tokenAmounts; //  array of tokens and amounts to transfer
    bytes[] sourceTokenData; //               array of token pool return values, one per token
    bytes32 messageId; //                     a hash of the message data
  }

  /// @dev EVM2EVMMessage struct has 13 fields, including 3 variable arrays.
  /// Each variable array takes 1 more slot to store its length.
  /// When abi encoded, excluding array contents,
  /// EVM2EVMMessage takes up a fixed number of 16 lots, 32 bytes each.
  /// For structs that contain arrays, 1 more slot is added to the front, reaching a total of 17.
  uint256 public constant MESSAGE_FIXED_BYTES = 32 * 17;

  /// @dev Each token transfer adds 1 EVMTokenAmount and 1 bytes.
  /// When abiEncoded, each EVMTokenAmount takes 2 slots, each bytes takes 2 slots, excl bytes contents
  uint256 public constant MESSAGE_FIXED_BYTES_PER_TOKEN = 32 * 4;

  function _toAny2EVMMessage(
    EVM2EVMMessage memory original,
    Client.EVMTokenAmount[] memory destTokenAmounts
  ) internal pure returns (Client.Any2EVMMessage memory message) {
    message = Client.Any2EVMMessage({
      messageId: original.messageId,
      sourceChainSelector: original.sourceChainSelector,
      sender: abi.encode(original.sender),
      data: original.data,
      destTokenAmounts: destTokenAmounts
    });
  }

  bytes32 internal constant EVM_2_EVM_MESSAGE_HASH = keccak256("EVM2EVMMessageHashV2");

  function _hash(EVM2EVMMessage memory original, bytes32 metadataHash) internal pure returns (bytes32) {
    // Fixed-size message fields are included in nested hash to reduce stack pressure.
    // This hashing scheme is also used by RMN. If changing it, please notify the RMN maintainers.
    return
      keccak256(
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
}

interface IPriceRegistry {
  /// @notice Update the price for given tokens and gas prices for given chains.
  /// @param priceUpdates The price updates to apply.
  function updatePrices(Internal.PriceUpdates memory priceUpdates) external;

  /// @notice Get the `tokenPrice` for a given token.
  /// @param token The token to get the price for.
  /// @return tokenPrice The tokenPrice for the given token.
  function getTokenPrice(address token) external view returns (Internal.TimestampedPackedUint224 memory);

  /// @notice Get the `tokenPrice` for a given token, checks if the price is valid.
  /// @param token The token to get the price for.
  /// @return tokenPrice The tokenPrice for the given token if it exists and is valid.
  function getValidatedTokenPrice(address token) external view returns (uint224);

  /// @notice Get the `tokenPrice` for an array of tokens.
  /// @param tokens The tokens to get prices for.
  /// @return tokenPrices The tokenPrices for the given tokens.
  function getTokenPrices(address[] calldata tokens) external view returns (Internal.TimestampedPackedUint224[] memory);

  /// @notice Get an encoded `gasPrice` for a given destination chain ID.
  /// The 224-bit result encodes necessary gas price components.
  /// On L1 chains like Ethereum or Avax, the only component is the gas price.
  /// On Optimistic Rollups, there are two components - the L2 gas price, and L1 base fee for data availability.
  /// On future chains, there could be more or differing price components.
  /// PriceRegistry does not contain chain-specific logic to parse destination chain price components.
  /// @param destChainSelector The destination chain to get the price for.
  /// @return gasPrice The encoded gasPrice for the given destination chain ID.
  function getDestinationChainGasPrice(
    uint64 destChainSelector
  ) external view returns (Internal.TimestampedPackedUint224 memory);

  /// @notice Gets the fee token price and the gas price, both denominated in dollars.
  /// @param token The source token to get the price for.
  /// @param destChainSelector The destination chain to get the gas price for.
  /// @return tokenPrice The price of the feeToken in 1e18 dollars per base unit.
  /// @return gasPrice The price of gas in 1e18 dollars per base unit.
  function getTokenAndGasPrices(
    address token,
    uint64 destChainSelector
  ) external view returns (uint224 tokenPrice, uint224 gasPrice);

  /// @notice Convert a given token amount to target token amount.
  /// @param fromToken The given token address.
  /// @param fromTokenAmount The given token amount.
  /// @param toToken The target token address.
  /// @return toTokenAmount The target token amount.
  function convertTokenAmount(
    address fromToken,
    uint256 fromTokenAmount,
    address toToken
  ) external view returns (uint256 toTokenAmount);
}

contract PriceRegistry is IPriceRegistry, OwnerIsCreator, ITypeAndVersion {
  using EnumerableSet for EnumerableSet.AddressSet;
  using USDPriceWith18Decimals for uint224;

  error TokenNotSupported(address token);
  error ChainNotSupported(uint64 chain);
  error OnlyCallableByUpdaterOrOwner();
  error StaleGasPrice(uint64 destChainSelector, uint256 threshold, uint256 timePassed);
  error StaleTokenPrice(address token, uint256 threshold, uint256 timePassed);
  error InvalidStalenessThreshold();

  event PriceUpdaterSet(address indexed priceUpdater);
  event PriceUpdaterRemoved(address indexed priceUpdater);
  event FeeTokenAdded(address indexed feeToken);
  event FeeTokenRemoved(address indexed feeToken);
  event UsdPerUnitGasUpdated(uint64 indexed destChain, uint256 value, uint256 timestamp);
  event UsdPerTokenUpdated(address indexed token, uint256 value, uint256 timestamp);

  // solhint-disable-next-line chainlink-solidity/all-caps-constant-storage-variables
  string public constant override typeAndVersion = "PriceRegistry 1.2.0";

  /// @dev The gas price per unit of gas for a given destination chain, in USD with 18 decimals.
  /// Multiple gas prices can be encoded into the same value. Each price takes {Internal.GAS_PRICE_BITS} bits.
  /// For example, if Optimism is the destination chain, gas price can include L1 base fee and L2 gas price.
  /// Logic to parse the price components is chain-specific, and should live in OnRamp.
  /// @dev Price of 1e18 is 1 USD. Examples:
  ///     Very Expensive:   1 unit of gas costs 1 USD                  -> 1e18
  ///     Expensive:        1 unit of gas costs 0.1 USD                -> 1e17
  ///     Cheap:            1 unit of gas costs 0.000001 USD           -> 1e12
  mapping(uint64 destChainSelector => Internal.TimestampedPackedUint224 price)
    private s_usdPerUnitGasByDestChainSelector;

  /// @dev The price, in USD with 18 decimals, per 1e18 of the smallest token denomination.
  /// @dev Price of 1e18 represents 1 USD per 1e18 token amount.
  ///     1 USDC = 1.00 USD per full token, each full token is 1e6 units -> 1 * 1e18 * 1e18 / 1e6 = 1e30
  ///     1 ETH = 2,000 USD per full token, each full token is 1e18 units -> 2000 * 1e18 * 1e18 / 1e18 = 2_000e18
  ///     1 LINK = 5.00 USD per full token, each full token is 1e18 units -> 5 * 1e18 * 1e18 / 1e18 = 5e18
  mapping(address token => Internal.TimestampedPackedUint224 price) private s_usdPerToken;

  // Price updaters are allowed to update the prices.
  EnumerableSet.AddressSet private s_priceUpdaters;
  // Subset of tokens which prices tracked by this registry which are fee tokens.
  EnumerableSet.AddressSet private s_feeTokens;
  // The amount of time a price can be stale before it is considered invalid.
  uint32 private immutable i_stalenessThreshold;

  constructor(address[] memory priceUpdaters, address[] memory feeTokens, uint32 stalenessThreshold) {
    _applyPriceUpdatersUpdates(priceUpdaters, new address[](0));
    _applyFeeTokensUpdates(feeTokens, new address[](0));
    if (stalenessThreshold == 0) revert InvalidStalenessThreshold();
    i_stalenessThreshold = stalenessThreshold;
  }

  // ================================================================
  // │                     Price calculations                       │
  // ================================================================

  // @inheritdoc IPriceRegistry
  function getTokenPrice(address token) public view override returns (Internal.TimestampedPackedUint224 memory) {
    return s_usdPerToken[token];
  }

  // @inheritdoc IPriceRegistry
  function getValidatedTokenPrice(address token) external view override returns (uint224) {
    return _getValidatedTokenPrice(token);
  }

  // @inheritdoc IPriceRegistry
  function getTokenPrices(
    address[] calldata tokens
  ) external view override returns (Internal.TimestampedPackedUint224[] memory) {
    uint256 length = tokens.length;
    Internal.TimestampedPackedUint224[] memory tokenPrices = new Internal.TimestampedPackedUint224[](length);
    for (uint256 i = 0; i < length; ++i) {
      tokenPrices[i] = getTokenPrice(tokens[i]);
    }
    return tokenPrices;
  }

  /// @notice Get the staleness threshold.
  /// @return stalenessThreshold The staleness threshold.
  function getStalenessThreshold() external view returns (uint128) {
    return i_stalenessThreshold;
  }

  // @inheritdoc IPriceRegistry
  function getDestinationChainGasPrice(
    uint64 destChainSelector
  ) external view override returns (Internal.TimestampedPackedUint224 memory) {
    return s_usdPerUnitGasByDestChainSelector[destChainSelector];
  }

  function getTokenAndGasPrices(
    address token,
    uint64 destChainSelector
  ) external view override returns (uint224 tokenPrice, uint224 gasPriceValue) {
    Internal.TimestampedPackedUint224 memory gasPrice = s_usdPerUnitGasByDestChainSelector[destChainSelector];
    // We do allow a gas price of 0, but no stale or unset gas prices
    if (gasPrice.timestamp == 0) revert ChainNotSupported(destChainSelector);
    uint256 timePassed = block.timestamp - gasPrice.timestamp;
    if (timePassed > i_stalenessThreshold) revert StaleGasPrice(destChainSelector, i_stalenessThreshold, timePassed);

    return (_getValidatedTokenPrice(token), gasPrice.value);
  }

  /// @inheritdoc IPriceRegistry
  /// @dev this function assumes that no more than 1e59 dollars are sent as payment.
  /// If more is sent, the multiplication of feeTokenAmount and feeTokenValue will overflow.
  /// Since there isn't even close to 1e59 dollars in the world economy this is safe.
  function convertTokenAmount(
    address fromToken,
    uint256 fromTokenAmount,
    address toToken
  ) external view override returns (uint256) {
    /// Example:
    /// fromTokenAmount:   1e18      // 1 ETH
    /// ETH:               2_000e18
    /// LINK:              5e18
    /// return:            1e18 * 2_000e18 / 5e18 = 400e18 (400 LINK)
    return (fromTokenAmount * _getValidatedTokenPrice(fromToken)) / _getValidatedTokenPrice(toToken);
  }

  /// @notice Gets the token price for a given token and revert if the token is either
  /// not supported or the price is stale.
  /// @param token The address of the token to get the price for
  /// @return the token price
  function _getValidatedTokenPrice(address token) internal view returns (uint224) {
    Internal.TimestampedPackedUint224 memory tokenPrice = s_usdPerToken[token];
    if (tokenPrice.timestamp == 0 || tokenPrice.value == 0) revert TokenNotSupported(token);
    uint256 timePassed = block.timestamp - tokenPrice.timestamp;
    if (timePassed > i_stalenessThreshold) revert StaleTokenPrice(token, i_stalenessThreshold, timePassed);
    return tokenPrice.value;
  }

  // ================================================================
  // │                         Fee tokens                           │
  // ================================================================

  /// @notice Get the list of fee tokens.
  /// @return The tokens set as fee tokens.
  function getFeeTokens() external view returns (address[] memory) {
    return s_feeTokens.values();
  }

  /// @notice Add and remove tokens from feeTokens set.
  /// @param feeTokensToAdd The addresses of the tokens which are now considered fee tokens
  /// and can be used to calculate fees.
  /// @param feeTokensToRemove The addresses of the tokens which are no longer considered feeTokens.
  function applyFeeTokensUpdates(
    address[] memory feeTokensToAdd,
    address[] memory feeTokensToRemove
  ) external onlyOwner {
    _applyFeeTokensUpdates(feeTokensToAdd, feeTokensToRemove);
  }

  /// @notice Add and remove tokens from feeTokens set.
  /// @param feeTokensToAdd The addresses of the tokens which are now considered fee tokens
  /// and can be used to calculate fees.
  /// @param feeTokensToRemove The addresses of the tokens which are no longer considered feeTokens.
  function _applyFeeTokensUpdates(address[] memory feeTokensToAdd, address[] memory feeTokensToRemove) private {
    for (uint256 i = 0; i < feeTokensToAdd.length; ++i) {
      if (s_feeTokens.add(feeTokensToAdd[i])) {
        emit FeeTokenAdded(feeTokensToAdd[i]);
      }
    }
    for (uint256 i = 0; i < feeTokensToRemove.length; ++i) {
      if (s_feeTokens.remove(feeTokensToRemove[i])) {
        emit FeeTokenRemoved(feeTokensToRemove[i]);
      }
    }
  }

  // ================================================================
  // │                       Price updates                          │
  // ================================================================

  // @inheritdoc IPriceRegistry
  function updatePrices(Internal.PriceUpdates calldata priceUpdates) external override requireUpdaterOrOwner {
    uint256 tokenUpdatesLength = priceUpdates.tokenPriceUpdates.length;

    for (uint256 i = 0; i < tokenUpdatesLength; ++i) {
      Internal.TokenPriceUpdate memory update = priceUpdates.tokenPriceUpdates[i];
      s_usdPerToken[update.sourceToken] = Internal.TimestampedPackedUint224({
        value: update.usdPerToken,
        timestamp: uint32(block.timestamp)
      });
      emit UsdPerTokenUpdated(update.sourceToken, update.usdPerToken, block.timestamp);
    }

    uint256 gasUpdatesLength = priceUpdates.gasPriceUpdates.length;

    for (uint256 i = 0; i < gasUpdatesLength; ++i) {
      Internal.GasPriceUpdate memory update = priceUpdates.gasPriceUpdates[i];
      s_usdPerUnitGasByDestChainSelector[update.destChainSelector] = Internal.TimestampedPackedUint224({
        value: update.usdPerUnitGas,
        timestamp: uint32(block.timestamp)
      });
      emit UsdPerUnitGasUpdated(update.destChainSelector, update.usdPerUnitGas, block.timestamp);
    }
  }

  // ================================================================
  // │                           Access                             │
  // ================================================================

  /// @notice Get the list of price updaters.
  /// @return The price updaters.
  function getPriceUpdaters() external view returns (address[] memory) {
    return s_priceUpdaters.values();
  }

  /// @notice Adds new priceUpdaters and remove existing ones.
  /// @param priceUpdatersToAdd The addresses of the priceUpdaters that are now allowed
  /// to send fee updates.
  /// @param priceUpdatersToRemove The addresses of the priceUpdaters that are no longer allowed
  /// to send fee updates.
  function applyPriceUpdatersUpdates(
    address[] memory priceUpdatersToAdd,
    address[] memory priceUpdatersToRemove
  ) external onlyOwner {
    _applyPriceUpdatersUpdates(priceUpdatersToAdd, priceUpdatersToRemove);
  }

  /// @notice Adds new priceUpdaters and remove existing ones.
  /// @param priceUpdatersToAdd The addresses of the priceUpdaters that are now allowed
  /// to send fee updates.
  /// @param priceUpdatersToRemove The addresses of the priceUpdaters that are no longer allowed
  /// to send fee updates.
  function _applyPriceUpdatersUpdates(
    address[] memory priceUpdatersToAdd,
    address[] memory priceUpdatersToRemove
  ) private {
    for (uint256 i = 0; i < priceUpdatersToAdd.length; ++i) {
      if (s_priceUpdaters.add(priceUpdatersToAdd[i])) {
        emit PriceUpdaterSet(priceUpdatersToAdd[i]);
      }
    }
    for (uint256 i = 0; i < priceUpdatersToRemove.length; ++i) {
      if (s_priceUpdaters.remove(priceUpdatersToRemove[i])) {
        emit PriceUpdaterRemoved(priceUpdatersToRemove[i]);
      }
    }
  }

  /// @notice Require that the caller is the owner or a fee updater.
  modifier requireUpdaterOrOwner() {
    if (msg.sender != owner() && !s_priceUpdaters.contains(msg.sender)) revert OnlyCallableByUpdaterOrOwner();
    _;
  }
}