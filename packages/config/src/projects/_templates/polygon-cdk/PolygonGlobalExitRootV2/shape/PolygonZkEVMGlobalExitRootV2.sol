// SPDX-License-Identifier: Unknown
pragma solidity 0.8.20;

library GlobalExitRootLib {
    function calculateGlobalExitRoot(
        bytes32 mainnetExitRoot,
        bytes32 rollupExitRoot
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(mainnetExitRoot, rollupExitRoot));
    }
}

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
        return functionCallWithValue(target, data, 0, "Address: low-level call failed");
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
     * `onlyInitializing` functions can be used to initialize parent contracts.
     *
     * Similar to `reinitializer(1)`, except that functions marked with `initializer` can be nested in the context of a
     * constructor.
     *
     * Emits an {Initialized} event.
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
     * A reinitializer may be used after the original initialization step. This is essential to configure modules that
     * are added through upgrades and that require initialization.
     *
     * When `version` is 1, this modifier is similar to `initializer`, except that functions marked with `reinitializer`
     * cannot be nested. If one is invoked in the context of another, execution will revert.
     *
     * Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
     * a contract, executing them in the right order is up to the developer or operator.
     *
     * WARNING: setting the version to 255 will prevent any future reinitialization.
     *
     * Emits an {Initialized} event.
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
     *
     * Emits an {Initialized} event the first time it is successfully executed.
     */
    function _disableInitializers() internal virtual {
        require(!_initializing, "Initializable: contract is initializing");
        if (_initialized < type(uint8).max) {
            _initialized = type(uint8).max;
            emit Initialized(type(uint8).max);
        }
    }

    /**
     * @dev Returns the highest version that has been initialized. See {reinitializer}.
     */
    function _getInitializedVersion() internal view returns (uint8) {
        return _initialized;
    }

    /**
     * @dev Returns `true` if the contract is currently initializing. See {onlyInitializing}.
     */
    function _isInitializing() internal view returns (bool) {
        return _initializing;
    }
}

contract DepositContractBase {
    /**
     * @dev Thrown when the merkle tree is full
     */
    error MerkleTreeFull();

    // Merkle tree levels
    uint256 internal constant _DEPOSIT_CONTRACT_TREE_DEPTH = 32;

    // This ensures `depositCount` will fit into 32-bits
    uint256 internal constant _MAX_DEPOSIT_COUNT =
        2 ** _DEPOSIT_CONTRACT_TREE_DEPTH - 1;

    // Branch array which contains the necessary sibilings to compute the next root when a new
    // leaf is inserted
    bytes32[_DEPOSIT_CONTRACT_TREE_DEPTH] internal _branch;

    // Counter of current deposits
    uint256 public depositCount;

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     */
    uint256[10] private _gap;

    /**
     * @notice Computes and returns the merkle root
     */
    function getRoot() public view virtual returns (bytes32) {
        bytes32 node;
        uint256 size = depositCount;
        bytes32 currentZeroHashHeight = 0;

        for (
            uint256 height = 0;
            height < _DEPOSIT_CONTRACT_TREE_DEPTH;
            height++
        ) {
            if (((size >> height) & 1) == 1)
                node = keccak256(abi.encodePacked(_branch[height], node));
            else
                node = keccak256(abi.encodePacked(node, currentZeroHashHeight));

            currentZeroHashHeight = keccak256(
                abi.encodePacked(currentZeroHashHeight, currentZeroHashHeight)
            );
        }
        return node;
    }

    /**
     * @notice Add a new leaf to the merkle tree
     * @param leaf Leaf
     */
    function _addLeaf(bytes32 leaf) internal {
        bytes32 node = leaf;

        // Avoid overflowing the Merkle tree (and prevent edge case in computing `_branch`)
        if (depositCount >= _MAX_DEPOSIT_COUNT) {
            revert MerkleTreeFull();
        }

        // Add deposit data root to Merkle tree (update a single `_branch` node)
        uint256 size = ++depositCount;
        for (
            uint256 height = 0;
            height < _DEPOSIT_CONTRACT_TREE_DEPTH;
            height++
        ) {
            if (((size >> height) & 1) == 1) {
                _branch[height] = node;
                return;
            }
            node = keccak256(abi.encodePacked(_branch[height], node));
        }
        // As the loop should always end prematurely with the `return` statement,
        // this code should be unreachable. We assert `false` just to be safe.
        assert(false);
    }

    /**
     * @notice Verify merkle proof
     * @param leafHash Leaf hash
     * @param smtProof Smt proof
     * @param index Index of the leaf
     * @param root Merkle root
     */
    function verifyMerkleProof(
        bytes32 leafHash,
        bytes32[_DEPOSIT_CONTRACT_TREE_DEPTH] calldata smtProof,
        uint32 index,
        bytes32 root
    ) public pure returns (bool) {
        return calculateRoot(leafHash, smtProof, index) == root;
    }

    /**
     * @notice Calculate root from merkle proof
     * @param leafHash Leaf hash
     * @param smtProof Smt proof
     * @param index Index of the leaf
     */
    function calculateRoot(
        bytes32 leafHash,
        bytes32[_DEPOSIT_CONTRACT_TREE_DEPTH] calldata smtProof,
        uint32 index
    ) public pure returns (bytes32) {
        bytes32 node = leafHash;

        // Compute root
        for (
            uint256 height = 0;
            height < _DEPOSIT_CONTRACT_TREE_DEPTH;
            height++
        ) {
            if (((index >> height) & 1) == 1)
                node = keccak256(abi.encodePacked(smtProof[height], node));
            else node = keccak256(abi.encodePacked(node, smtProof[height]));
        }

        return node;
    }
}

interface IBasePolygonZkEVMGlobalExitRoot {
    /**
     * @dev Thrown when the caller is not the allowed contracts
     */
    error OnlyAllowedContracts();

    function updateExitRoot(bytes32 newRollupExitRoot) external;

    function globalExitRootMap(
        bytes32 globalExitRootNum
    ) external returns (uint256);
}

interface IPolygonZkEVMGlobalExitRootV2 is IBasePolygonZkEVMGlobalExitRoot {
    function getLastGlobalExitRoot() external view returns (bytes32);

    function getRoot() external view returns (bytes32);

    function l1InfoRootMap(
        uint32 depositCount
    ) external view returns (bytes32);
}

abstract contract PolygonZkEVMGlobalExitRootBaseStorage is
    IPolygonZkEVMGlobalExitRootV2
{
    // Rollup root, contains all exit roots of all rollups
    bytes32 public lastRollupExitRoot;

    // Mainnet exit root, this will be updated every time a deposit is made in mainnet
    bytes32 public lastMainnetExitRoot;

    // Store every global exit root: Root --> blockhash
    // Note that previously recoded global exit roots in previous versions, timestamp was recorded instead of blockhash
    mapping(bytes32 => uint256) public globalExitRootMap;
}

contract PolygonZkEVMGlobalExitRootV2 is
    PolygonZkEVMGlobalExitRootBaseStorage,
    DepositContractBase,
    Initializable
{
    // PolygonZkEVMBridge address
    address public immutable bridgeAddress;

    // Rollup manager contract address
    address public immutable rollupManager;

    // Store every l1InfoLeaf
    mapping(uint32 leafCount => bytes32 l1InfoRoot) public l1InfoRootMap;

    /**
     * @dev Emitted when the global exit root is updated
     */
    event UpdateL1InfoTree(
        bytes32 indexed mainnetExitRoot,
        bytes32 indexed rollupExitRoot
    );

    /**
     * @dev Emitted when the global exit root is updated with the L1InfoTree leaf information
     */
    event UpdateL1InfoTreeV2(
        bytes32 currentL1InfoRoot,
        uint32 indexed leafCount,
        uint256 blockhash,
        uint64 minTimestamp
    );

    /**
     * @dev Emitted when the global exit root manager starts adding leafs to the L1InfoRootMap
     */
    event InitL1InfoRootMap(uint32 leafCount, bytes32 currentL1InfoRoot);

    /**
     * @param _rollupManager Rollup manager contract address
     * @param _bridgeAddress PolygonZkEVMBridge contract address
     */
    constructor(address _rollupManager, address _bridgeAddress) {
        rollupManager = _rollupManager;
        bridgeAddress = _bridgeAddress;

        // disable initializers
        _disableInitializers();
    }

    /**
     * @notice Reset the deposit tree since will be replace by a recursive one
     */
    function initialize() external virtual initializer {
        // Get the current historic root
        bytes32 currentL1InfoRoot = getRoot();

        // Store L1InfoRoot
        l1InfoRootMap[uint32(depositCount)] = currentL1InfoRoot;

        emit InitL1InfoRootMap(uint32(depositCount), currentL1InfoRoot);
    }

    /**
     * @notice Update the exit root of one of the networks and the global exit root
     * @param newRoot new exit tree root
     */
    function updateExitRoot(bytes32 newRoot) external {
        // Store storage variables into temporal variables since will be used multiple times
        bytes32 cacheLastRollupExitRoot;
        bytes32 cacheLastMainnetExitRoot;

        if (msg.sender == bridgeAddress) {
            lastMainnetExitRoot = newRoot;
            cacheLastMainnetExitRoot = newRoot;
            cacheLastRollupExitRoot = lastRollupExitRoot;
        } else if (msg.sender == rollupManager) {
            lastRollupExitRoot = newRoot;
            cacheLastRollupExitRoot = newRoot;
            cacheLastMainnetExitRoot = lastMainnetExitRoot;
        } else {
            revert OnlyAllowedContracts();
        }

        bytes32 newGlobalExitRoot = GlobalExitRootLib.calculateGlobalExitRoot(
            cacheLastMainnetExitRoot,
            cacheLastRollupExitRoot
        );

        // If it already exists, do not modify the blockhash
        if (globalExitRootMap[newGlobalExitRoot] == 0) {
            uint64 currentTimestmap = uint64(block.timestamp);

            uint256 lastBlockHash = uint256(blockhash(block.number - 1));
            globalExitRootMap[newGlobalExitRoot] = lastBlockHash;

            // save new leaf in L1InfoTree
            _addLeaf(
                getLeafValue(newGlobalExitRoot, lastBlockHash, currentTimestmap)
            );

            // Get the current historic root
            bytes32 currentL1InfoRoot = getRoot();

            // Store L1InfoRoot
            l1InfoRootMap[uint32(depositCount)] = currentL1InfoRoot;

            emit UpdateL1InfoTree(
                cacheLastMainnetExitRoot,
                cacheLastRollupExitRoot
            );

            emit UpdateL1InfoTreeV2(
                currentL1InfoRoot,
                uint32(depositCount),
                lastBlockHash,
                currentTimestmap
            );
        }
    }

    /**
     * @notice Return last global exit root
     */
    function getLastGlobalExitRoot() public view returns (bytes32) {
        return
            GlobalExitRootLib.calculateGlobalExitRoot(
                lastMainnetExitRoot,
                lastRollupExitRoot
            );
    }

    /**
     * @notice Computes and returns the merkle root of the L1InfoTree
     */
    function getRoot()
        public
        view
        override(DepositContractBase, IPolygonZkEVMGlobalExitRootV2)
        returns (bytes32)
    {
        return super.getRoot();
    }

    /**
     * @notice Given the leaf data returns the leaf hash
     * @param newGlobalExitRoot Last global exit root
     * @param lastBlockHash Last accesible block hash
     * @param timestamp Ethereum timestamp in seconds
     */
    function getLeafValue(
        bytes32 newGlobalExitRoot,
        uint256 lastBlockHash,
        uint64 timestamp
    ) public pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(newGlobalExitRoot, lastBlockHash, timestamp)
            );
    }
}