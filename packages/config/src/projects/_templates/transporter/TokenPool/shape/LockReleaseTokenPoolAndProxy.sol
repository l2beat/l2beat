// SPDX-License-Identifier: Unknown
pragma solidity 0.8.24;

interface ITypeAndVersion {
  function typeAndVersion() external pure returns (string memory);
}

interface ILiquidityContainer {
  event LiquidityAdded(address indexed provider, uint256 indexed amount);
  event LiquidityRemoved(address indexed provider, uint256 indexed amount);

  /// @notice Provide additional liquidity to the container.
  /// @dev Should emit LiquidityAdded
  function provideLiquidity(uint256 amount) external;

  /// @notice Withdraws liquidity from the container to the msg sender
  /// @dev Should emit LiquidityRemoved
  function withdrawLiquidity(uint256 amount) external;
}

interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

interface IPoolV1 is IERC165 {
  /// @notice Lock tokens into the pool or burn the tokens.
  /// @param lockOrBurnIn Encoded data fields for the processing of tokens on the source chain.
  /// @return lockOrBurnOut Encoded data fields for the processing of tokens on the destination chain.
  function lockOrBurn(Pool.LockOrBurnInV1 calldata lockOrBurnIn)
    external
    returns (Pool.LockOrBurnOutV1 memory lockOrBurnOut);

  /// @notice Releases or mints tokens to the receiver address.
  /// @param releaseOrMintIn All data required to release or mint tokens.
  /// @return releaseOrMintOut The amount of tokens released or minted on the local chain, denominated
  /// in the local token's decimals.
  /// @dev The offramp asserts that the balanceOf of the receiver has been incremented by exactly the number
  /// of tokens that is returned in ReleaseOrMintOutV1.destinationAmount. If the amounts do not match, the tx reverts.
  function releaseOrMint(Pool.ReleaseOrMintInV1 calldata releaseOrMintIn)
    external
    returns (Pool.ReleaseOrMintOutV1 memory);

  /// @notice Checks whether a remote chain is supported in the token pool.
  /// @param remoteChainSelector The selector of the remote chain.
  /// @return true if the given chain is a permissioned remote chain.
  function isSupportedChain(uint64 remoteChainSelector) external view returns (bool);

  /// @notice Returns if the token pool supports the given token.
  /// @param token The address of the token.
  /// @return true if the token is supported by the pool.
  function isSupportedToken(address token) external view returns (bool);
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

abstract contract TokenPool is IPoolV1, OwnerIsCreator {
  using EnumerableSet for EnumerableSet.AddressSet;
  using EnumerableSet for EnumerableSet.UintSet;
  using RateLimiter for RateLimiter.TokenBucket;

  error CallerIsNotARampOnRouter(address caller);
  error ZeroAddressNotAllowed();
  error SenderNotAllowed(address sender);
  error AllowListNotEnabled();
  error NonExistentChain(uint64 remoteChainSelector);
  error ChainNotAllowed(uint64 remoteChainSelector);
  error CursedByRMN();
  error ChainAlreadyExists(uint64 chainSelector);
  error InvalidSourcePoolAddress(bytes sourcePoolAddress);
  error InvalidToken(address token);
  error Unauthorized(address caller);

  event Locked(address indexed sender, uint256 amount);
  event Burned(address indexed sender, uint256 amount);
  event Released(address indexed sender, address indexed recipient, uint256 amount);
  event Minted(address indexed sender, address indexed recipient, uint256 amount);
  event ChainAdded(
    uint64 remoteChainSelector,
    bytes remoteToken,
    RateLimiter.Config outboundRateLimiterConfig,
    RateLimiter.Config inboundRateLimiterConfig
  );
  event ChainConfigured(
    uint64 remoteChainSelector,
    RateLimiter.Config outboundRateLimiterConfig,
    RateLimiter.Config inboundRateLimiterConfig
  );
  event ChainRemoved(uint64 remoteChainSelector);
  event RemotePoolSet(uint64 indexed remoteChainSelector, bytes previousPoolAddress, bytes remotePoolAddress);
  event AllowListAdd(address sender);
  event AllowListRemove(address sender);
  event RouterUpdated(address oldRouter, address newRouter);

  struct ChainUpdate {
    uint64 remoteChainSelector; // ──╮ Remote chain selector
    bool allowed; // ────────────────╯ Whether the chain should be enabled
    bytes remotePoolAddress; //        Address of the remote pool, ABI encoded in the case of a remove EVM chain.
    bytes remoteTokenAddress; //       Address of the remote token, ABI encoded in the case of a remote EVM chain.
    RateLimiter.Config outboundRateLimiterConfig; // Outbound rate limited config, meaning the rate limits for all of the onRamps for the given chain
    RateLimiter.Config inboundRateLimiterConfig; // Inbound rate limited config, meaning the rate limits for all of the offRamps for the given chain
  }

  struct RemoteChainConfig {
    RateLimiter.TokenBucket outboundRateLimiterConfig; // Outbound rate limited config, meaning the rate limits for all of the onRamps for the given chain
    RateLimiter.TokenBucket inboundRateLimiterConfig; // Inbound rate limited config, meaning the rate limits for all of the offRamps for the given chain
    bytes remotePoolAddress; // Address of the remote pool, ABI encoded in the case of a remote EVM chain.
    bytes remoteTokenAddress; // Address of the remote token, ABI encoded in the case of a remote EVM chain.
  }

  /// @dev The bridgeable token that is managed by this pool.
  IERC20 internal immutable i_token;
  /// @dev The address of the RMN proxy
  address internal immutable i_rmnProxy;
  /// @dev The immutable flag that indicates if the pool is access-controlled.
  bool internal immutable i_allowlistEnabled;
  /// @dev A set of addresses allowed to trigger lockOrBurn as original senders.
  /// Only takes effect if i_allowlistEnabled is true.
  /// This can be used to ensure only token-issuer specified addresses can
  /// move tokens.
  EnumerableSet.AddressSet internal s_allowList;
  /// @dev The address of the router
  IRouter internal s_router;
  /// @dev A set of allowed chain selectors. We want the allowlist to be enumerable to
  /// be able to quickly determine (without parsing logs) who can access the pool.
  /// @dev The chain selectors are in uint256 format because of the EnumerableSet implementation.
  EnumerableSet.UintSet internal s_remoteChainSelectors;
  mapping(uint64 remoteChainSelector => RemoteChainConfig) internal s_remoteChainConfigs;
  /// @notice The address of the rate limiter admin.
  /// @dev Can be address(0) if none is configured.
  address internal s_rateLimitAdmin;

  constructor(IERC20 token, address[] memory allowlist, address rmnProxy, address router) {
    if (address(token) == address(0) || router == address(0) || rmnProxy == address(0)) revert ZeroAddressNotAllowed();
    i_token = token;
    i_rmnProxy = rmnProxy;
    s_router = IRouter(router);

    // Pool can be set as permissioned or permissionless at deployment time only to save hot-path gas.
    i_allowlistEnabled = allowlist.length > 0;
    if (i_allowlistEnabled) {
      _applyAllowListUpdates(new address[](0), allowlist);
    }
  }

  /// @notice Get RMN proxy address
  /// @return rmnProxy Address of RMN proxy
  function getRmnProxy() public view returns (address rmnProxy) {
    return i_rmnProxy;
  }

  /// @inheritdoc IPoolV1
  function isSupportedToken(address token) public view virtual returns (bool) {
    return token == address(i_token);
  }

  /// @notice Gets the IERC20 token that this pool can lock or burn.
  /// @return token The IERC20 token representation.
  function getToken() public view returns (IERC20 token) {
    return i_token;
  }

  /// @notice Gets the pool's Router
  /// @return router The pool's Router
  function getRouter() public view returns (address router) {
    return address(s_router);
  }

  /// @notice Sets the pool's Router
  /// @param newRouter The new Router
  function setRouter(address newRouter) public onlyOwner {
    if (newRouter == address(0)) revert ZeroAddressNotAllowed();
    address oldRouter = address(s_router);
    s_router = IRouter(newRouter);

    emit RouterUpdated(oldRouter, newRouter);
  }

  /// @notice Signals which version of the pool interface is supported
  function supportsInterface(bytes4 interfaceId) public pure virtual override returns (bool) {
    return interfaceId == Pool.CCIP_POOL_V1 || interfaceId == type(IPoolV1).interfaceId
      || interfaceId == type(IERC165).interfaceId;
  }

  // ================================================================
  // │                         Validation                           │
  // ================================================================

  /// @notice Validates the lock or burn input for correctness on
  /// - token to be locked or burned
  /// - RMN curse status
  /// - allowlist status
  /// - if the sender is a valid onRamp
  /// - rate limit status
  /// @param lockOrBurnIn The input to validate.
  /// @dev This function should always be called before executing a lock or burn. Not doing so would allow
  /// for various exploits.
  function _validateLockOrBurn(Pool.LockOrBurnInV1 memory lockOrBurnIn) internal {
    if (!isSupportedToken(lockOrBurnIn.localToken)) revert InvalidToken(lockOrBurnIn.localToken);
    if (IRMN(i_rmnProxy).isCursed(bytes16(uint128(lockOrBurnIn.remoteChainSelector)))) revert CursedByRMN();
    _checkAllowList(lockOrBurnIn.originalSender);

    _onlyOnRamp(lockOrBurnIn.remoteChainSelector);
    _consumeOutboundRateLimit(lockOrBurnIn.remoteChainSelector, lockOrBurnIn.amount);
  }

  /// @notice Validates the release or mint input for correctness on
  /// - token to be released or minted
  /// - RMN curse status
  /// - if the sender is a valid offRamp
  /// - if the source pool is valid
  /// - rate limit status
  /// @param releaseOrMintIn The input to validate.
  /// @dev This function should always be called before executing a release or mint. Not doing so would allow
  /// for various exploits.
  function _validateReleaseOrMint(Pool.ReleaseOrMintInV1 memory releaseOrMintIn) internal {
    if (!isSupportedToken(releaseOrMintIn.localToken)) revert InvalidToken(releaseOrMintIn.localToken);
    if (IRMN(i_rmnProxy).isCursed(bytes16(uint128(releaseOrMintIn.remoteChainSelector)))) revert CursedByRMN();
    _onlyOffRamp(releaseOrMintIn.remoteChainSelector);

    // Validates that the source pool address is configured on this pool.
    bytes memory configuredRemotePool = getRemotePool(releaseOrMintIn.remoteChainSelector);
    if (
      configuredRemotePool.length == 0
        || keccak256(releaseOrMintIn.sourcePoolAddress) != keccak256(configuredRemotePool)
    ) {
      revert InvalidSourcePoolAddress(releaseOrMintIn.sourcePoolAddress);
    }
    _consumeInboundRateLimit(releaseOrMintIn.remoteChainSelector, releaseOrMintIn.amount);
  }

  // ================================================================
  // │                     Chain permissions                        │
  // ================================================================

  /// @notice Gets the pool address on the remote chain.
  /// @param remoteChainSelector Remote chain selector.
  /// @dev To support non-evm chains, this value is encoded into bytes
  function getRemotePool(uint64 remoteChainSelector) public view returns (bytes memory) {
    return s_remoteChainConfigs[remoteChainSelector].remotePoolAddress;
  }

  /// @notice Gets the token address on the remote chain.
  /// @param remoteChainSelector Remote chain selector.
  /// @dev To support non-evm chains, this value is encoded into bytes
  function getRemoteToken(uint64 remoteChainSelector) public view returns (bytes memory) {
    return s_remoteChainConfigs[remoteChainSelector].remoteTokenAddress;
  }

  /// @notice Sets the remote pool address for a given chain selector.
  /// @param remoteChainSelector The remote chain selector for which the remote pool address is being set.
  /// @param remotePoolAddress The address of the remote pool.
  function setRemotePool(uint64 remoteChainSelector, bytes calldata remotePoolAddress) external onlyOwner {
    if (!isSupportedChain(remoteChainSelector)) revert NonExistentChain(remoteChainSelector);

    bytes memory prevAddress = s_remoteChainConfigs[remoteChainSelector].remotePoolAddress;
    s_remoteChainConfigs[remoteChainSelector].remotePoolAddress = remotePoolAddress;

    emit RemotePoolSet(remoteChainSelector, prevAddress, remotePoolAddress);
  }

  /// @inheritdoc IPoolV1
  function isSupportedChain(uint64 remoteChainSelector) public view returns (bool) {
    return s_remoteChainSelectors.contains(remoteChainSelector);
  }

  /// @notice Get list of allowed chains
  /// @return list of chains.
  function getSupportedChains() public view returns (uint64[] memory) {
    uint256[] memory uint256ChainSelectors = s_remoteChainSelectors.values();
    uint64[] memory chainSelectors = new uint64[](uint256ChainSelectors.length);
    for (uint256 i = 0; i < uint256ChainSelectors.length; ++i) {
      chainSelectors[i] = uint64(uint256ChainSelectors[i]);
    }

    return chainSelectors;
  }

  /// @notice Sets the permissions for a list of chains selectors. Actual senders for these chains
  /// need to be allowed on the Router to interact with this pool.
  /// @dev Only callable by the owner
  /// @param chains A list of chains and their new permission status & rate limits. Rate limits
  /// are only used when the chain is being added through `allowed` being true.
  function applyChainUpdates(ChainUpdate[] calldata chains) external virtual onlyOwner {
    for (uint256 i = 0; i < chains.length; ++i) {
      ChainUpdate memory update = chains[i];
      RateLimiter._validateTokenBucketConfig(update.outboundRateLimiterConfig, !update.allowed);
      RateLimiter._validateTokenBucketConfig(update.inboundRateLimiterConfig, !update.allowed);

      if (update.allowed) {
        // If the chain already exists, revert
        if (!s_remoteChainSelectors.add(update.remoteChainSelector)) {
          revert ChainAlreadyExists(update.remoteChainSelector);
        }

        if (update.remotePoolAddress.length == 0 || update.remoteTokenAddress.length == 0) {
          revert ZeroAddressNotAllowed();
        }

        s_remoteChainConfigs[update.remoteChainSelector] = RemoteChainConfig({
          outboundRateLimiterConfig: RateLimiter.TokenBucket({
            rate: update.outboundRateLimiterConfig.rate,
            capacity: update.outboundRateLimiterConfig.capacity,
            tokens: update.outboundRateLimiterConfig.capacity,
            lastUpdated: uint32(block.timestamp),
            isEnabled: update.outboundRateLimiterConfig.isEnabled
          }),
          inboundRateLimiterConfig: RateLimiter.TokenBucket({
            rate: update.inboundRateLimiterConfig.rate,
            capacity: update.inboundRateLimiterConfig.capacity,
            tokens: update.inboundRateLimiterConfig.capacity,
            lastUpdated: uint32(block.timestamp),
            isEnabled: update.inboundRateLimiterConfig.isEnabled
          }),
          remotePoolAddress: update.remotePoolAddress,
          remoteTokenAddress: update.remoteTokenAddress
        });

        emit ChainAdded(
          update.remoteChainSelector,
          update.remoteTokenAddress,
          update.outboundRateLimiterConfig,
          update.inboundRateLimiterConfig
        );
      } else {
        // If the chain doesn't exist, revert
        if (!s_remoteChainSelectors.remove(update.remoteChainSelector)) {
          revert NonExistentChain(update.remoteChainSelector);
        }

        delete s_remoteChainConfigs[update.remoteChainSelector];

        emit ChainRemoved(update.remoteChainSelector);
      }
    }
  }

  // ================================================================
  // │                        Rate limiting                         │
  // ================================================================

  /// @notice Sets the rate limiter admin address.
  /// @dev Only callable by the owner.
  /// @param rateLimitAdmin The new rate limiter admin address.
  function setRateLimitAdmin(address rateLimitAdmin) external onlyOwner {
    s_rateLimitAdmin = rateLimitAdmin;
  }

  /// @notice Gets the rate limiter admin address.
  function getRateLimitAdmin() external view returns (address) {
    return s_rateLimitAdmin;
  }

  /// @notice Consumes outbound rate limiting capacity in this pool
  function _consumeOutboundRateLimit(uint64 remoteChainSelector, uint256 amount) internal {
    s_remoteChainConfigs[remoteChainSelector].outboundRateLimiterConfig._consume(amount, address(i_token));
  }

  /// @notice Consumes inbound rate limiting capacity in this pool
  function _consumeInboundRateLimit(uint64 remoteChainSelector, uint256 amount) internal {
    s_remoteChainConfigs[remoteChainSelector].inboundRateLimiterConfig._consume(amount, address(i_token));
  }

  /// @notice Gets the token bucket with its values for the block it was requested at.
  /// @return The token bucket.
  function getCurrentOutboundRateLimiterState(uint64 remoteChainSelector)
    external
    view
    returns (RateLimiter.TokenBucket memory)
  {
    return s_remoteChainConfigs[remoteChainSelector].outboundRateLimiterConfig._currentTokenBucketState();
  }

  /// @notice Gets the token bucket with its values for the block it was requested at.
  /// @return The token bucket.
  function getCurrentInboundRateLimiterState(uint64 remoteChainSelector)
    external
    view
    returns (RateLimiter.TokenBucket memory)
  {
    return s_remoteChainConfigs[remoteChainSelector].inboundRateLimiterConfig._currentTokenBucketState();
  }

  /// @notice Sets the chain rate limiter config.
  /// @param remoteChainSelector The remote chain selector for which the rate limits apply.
  /// @param outboundConfig The new outbound rate limiter config, meaning the onRamp rate limits for the given chain.
  /// @param inboundConfig The new inbound rate limiter config, meaning the offRamp rate limits for the given chain.
  function setChainRateLimiterConfig(
    uint64 remoteChainSelector,
    RateLimiter.Config memory outboundConfig,
    RateLimiter.Config memory inboundConfig
  ) external {
    if (msg.sender != s_rateLimitAdmin && msg.sender != owner()) revert Unauthorized(msg.sender);

    _setRateLimitConfig(remoteChainSelector, outboundConfig, inboundConfig);
  }

  function _setRateLimitConfig(
    uint64 remoteChainSelector,
    RateLimiter.Config memory outboundConfig,
    RateLimiter.Config memory inboundConfig
  ) internal {
    if (!isSupportedChain(remoteChainSelector)) revert NonExistentChain(remoteChainSelector);
    RateLimiter._validateTokenBucketConfig(outboundConfig, false);
    s_remoteChainConfigs[remoteChainSelector].outboundRateLimiterConfig._setTokenBucketConfig(outboundConfig);
    RateLimiter._validateTokenBucketConfig(inboundConfig, false);
    s_remoteChainConfigs[remoteChainSelector].inboundRateLimiterConfig._setTokenBucketConfig(inboundConfig);
    emit ChainConfigured(remoteChainSelector, outboundConfig, inboundConfig);
  }

  // ================================================================
  // │                           Access                             │
  // ================================================================

  /// @notice Checks whether remote chain selector is configured on this contract, and if the msg.sender
  /// is a permissioned onRamp for the given chain on the Router.
  function _onlyOnRamp(uint64 remoteChainSelector) internal view {
    if (!isSupportedChain(remoteChainSelector)) revert ChainNotAllowed(remoteChainSelector);
    if (!(msg.sender == s_router.getOnRamp(remoteChainSelector))) revert CallerIsNotARampOnRouter(msg.sender);
  }

  /// @notice Checks whether remote chain selector is configured on this contract, and if the msg.sender
  /// is a permissioned offRamp for the given chain on the Router.
  function _onlyOffRamp(uint64 remoteChainSelector) internal view {
    if (!isSupportedChain(remoteChainSelector)) revert ChainNotAllowed(remoteChainSelector);
    if (!s_router.isOffRamp(remoteChainSelector, msg.sender)) revert CallerIsNotARampOnRouter(msg.sender);
  }

  // ================================================================
  // │                          Allowlist                           │
  // ================================================================

  function _checkAllowList(address sender) internal view {
    if (i_allowlistEnabled) {
      if (!s_allowList.contains(sender)) {
        revert SenderNotAllowed(sender);
      }
    }
  }

  /// @notice Gets whether the allowList functionality is enabled.
  /// @return true is enabled, false if not.
  function getAllowListEnabled() external view returns (bool) {
    return i_allowlistEnabled;
  }

  /// @notice Gets the allowed addresses.
  /// @return The allowed addresses.
  function getAllowList() external view returns (address[] memory) {
    return s_allowList.values();
  }

  /// @notice Apply updates to the allow list.
  /// @param removes The addresses to be removed.
  /// @param adds The addresses to be added.
  function applyAllowListUpdates(address[] calldata removes, address[] calldata adds) external onlyOwner {
    _applyAllowListUpdates(removes, adds);
  }

  /// @notice Internal version of applyAllowListUpdates to allow for reuse in the constructor.
  function _applyAllowListUpdates(address[] memory removes, address[] memory adds) internal {
    if (!i_allowlistEnabled) revert AllowListNotEnabled();

    for (uint256 i = 0; i < removes.length; ++i) {
      address toRemove = removes[i];
      if (s_allowList.remove(toRemove)) {
        emit AllowListRemove(toRemove);
      }
    }
    for (uint256 i = 0; i < adds.length; ++i) {
      address toAdd = adds[i];
      if (toAdd == address(0)) {
        continue;
      }
      if (s_allowList.add(toAdd)) {
        emit AllowListAdd(toAdd);
      }
    }
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

abstract contract LegacyPoolWrapper is TokenPool {
  using SafeERC20 for IERC20;

  event LegacyPoolChanged(IPoolPriorTo1_5 oldPool, IPoolPriorTo1_5 newPool);

  /// @dev The previous pool, if there is any. This is a property to make the older 1.0-1.4 pools
  /// compatible with the current 1.5 pool. To achieve this, we set the previous pool address to the
  /// currently deployed legacy pool. Then we configure this new pool as onRamp and offRamp on the legacy pools.
  /// In the case of a 1.4 pool, this new pool contract has to be set to the Router as well, as it validates
  /// who can call it through the router calls. This contract will always return itself as the only allowed ramp.
  /// @dev Can be address(0), this would indicate that this pool is operating as a normal pool as opposed to
  /// a proxy pool.
  IPoolPriorTo1_5 internal s_previousPool;

  constructor(
    IERC20 token,
    address[] memory allowlist,
    address rmnProxy,
    address router
  ) TokenPool(token, allowlist, rmnProxy, router) {}

  // ================================================================
  // │                      Legacy Fallbacks                        │
  // ================================================================
  // Legacy fallbacks for older token pools that do not implement the new interface.

  /// @notice Legacy fallback for the 1.4 token pools.
  function getOnRamp(uint64) external view returns (address onRampAddress) {
    return address(this);
  }

  /// @notice Return true if the given offRamp is a configured offRamp for the given source chain.
  function isOffRamp(uint64 sourceChainSelector, address offRamp) external view returns (bool) {
    return offRamp == address(this) || s_router.isOffRamp(sourceChainSelector, offRamp);
  }

  /// @notice Configures the legacy fallback option. If the previous pool is set, this pool will act as a proxy for
  /// the legacy pool.
  /// @param prevPool The address of the previous pool.
  function setPreviousPool(IPoolPriorTo1_5 prevPool) external onlyOwner {
    IPoolPriorTo1_5 oldPrevPool = s_previousPool;
    s_previousPool = prevPool;

    emit LegacyPoolChanged(oldPrevPool, prevPool);
  }

  /// @notice Returns the address of the previous pool.
  function getPreviousPool() external view returns (address) {
    return address(s_previousPool);
  }

  function _hasLegacyPool() internal view returns (bool) {
    return address(s_previousPool) != address(0);
  }

  function _lockOrBurnLegacy(Pool.LockOrBurnInV1 memory lockOrBurnIn) internal {
    i_token.safeTransfer(address(s_previousPool), lockOrBurnIn.amount);
    s_previousPool.lockOrBurn(
      lockOrBurnIn.originalSender, lockOrBurnIn.receiver, lockOrBurnIn.amount, lockOrBurnIn.remoteChainSelector, ""
    );
  }

  /// @notice This call converts the arguments from a >=1.5 pool call to those of a <1.5 pool call, and uses these
  /// to call the previous pool.
  /// @param releaseOrMintIn The 1.5 style release or mint arguments.
  /// @dev Overwrites the receiver so the previous pool sends the tokens to the sender of this call, which is the
  /// offRamp. This is due to the older pools sending funds directly to the receiver, while the new pools do a hop
  /// through the offRamp to ensure the correct tokens are sent.
  /// @dev Since extraData has never been used in LockRelease or MintBurn token pools, we can safely ignore it.
  function _releaseOrMintLegacy(Pool.ReleaseOrMintInV1 memory releaseOrMintIn) internal {
    s_previousPool.releaseOrMint(
      releaseOrMintIn.originalSender,
      releaseOrMintIn.receiver,
      releaseOrMintIn.amount,
      releaseOrMintIn.remoteChainSelector,
      ""
    );
  }
}

contract LockReleaseTokenPoolAndProxy is LegacyPoolWrapper, ILiquidityContainer, ITypeAndVersion {
  using SafeERC20 for IERC20;

  error InsufficientLiquidity();
  error LiquidityNotAccepted();

  string public constant override typeAndVersion = "LockReleaseTokenPoolAndProxy 1.5.0";

  /// @dev Whether or not the pool accepts liquidity.
  /// External liquidity is not required when there is one canonical token deployed to a chain,
  /// and CCIP is facilitating mint/burn on all the other chains, in which case the invariant
  /// balanceOf(pool) on home chain >= sum(totalSupply(mint/burn "wrapped" token) on all remote chains) should always hold
  bool internal immutable i_acceptLiquidity;
  /// @notice The address of the rebalancer.
  address internal s_rebalancer;

  constructor(
    IERC20 token,
    address[] memory allowlist,
    address rmnProxy,
    bool acceptLiquidity,
    address router
  ) LegacyPoolWrapper(token, allowlist, rmnProxy, router) {
    i_acceptLiquidity = acceptLiquidity;
  }

  /// @notice Locks the token in the pool
  /// @dev The _validateLockOrBurn check is an essential security check
  function lockOrBurn(Pool.LockOrBurnInV1 calldata lockOrBurnIn)
    external
    virtual
    override
    returns (Pool.LockOrBurnOutV1 memory)
  {
    _validateLockOrBurn(lockOrBurnIn);

    if (_hasLegacyPool()) {
      _lockOrBurnLegacy(lockOrBurnIn);
    }

    emit Locked(msg.sender, lockOrBurnIn.amount);

    return Pool.LockOrBurnOutV1({destTokenAddress: getRemoteToken(lockOrBurnIn.remoteChainSelector), destPoolData: ""});
  }

  /// @notice Release tokens from the pool to the recipient
  /// @dev The _validateReleaseOrMint check is an essential security check
  function releaseOrMint(Pool.ReleaseOrMintInV1 calldata releaseOrMintIn)
    external
    virtual
    override
    returns (Pool.ReleaseOrMintOutV1 memory)
  {
    _validateReleaseOrMint(releaseOrMintIn);

    if (!_hasLegacyPool()) {
      // Release to the recipient
      getToken().safeTransfer(releaseOrMintIn.receiver, releaseOrMintIn.amount);
    } else {
      _releaseOrMintLegacy(releaseOrMintIn);
    }

    emit Released(msg.sender, releaseOrMintIn.receiver, releaseOrMintIn.amount);

    return Pool.ReleaseOrMintOutV1({destinationAmount: releaseOrMintIn.amount});
  }

  // @inheritdoc IERC165
  function supportsInterface(bytes4 interfaceId) public pure virtual override returns (bool) {
    return interfaceId == type(ILiquidityContainer).interfaceId || super.supportsInterface(interfaceId);
  }

  /// @notice Gets LiquidityManager, can be address(0) if none is configured.
  /// @return The current liquidity manager.
  function getRebalancer() external view returns (address) {
    return s_rebalancer;
  }

  /// @notice Sets the LiquidityManager address.
  /// @dev Only callable by the owner.
  function setRebalancer(address rebalancer) external onlyOwner {
    s_rebalancer = rebalancer;
  }

  /// @notice Checks if the pool can accept liquidity.
  /// @return true if the pool can accept liquidity, false otherwise.
  function canAcceptLiquidity() external view returns (bool) {
    return i_acceptLiquidity;
  }

  /// @notice Adds liquidity to the pool. The tokens should be approved first.
  /// @param amount The amount of liquidity to provide.
  function provideLiquidity(uint256 amount) external {
    if (!i_acceptLiquidity) revert LiquidityNotAccepted();
    if (s_rebalancer != msg.sender) revert Unauthorized(msg.sender);

    i_token.safeTransferFrom(msg.sender, address(this), amount);
    emit LiquidityAdded(msg.sender, amount);
  }

  /// @notice Removed liquidity to the pool. The tokens will be sent to msg.sender.
  /// @param amount The amount of liquidity to remove.
  function withdrawLiquidity(uint256 amount) external {
    if (s_rebalancer != msg.sender) revert Unauthorized(msg.sender);

    if (i_token.balanceOf(address(this)) < amount) revert InsufficientLiquidity();
    i_token.safeTransfer(msg.sender, amount);
    emit LiquidityRemoved(msg.sender, amount);
  }

  /// @notice This function can be used to transfer liquidity from an older version of the pool to this pool. To do so
  /// this pool will have to be set as the rebalancer in the older version of the pool. This allows it to transfer the
  /// funds in the old pool to the new pool.
  /// @dev When upgrading a LockRelease pool, this function can be called at the same time as the pool is changed in the
  /// TokenAdminRegistry. This allows for a smooth transition of both liquidity and transactions to the new pool.
  /// Alternatively, when no multicall is available, a portion of the funds can be transferred to the new pool before
  /// changing which pool CCIP uses, to ensure both pools can operate. Then the pool should be changed in the
  /// TokenAdminRegistry, which will activate the new pool. All new transactions will use the new pool and its
  /// liquidity. Finally, the remaining liquidity can be transferred to the new pool using this function one more time.
  /// @param from The address of the old pool.
  /// @param amount The amount of liquidity to transfer.
  function transferLiquidity(address from, uint256 amount) external onlyOwner {
    LockReleaseTokenPoolAndProxy(from).withdrawLiquidity(amount);
  }
}