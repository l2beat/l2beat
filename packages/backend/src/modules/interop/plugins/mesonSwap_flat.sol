No constructor arguments

/// @title MesonSwapEvents Interface
interface IMesonSwapEvents {
  /// @notice Event when a swap request was posted.
  /// Emit at the end of `postSwap()` and `postSwapWithSignature()` calls.
  /// @param encodedSwap Encoded swap
  event SwapPosted(uint256 indexed encodedSwap);

  /// @notice Event when a swap request was bonded.
  /// Emit at the end of `bondSwap()` calls.
  /// @param encodedSwap Encoded swap
  event SwapBonded(uint256 indexed encodedSwap);

  /// @notice Event when a swap request was cancelled.
  /// Emit at the end of `cancelSwap()` and `cancelSwapTo()` calls.
  /// @param encodedSwap Encoded swap
  event SwapCancelled(uint256 indexed encodedSwap);

  /// @notice Event when a swap request was executed.
  /// Emit at the end of `executeSwap()`, `directExecuteSwap()` and `simpleExecuteSwap()` calls.
  /// @param encodedSwap Encoded swap
  event SwapExecuted(uint256 indexed encodedSwap);
}

/// @title MesonSwap
/// @notice The class to receive and process swap requests on the initial chain side.
/// Methods in this class will be executed by swap initiators or LPs
/// on the initial chain of swaps.
contract MesonSwap is IMesonSwapEvents, MesonStates {
  /// @notice Posted Swaps
  /// key: `encodedSwap` in format of `version:uint8|amount:uint40|salt:uint80|fee:uint40|expireTs:uint40|outChain:uint16|outToken:uint8|inChain:uint16|inToken:uint8`
  ///   version: Version of encoding
  ///   amount: The amount of tokens of this swap, always in decimal 6. The amount of a swap is capped at $100k so it can be safely encoded in uint48;
  ///   salt: The salt value of this swap, carrying some information below:
  ///     salt & 0x80000000000000000000 == true => will release to an EOA address, otherwise a smart contract;
  ///     salt & 0x40000000000000000000 == true => will waive *service fee*;
  ///     salt & 0x30000000000000000000 == 0x3. => from TransferToMesonContract;
  ///     salt & 0x30000000000000000000 == 0x2. => meson.to;
  ///     salt & 0x30000000000000000000 == 0x1. => API;
  ///     salt & 0x08000000000000000000 == true => use *non-typed signing* (some wallets such as hardware wallets don't support EIP-712v1);
  ///     salt & 0x04000000000000000000 == true => swap for core token (n/a for releasing to contract);
  ///         salt & 0xfffff00000000000         => price for core token;
  ///         salt & 0x00000fff00000000         => amount for core token;
  ///     salt & 0x02000000000000000000 == true => share some release amount to partner;
  ///         salt & 0xffff000000000000 + 65536 => pool index to share;
  ///         salt & 0x0000ffff00000000         => amount to share;
  ///     salt & 0x01000000000000000000 == true => use points to waive service fee;
  ///                                              in reality, the salt header would be 0x41
  ///     salt & 0x0000ffffffffffffffff: customized data that can be passed to integrated 3rd-party smart contract;
  ///   fee: The fee given to LPs (liquidity providers). An extra service fee maybe charged afterwards;
  ///   expireTs: The expiration time of this swap on the initial chain. The LP should `executeSwap` and receive his funds before `expireTs`;
  ///   outChain: The target chain of a cross-chain swap (given by the last 2 bytes of SLIP-44);
  ///   outToken: The index of the token on the target chain. See `tokenForIndex` in `MesonToken.sol`;
  ///   inChain: The initial chain of a cross-chain swap (given by the last 2 bytes of SLIP-44);
  ///   inToken: The index of the token on the initial chain. See `tokenForIndex` in `MesonToken.sol`.
  /// value: `postedSwap` in format of `tokenNotFromInitiator:byte1|initiator:address|poolIndex:uint40`
  ///   tokenNotFromInitiator: Token not from initiator (usually sent from a smart contract);
  ///   initiator: The swap initiator who created and signed the swap request (not necessarily the one who posted the swap);
  //    poolIndex: The index of an LP pool. See `ownerOfPool` in `MesonStates.sol` for more information.
  mapping(uint256 => uint208) internal _postedSwaps;

  /// @dev This empty reserved space is put in place to allow future versions to
  /// add new variables without shifting down storage in the inheritance chain.
  /// See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
  uint256[50] private __gap;

  function postSwap(uint256 encodedSwap, address initiator, uint40 poolIndex)
    payable public matchProtocolVersion(encodedSwap) verifyEncodedSwap(encodedSwap)
  {
    _postedSwaps[encodedSwap] = _postedSwapFrom(initiator, poolIndex, _msgSender() != initiator);

    uint8 tokenIndex = _inTokenIndexFrom(encodedSwap);
    _unsafeDepositToken(tokenIndex, _msgSender(), _amountFrom(encodedSwap));

    emit SwapPosted(encodedSwap);
  }

  /// @notice Anyone can call this method to post a swap request. This is step 1️⃣ in a swap.
  /// The r,s,v signature must be signed by the swap initiator. The initiator can call
  /// this method directly, in which case `poolIndex` should be zero and wait for LPs
  /// to call `bondSwap`. Initiators can also send the swap requests offchain (through the
  /// meson relayer service). An LP (pool owner or authorized addresses) who receives requests through
  /// the relayer can call this method to post and bond the swap in a single contract execution,
  /// in which case he should give his own `poolIndex`.
  ///
  /// The swap will last until `expireTs` and at most one LP pool can bond to it.
  /// After the swap expires, the initiator can cancel the swap and withdraw funds.
  ///
  /// Once a swap is posted and bonded, the bonding LP should call `lock` on the target chain.
  ///
  /// @dev Designed to be used by both swap initiators, pool owner, or authorized addresses
  /// @param encodedSwap Encoded swap information; also used as the key of `_postedSwaps`
  /// @param r Part of the signature
  /// @param yParityAndS Part of the signature
  /// @param initiator Initiator
  /// @param poolIndex Pool index
  function postSwapWithSignature(uint256 encodedSwap, bytes32 r, bytes32 yParityAndS, address initiator, uint40 poolIndex)
    external matchProtocolVersion(encodedSwap) verifyEncodedSwap(encodedSwap)
  {
    if (poolIndex > 0 && _msgSender() != initiator) {
      // If pool index is given, the signer should be the initiator or an authorized address
      require(poolOfAuthorizedAddr[_msgSender()] == poolIndex, "Signer should be an authorized address of the given pool");
    } // Otherwise, this is posted without bonding to a specific pool. Need to execute `bondSwap` later

    _checkRequestSignature(encodedSwap, r, yParityAndS, initiator);
    _postedSwaps[encodedSwap] = _postedSwapFrom(initiator, poolIndex, false);

    uint8 tokenIndex = _inTokenIndexFrom(encodedSwap);
    _unsafeDepositToken(tokenIndex, initiator, _amountFrom(encodedSwap));

    emit SwapPosted(encodedSwap);
  }

  // deprecated
  function postSwapFromInitiator(uint256 encodedSwap, uint200 postingValue) payable external {
    postSwap(encodedSwap, _initiatorFromPosted(postingValue), _poolIndexFromPosted(postingValue));
  }

  /// @notice If `postSwap` is called by the initiator of the swap and `poolIndex`
  /// is zero, an LP (pool owner or authorized addresses) can call this to bond the swap to himself.
  /// @dev Designed to be used by pool owner or authorized addresses
  /// @param encodedSwap Encoded swap information; also used as the key of `_postedSwaps`
  /// @param poolIndex The index of an LP pool. See `ownerOfPool` in `MesonStates.sol` for more information.
  function bondSwap(uint256 encodedSwap, uint40 poolIndex) external {
    uint208 postedSwap = _postedSwaps[encodedSwap];
    require(postedSwap > 1, "Swap does not exist");
    require(_poolIndexFromPosted(postedSwap) == 0, "Swap bonded to another pool");
    require(poolOfAuthorizedAddr[_msgSender()] == poolIndex, "Signer should be an authorized address of the given pool");

    _postedSwaps[encodedSwap] = postedSwap | poolIndex;
    emit SwapBonded(encodedSwap);
  }

  /// @notice Cancel a swap. The swap initiator can call this method to withdraw funds
  /// from an expired swap request.
  /// @dev Designed to be used by swap initiators
  /// @param encodedSwap Encoded swap information; also used as the key of `_postedSwaps`
  function cancelSwap(uint256 encodedSwap) external {
    uint208 postedSwap = _postedSwaps[encodedSwap];
    require(postedSwap > 1, "Swap does not exist");
    require(_expireTsFrom(encodedSwap) < block.timestamp, "Swap is still locked");
    require((postedSwap >> 200) == 0, "Swap token not from initiator");

    delete _postedSwaps[encodedSwap]; // Swap expired so the same one cannot be posted again

    uint8 tokenIndex = _inTokenIndexFrom(encodedSwap);
    _safeTransfer(tokenIndex, _initiatorFromPosted(postedSwap), _amountFrom(encodedSwap));

    emit SwapCancelled(encodedSwap);
  }

  function cancelSwapTo(uint256 encodedSwap, address recipient) external {
    require(_isPremiumManager(), "Caller is not the premium manager");

    uint208 postedSwap = _postedSwaps[encodedSwap];
    require(postedSwap > 1, "Swap does not exist");
    require(_expireTsFrom(encodedSwap) < block.timestamp, "Swap is still locked");

    delete _postedSwaps[encodedSwap]; // Swap expired so the same one cannot be posted again

    uint8 tokenIndex = _inTokenIndexFrom(encodedSwap);
    _safeTransfer(tokenIndex, recipient, _amountFrom(encodedSwap));

    emit SwapCancelled(encodedSwap);
  }

  /// @notice Execute the swap by providing a release signature. This is step 4️⃣ in a swap.
  /// Once the signature is verified, the current bonding pool will receive funds deposited 
  /// by the swap initiator.
  /// @dev Designed to be used by pool owner or authorized addresses of the current bonding pool
  /// @param encodedSwap Encoded swap information; also used as the key of `_postedSwaps`
  /// @param r Part of the release signature (same as in the `release` call)
  /// @param yParityAndS Part of the release signature (same as in the `release` call)
  /// @param recipient The recipient address of the swap
  /// @param depositToPool Whether to deposit funds to the pool (will save gas)
  function executeSwap(
    uint256 encodedSwap,
    bytes32 r,
    bytes32 yParityAndS,
    address recipient,
    bool depositToPool
  ) external {
    uint208 postedSwap = _postedSwaps[encodedSwap];
    require(postedSwap > 1, "Swap does not exist");

    // Swap expiredTs < current + MIN_BOND_TIME_PERIOD
    if (_expireTsFrom(encodedSwap) < block.timestamp + MIN_BOND_TIME_PERIOD) {
      // The swap cannot be posted again and therefore safe to remove it.
      // LPs who execute in this mode can save ~5000 gas.
      delete _postedSwaps[encodedSwap];
    } else {
      // The same swap information can be posted again, so set `_postedSwaps` value to 1 to prevent that.
      _postedSwaps[encodedSwap] = 1;
    }

    _checkReleaseSignature(encodedSwap, recipient, r, yParityAndS, _initiatorFromPosted(postedSwap));

    uint8 tokenIndex = _inTokenIndexFrom(encodedSwap);
    uint40 poolIndex = _poolIndexFromPosted(postedSwap);
    if (depositToPool) {
      _balanceOfPoolToken[_poolTokenIndexFrom(tokenIndex, poolIndex)] += _amountFrom(encodedSwap);
    } else {
      _safeTransfer(tokenIndex, ownerOfPool[poolIndex], _amountFrom(encodedSwap));
    }

    emit SwapExecuted(encodedSwap);
  }

  function directExecuteSwap(
    uint256 encodedSwap,
    bytes32 r,
    bytes32 yParityAndS,
    address initiator,
    address recipient
  ) payable external matchProtocolVersion(encodedSwap) verifyEncodedSwap(encodedSwap) {
    _checkReleaseSignature(encodedSwap, recipient, r, yParityAndS, initiator);

    _postedSwaps[encodedSwap] = 1;

    uint256 amount = _amountFrom(encodedSwap);
    uint8 tokenIndex = _inTokenIndexFrom(encodedSwap);
    _balanceOfPoolToken[_poolTokenIndexFrom(tokenIndex, 1)] += amount;

    _unsafeDepositToken(tokenIndex, initiator, amount);

    emit SwapExecuted(encodedSwap);
  }

  function simpleExecuteSwap(uint256 encodedSwap)
    payable external matchProtocolVersion(encodedSwap) verifyEncodedSwap(encodedSwap)
  {
    _postedSwaps[encodedSwap] = 1;

    uint256 amount = _amountFrom(encodedSwap);
    uint8 tokenIndex = _inTokenIndexFrom(encodedSwap);
    _balanceOfPoolToken[_poolTokenIndexFrom(tokenIndex, 1)] += amount;

    _unsafeDepositToken(tokenIndex, _msgSender(), amount);

    emit SwapExecuted(encodedSwap);
  }

  /// @notice Read information for a posted swap
  function getPostedSwap(uint256 encodedSwap) external view
    returns (address initiator, address poolOwner, bool exist)
  {
    uint208 postedSwap = _postedSwaps[encodedSwap];
    initiator = _initiatorFromPosted(postedSwap);
    exist = postedSwap > 0;
    if (initiator == address(0)) {
      poolOwner = address(0);
    } else {
      poolOwner = ownerOfPool[_poolIndexFromPosted(postedSwap)];
    }
  }

  modifier verifyEncodedSwap(uint256 encodedSwap) {
    require(_inChainFrom(encodedSwap) == SHORT_COIN_TYPE, "Swap not for this chain");
    require(
      _tokenType(_inTokenIndexFrom(encodedSwap)) == _tokenType(_outTokenIndexFrom(encodedSwap)),
      "In & out token types do not match"
    );
    require(_postedSwaps[encodedSwap] == 0, "Swap already exists");

    require(_amountFrom(encodedSwap) <= MAX_SWAP_AMOUNT, "For security reason, amount cannot be greater than 100k");

    uint256 delta = _expireTsFrom(encodedSwap) - block.timestamp;
    require(delta > MIN_BOND_TIME_PERIOD, "Expire ts too early");
    require(delta < MAX_BOND_TIME_PERIOD, "Expire ts too late");

    _;
  }
}

/// @title MesonPools Interface
interface IMesonPoolsEvents {
  /// @notice Event when an LP pool is registered.
  /// Emit at the end of `depositAndRegister()` calls.
  /// @param poolIndex Pool index
  /// @param owner Pool owner
  event PoolRegistered(uint40 indexed poolIndex, address owner);

  /// @notice Event when fund was deposited to an LP pool.
  /// Emit at the end of `depositAndRegister()` and `deposit()` calls.
  /// @param poolTokenIndex Concatenation of pool index & token index
  /// @param amount The amount of tokens to be added to the pool
  event PoolDeposited(uint48 indexed poolTokenIndex, uint256 amount);

  /// @notice Event when fund was withdrawn from an LP pool.
  /// Emit at the end of `withdraw()` calls.
  /// @param poolTokenIndex Concatenation of pool index & token index
  /// @param amount The amount of tokens to be removed from the pool
  event PoolWithdrawn(uint48 indexed poolTokenIndex, uint256 amount);

  /// @notice Event when an authorized address was added for an LP pool.
  /// Emit at the end of `depositAndRegister()` calls.
  /// @param poolIndex Pool index
  /// @param addr Authorized address to be added
  event PoolAuthorizedAddrAdded(uint40 indexed poolIndex, address addr);

  /// @notice Event when an authorized address was removed for an LP pool.
  /// Emit at the end of `depositAndRegister()` calls.
  /// @param poolIndex Pool index
  /// @param addr Authorized address to be removed
  event PoolAuthorizedAddrRemoved(uint40 indexed poolIndex, address addr);

  /// @notice Event when the ownership of a pool was transferred.
  /// Emit at the end of `transferPoolOwner()` calls.
  /// @param poolIndex Pool index
  /// @param prevOwner Previous owner of the pool
  /// @param newOwner New owner of the pool
  event PoolOwnerTransferred(uint40 indexed poolIndex, address prevOwner, address newOwner);

  /// @notice Event when a swap was locked.
  /// Emit at the end of `lock()` and `lockSwap()` calls.
  /// @param encodedSwap Encoded swap
  event SwapLocked(uint256 indexed encodedSwap);

  /// @notice Event when a swap was unlocked.
  /// Emit at the end of `unlock()` calls.
  /// @param encodedSwap Encoded swap
  event SwapUnlocked(uint256 indexed encodedSwap);

  /// @notice Event when a swap was released.
  /// Emit at the end of `release()`, `directRelease()` calls.
  /// @param encodedSwap Encoded swap
  event SwapReleased(uint256 indexed encodedSwap);
}

/// @title MesonTokens
/// @notice The class that stores the information of Meson's supported tokens
contract MesonTokens {
  /// @notice The whitelist of supported tokens in Meson
  /// Meson use a whitelist for supported stablecoins, which is specified on first deployment
  /// or added through `_addSupportToken` Only modify this mapping through `_addSupportToken`.
  /// key: `tokenIndex` in range of 1-255
  ///     0:       unsupported
  ///     1-32:    stablecoins with decimals 6
  ///       1, 9:    USDC, USDC.e
  ///       2, 10:   USDT, USDT.e
  ///       3:       BUSD
  ///       6:       CUSD (Viction/Tomo)
  ///       7:       pUSD
  ///       16:      USD1
  ///       17:      PoD USDC
  ///       18:      PoD USDT
  ///       19:      PoD BUSD
  ///       32:      PoD
  ///     33-48:   stablecoins with decimals 18
  ///       33:      USDC
  ///       34:      USDT
  ///       35:      BUSD
  ///       36:      (reserved for DAI)
  ///       37:      cUSD (Celo)
  ///       39:      USDB (Blast)
  ///       40:      FDUSD
  ///       41:      BBUSD
  ///       48:      USD1
  ///     49-64:   stablecoins as core (decimals 18)
  ///       49:      USDC
  ///       52:      DAI
  ///     65-112:  3rd party tokens (decimals 18)
  ///       65:      iUSD (iZUMi Bond USD)
  ///       67:      M-BTC (Merlin BTC)
  ///       69:      MERL
  ///       71:      STONE
  ///       73:      SolvBTC.m
  ///       75:      SolvBTC
  ///       77:      SolvBTC.a
  ///       79:      uBTC
  ///       81:      xSolvBTC
  ///       83:      SolvBTC.ENA
  ///       85:      SolvBTC.JUP
  ///       87:      PUMP
  ///       89:      B2
  ///     113-123:  3rd party tokens (decimals 8)
  ///       113:     pumpBTC
  ///       114:     uniBTC
  ///       115:     cbBTC
  ///       116:     FBTC
  ///     124-128:  3rd party tokens (decimals 9)
  ///       124:     DUCK
  ///     129-190: (Unspecified)
  ///     191:     No-swap core
  ///     192-195: M & M equivalent
  ///       194:     ERC20 M
  ///       195:     M as core
  ///     196-199: M & M equivalent
  ///       198:     ERC20 TAKER
  ///       199:     TAKER as core
  ///     200-235: (Unspecified)
  ///     236-239: MATIC & MATIC equivalent
  ///       236:     PoD MATIC
  ///       238:     ERC20 MATIC
  ///       239:     MATIC as core
  ///     240-243: BTC & BTC equivalent
  ///       240:     PoD BTC
  ///       241:     ERC20 BTC (decimals 18)
  ///       242:     ERC20 BTC (decimals 8 except BNB Smart Chain & BounceBit)
  ///       243:     BTC as core
  ///     244-247: SOL & SOL equivalent
  ///       244:     PoD SOL
  ///       246:     ERC20 SOL
  ///       247:     SOL as core
  ///     248-251: BNB & BNB equivalent
  ///       248:     PoD BNB
  ///       250:     (reserved for ERC20 BNB)
  ///       251:     BNB as core
  ///     252-255: ETH & ETH equivalent
  ///       252:     PoD ETH
  ///       254:     Wrapped ETH
  ///       255:     ETH as core
  /// value: the supported token's contract address
  mapping(uint8 => address) public tokenForIndex;


  /// @notice The mapping to get `tokenIndex` from a supported token's address
  /// Only modify this mapping through `_addSupportToken`.
  /// key: the supported token's contract address
  /// value: `tokenIndex` in range of 1-255
  mapping(address => uint8) public indexOfToken;

  /// @dev This empty reserved space is put in place to allow future versions to
  /// add new variables without shifting down storage in the inheritance chain.
  /// See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
  uint256[50] private __gap;

  function _isCoreToken(uint8 tokenIndex) public pure returns (bool) {
    return (tokenIndex >= 49 && tokenIndex <= 64) || ((tokenIndex > 190) && ((tokenIndex % 4) == 3));
  }

  /// @notice Return all supported token addresses in an array ordered by `tokenIndex`
  /// This method will only return tokens with consecutive token indexes.
  function getSupportedTokens() external view returns (address[] memory tokens, uint8[] memory indexes) {
    uint8 i;
    uint8 num;
    for (i = 0; i < 255; i++) {
      if (tokenForIndex[i+1] != address(0)) {
        num++;
      }
    }
    tokens = new address[](num);
    indexes = new uint8[](num);
    uint8 j = 0;
    for (i = 0; i < 255; i++) {
      if (tokenForIndex[i+1] != address(0)) {
        tokens[j] = tokenForIndex[i+1];
        indexes[j] = i+1;
        j++;
      }
    }
  }

  function _addSupportToken(address token, uint8 index) internal {
    require(index != 0, "Cannot use 0 as token index");
    require(token != address(0), "Cannot use zero address");
    require(indexOfToken[token] == 0, "Token has been added before");
    require(tokenForIndex[index] == address(0), "Index has been used");
    if (_isCoreToken(index)) {
      require(token == address(0x1), "Core token requires adddress(0x1)");
    }
    indexOfToken[token] = index;
    tokenForIndex[index] = token;
  }

  function _removeSupportToken(uint8 index) internal {
    require(index != 0, "Cannot use 0 as token index");
    address token = tokenForIndex[index];
    require(token != address(0), "Token for the index does not exist");
    delete indexOfToken[token];
    delete tokenForIndex[index];
  }
}

/// @notice Parameters of the Meson contract
/// for Arbitrum
contract MesonConfig {
  uint8 constant MESON_PROTOCOL_VERSION = 1;

  // Ref https://github.com/satoshilabs/slips/blob/master/slip-0044.md
  uint16 constant SHORT_COIN_TYPE = 0x2329;

  uint256 constant MAX_SWAP_AMOUNT = 1e11; // 100,000.000000 = 100k
  uint256 constant SERVICE_FEE_RATE = 5; // service fee = 5 / 10000 = 0.05%
  uint256 constant SERVICE_FEE_MINIMUM = 500_000; // min $0.5
  uint256 constant SERVICE_FEE_MINIMUM_ETH = 500; // min 0.0005 ETH (or SOL)
  uint256 constant SERVICE_FEE_MINIMUM_BNB = 5000; // min 0.005 BNB
  uint256 constant SERVICE_FEE_MINIMUM_BTC = 10; // min 0.00001 BTC

  uint256 constant MIN_BOND_TIME_PERIOD = 1 hours;
  uint256 constant MAX_BOND_TIME_PERIOD = 2 hours;
  uint256 constant LOCK_TIME_PERIOD = 20 minutes;

  bytes28 constant ETH_SIGN_HEADER = bytes28("\x19Ethereum Signed Message:\n32");
  bytes28 constant ETH_SIGN_HEADER_52 = bytes28("\x19Ethereum Signed Message:\n52");
  bytes25 constant TRON_SIGN_HEADER = bytes25("\x19TRON Signed Message:\n32\n");
  bytes25 constant TRON_SIGN_HEADER_33 = bytes25("\x19TRON Signed Message:\n33\n");
  bytes25 constant TRON_SIGN_HEADER_53 = bytes25("\x19TRON Signed Message:\n53\n");

  bytes32 constant REQUEST_TYPE_HASH = keccak256("bytes32 Sign to request a swap on Meson");
  bytes32 constant RELEASE_TYPE_HASH = keccak256("bytes32 Sign to release a swap on Mesonaddress Recipient");

  bytes32 constant RELEASE_TO_TRON_TYPE_HASH = keccak256("bytes32 Sign to release a swap on Mesonaddress Recipient (tron address in hex format)");
}

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

/// @title MesonHelpers
/// @notice The class that provides helper functions for Meson protocol
contract MesonHelpers is MesonConfig, Context {
  modifier matchProtocolVersion(uint256 encodedSwap) {
    require(_versionFrom(encodedSwap) == MESON_PROTOCOL_VERSION, "Incorrect encoding version");
    _;
  }

  function getShortCoinType() external pure returns (bytes2) {
    return bytes2(SHORT_COIN_TYPE);
  }

  /// @notice Calculate `swapId` from `encodedSwap`, `initiator`
  /// See variable `_postedSwaps` in `MesonSwap.sol` for the defination of `encodedSwap`
  function _getSwapId(uint256 encodedSwap, address initiator) internal pure returns (bytes32) {
    return keccak256(abi.encodePacked(encodedSwap, initiator));
  }

  /// @notice Decode `version` from `encodedSwap`
  /// See variable `_postedSwaps` in `MesonSwap.sol` for the defination of `encodedSwap`
  function _versionFrom(uint256 encodedSwap) internal pure returns (uint8) {
    return uint8(encodedSwap >> 248);
  }

  /// @notice Decode `amount` from `encodedSwap`
  /// See variable `_postedSwaps` in `MesonSwap.sol` for the defination of `encodedSwap`
  function _amountFrom(uint256 encodedSwap) internal pure returns (uint256) {
    return (encodedSwap >> 208) & 0xFFFFFFFFFF;
  }

  function _amountToLock(uint256 encodedSwap) internal pure returns (uint256) {
    return _amountFrom(encodedSwap) - _feeForLp(encodedSwap) - _amountForCoreTokenFrom(encodedSwap);
  }

  /// @notice Calculate the service fee from `encodedSwap`
  /// See variable `_postedSwaps` in `MesonSwap.sol` for the defination of `encodedSwap`
  function _serviceFee(uint256 encodedSwap) internal pure returns (uint256) {
    uint8 tokenIndex = _inTokenIndexFrom(encodedSwap);
    uint256 minFee;
    if (tokenIndex >= 252) {
      minFee = SERVICE_FEE_MINIMUM_ETH;
    } else if (tokenIndex >= 248) {
      minFee = SERVICE_FEE_MINIMUM_BNB;
    } else if (tokenIndex >= 244) {
      minFee = SERVICE_FEE_MINIMUM_ETH;
    } else if (tokenIndex >= 240) {
      minFee = SERVICE_FEE_MINIMUM_BTC;
    } else {
      minFee = SERVICE_FEE_MINIMUM;
    }
    // Default to `serviceFee` = 0.05% * `amount`
    uint256 fee = _amountFrom(encodedSwap) * SERVICE_FEE_RATE / 10000;
    return fee > minFee ? fee : minFee;
  }

  /// @notice Decode `fee` (the fee for LPs) from `encodedSwap`
  /// See variable `_postedSwaps` in `MesonSwap.sol` for the defination of `encodedSwap`
  function _feeForLp(uint256 encodedSwap) internal pure returns (uint256) {
    return (encodedSwap >> 88) & 0xFFFFFFFFFF;
  }

  /// @notice Decode `salt` from `encodedSwap`
  /// See variable `_postedSwaps` in `MesonSwap.sol` for the defination of `encodedSwap`
  function _saltFrom(uint256 encodedSwap) internal pure returns (uint80) {
    return uint80(encodedSwap >> 128);
  }

  /// @notice Decode data from `salt`
  /// See variable `_postedSwaps` in `MesonSwap.sol` for the defination of `encodedSwap`
  function _saltDataFrom(uint256 encodedSwap) internal pure returns (uint64) {
    return uint64(encodedSwap >> 128);
  }

  /// @notice Whether the swap should release to a 3rd-party integrated dapp contract
  /// See method `release` in `MesonPools.sol` for more details
  function _willTransferToContract(uint256 encodedSwap) internal pure returns (bool) {
    return (encodedSwap & 0x8000000000000000000000000000000000000000000000000000) == 0;
  }

  /// @notice Whether the swap needs to pay service fee
  /// See method `release` in `MesonPools.sol` for more details about the service fee
  function _feeWaived(uint256 encodedSwap) internal pure returns (bool) {
    return (encodedSwap & 0x4000000000000000000000000000000000000000000000000000) > 0;
  }
  
  /// @notice Whether the swap was signed in the non-typed manner (usually by hardware wallets)
  function _signNonTyped(uint256 encodedSwap) internal pure returns (bool) {
    return (encodedSwap & 0x0800000000000000000000000000000000000000000000000000) > 0;
  }

  function _swapForCoreToken(uint256 encodedSwap) internal pure returns (bool) {
    return (_outTokenIndexFrom(encodedSwap) < 191) &&
      ((encodedSwap & 0x8410000000000000000000000000000000000000000000000000) == 0x8410000000000000000000000000000000000000000000000000);
  }

  function _amountForCoreTokenFrom(uint256 encodedSwap) internal pure returns (uint256) {
    if (_swapForCoreToken(encodedSwap)) {
      uint256 d = (encodedSwap >> 160) & 0xFFFF;
      if (d == 0xFFFF) {
        return _amountFrom(encodedSwap) - _feeForLp(encodedSwap) - (_feeWaived(encodedSwap) ? 0 : _serviceFee(encodedSwap));
      }
      return _decompressFixedPrecision(d) * 1e3;
    }
    return 0;
  }

  function _coreTokenAmount(uint256 encodedSwap) internal pure returns (uint256) {
    uint256 amountForCore = _amountForCoreTokenFrom(encodedSwap);
    if (amountForCore > 0) {
      return amountForCore * 1e4 / _decompressFixedPrecision((encodedSwap >> 176) & 0xFFFF);
    }
    return 0;
  }

  function _shareWithPartner(uint256 encodedSwap) internal pure returns (bool) {
    return !_willTransferToContract(encodedSwap)
      && ((encodedSwap & 0x0600000000000000000000000000000000000000000000000000) == 0x0200000000000000000000000000000000000000000000000000);
  }

  function _amountToShare(uint256 encodedSwap) internal pure returns (uint256) {
    if (_shareWithPartner(encodedSwap)) {
      return _decompressFixedPrecision((encodedSwap >> 160) & 0xFFFF);
    }
    return 0;
  }

  function _decompressFixedPrecision(uint256 d) internal pure returns (uint256) {
    if (d <= 1000) {
      return d;
    }
    return ((d - 1000) % 9000 + 1000) * 10 ** ((d - 1000) / 9000);
  }

  function _poolIndexToShare(uint256 encodedSwap) internal pure returns (uint40) {
    if (_shareWithPartner(encodedSwap)) {
      return (uint40(encodedSwap >> 176) & 0xFFFF) + 65536;
    }
    return 0;
  }

  /// @notice Decode `expireTs` from `encodedSwap`
  /// See variable `_postedSwaps` in `MesonSwap.sol` for the defination of `encodedSwap`
  function _expireTsFrom(uint256 encodedSwap) internal pure returns (uint256) {
    return (encodedSwap >> 48) & 0xFFFFFFFFFF;
    // [Suggestion]: return uint40(encodedSwap >> 48);
  }

  /// @notice Decode the initial chain (`inChain`) from `encodedSwap`
  /// See variable `_postedSwaps` in `MesonSwap.sol` for the defination of `encodedSwap`
  function _inChainFrom(uint256 encodedSwap) internal pure returns (uint16) {
    return uint16(encodedSwap >> 8);
  }

  /// @notice Decode the token index of initial chain (`inToken`) from `encodedSwap`
  /// See variable `_postedSwaps` in `MesonSwap.sol` for the defination of `encodedSwap`
  function _inTokenIndexFrom(uint256 encodedSwap) internal pure returns (uint8) {
    return uint8(encodedSwap);
  }

  /// @notice Decode the target chain (`outChain`) from `encodedSwap`
  /// See variable `_postedSwaps` in `MesonSwap.sol` for the defination of `encodedSwap`
  function _outChainFrom(uint256 encodedSwap) internal pure returns (uint16) {
    return uint16(encodedSwap >> 32);
  }

  /// @notice Decode the token index of target chain (`outToken`) from `encodedSwap`
  /// See variable `_postedSwaps` in `MesonSwap.sol` for the defination of `encodedSwap`
  function _outTokenIndexFrom(uint256 encodedSwap) internal pure returns (uint8) {
    return uint8(encodedSwap >> 24);
  }

  function _tokenType(uint8 tokenIndex) internal pure returns (uint8) {
    if (tokenIndex >= 192) {
      // Non stablecoins [192, 255] -> [48, 63]
      return tokenIndex / 4;
    } else if (tokenIndex <= 64) {
      // Stablecoins [1, 64] -> 0
      return 0;
    } else if (tokenIndex <= 112) {
      // 3rd party tokens [65, 112] -> [1, 24]
      return (tokenIndex + 1) / 2 - 32;
    } else if (tokenIndex <= 128) {
      // 3rd party tokens [113, 128] -> [33, 48]
      return tokenIndex - 80;
    }
    revert("Token index not allowed for swapping");
  }

  /// @notice Decode `outToken` from `encodedSwap`, and encode it with `poolIndex` to `poolTokenIndex`.
  /// See variable `_balanceOfPoolToken` in `MesonStates.sol` for the defination of `poolTokenIndex`
  function _poolTokenIndexForOutToken(uint256 encodedSwap, uint40 poolIndex) internal pure returns (uint48) {
    return uint48((encodedSwap & 0xFF000000) << 16) | poolIndex;
  }

  /// @notice Encode `postedSwap` from `initiator` and `poolIndex`
  /// See variable `_postedSwaps` in `MesonSwap.sol` for the defination of `postedSwap`
  function _postedSwapFrom(address initiator, uint40 poolIndex, bool tokenNotFromInitiator)
    internal pure returns (uint208)
  {
    return (tokenNotFromInitiator ? (uint208(1) << 200) : uint208(0)) | (uint208(uint160(initiator)) << 40) | poolIndex;
  }

  /// @notice Decode `initiator` from `postedSwap`
  /// See variable `_postedSwaps` in `MesonSwap.sol` for the defination of `postedSwap`
  function _initiatorFromPosted(uint208 postedSwap) internal pure returns (address) {
    return address(uint160(postedSwap >> 40));
  }

  /// @notice Decode `poolIndex` from `postedSwap`
  /// See variable `_postedSwaps` in `MesonSwap.sol` for the defination of `postedSwap`
  function _poolIndexFromPosted(uint208 postedSwap) internal pure returns (uint40) {
    return uint40(postedSwap);
  }
  
  /// @notice Encode `lockedSwap` from `until` and `poolIndex`
  /// See variable `_lockedSwaps` in `MesonPools.sol` for the defination of `lockedSwap`
  function _lockedSwapFrom(uint256 until, uint40 poolIndex) internal pure returns (uint80) {
    return (uint80(until) << 40) | poolIndex;
  }

  /// @notice Decode `poolIndex` from `lockedSwap`
  /// See variable `_lockedSwaps` in `MesonPools.sol` for the defination of `lockedSwap`
  function _poolIndexFromLocked(uint80 lockedSwap) internal pure returns (uint40) {
    return uint40(lockedSwap);
  }

  /// @notice Decode `until` from `lockedSwap`
  /// See variable `_lockedSwaps` in `MesonPools.sol` for the defination of `lockedSwap`
  function _untilFromLocked(uint80 lockedSwap) internal pure returns (uint256) {
    return uint256(lockedSwap >> 40);
  }

  /// @notice Encode `poolTokenIndex` from `tokenIndex` and `poolIndex`
  /// See variable `_balanceOfPoolToken` in `MesonStates.sol` for the defination of `poolTokenIndex`
  function _poolTokenIndexFrom(uint8 tokenIndex, uint40 poolIndex) internal pure returns (uint48) {
    return (uint48(tokenIndex) << 40) | poolIndex;
  }

  /// @notice Decode `tokenIndex` from `poolTokenIndex`
  /// See variable `_balanceOfPoolToken` in `MesonStates.sol` for the defination of `poolTokenIndex`
  function _tokenIndexFrom(uint48 poolTokenIndex) internal pure returns (uint8) {
    return uint8(poolTokenIndex >> 40);
  }

  /// @notice Decode `poolIndex` from `poolTokenIndex`
  /// See variable `_balanceOfPoolToken` in `MesonStates.sol` for the defination of `poolTokenIndex`
  function _poolIndexFrom(uint48 poolTokenIndex) internal pure returns (uint40) {
    return uint40(poolTokenIndex);
  }

  /// @notice Check the initiator's signature for a swap request
  /// Signatures are constructed with the package `mesonfi/sdk`. Go to `packages/sdk/src/SwapSigner.ts` and 
  /// see how to generate a signautre in class `EthersWalletSwapSigner` method `signSwapRequest`
  /// @param encodedSwap Encoded swap information. See variable `_postedSwaps` in `MesonSwap.sol` for the defination of `encodedSwap`
  /// @param r Part of the signature
  /// @param yParityAndS Part of the signature
  /// @param signer The signer for the swap request which is the `initiator`
  function _checkRequestSignature(
    uint256 encodedSwap,
    bytes32 r,
    bytes32 yParityAndS,
    address signer
  ) internal pure {
    require(signer != address(0), "Signer cannot be empty address");
    bytes32 s = yParityAndS & bytes32(0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
    uint8 v = uint8((uint256(yParityAndS) >> 255) + 27);
    require(uint256(s) <= 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0, "Invalid signature");

    bool nonTyped = _signNonTyped(encodedSwap);
    bytes32 digest;
    if (_inChainFrom(encodedSwap) == 0x00c3) {
      digest = keccak256(abi.encodePacked(nonTyped ? TRON_SIGN_HEADER_33 : TRON_SIGN_HEADER, encodedSwap));
    } else if (nonTyped) {
      digest = keccak256(abi.encodePacked(ETH_SIGN_HEADER, encodedSwap));
    } else {
      bytes32 typehash = REQUEST_TYPE_HASH;
      assembly {
        mstore(0, encodedSwap)
        mstore(32, keccak256(0, 32))
        mstore(0, typehash)
        digest := keccak256(0, 64)
      }
    }
    require(signer == ecrecover(digest, v, r, s), "Invalid signature");
  }

  /// @notice Check the initiator's signature for the release request
  /// Signatures are constructed with the package `mesonfi/sdk`. Go to `packages/sdk/src/SwapSigner.ts` and 
  /// see how to generate a signautre in class `EthersWalletSwapSigner` method `signSwapRelease`
  /// @param encodedSwap Encoded swap information. See variable `_postedSwaps` in `MesonSwap.sol` for the defination of `encodedSwap`
  /// @param recipient The recipient address of the swap
  /// @param r Part of the signature
  /// @param yParityAndS Part of the signature
  /// @param signer The signer for the swap request which is the `initiator`
  function _checkReleaseSignature(
    uint256 encodedSwap,
    address recipient,
    bytes32 r,
    bytes32 yParityAndS,
    address signer
  ) internal pure {
    require(signer != address(0), "Signer cannot be empty address");
    bytes32 s = yParityAndS & bytes32(0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
    uint8 v = uint8((uint256(yParityAndS) >> 255) + 27);
    require(uint256(s) <= 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0, "Invalid signature");

    bool nonTyped = _signNonTyped(encodedSwap);
    bytes32 digest;
    if (_inChainFrom(encodedSwap) == 0x00c3) {
      digest = keccak256(abi.encodePacked(nonTyped ? TRON_SIGN_HEADER_53 : TRON_SIGN_HEADER, encodedSwap, recipient));
    } else if (nonTyped) {
      digest = keccak256(abi.encodePacked(ETH_SIGN_HEADER_52, encodedSwap, recipient));
    } else {
      bytes32 typehash = _outChainFrom(encodedSwap) == 0x00c3 ? RELEASE_TO_TRON_TYPE_HASH : RELEASE_TYPE_HASH;
      assembly {
        mstore(20, recipient)
        mstore(0, encodedSwap)
        mstore(32, keccak256(0, 52))
        mstore(0, typehash)
        digest := keccak256(0, 64)
      }
    }
    require(signer == ecrecover(digest, v, r, s), "Invalid signature");
  }

  function _checkSignature(bytes32 digest, bytes32 r, bytes32 yParityAndS, address signer) internal pure {
    require(signer != address(0), "Signer cannot be empty address");
    bytes32 s = yParityAndS & bytes32(0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
    uint8 v = uint8((uint256(yParityAndS) >> 255) + 27);
    require(uint256(s) <= 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0, "Invalid signature");

    require(signer == ecrecover(digest, v, r, s), "Invalid signature");
  }
}

/**
 * @dev Collection of functions related to the address type
 */
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
        return functionCall(target, data, "Address: low-level call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
     * `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
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
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value
    ) internal returns (bytes memory) {
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
        require(isContract(target), "Address: call to non-contract");

        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResult(success, returndata, errorMessage);
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
        require(isContract(target), "Address: static call to non-contract");

        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResult(success, returndata, errorMessage);
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
        require(isContract(target), "Address: delegate call to non-contract");

        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResult(success, returndata, errorMessage);
    }

    /**
     * @dev Tool to verifies that a low level call was successful, and revert if it wasn't, either by bubbling the
     * revert reason using the provided one.
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
}

/// @title Minimal ERC20 interface for Uniswap
/// @notice Contains a subset of the full ERC20 interface that is used in Uniswap V3
interface IERC20Minimal {
  /// @notice Returns the balance of a token
  /// @param account The account for which to look up the number of tokens it has, i.e. its balance
  /// @return The number of tokens held by the account
  function balanceOf(address account) external view returns (uint256);

  /// @notice Transfers the amount of token from the `msg.sender` to the recipient
  /// @param recipient The account that will receive the amount transferred
  /// @param amount The number of tokens to send from the sender to the recipient
  /// @return Returns true for a successful transfer, false for an unsuccessful transfer
  function transfer(address recipient, uint256 amount) external returns (bool);

  /// @notice Returns the current allowance given to a spender by an owner
  /// @param owner The account of the token owner
  /// @param spender The account of the token spender
  /// @return The current allowance granted by `owner` to `spender`
  function allowance(address owner, address spender) external view returns (uint256);

  /// @notice Sets the allowance of a spender from the `msg.sender` to the value `amount`
  /// @param spender The account which will be allowed to spend a given amount of the owners tokens
  /// @param amount The amount of tokens allowed to be used by `spender`
  /// @return Returns true for a successful approval, false for unsuccessful
  function approve(address spender, uint256 amount) external returns (bool);

  /// @notice Transfers `amount` tokens from `sender` to `recipient` up to the allowance given to the `msg.sender`
  /// @param sender The account from which the transfer will be initiated
  /// @param recipient The recipient of the transfer
  /// @param amount The amount of the transfer
  /// @return Returns true for a successful transfer, false for unsuccessful
  function transferFrom(
      address sender,
      address recipient,
      uint256 amount
  ) external returns (bool);

  /// @notice Event emitted when tokens are transferred from one address to another, either via `#transfer` or `#transferFrom`.
  /// @param from The account from which the tokens were sent, i.e. the balance decreased
  /// @param to The account to which the tokens were sent, i.e. the balance increased
  /// @param value The amount of tokens that were transferred
  event Transfer(address indexed from, address indexed to, uint256 value);

  /// @notice Event emitted when the approval amount for the spender of a given owner's tokens changes.
  /// @param owner The account that approved spending of its tokens
  /// @param spender The account for which the spending allowance was modified
  /// @param value The new allowance from the owner to the spender
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

/// @title Interface for depositWithBeneficiary
interface IDepositWithBeneficiary {
  /// @notice Make a token transfer that the *signer* is paying tokens but benefits are given to the *beneficiary*
  /// @param token The contract address of the transferring token
  /// @param amount The amount of the transfer
  /// @param beneficiary The address that will receive benefits of this transfer
  /// @param data Extra data passed to the contract
  /// @return Returns true for a successful transfer.
  function depositWithBeneficiary(address token, uint256 amount, address beneficiary, uint64 data)
    payable external returns (bool);
}

/// @title MesonStates
/// @notice The class that keeps track of LP pool states
contract MesonStates is MesonTokens, MesonHelpers {
  bytes4 private constant ERC20_TRANSFER_SELECTOR = bytes4(keccak256("transfer(address,uint256)"));
  bytes4 private constant ERC20_TRANSFER_FROM_SELECTOR = bytes4(keccak256("transferFrom(address,address,uint256)"));

  /// @notice The mapping from *authorized addresses* to LP pool indexes.
  /// See `ownerOfPool` to understand how pool index is defined and used.
  ///
  /// This mapping records the relation between *authorized addresses* and pool indexes, where
  /// authorized addresses are those who have the permision to match and complete a swap with funds 
  /// in a pool with specific index. For example, for an LP pool with index `i` there could be multiple
  /// addresses that `poolOfAuthorizedAddr[address] = i`, which means these addresses can all sign to match
  /// (call `bondSwap`, `lock`) a swap and complete it (call `release`) with funds in pool `i`. That helps
  /// an LP to give other addresses the permission to perform daily swap transactions. However, authorized
  /// addresses cannot withdraw funds from the LP pool, unless it's given in `ownerOfPool` which records
  /// the *owner* address for each pool.
  ///
  /// The pool index 0 is reserved for use by Meson
  mapping(address => uint40) public poolOfAuthorizedAddr;

  /// @notice The mapping from LP pool indexes to their owner addresses.
  /// Each LP pool in Meson has a uint40 index `i` and each LP needs to register an pool index at
  /// initial deposit by calling `depositAndRegister`. The balance for each LP pool is tracked by its
  /// pool index and token index (see `_balanceOfPoolToken`).
  /// 
  /// This mapping records the *owner* address for each LP pool. Only the owner address can withdraw funds
  /// from its corresponding LP pool.
  ///
  /// The pool index 0 is reserved for use by Meson
  mapping(uint40 => address) public ownerOfPool;

  /// @notice Balance for each token in LP pool, tracked by the `poolTokenIndex`.
  /// See `ownerOfPool` to understand how pool index is defined and used.
  ///
  /// The balance of a token in an LP pool is `_balanceOfPoolToken[poolTokenIndex]` in which
  /// the `poolTokenIndex` is in format of `tokenIndex:uint8|poolIndex:uint40`. `tokenIndex`
  /// is the index of supported tokens given by `tokenForIndex` (see definition in `MesonTokens.sol`).
  /// The balances are always store as tokens have decimal 6, which is the case for USDC/USDT on most chains
  /// except BNB Smart Chain & Conflux. In the exceptional cases, the value of token amount will be converted
  /// on deposit and withdrawal (see `_safeTransfer` and `_unsafeDepositToken` in `MesonHelpers.sol`).
  ///
  /// The pool index 0 is reserved for use by Meson to store service fees
  mapping(uint48 => uint256) internal _balanceOfPoolToken;

  /// @dev This empty reserved space is put in place to allow future versions to
  /// add new variables without shifting down storage in the inheritance chain.
  /// See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
  uint256[50] private __gap;

  function _isPremiumManager() internal view virtual returns (bool) {}

  function poolTokenBalance(address token, address addr) external view returns (uint256) {
    uint8 tokenIndex = indexOfToken[token];
    uint40 poolIndex = poolOfAuthorizedAddr[addr];
    if (poolIndex == 0 || tokenIndex == 0) {
      return 0;
    }
    return _balanceOfPoolToken[_poolTokenIndexFrom(tokenIndex, poolIndex)];
  }
  
  /// @notice The collected service fee of a specific token.
  /// @param tokenIndex The index of a supported token. See `tokenForIndex` in `MesonTokens.sol`
  function serviceFeeCollected(uint8 tokenIndex) external view returns (uint256) {
    return _balanceOfPoolToken[_poolTokenIndexFrom(tokenIndex, 0)];
  }

  /// @notice Help the senders to transfer their assets to the Meson contract
  /// @param tokenIndex The index of token. See `tokenForIndex` in `MesonTokens.sol`
  /// @param sender The sender of the transfer
  /// @param amount The value of the transfer (always in decimal 6)
  function _unsafeDepositToken(
    uint8 tokenIndex,
    address sender,
    uint256 amount
  ) internal {
    require(amount > 0, "Amount must be greater than zero");

    if (_isCoreToken(tokenIndex)) {
      // Core tokens (e.g. ETH or BNB)
      require(amount * 1e12 == msg.value, "msg.value does not match the amount");
    } else {
      // Stablecoins
      address token = tokenForIndex[tokenIndex];

      require(token != address(0), "Token not supported");
      require(Address.isContract(token), "The given token address is not a contract");

      amount *= _amountFactor(tokenIndex);
      (bool success, bytes memory data) = token.call(abi.encodeWithSelector(
        ERC20_TRANSFER_FROM_SELECTOR,
        sender,
        address(this),
        amount
      ));
      require(success && (data.length == 0 || abi.decode(data, (bool))), "transferFrom failed");
    }
  }

  /// @notice Safe transfers tokens from Meson contract to a recipient
  /// for interacting with ERC20 tokens that do not consistently return true/false
  /// @param tokenIndex The index of token. See `tokenForIndex` in `MesonTokens.sol`
  /// @param recipient The recipient of the transfer
  /// @param amount The value of the transfer (always in decimal 6)
  function _safeTransfer(
    uint8 tokenIndex,
    address recipient,
    uint256 amount
  ) internal {
    if (_isCoreToken(tokenIndex)) {
      // Core tokens (e.g. ETH or BNB)
      _transferCoreToken(recipient, amount);
    } else {
      // Stablecoins
      address token = tokenForIndex[tokenIndex];

      require(Address.isContract(token), "The given token address is not a contract");

      amount *= _amountFactor(tokenIndex);
      if (SHORT_COIN_TYPE == 0x00c3) {
        IERC20Minimal(token).transfer(recipient, amount);
      } else {
        // This doesn't works on Tron
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(
          ERC20_TRANSFER_SELECTOR,
          recipient,
          amount
        ));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "transfer failed");
      }
    }
  }

  function _transferCoreToken(address recipient, uint256 amount) internal {
    (bool success, ) = recipient.call{value: amount * 1e12}("");
    require(success, "Transfer failed");
  }

  /// @notice Transfer tokens to a contract using `depositWithBeneficiary`
  /// @param tokenIndex The index of token. See `tokenForIndex` in `MesonTokens.sol`
  /// @param contractAddr The smart contract address that will receive transferring tokens
  /// @param beneficiary The beneficiary of `depositWithBeneficiary`
  /// @param amount The value of the transfer (always in decimal 6)
  /// @param data Extra data passed to the contract
  function _transferToContract(
    uint8 tokenIndex,
    address contractAddr,
    address beneficiary,
    uint256 amount,
    uint64 data
  ) internal {
    require(Address.isContract(contractAddr), "The given recipient address is not a contract");

    amount *= _amountFactor(tokenIndex);
    if (_isCoreToken(tokenIndex)) {
      // Core tokens (e.g. ETH or BNB)
      IDepositWithBeneficiary(contractAddr).depositWithBeneficiary{value: amount}(
        address(0),
        amount,
        beneficiary,
        data
      );
    } else {
      // Stablecoins
      address token = tokenForIndex[tokenIndex];
      require(Address.isContract(token), "The given token address is not a contract");
      
      IERC20Minimal(token).approve(contractAddr, amount);
      IDepositWithBeneficiary(contractAddr).depositWithBeneficiary(
        token,
        amount,
        beneficiary,
        data
      );
    }
  }

  /// @notice Determine if token has decimal 18 and therefore need to adjust amount
  /// @param tokenIndex The index of token. See `tokenForIndex` in `MesonTokens.sol`
  function _amountFactor(uint8 tokenIndex) public pure returns (uint256) {
    if (tokenIndex <= 32) {
      return 1;
    } else if (tokenIndex == 242 && SHORT_COIN_TYPE != 0x02ca && SHORT_COIN_TYPE != 0x1771) {
      return 100;
    } else if (tokenIndex > 112 && tokenIndex <= 123) {
      return 100;
    } else if (tokenIndex > 123 && tokenIndex <= 128) {
      return 1000;
    }
    return 1e12;
  }
}

/// @title MesonPools
/// @notice The class to manage pools for LPs, and perform swap operations on the target 
/// chain side.
/// Methods in this class will be executed when a user wants to swap into this chain.
/// LP pool operations are also provided in this class.
contract MesonPools is IMesonPoolsEvents, MesonStates {
  /// @notice Locked Swaps
  /// key: `swapId` is calculated from `encodedSwap` and `initiator`. See `_getSwapId` in `MesonHelpers.sol`
  ///   encodedSwap: see `MesonSwap.sol` for defination;
  ///   initiator: The user address who created and signed the swap request.
  /// value: `lockedSwap` in format of `until:uint40|poolIndex:uint40`
  ///   until: The expiration time of this swap on the target chain. Need to `release` the swap fund before `until`;
  ///   poolIndex: The index of an LP pool. See `ownerOfPool` in `MesonStates.sol` for more information.
  mapping(bytes32 => uint80) internal _lockedSwaps;

  /// @dev This empty reserved space is put in place to allow future versions to
  /// add new variables without shifting down storage in the inheritance chain.
  /// See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
  uint256[50] private __gap;

  /// @notice Initially deposit tokens into an LP pool and register a pool index.
  /// This is the prerequisite for LPs if they want to participate in Meson swaps.
  /// @dev Designed to be used by a new address who wants to be an LP and register a pool index
  /// @param amount The amount of tokens to be added to the pool
  /// @param poolTokenIndex In format of `tokenIndex:uint8|poolIndex:uint40`. See `_balanceOfPoolToken` in `MesonStates.sol` for more information.
  function depositAndRegister(uint256 amount, uint48 poolTokenIndex) payable external {
    require(amount > 0, "Amount must be positive");

    address poolOwner = _msgSender();
    uint40 poolIndex = _poolIndexFrom(poolTokenIndex);
    require(poolIndex != 0, "Cannot use 0 as pool index"); // pool 0 is reserved for meson service fee
    require(ownerOfPool[poolIndex] == address(0), "Pool index already registered");
    require(poolOfAuthorizedAddr[poolOwner] == 0, "Signer address already registered");
    ownerOfPool[poolIndex] = poolOwner;
    poolOfAuthorizedAddr[poolOwner] = poolIndex;

    _balanceOfPoolToken[poolTokenIndex] += amount;
    uint8 tokenIndex = _tokenIndexFrom(poolTokenIndex);
    _unsafeDepositToken(tokenIndex, poolOwner, amount);

    emit PoolRegistered(poolIndex, poolOwner);
    emit PoolDeposited(poolTokenIndex, amount);
  }

  /// @notice Deposit tokens into the liquidity pool.
  /// The LP should be careful to make sure the `poolTokenIndex` is correct.
  /// Make sure to call `depositAndRegister` first and register a pool index.
  /// Otherwise, token may be deposited to others.
  /// @dev Designed to be used by addresses authorized to a pool
  /// @param amount The amount of tokens to be added to the pool
  /// @param poolTokenIndex In format of `tokenIndex:uint8|poolIndex:uint40`. See `_balanceOfPoolToken` in `MesonStates.sol` for more information.
  function deposit(uint256 amount, uint48 poolTokenIndex) payable external {
    require(amount > 0, "Amount must be positive");

    uint40 poolIndex = _poolIndexFrom(poolTokenIndex);
    require(poolIndex != 0, "Cannot use 0 as pool index"); // pool 0 is reserved for meson service fee
    require(poolIndex == poolOfAuthorizedAddr[_msgSender()], "Need an authorized address as the signer");
    _balanceOfPoolToken[poolTokenIndex] += amount;
    uint8 tokenIndex = _tokenIndexFrom(poolTokenIndex);
    _unsafeDepositToken(tokenIndex, _msgSender(), amount);

    emit PoolDeposited(poolTokenIndex, amount);
  }

  /// @notice Withdraw tokens from the liquidity pool.
  /// @dev Designed to be used by LPs (pool owners) who have already registered a pool index
  /// @param amount The amount to be removed from the pool
  /// @param poolTokenIndex In format of `tokenIndex:uint8|poolIndex:uint40. See `_balanceOfPoolToken` in `MesonStates.sol` for more information.
  function withdraw(uint256 amount, uint48 poolTokenIndex) external {
    require(amount > 0, "Amount must be positive");

    uint40 poolIndex = _poolIndexFrom(poolTokenIndex);
    require(poolIndex != 0, "Cannot use 0 as pool index"); // pool 0 is reserved for meson service fee
    require(ownerOfPool[poolIndex] == _msgSender(), "Need the pool owner as the signer");
    _balanceOfPoolToken[poolTokenIndex] -= amount;
    uint8 tokenIndex = _tokenIndexFrom(poolTokenIndex);
    _safeTransfer(tokenIndex, _msgSender(), amount);

    emit PoolWithdrawn(poolTokenIndex, amount);
  }

  /// @notice Add an authorized address to the pool
  /// @dev Designed to be used by LPs (pool owners)
  /// @param addr The address to be added
  function addAuthorizedAddr(address addr) external {
    address poolOwner = _msgSender();
    uint40 poolIndex = poolOfAuthorizedAddr[poolOwner];
    require(poolIndex != 0, "The signer does not register a pool");
    require(poolOwner == ownerOfPool[poolIndex], "Need the pool owner as the signer");
    require(poolOfAuthorizedAddr[addr] == 0, "Addr is authorized for another pool");
    poolOfAuthorizedAddr[addr] = poolIndex;

    emit PoolAuthorizedAddrAdded(poolIndex, addr);
  }
  
  /// @notice Remove an authorized address from the pool
  /// @dev Designed to be used by LPs (pool owners)
  /// @param addr The address to be removed
  function removeAuthorizedAddr(address addr) external {
    address poolOwner = _msgSender();
    uint40 poolIndex = poolOfAuthorizedAddr[poolOwner];
    require(poolIndex != 0, "The signer does not register a pool");
    require(poolOwner == ownerOfPool[poolIndex], "Need the pool owner as the signer");
    require(poolOfAuthorizedAddr[addr] == poolIndex, "Addr is not authorized for the signer's pool");
    delete poolOfAuthorizedAddr[addr];

    emit PoolAuthorizedAddrRemoved(poolIndex, addr);
  }

  /// @notice Transfer the ownership of a pool to another address
  /// @dev Designed to be used by LPs (pool owners)
  /// @param addr The new address to be the pool owner
  function transferPoolOwner(address addr) external {
    address poolOwner = _msgSender();
    uint40 poolIndex = poolOfAuthorizedAddr[poolOwner];
    require(poolIndex != 0, "The signer does not register a pool");
    require(poolOwner == ownerOfPool[poolIndex], "Need the pool owner as the signer");
    require(poolOfAuthorizedAddr[addr] == poolIndex, "Addr is not authorized for the signer's pool");
    ownerOfPool[poolIndex] = addr;

    emit PoolOwnerTransferred(poolIndex, poolOwner, addr);
  }

  function lock(uint256 encodedSwap, bytes32, bytes32, address initiator) external {
    // deprecated
    lockSwap(encodedSwap, initiator);
  }

  /// @notice Lock funds to match a swap request. This is step 2️⃣ in a swap.
  /// The authorized address of the bonding pool should call this method,
  /// which will lock swapping fund on the target chain for `LOCK_TIME_PERIOD`
  /// and wait for fund release and execution.
  /// @dev Designed to be used by authorized addresses or pool owners
  /// @param encodedSwap Encoded swap information
  /// @param initiator The swap initiator who created and signed the swap request
  function lockSwap(uint256 encodedSwap, address initiator)
    public matchProtocolVersion(encodedSwap) forTargetChain(encodedSwap)
  {
    bytes32 swapId = _getSwapId(encodedSwap, initiator);
    require(_lockedSwaps[swapId] == 0, "Swap already exists");

    uint40 poolIndex = poolOfAuthorizedAddr[_msgSender()];
    require(poolIndex != 0, "Caller not registered. Call depositAndRegister.");

    uint256 until = block.timestamp + LOCK_TIME_PERIOD;
    require(until < _expireTsFrom(encodedSwap) - 5 minutes, "Cannot lock because expireTs is soon.");

    uint48 poolTokenIndex = _poolTokenIndexForOutToken(encodedSwap, poolIndex);
    _balanceOfPoolToken[poolTokenIndex] -= _amountToLock(encodedSwap); // The service fee will be charged on release

    uint256 coreAmount = _coreTokenAmount(encodedSwap);
    if (coreAmount > 0) {
      _balanceOfPoolToken[_poolTokenIndexFrom(indexOfToken[address(1)], poolIndex)] -= coreAmount;
    }

    _lockedSwaps[swapId] = _lockedSwapFrom(until, poolIndex);

    emit SwapLocked(encodedSwap);
  }

  /// @notice If the locked swap is not released after `LOCK_TIME_PERIOD`,
  /// the authorized address can call this method to unlock the swapping fund.
  /// @dev Designed to be used by authorized addresses or pool owners
  /// @param encodedSwap Encoded swap information
  /// @param initiator The swap initiator who created and signed the swap request
  function unlock(uint256 encodedSwap, address initiator) external {
    bytes32 swapId = _getSwapId(encodedSwap, initiator);
    uint80 lockedSwap = _lockedSwaps[swapId];
    require(lockedSwap > 1, "Swap does not exist");
    require(_untilFromLocked(lockedSwap) < block.timestamp, "Swap still in lock");

    uint40 poolIndex = _poolIndexFromLocked(lockedSwap);
    uint48 poolTokenIndex = _poolTokenIndexForOutToken(encodedSwap, poolIndex);
    _balanceOfPoolToken[poolTokenIndex] += _amountToLock(encodedSwap);

    uint256 coreAmount = _coreTokenAmount(encodedSwap);
    if (coreAmount > 0) {
      _balanceOfPoolToken[_poolTokenIndexFrom(indexOfToken[address(1)], poolIndex)] += coreAmount;
    }

    delete _lockedSwaps[swapId];

    emit SwapUnlocked(encodedSwap);
  }

  /// @notice Release tokens to satisfy a locked swap. This is step 3️⃣ in a swap.
  /// This method requires a release signature from the swap initiator,
  /// but anyone (initiator herself, the LP, and other people) with the signature 
  /// can call this method to make sure the swapping fund is guaranteed to be released.
  /// @dev Designed to be used by anyone
  /// @param encodedSwap Encoded swap information
  /// @param r Part of the release signature (same as in the `executeSwap` call)
  /// @param yParityAndS Part of the release signature (same as in the `executeSwap` call)
  /// @param initiator The swap initiator who created and signed the swap request
  /// @param recipient The recipient address of the swap
  function release(
    uint256 encodedSwap,
    bytes32 r,
    bytes32 yParityAndS,
    address initiator,
    address recipient
  ) external {
    require(_msgSender() == tx.origin, "Cannot be called through contracts");
    require(_expireTsFrom(encodedSwap) > block.timestamp, "Cannot release because expired");
    require(recipient != address(0), "Recipient cannot be zero address");

    bool feeWaived = _feeWaived(encodedSwap);
    if (feeWaived) {
      // For swaps that service fee is waived, need the premium manager as the signer
      require(_isPremiumManager(), "Caller is not the premium manager");
    }
    // For swaps that charge service fee, anyone can call

    bytes32 swapId = _getSwapId(encodedSwap, initiator);
    require(_lockedSwaps[swapId] > 1, "Swap does not exist");

    _checkReleaseSignature(encodedSwap, recipient, r, yParityAndS, initiator);
    _lockedSwaps[swapId] = 1;

    // LP fee will be subtracted from the swap amount
    uint256 releaseAmount = _amountToLock(encodedSwap);
    if (!feeWaived) { // If the swap should pay service fee (charged by Meson protocol)
      uint256 serviceFee = _serviceFee(encodedSwap);
      // Subtract service fee from the release amount
      releaseAmount -= serviceFee;
      // Collected service fee will be stored in `_balanceOfPoolToken` with `poolIndex = 0`.
      // Currently, no one is capable to withdraw fund from pool 0. In the future, Meson protocol
      // will specify the purpose of service fee and its usage permission, and upgrade the contract
      // accordingly.
      _balanceOfPoolToken[_poolTokenIndexForOutToken(encodedSwap, 0)] += serviceFee;
    }

    uint256 amountToShare = _amountToShare(encodedSwap);
    if (amountToShare > 0) {
      releaseAmount -= amountToShare;
      _balanceOfPoolToken[_poolTokenIndexForOutToken(encodedSwap, _poolIndexToShare(encodedSwap))] += amountToShare;
    }

    uint256 coreAmount = _coreTokenAmount(encodedSwap);
    if (coreAmount > 0) {
      _transferCoreToken(recipient, coreAmount);
    }
    _release(encodedSwap, _outTokenIndexFrom(encodedSwap), initiator, recipient, releaseAmount);

    emit SwapReleased(encodedSwap);
  }

  function directRelease(
    uint256 encodedSwap,
    bytes32 r,
    bytes32 yParityAndS,
    address initiator,
    address recipient
  ) external matchProtocolVersion(encodedSwap) forTargetChain(encodedSwap) {
    require(_msgSender() == tx.origin, "Cannot be called through contracts");
    require(recipient != address(0), "Recipient cannot be zero address");

    bool feeWaived = _feeWaived(encodedSwap);
    if (feeWaived) {
      require(_isPremiumManager(), "Caller is not the premium manager");
    }

    bytes32 swapId = _getSwapId(encodedSwap, initiator);
    require(_lockedSwaps[swapId] == 0, "Swap already exists");

    uint40 poolIndex = poolOfAuthorizedAddr[_msgSender()];
    require(poolIndex != 0, "Caller not registered. Call depositAndRegister.");

    if (r != bytes32(0x0)) {
      require(_expireTsFrom(encodedSwap) > block.timestamp, "Cannot release because expired");
      _checkReleaseSignature(encodedSwap, recipient, r, yParityAndS, initiator);
    } else if (!feeWaived) {
      require(_isPremiumManager(), "Caller is not the premium manager");
    }
    _lockedSwaps[swapId] = 1;

    uint256 releaseAmount = _amountToLock(encodedSwap);
    _balanceOfPoolToken[_poolTokenIndexForOutToken(encodedSwap, poolIndex)] -= releaseAmount;

    if (!feeWaived) {
      uint256 serviceFee = _serviceFee(encodedSwap);
      releaseAmount -= serviceFee;
      _balanceOfPoolToken[_poolTokenIndexForOutToken(encodedSwap, 0)] += serviceFee;
    }

    uint256 amountToShare = _amountToShare(encodedSwap);
    if (amountToShare > 0) {
      releaseAmount -= amountToShare;
      _balanceOfPoolToken[_poolTokenIndexForOutToken(encodedSwap, _poolIndexToShare(encodedSwap))] += amountToShare;
    }

    uint256 coreAmount = _coreTokenAmount(encodedSwap);
    if (coreAmount > 0) {
      _balanceOfPoolToken[_poolTokenIndexFrom(indexOfToken[address(1)], poolIndex)] -= coreAmount;
      _transferCoreToken(recipient, coreAmount);
    }
    _release(encodedSwap, _outTokenIndexFrom(encodedSwap), initiator, recipient, releaseAmount);

    emit SwapReleased(encodedSwap);
  }

  function _release(uint256 encodedSwap, uint8 tokenIndex, address initiator, address recipient, uint256 amount) internal {
    if (_willTransferToContract(encodedSwap)) {
      _transferToContract(tokenIndex, recipient, initiator, amount, _saltDataFrom(encodedSwap));
    } else if (amount > 0) {
      _safeTransfer(tokenIndex, recipient, amount);
      if ((SHORT_COIN_TYPE == 0x9296 || SHORT_COIN_TYPE == 0xb4b1 || SHORT_COIN_TYPE == 0x6c62) && _swapForCoreToken(encodedSwap)) {
        _callSkaleFaucet(recipient);
      }
    }
  }

  function _callSkaleFaucet(address recipient) private {
    if (SHORT_COIN_TYPE == 0x9296) {
      // SKALE Europa
      bytes memory data = abi.encodeWithSelector(bytes4(0x6a627842), recipient);
      (bool success, ) = address(0x2B267A3e49b351DEdac892400a530ABb2f899d23).call(data);
      require(success, "Call faucet not successful");
    } else if (SHORT_COIN_TYPE == 0xb4b1) {
      // SKALE Nebula
      bytes memory data = abi.encodeWithSelector(bytes4(0x0c11dedd), recipient);
      (bool success, ) = address(0x5a6869ef5b81DCb58EBF51b8F893c31f5AFE3Fa8).call(data);
      require(success, "Call faucet not successful");
    } else if (SHORT_COIN_TYPE == 0x6c62) {
      // SKALE Calypso
      bytes memory data = abi.encodeWithSelector(bytes4(0x0c11dedd), recipient);
      (bool success, ) = address(0x02891b34B7911A9C68e82C193cd7A6fBf0c3b30A).call(data);
      require(success, "Call faucet not successful");
    }
  }

  /// @notice Read information for a locked swap
  function getLockedSwap(uint256 encodedSwap, address initiator) external view
    returns (address poolOwner, uint40 until)
  {
    bytes32 swapId = _getSwapId(encodedSwap, initiator);
    uint80 lockedSwap = _lockedSwaps[swapId];
    if (lockedSwap == 1) {
      poolOwner = address(1);
      until = 0;
    } else {
      poolOwner = ownerOfPool[_poolIndexFromLocked(lockedSwap)];
      until = uint40(_untilFromLocked(lockedSwap));
    }
  }

  modifier forTargetChain(uint256 encodedSwap) {
    require(_outChainFrom(encodedSwap) == SHORT_COIN_TYPE, "Swap not for this chain");
    _;
  }
}

/// @title MesonManager
/// @notice The class to store data related to management permissions of Meson
contract MesonManager is MesonSwap, MesonPools {
  /// @notice The admin of meson contract
  /// The owner has the permission to upgrade meson contract. In future versions,
  /// the management authority of meson contract will be decentralized.
  address internal _owner;

  /// @notice The manager to authorized fee waived swaps
  /// Only the premium manager can authorize the execution to release for fee waived swaps.
  /// This address is managed by Meson team.
  address internal _premiumManager;

  /// @dev This empty reserved space is put in place to allow future versions to
  /// add new variables without shifting down storage in the inheritance chain.
  /// See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
  uint256[50] private __gap;

  event OwnerTransferred(address indexed prevOwner, address indexed newOwner);

  event PremiumManagerTransferred(address indexed prevPremiumManager, address indexed newPremiumManager);

  /// @notice The owner will also have the permission to add supported tokens
  function addSupportToken(address token, uint8 index) external onlyOwner {
    _addSupportToken(token, index);
  }

  /// @notice The owner will also have the permission to remove a supported tokens
  function removeSupportToken(uint8 index) external onlyOwner {
    _removeSupportToken(index);
  }

  /// @notice Add multiple tokens
  function addMultipleSupportedTokens(address[] memory tokens, uint8[] memory indexes) external onlyOwner {
    require(tokens.length == indexes.length, "Tokens and indexes should have the same length");
    for (uint8 i = 0; i < tokens.length; i++) {
      _addSupportToken(tokens[i], indexes[i]);
    }
  }

  function transferOwnership(address newOwner) public onlyOwner {
    _transferOwnership(newOwner);
  }

  function transferPremiumManager(address newPremiumManager) public {
    require(_isPremiumManager(), "Caller is not the premium manager");
    _transferPremiumManager(newPremiumManager);
  }

  function withdrawServiceFee(uint8 tokenIndex, uint256 amount, uint40 toPoolIndex) external onlyOwner {
    require(ownerOfPool[toPoolIndex] != address(0), "Pool index not registered");
    _balanceOfPoolToken[_poolTokenIndexFrom(tokenIndex, 0)] -= amount;
    _balanceOfPoolToken[_poolTokenIndexFrom(tokenIndex, toPoolIndex)] += amount;
  }

  function adjustToPool(uint8 tokenIndex, uint256 amount, uint40 toPoolIndex) external onlyOwner {
    require(ownerOfPool[toPoolIndex] != address(0), "Pool index not registered");
    _balanceOfPoolToken[_poolTokenIndexFrom(tokenIndex, toPoolIndex)] += amount;
  }

  modifier onlyOwner() {
    require(_owner == _msgSender(), "Caller is not the owner");
    _;
  }

  function _transferOwnership(address newOwner) internal {
    require(newOwner != address(0), "New owner cannot be zero address");
    address prevOwner = _owner;
    _owner = newOwner;
    emit OwnerTransferred(prevOwner, newOwner);
  }

  function _isPremiumManager() internal view override returns (bool) {
    return _premiumManager == _msgSender();
  }

  function _transferPremiumManager(address newPremiumManager) internal {
    require(newPremiumManager != address(0), "New premium manager be zero address");
    address prevPremiumManager = _premiumManager;
    _premiumManager = newPremiumManager;
    emit PremiumManagerTransferred(prevPremiumManager, newPremiumManager);
  }

  function directSwap(uint256 encodedSwap, address recipient, bytes32 r, bytes32 yParityAndS)
    external matchProtocolVersion(encodedSwap) verifyEncodedSwap(encodedSwap) forTargetChain(encodedSwap)
  {
    require(recipient != address(0), "Recipient cannot be zero address");

    bytes32 digest = keccak256(abi.encodePacked(encodedSwap, recipient));
    _checkSignature(digest, r, yParityAndS, _premiumManager);

    uint256 amount = _amountFrom(encodedSwap);
    uint8 inTokenIndex = _inTokenIndexFrom(encodedSwap);
    uint256 releaseAmount = amount - _feeForLp(encodedSwap);

    _balanceOfPoolToken[_poolTokenIndexFrom(inTokenIndex, 1)] += amount;
    _balanceOfPoolToken[_poolTokenIndexForOutToken(encodedSwap, 1)] -= releaseAmount;

    _unsafeDepositToken(inTokenIndex, _msgSender(), amount);
    _release(encodedSwap, _outTokenIndexFrom(encodedSwap), _msgSender(), recipient, releaseAmount);

    emit SwapReleased(encodedSwap);
  }
}

/**
 * @dev This is a base contract to aid in writing upgradeable contracts, or any kind of contract that will be deployed
 * behind a proxy. Since proxied contracts do not make use of a constructor, it's common to move constructor logic to an
 * external initializer function, usually called `initialize`. It then becomes necessary to protect this initializer
 * function so it can only be called once. The {initializer} modifier provided by this contract will have this effect.
 *
 * The initialization functions use a version number. Once a version number is used, it is consumed and cannot be
 * reused. This mechanism prevents re-execution of each "step" but allows the creation of new initialization steps in
 * case an upgrade adds a module that needs to be initialized.
 *
 * For example:
 *
 * [.hljs-theme-light.nopadding]
 * ```
 * contract MyToken is ERC20Upgradeable {
 *     function initialize() initializer public {
 *         __ERC20_init("MyToken", "MTK");
 *     }
 * }
 * contract MyTokenV2 is MyToken, ERC20PermitUpgradeable {
 *     function initializeV2() reinitializer(2) public {
 *         __ERC20Permit_init("MyToken");
 *     }
 * }
 * ```
 *
 * TIP: To avoid leaving the proxy in an uninitialized state, the initializer function should be called as early as
 * possible by providing the encoded function call as the `_data` argument to {ERC1967Proxy-constructor}.
 *
 * CAUTION: When used with inheritance, manual care must be taken to not invoke a parent initializer twice, or to ensure
 * that all initializers are idempotent. This is not verified automatically as constructors are by Solidity.
 *
 * [CAUTION]
 * ====
 * Avoid leaving a contract uninitialized.
 *
 * An uninitialized contract can be taken over by an attacker. This applies to both a proxy and its implementation
 * contract, which may impact the proxy. To prevent the implementation contract from being used, you should invoke
 * the {_disableInitializers} function in the constructor to automatically lock it when it is deployed:
 *
 * [.hljs-theme-light.nopadding]
 * ```
 * /// @custom:oz-upgrades-unsafe-allow constructor
 * constructor() {
 *     _disableInitializers();
 * }
 * ```
 * ====
 */
abstract contract Initializable {
    /**
     * @dev Indicates that the contract has been initialized.
     * @custom:oz-retyped-from bool
     */
    uint8 private _initialized;

    /**
     * @dev Indicates that the contract is in the process of being initialized.
     */
    bool private _initializing;

    /**
     * @dev Triggered when the contract has been initialized or reinitialized.
     */
    event Initialized(uint8 version);

    /**
     * @dev A modifier that defines a protected initializer function that can be invoked at most once. In its scope,
     * `onlyInitializing` functions can be used to initialize parent contracts. Equivalent to `reinitializer(1)`.
     */
    modifier initializer() {
        bool isTopLevelCall = !_initializing;
        require(
            (isTopLevelCall && _initialized < 1) || (!AddressUpgradeable.isContract(address(this)) && _initialized == 1),
            "Initializable: contract is already initialized"
        );
        _initialized = 1;
        if (isTopLevelCall) {
            _initializing = true;
        }
        _;
        if (isTopLevelCall) {
            _initializing = false;
            emit Initialized(1);
        }
    }

    /**
     * @dev A modifier that defines a protected reinitializer function that can be invoked at most once, and only if the
     * contract hasn't been initialized to a greater version before. In its scope, `onlyInitializing` functions can be
     * used to initialize parent contracts.
     *
     * `initializer` is equivalent to `reinitializer(1)`, so a reinitializer may be used after the original
     * initialization step. This is essential to configure modules that are added through upgrades and that require
     * initialization.
     *
     * Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
     * a contract, executing them in the right order is up to the developer or operator.
     */
    modifier reinitializer(uint8 version) {
        require(!_initializing && _initialized < version, "Initializable: contract is already initialized");
        _initialized = version;
        _initializing = true;
        _;
        _initializing = false;
        emit Initialized(version);
    }

    /**
     * @dev Modifier to protect an initialization function so that it can only be invoked by functions with the
     * {initializer} and {reinitializer} modifiers, directly or indirectly.
     */
    modifier onlyInitializing() {
        require(_initializing, "Initializable: contract is not initializing");
        _;
    }

    /**
     * @dev Locks the contract, preventing any future reinitialization. This cannot be part of an initializer call.
     * Calling this in the constructor of a contract will prevent that contract from being initialized or reinitialized
     * to any version. It is recommended to use this to lock implementation contracts that are designed to be called
     * through proxies.
     */
    function _disableInitializers() internal virtual {
        require(!_initializing, "Initializable: contract is initializing");
        if (_initialized < type(uint8).max) {
            _initialized = type(uint8).max;
            emit Initialized(type(uint8).max);
        }
    }
}

/**
 * @dev Library for reading and writing primitive types to specific storage slots.
 *
 * Storage slots are often used to avoid storage conflict when dealing with upgradeable contracts.
 * This library helps with reading and writing to such slots without the need for inline assembly.
 *
 * The functions in this library return Slot structs that contain a `value` member that can be used to read or write.
 *
 * Example usage to set ERC1967 implementation slot:
 * ```
 * contract ERC1967 {
 *     bytes32 internal constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
 *
 *     function _getImplementation() internal view returns (address) {
 *         return StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value;
 *     }
 *
 *     function _setImplementation(address newImplementation) internal {
 *         require(Address.isContract(newImplementation), "ERC1967: new implementation is not a contract");
 *         StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value = newImplementation;
 *     }
 * }
 * ```
 *
 * _Available since v4.1 for `address`, `bool`, `bytes32`, and `uint256`._
 */
library StorageSlotUpgradeable {
    struct AddressSlot {
        address value;
    }

    struct BooleanSlot {
        bool value;
    }

    struct Bytes32Slot {
        bytes32 value;
    }

    struct Uint256Slot {
        uint256 value;
    }

    /**
     * @dev Returns an `AddressSlot` with member `value` located at `slot`.
     */
    function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `BooleanSlot` with member `value` located at `slot`.
     */
    function getBooleanSlot(bytes32 slot) internal pure returns (BooleanSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `Bytes32Slot` with member `value` located at `slot`.
     */
    function getBytes32Slot(bytes32 slot) internal pure returns (Bytes32Slot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `Uint256Slot` with member `value` located at `slot`.
     */
    function getUint256Slot(bytes32 slot) internal pure returns (Uint256Slot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }
}

/**
 * @dev Collection of functions related to the address type
 */
library AddressUpgradeable {
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
        return functionCall(target, data, "Address: low-level call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
     * `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
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
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value
    ) internal returns (bytes memory) {
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
        require(isContract(target), "Address: call to non-contract");

        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResult(success, returndata, errorMessage);
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
        require(isContract(target), "Address: static call to non-contract");

        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResult(success, returndata, errorMessage);
    }

    /**
     * @dev Tool to verifies that a low level call was successful, and revert if it wasn't, either by bubbling the
     * revert reason using the provided one.
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
}

/**
 * @dev ERC1822: Universal Upgradeable Proxy Standard (UUPS) documents a method for upgradeability through a simplified
 * proxy whose upgrades are fully controlled by the current implementation.
 */
interface IERC1822ProxiableUpgradeable {
    /**
     * @dev Returns the storage slot that the proxiable contract assumes is being used to store the implementation
     * address.
     *
     * IMPORTANT: A proxy pointing at a proxiable contract should not be considered proxiable itself, because this risks
     * bricking a proxy that upgrades to it, by delegating to itself until out of gas. Thus it is critical that this
     * function revert if invoked through a proxy.
     */
    function proxiableUUID() external view returns (bytes32);
}

/**
 * @dev This is the interface that {BeaconProxy} expects of its beacon.
 */
interface IBeaconUpgradeable {
    /**
     * @dev Must return an address that can be used as a delegate call target.
     *
     * {BeaconProxy} will check that this address is a contract.
     */
    function implementation() external view returns (address);
}

/**
 * @dev This abstract contract provides getters and event emitting update functions for
 * https://eips.ethereum.org/EIPS/eip-1967[EIP1967] slots.
 *
 * _Available since v4.1._
 *
 * @custom:oz-upgrades-unsafe-allow delegatecall
 */
abstract contract ERC1967UpgradeUpgradeable is Initializable {
    function __ERC1967Upgrade_init() internal onlyInitializing {
    }

    function __ERC1967Upgrade_init_unchained() internal onlyInitializing {
    }
    // This is the keccak-256 hash of "eip1967.proxy.rollback" subtracted by 1
    bytes32 private constant _ROLLBACK_SLOT = 0x4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143;

    /**
     * @dev Storage slot with the address of the current implementation.
     * This is the keccak-256 hash of "eip1967.proxy.implementation" subtracted by 1, and is
     * validated in the constructor.
     */
    bytes32 internal constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    /**
     * @dev Emitted when the implementation is upgraded.
     */
    event Upgraded(address indexed implementation);

    /**
     * @dev Returns the current implementation address.
     */
    function _getImplementation() internal view returns (address) {
        return StorageSlotUpgradeable.getAddressSlot(_IMPLEMENTATION_SLOT).value;
    }

    /**
     * @dev Stores a new address in the EIP1967 implementation slot.
     */
    function _setImplementation(address newImplementation) private {
        require(AddressUpgradeable.isContract(newImplementation), "ERC1967: new implementation is not a contract");
        StorageSlotUpgradeable.getAddressSlot(_IMPLEMENTATION_SLOT).value = newImplementation;
    }

    /**
     * @dev Perform implementation upgrade
     *
     * Emits an {Upgraded} event.
     */
    function _upgradeTo(address newImplementation) internal {
        _setImplementation(newImplementation);
        emit Upgraded(newImplementation);
    }

    /**
     * @dev Perform implementation upgrade with additional setup call.
     *
     * Emits an {Upgraded} event.
     */
    function _upgradeToAndCall(
        address newImplementation,
        bytes memory data,
        bool forceCall
    ) internal {
        _upgradeTo(newImplementation);
        if (data.length > 0 || forceCall) {
            _functionDelegateCall(newImplementation, data);
        }
    }

    /**
     * @dev Perform implementation upgrade with security checks for UUPS proxies, and additional setup call.
     *
     * Emits an {Upgraded} event.
     */
    function _upgradeToAndCallUUPS(
        address newImplementation,
        bytes memory data,
        bool forceCall
    ) internal {
        // Upgrades from old implementations will perform a rollback test. This test requires the new
        // implementation to upgrade back to the old, non-ERC1822 compliant, implementation. Removing
        // this special case will break upgrade paths from old UUPS implementation to new ones.
        if (StorageSlotUpgradeable.getBooleanSlot(_ROLLBACK_SLOT).value) {
            _setImplementation(newImplementation);
        } else {
            try IERC1822ProxiableUpgradeable(newImplementation).proxiableUUID() returns (bytes32 slot) {
                require(slot == _IMPLEMENTATION_SLOT, "ERC1967Upgrade: unsupported proxiableUUID");
            } catch {
                revert("ERC1967Upgrade: new implementation is not UUPS");
            }
            _upgradeToAndCall(newImplementation, data, forceCall);
        }
    }

    /**
     * @dev Storage slot with the admin of the contract.
     * This is the keccak-256 hash of "eip1967.proxy.admin" subtracted by 1, and is
     * validated in the constructor.
     */
    bytes32 internal constant _ADMIN_SLOT = 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103;

    /**
     * @dev Emitted when the admin account has changed.
     */
    event AdminChanged(address previousAdmin, address newAdmin);

    /**
     * @dev Returns the current admin.
     */
    function _getAdmin() internal view returns (address) {
        return StorageSlotUpgradeable.getAddressSlot(_ADMIN_SLOT).value;
    }

    /**
     * @dev Stores a new address in the EIP1967 admin slot.
     */
    function _setAdmin(address newAdmin) private {
        require(newAdmin != address(0), "ERC1967: new admin is the zero address");
        StorageSlotUpgradeable.getAddressSlot(_ADMIN_SLOT).value = newAdmin;
    }

    /**
     * @dev Changes the admin of the proxy.
     *
     * Emits an {AdminChanged} event.
     */
    function _changeAdmin(address newAdmin) internal {
        emit AdminChanged(_getAdmin(), newAdmin);
        _setAdmin(newAdmin);
    }

    /**
     * @dev The storage slot of the UpgradeableBeacon contract which defines the implementation for this proxy.
     * This is bytes32(uint256(keccak256('eip1967.proxy.beacon')) - 1)) and is validated in the constructor.
     */
    bytes32 internal constant _BEACON_SLOT = 0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50;

    /**
     * @dev Emitted when the beacon is upgraded.
     */
    event BeaconUpgraded(address indexed beacon);

    /**
     * @dev Returns the current beacon.
     */
    function _getBeacon() internal view returns (address) {
        return StorageSlotUpgradeable.getAddressSlot(_BEACON_SLOT).value;
    }

    /**
     * @dev Stores a new beacon in the EIP1967 beacon slot.
     */
    function _setBeacon(address newBeacon) private {
        require(AddressUpgradeable.isContract(newBeacon), "ERC1967: new beacon is not a contract");
        require(
            AddressUpgradeable.isContract(IBeaconUpgradeable(newBeacon).implementation()),
            "ERC1967: beacon implementation is not a contract"
        );
        StorageSlotUpgradeable.getAddressSlot(_BEACON_SLOT).value = newBeacon;
    }

    /**
     * @dev Perform beacon upgrade with additional setup call. Note: This upgrades the address of the beacon, it does
     * not upgrade the implementation contained in the beacon (see {UpgradeableBeacon-_setImplementation} for that).
     *
     * Emits a {BeaconUpgraded} event.
     */
    function _upgradeBeaconToAndCall(
        address newBeacon,
        bytes memory data,
        bool forceCall
    ) internal {
        _setBeacon(newBeacon);
        emit BeaconUpgraded(newBeacon);
        if (data.length > 0 || forceCall) {
            _functionDelegateCall(IBeaconUpgradeable(newBeacon).implementation(), data);
        }
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function _functionDelegateCall(address target, bytes memory data) private returns (bytes memory) {
        require(AddressUpgradeable.isContract(target), "Address: delegate call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return AddressUpgradeable.verifyCallResult(success, returndata, "Address: low-level delegate call failed");
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}

/**
 * @dev An upgradeability mechanism designed for UUPS proxies. The functions included here can perform an upgrade of an
 * {ERC1967Proxy}, when this contract is set as the implementation behind such a proxy.
 *
 * A security mechanism ensures that an upgrade does not turn off upgradeability accidentally, although this risk is
 * reinstated if the upgrade retains upgradeability but removes the security mechanism, e.g. by replacing
 * `UUPSUpgradeable` with a custom implementation of upgrades.
 *
 * The {_authorizeUpgrade} function must be overridden to include access restriction to the upgrade mechanism.
 *
 * _Available since v4.1._
 */
abstract contract UUPSUpgradeable is Initializable, IERC1822ProxiableUpgradeable, ERC1967UpgradeUpgradeable {
    function __UUPSUpgradeable_init() internal onlyInitializing {
    }

    function __UUPSUpgradeable_init_unchained() internal onlyInitializing {
    }
    /// @custom:oz-upgrades-unsafe-allow state-variable-immutable state-variable-assignment
    address private immutable __self = address(this);

    /**
     * @dev Check that the execution is being performed through a delegatecall call and that the execution context is
     * a proxy contract with an implementation (as defined in ERC1967) pointing to self. This should only be the case
     * for UUPS and transparent proxies that are using the current contract as their implementation. Execution of a
     * function through ERC1167 minimal proxies (clones) would not normally pass this test, but is not guaranteed to
     * fail.
     */
    modifier onlyProxy() {
        require(address(this) != __self, "Function must be called through delegatecall");
        require(_getImplementation() == __self, "Function must be called through active proxy");
        _;
    }

    /**
     * @dev Check that the execution is not being performed through a delegate call. This allows a function to be
     * callable on the implementing contract but not through proxies.
     */
    modifier notDelegated() {
        require(address(this) == __self, "UUPSUpgradeable: must not be called through delegatecall");
        _;
    }

    /**
     * @dev Implementation of the ERC1822 {proxiableUUID} function. This returns the storage slot used by the
     * implementation. It is used to validate that the this implementation remains valid after an upgrade.
     *
     * IMPORTANT: A proxy pointing at a proxiable contract should not be considered proxiable itself, because this risks
     * bricking a proxy that upgrades to it, by delegating to itself until out of gas. Thus it is critical that this
     * function revert if invoked through a proxy. This is guaranteed by the `notDelegated` modifier.
     */
    function proxiableUUID() external view virtual override notDelegated returns (bytes32) {
        return _IMPLEMENTATION_SLOT;
    }

    /**
     * @dev Upgrade the implementation of the proxy to `newImplementation`.
     *
     * Calls {_authorizeUpgrade}.
     *
     * Emits an {Upgraded} event.
     */
    function upgradeTo(address newImplementation) external virtual onlyProxy {
        _authorizeUpgrade(newImplementation);
        _upgradeToAndCallUUPS(newImplementation, new bytes(0), false);
    }

    /**
     * @dev Upgrade the implementation of the proxy to `newImplementation`, and subsequently execute the function call
     * encoded in `data`.
     *
     * Calls {_authorizeUpgrade}.
     *
     * Emits an {Upgraded} event.
     */
    function upgradeToAndCall(address newImplementation, bytes memory data) external payable virtual onlyProxy {
        _authorizeUpgrade(newImplementation);
        _upgradeToAndCallUUPS(newImplementation, data, true);
    }

    /**
     * @dev Function that should revert when `msg.sender` is not authorized to upgrade the contract. Called by
     * {upgradeTo} and {upgradeToAndCall}.
     *
     * Normally, this function will use an xref:access.adoc[access control] modifier such as {Ownable-onlyOwner}.
     *
     * ```solidity
     * function _authorizeUpgrade(address) internal override onlyOwner {}
     * ```
     */
    function _authorizeUpgrade(address newImplementation) internal virtual;

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}

contract UpgradableMeson is UUPSUpgradeable, MesonManager {
  function initialize(address owner, address premiumManager) external initializer {
    _transferOwnership(owner);
    _transferPremiumManager(premiumManager);
  }

  function _authorizeUpgrade(address) internal override onlyOwner {}
}