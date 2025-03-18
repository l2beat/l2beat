// SPDX-License-Identifier: Unknown
pragma solidity 0.8.24;

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
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
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
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
}

abstract contract Ownable2Step is Ownable {
    address private _pendingOwner;

    event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Returns the address of the pending owner.
     */
    function pendingOwner() public view virtual returns (address) {
        return _pendingOwner;
    }

    /**
     * @dev Starts the ownership transfer of the contract to a new account. Replaces the pending transfer if there is one.
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual override onlyOwner {
        _pendingOwner = newOwner;
        emit OwnershipTransferStarted(owner(), newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`) and deletes any pending owner.
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual override {
        delete _pendingOwner;
        super._transferOwnership(newOwner);
    }

    /**
     * @dev The new owner accepts the ownership transfer.
     */
    function acceptOwnership() public virtual {
        address sender = _msgSender();
        require(pendingOwner() == sender, "Ownable2Step: caller is not the new owner");
        _transferOwnership(sender);
    }
}

interface IChainAdmin {
    /// @dev Represents a call to be made during multicall.
    /// @param target The address to which the call will be made.
    /// @param value The amount of Ether (in wei) to be sent along with the call.
    /// @param data The calldata to be executed on the `target` address.
    struct Call {
        address target;
        uint256 value;
        bytes data;
    }

    /// @notice Emitted when the expected upgrade timestamp for a specific protocol version is set.
    event UpdateUpgradeTimestamp(uint256 indexed _protocolVersion, uint256 _upgradeTimestamp);

    /// @notice Emitted when the call is executed from the contract.
    event CallExecuted(Call _call, bool _success, bytes _returnData);

    /// @notice Emitted when the new token multiplier address is set.
    event NewTokenMultiplierSetter(address _oldTokenMultiplierSetter, address _newTokenMultiplierSetter);

    function setTokenMultiplierSetter(address _tokenMultiplierSetter) external;

    function setUpgradeTimestamp(uint256 _protocolVersion, uint256 _upgradeTimestamp) external;

    function multicall(Call[] calldata _calls, bool _requireSuccess) external payable;

    function setTokenMultiplier(IAdmin _chainContract, uint128 _nominator, uint128 _denominator) external;
}

contract ChainAdmin is IChainAdmin, Ownable2Step {
    /// @notice Mapping of protocol versions to their expected upgrade timestamps.
    /// @dev Needed for the offchain node administration to know when to start building batches with the new protocol version.
    mapping(uint256 protocolVersion => uint256 upgradeTimestamp) public protocolVersionToUpgradeTimestamp;

    /// @notice The address which can call `setTokenMultiplier` function to change the base token gas price in the Chain contract.
    /// @dev The token base price can be changed quite often, so the private key for this role is supposed to be stored in the node
    /// and used by the automated service in a way similar to the sequencer workflow.
    address public tokenMultiplierSetter;

    constructor(address _initialOwner, address _initialTokenMultiplierSetter) {
        require(_initialOwner != address(0), "Initial owner should be non zero address");
        _transferOwnership(_initialOwner);
        // Can be zero if no one has this permission.
        tokenMultiplierSetter = _initialTokenMultiplierSetter;
        emit NewTokenMultiplierSetter(address(0), _initialTokenMultiplierSetter);
    }

    /// @notice Updates the address responsible for setting token multipliers on the Chain contract .
    /// @param _tokenMultiplierSetter The new address to be set as the token multiplier setter.
    function setTokenMultiplierSetter(address _tokenMultiplierSetter) external onlyOwner {
        emit NewTokenMultiplierSetter(tokenMultiplierSetter, _tokenMultiplierSetter);
        tokenMultiplierSetter = _tokenMultiplierSetter;
    }

    /// @notice Set the expected upgrade timestamp for a specific protocol version.
    /// @param _protocolVersion The ZKsync chain protocol version.
    /// @param _upgradeTimestamp The timestamp at which the chain node should expect the upgrade to happen.
    function setUpgradeTimestamp(uint256 _protocolVersion, uint256 _upgradeTimestamp) external onlyOwner {
        protocolVersionToUpgradeTimestamp[_protocolVersion] = _upgradeTimestamp;
        emit UpdateUpgradeTimestamp(_protocolVersion, _upgradeTimestamp);
    }

    /// @notice Execute multiple calls as part of contract administration.
    /// @param _calls Array of Call structures defining target, value, and data for each call.
    /// @param _requireSuccess If true, reverts transaction on any call failure.
    /// @dev Intended for batch processing of contract interactions, managing gas efficiency and atomicity of operations.
    function multicall(Call[] calldata _calls, bool _requireSuccess) external payable onlyOwner {
        require(_calls.length > 0, "No calls provided");
        for (uint256 i = 0; i < _calls.length; ++i) {
            // slither-disable-next-line arbitrary-send-eth
            (bool success, bytes memory returnData) = _calls[i].target.call{value: _calls[i].value}(_calls[i].data);
            if (_requireSuccess && !success) {
                // Propagate an error if the call fails.
                assembly {
                    revert(add(returnData, 0x20), mload(returnData))
                }
            }
            emit CallExecuted(_calls[i], success, returnData);
        }
    }

    /// @notice Sets the token multiplier in the specified Chain contract.
    /// @param _chainContract The chain contract address where the token multiplier will be set.
    /// @param _nominator The numerator part of the token multiplier.
    /// @param _denominator The denominator part of the token multiplier.
    function setTokenMultiplier(IAdmin _chainContract, uint128 _nominator, uint128 _denominator) external {
        require(msg.sender == tokenMultiplierSetter, "Only the token multiplier setter can call this function");
        _chainContract.setTokenMultiplier(_nominator, _denominator);
    }

    /// @dev Contract might receive/hold ETH as part of the maintenance process.
    receive() external payable {}
}