// SPDX-License-Identifier: Unknown
pragma solidity 0.8.15;

enum GameStatus {
    // The game is currently in progress, and has not been resolved.
    IN_PROGRESS,
    // The game has concluded, and the `rootClaim` was challenged successfully.
    CHALLENGER_WINS,
    // The game has concluded, and the `rootClaim` could not be contested.
    DEFENDER_WINS
}

type Claim is bytes32;

type GameType is uint32;

type Hash is bytes32;

struct OutputRoot {
    Hash root;
    uint256 l2BlockNumber;
}

interface ISemver {
    /// @notice Getter for the semantic version of the contract. This is not
    ///         meant to be used onchain but instead meant to be used by offchain
    ///         tooling.
    /// @return Semver contract version as a string.
    function version() external view returns (string memory);
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
            (isTopLevelCall && _initialized < 1) || (!Address.isContract(address(this)) && _initialized == 1),
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

contract AnchorStateRegistry is Initializable, ISemver {
    /// @notice Semantic version.
    /// @custom:semver 2.2.2
    string public constant version = "2.2.2";

    /// @notice Address of the SuperchainConfig contract.
    ISuperchainConfig public superchainConfig;

    /// @notice Address of the DisputeGameFactory contract.
    IDisputeGameFactory public disputeGameFactory;

    /// @notice Address of the OptimismPortal contract.
    IOptimismPortal2 public portal;

    /// @notice The game whose claim is currently being used as the anchor state.
    IFaultDisputeGame public anchorGame;

    /// @notice The starting anchor root.
    OutputRoot internal startingAnchorRoot;

    /// @notice Emitted when an anchor state is not updated.
    /// @param game Game that was not used as the new anchor game.
    event AnchorNotUpdated(IFaultDisputeGame indexed game);

    /// @notice Emitted when an anchor state is updated.
    /// @param game Game that was used as the new anchor game.
    event AnchorUpdated(IFaultDisputeGame indexed game);

    /// @notice Thrown when an unauthorized caller attempts to set the anchor state.
    error AnchorStateRegistry_Unauthorized();

    /// @notice Thrown when an invalid anchor game is provided.
    error AnchorStateRegistry_InvalidAnchorGame();

    /// @notice Thrown when the anchor root is requested, but the anchor game is blacklisted.
    error AnchorStateRegistry_AnchorGameBlacklisted();

    /// @notice Constructor to disable initializers.
    constructor() {
        _disableInitializers();
    }

    /// @notice Initializes the contract.
    /// @param _superchainConfig The address of the SuperchainConfig contract.
    /// @param _disputeGameFactory The address of the DisputeGameFactory contract.
    /// @param _portal The address of the OptimismPortal contract.
    /// @param _startingAnchorRoot The starting anchor root.
    function initialize(
        ISuperchainConfig _superchainConfig,
        IDisputeGameFactory _disputeGameFactory,
        IOptimismPortal2 _portal,
        OutputRoot memory _startingAnchorRoot
    )
        external
        initializer
    {
        superchainConfig = _superchainConfig;
        disputeGameFactory = _disputeGameFactory;
        portal = _portal;
        startingAnchorRoot = _startingAnchorRoot;
    }

    /// @notice Returns the respected game type.
    /// @return The respected game type.
    function respectedGameType() public view returns (GameType) {
        return portal.respectedGameType();
    }

    /// @custom:legacy
    /// @notice Returns the anchor root. Note that this is a legacy deprecated function and will
    ///         be removed in a future release. Use getAnchorRoot() instead. Anchor roots are no
    ///         longer stored per game type, so this function will return the same root for all
    ///         game types.
    function anchors(GameType /* unused */ ) external view returns (Hash, uint256) {
        return getAnchorRoot();
    }

    /// @notice Returns the current anchor root.
    /// @return The anchor root.
    function getAnchorRoot() public view returns (Hash, uint256) {
        // Return the starting anchor root if there is no anchor game.
        if (address(anchorGame) == address(0)) {
            return (startingAnchorRoot.root, startingAnchorRoot.l2BlockNumber);
        }

        // Otherwise, return the anchor root.
        return (Hash.wrap(anchorGame.rootClaim().raw()), anchorGame.l2BlockNumber());
    }

    /// @notice Determines whether a game is registered in the DisputeGameFactory.
    /// @param _game The game to check.
    /// @return Whether the game is factory registered.
    function isGameRegistered(IDisputeGame _game) public view returns (bool) {
        // Grab the game and game data.
        (GameType gameType, Claim rootClaim, bytes memory extraData) = _game.gameData();

        // Grab the verified address of the game based on the game data.
        (IDisputeGame _factoryRegisteredGame,) =
            disputeGameFactory.games({ _gameType: gameType, _rootClaim: rootClaim, _extraData: extraData });

        // Return whether the game is factory registered.
        return address(_factoryRegisteredGame) == address(_game);
    }

    /// @notice Determines whether a game is of a respected game type.
    /// @param _game The game to check.
    /// @return Whether the game is of a respected game type.
    function isGameRespected(IDisputeGame _game) public view returns (bool) {
        return _game.wasRespectedGameTypeWhenCreated();
    }

    /// @notice Determines whether a game is blacklisted.
    /// @param _game The game to check.
    /// @return Whether the game is blacklisted.
    function isGameBlacklisted(IDisputeGame _game) public view returns (bool) {
        return portal.disputeGameBlacklist(_game);
    }

    /// @notice Determines whether a game is retired.
    /// @param _game The game to check.
    /// @return Whether the game is retired.
    function isGameRetired(IDisputeGame _game) public view returns (bool) {
        // Must be created after the respectedGameTypeUpdatedAt timestamp. Note that this means all
        // games created in the same block as the respectedGameTypeUpdatedAt timestamp are
        // considered retired.
        return _game.createdAt().raw() <= portal.respectedGameTypeUpdatedAt();
    }

    /// @notice Returns whether a game is resolved.
    /// @param _game The game to check.
    /// @return Whether the game is resolved.
    function isGameResolved(IDisputeGame _game) public view returns (bool) {
        return _game.resolvedAt().raw() != 0
            && (_game.status() == GameStatus.DEFENDER_WINS || _game.status() == GameStatus.CHALLENGER_WINS);
    }

    /// @notice **READ THIS FUNCTION DOCUMENTATION CAREFULLY.**
    ///         Determines whether a game resolved properly and the game was not subject to any
    ///         invalidation conditions. The root claim of a proper game IS NOT guaranteed to be
    ///         valid. The root claim of a proper game CAN BE incorrect and still be a proper game.
    ///         DO NOT USE THIS FUNCTION ALONE TO DETERMINE IF A ROOT CLAIM IS VALID.
    /// @dev Note that isGameProper previously checked that the game type was equal to the
    ///      respected game type. However, it should be noted that it is possible for a game other
    ///      than the respected game type to resolve without being invalidated. Since isGameProper
    ///      exists to determine if a game has (or has not) been invalidated, we now allow any game
    ///      type to be considered a proper game. We enforce checks on the game type in
    ///      isGameClaimValid().
    /// @param _game The game to check.
    /// @return Whether the game is a proper game.
    function isGameProper(IDisputeGame _game) public view returns (bool) {
        // Must be registered in the DisputeGameFactory.
        if (!isGameRegistered(_game)) {
            return false;
        }

        // Must not be blacklisted.
        if (isGameBlacklisted(_game)) {
            return false;
        }

        // Must be created at or after the respectedGameTypeUpdatedAt timestamp.
        if (isGameRetired(_game)) {
            return false;
        }

        return true;
    }

    /// @notice Returns whether a game is finalized.
    /// @param _game The game to check.
    /// @return Whether the game is finalized.
    function isGameFinalized(IDisputeGame _game) public view returns (bool) {
        // Game must be resolved.
        if (!isGameResolved(_game)) {
            return false;
        }

        // Game must be beyond the "airgap period" - time since resolution must be at least
        // "dispute game finality delay" seconds in the past.
        if (block.timestamp - _game.resolvedAt().raw() <= portal.disputeGameFinalityDelaySeconds()) {
            return false;
        }

        return true;
    }

    /// @notice Returns whether a game's root claim is valid.
    /// @param _game The game to check.
    /// @return Whether the game's root claim is valid.
    function isGameClaimValid(IDisputeGame _game) public view returns (bool) {
        // Game must be a proper game.
        if (!isGameProper(_game)) {
            return false;
        }

        // Must be respected.
        if (!isGameRespected(_game)) {
            return false;
        }

        // Game must be finalized.
        if (!isGameFinalized(_game)) {
            return false;
        }

        // Game must be resolved in favor of the defender.
        if (_game.status() != GameStatus.DEFENDER_WINS) {
            return false;
        }

        return true;
    }

    /// @notice Updates the anchor game.
    /// @param _game New candidate anchor game.
    function setAnchorState(IDisputeGame _game) public {
        // Convert game to FaultDisputeGame.
        // We can't use FaultDisputeGame in the interface because this function is called from the
        // FaultDisputeGame contract which can't import IFaultDisputeGame by convention. We should
        // likely introduce a new interface (e.g., StateDisputeGame) that can act as a more useful
        // version of IDisputeGame in the future.
        IFaultDisputeGame game = IFaultDisputeGame(address(_game));

        // Check if the candidate game claim is valid.
        if (!isGameClaimValid(game)) {
            revert AnchorStateRegistry_InvalidAnchorGame();
        }

        // Must be newer than the current anchor game.
        (, uint256 anchorL2BlockNumber) = getAnchorRoot();
        if (game.l2BlockNumber() <= anchorL2BlockNumber) {
            revert AnchorStateRegistry_InvalidAnchorGame();
        }

        // Update the anchor game.
        anchorGame = game;
        emit AnchorUpdated(game);
    }
}