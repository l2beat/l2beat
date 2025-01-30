// SPDX-License-Identifier: Unknown
pragma solidity 0.8.12;

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

abstract contract ContextUpgradeable is Initializable {
    function __Context_init() internal onlyInitializing {
    }

    function __Context_init_unchained() internal onlyInitializing {
    }
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}

abstract contract OwnableUpgradeable is Initializable, ContextUpgradeable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    function __Ownable_init() internal onlyInitializing {
        __Ownable_init_unchained();
    }

    function __Ownable_init_unchained() internal onlyInitializing {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}

interface IEjectionManager {

    /// @notice A quorum's ratelimit parameters
    struct QuorumEjectionParams {
        uint32 rateLimitWindow; // Time delta to track ejection over
        uint16 ejectableStakePercent; // Max stake to be ejectable per time delta
    }

    /// @notice A stake ejection event
    struct StakeEjection {
        uint256 timestamp; // Timestamp of the ejection
        uint256 stakeEjected; // Amount of stake ejected at the timestamp
    }

    ///@notice Emitted when the ejector address is set
    event EjectorUpdated(address ejector, bool status);
    ///@notice Emitted when the ratelimit parameters for a quorum are set
    event QuorumEjectionParamsSet(uint8 quorumNumber, uint32 rateLimitWindow, uint16 ejectableStakePercent);
    ///@notice Emitted when an operator is ejected
    event OperatorEjected(bytes32 operatorId, uint8 quorumNumber);
    ///@notice Emitted when operators are ejected for a quroum 
    event QuorumEjection(uint32 ejectedOperators, bool ratelimitHit);

   /**
     * @notice Ejects operators from the AVSs registryCoordinator under a ratelimit
     * @param _operatorIds The ids of the operators to eject for each quorum
     */
    function ejectOperators(bytes32[][] memory _operatorIds) external;

    /**
     * @notice Sets the ratelimit parameters for a quorum
     * @param _quorumNumber The quorum number to set the ratelimit parameters for
     * @param _quorumEjectionParams The quorum ratelimit parameters to set for the given quorum
     */
    function setQuorumEjectionParams(uint8 _quorumNumber, QuorumEjectionParams memory _quorumEjectionParams) external;

    /**
     * @notice Sets the address permissioned to eject operators under a ratelimit
     * @param _ejector The address to permission
     */
    function setEjector(address _ejector, bool _status) external;

    /**
     * @notice Returns the amount of stake that can be ejected for a quorum at the current block.timestamp
     * @param _quorumNumber The quorum number to view ejectable stake for
     */
    function amountEjectableForQuorum(uint8 _quorumNumber) external view returns (uint256);
}

contract EjectionManager is IEjectionManager, OwnableUpgradeable{

    /// @notice The basis point denominator for the ejectable stake percent
    uint16 internal constant BIPS_DENOMINATOR = 10000;

    /// @notice the RegistryCoordinator contract that is the entry point for ejection
    IRegistryCoordinator public immutable registryCoordinator;
    /// @notice the StakeRegistry contract that keeps track of quorum stake
    IStakeRegistry public immutable stakeRegistry;

    /// @notice Addresses permissioned to eject operators under a ratelimit
    mapping(address => bool) public isEjector;

    /// @notice Keeps track of the total stake ejected for a quorum
    mapping(uint8 => StakeEjection[]) public stakeEjectedForQuorum;
    /// @notice Ratelimit parameters for each quorum
    mapping(uint8 => QuorumEjectionParams) public quorumEjectionParams;

    constructor(
        IRegistryCoordinator _registryCoordinator,
        IStakeRegistry _stakeRegistry
    ) {
        registryCoordinator = _registryCoordinator;
        stakeRegistry = _stakeRegistry;

        _disableInitializers();
    }

    /**
     * @param _owner will hold the owner role
     * @param _ejectors will hold the ejector role
     * @param _quorumEjectionParams are the ratelimit parameters for the quorum at each index
     */
    function initialize(
        address _owner,
        address[] memory _ejectors,
        QuorumEjectionParams[] memory _quorumEjectionParams
    ) external initializer {
        _transferOwnership(_owner);
        for(uint8 i = 0; i < _ejectors.length; i++) {
            _setEjector(_ejectors[i], true);
        }
        for(uint8 i = 0; i < _quorumEjectionParams.length; i++) {
            _setQuorumEjectionParams(i, _quorumEjectionParams[i]);
        }
    }

    /**
     * @notice Ejects operators from the AVSs RegistryCoordinator under a ratelimit
     * @param _operatorIds The ids of the operators 'j' to eject for each quorum 'i'
     * @dev This function will eject as many operators as possible prioritizing operators at the lower index
     * @dev The owner can eject operators without recording of stake ejection
     */
    function ejectOperators(bytes32[][] memory _operatorIds) external {
        require(isEjector[msg.sender] || msg.sender == owner(), "Ejector: Only owner or ejector can eject");

        for(uint i = 0; i < _operatorIds.length; ++i) {
            uint8 quorumNumber = uint8(i);

            uint256 amountEjectable = amountEjectableForQuorum(quorumNumber);
            uint256 stakeForEjection;
            uint32 ejectedOperators;

            bool ratelimitHit;
            for(uint8 j = 0; j < _operatorIds[i].length; ++j) {
                uint256 operatorStake = stakeRegistry.getCurrentStake(_operatorIds[i][j], quorumNumber);

                //if caller is ejector enforce ratelimit
                if(
                    isEjector[msg.sender] &&
                    quorumEjectionParams[quorumNumber].rateLimitWindow > 0 &&
                    stakeForEjection + operatorStake > amountEjectable
                ){
                    stakeEjectedForQuorum[quorumNumber].push(StakeEjection({
                        timestamp: block.timestamp,
                        stakeEjected: stakeForEjection
                    }));
                    ratelimitHit = true;
                    break;
                }

                stakeForEjection += operatorStake;
                ++ejectedOperators;

                registryCoordinator.ejectOperator(
                    registryCoordinator.getOperatorFromId(_operatorIds[i][j]),
                    abi.encodePacked(quorumNumber)
                );
                
                emit OperatorEjected(_operatorIds[i][j], quorumNumber);
            }

            //record the stake ejected if ejector and ratelimit enforced
            if(!ratelimitHit && isEjector[msg.sender]){
                stakeEjectedForQuorum[quorumNumber].push(StakeEjection({
                    timestamp: block.timestamp,
                    stakeEjected: stakeForEjection
                }));
            }

            emit QuorumEjection(ejectedOperators, ratelimitHit);
        }
    }

    /**
     * @notice Sets the ratelimit parameters for a quorum
     * @param _quorumNumber The quorum number to set the ratelimit parameters for
     * @param _quorumEjectionParams The quorum ratelimit parameters to set for the given quorum
     */
    function setQuorumEjectionParams(uint8 _quorumNumber, QuorumEjectionParams memory _quorumEjectionParams) external onlyOwner() {
        _setQuorumEjectionParams(_quorumNumber, _quorumEjectionParams);
    }

    /**
     * @notice Sets the address permissioned to eject operators under a ratelimit
     * @param _ejector The address to permission
     * @param _status The status to set for the given address
     */
    function setEjector(address _ejector, bool _status) external onlyOwner() {
        _setEjector(_ejector, _status);
    }

    ///@dev internal function to set the quorum ejection params
    function _setQuorumEjectionParams(uint8 _quorumNumber, QuorumEjectionParams memory _quorumEjectionParams) internal {
        quorumEjectionParams[_quorumNumber] = _quorumEjectionParams;
        emit QuorumEjectionParamsSet(_quorumNumber, _quorumEjectionParams.rateLimitWindow, _quorumEjectionParams.ejectableStakePercent);
    }

    ///@dev internal function to set the ejector
    function _setEjector(address _ejector, bool _status) internal {
        isEjector[_ejector] = _status;
        emit EjectorUpdated(_ejector, _status);
    }

    /**
     * @notice Returns the amount of stake that can be ejected for a quorum at the current block.timestamp
     * @param _quorumNumber The quorum number to view ejectable stake for
     */
    function amountEjectableForQuorum(uint8 _quorumNumber) public view returns (uint256) {
        uint256 cutoffTime = block.timestamp - quorumEjectionParams[_quorumNumber].rateLimitWindow;
        uint256 totalEjectable = uint256(quorumEjectionParams[_quorumNumber].ejectableStakePercent) * uint256(stakeRegistry.getCurrentTotalStake(_quorumNumber)) / uint256(BIPS_DENOMINATOR);
        uint256 totalEjected;
        uint256 i;
        if (stakeEjectedForQuorum[_quorumNumber].length == 0) {
            return totalEjectable;
        }
        i = stakeEjectedForQuorum[_quorumNumber].length - 1;

        while(stakeEjectedForQuorum[_quorumNumber][i].timestamp > cutoffTime) {
            totalEjected += stakeEjectedForQuorum[_quorumNumber][i].stakeEjected;
            if(i == 0){
                break;
            } else {
                --i;
            }
        }

        if(totalEjected >= totalEjectable){
            return 0;
        }
        return totalEjectable - totalEjected;
    }
}