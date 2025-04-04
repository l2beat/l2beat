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

contract RollupDAManager is Ownable2Step {
    /// @dev Mapping to track the status (enabled/disabled) of each DAPair.
    mapping(address l1DAValidator => mapping(address l2DAValidator => bool)) public allowedDAPairs;

    /// @dev Emitted when a DAPair is added or updated.
    /// @param l1DAValidator Address of the L1 data availability validator.
    /// @param l2DAValidator Address of the L2 data availability validator.
    /// @param status Boolean representing the state of the DAPair.
    event DAPairUpdated(address indexed l1DAValidator, address indexed l2DAValidator, bool status);

    /// @dev Modifier to ensure addresses in DAPair are not zero addresses.
    /// @param l1DAValidator Address of the L1 data availability validator.
    /// @param l2DAValidator Address of the L2 data availability validator.
    modifier validAddresses(address l1DAValidator, address l2DAValidator) {
        if (l1DAValidator == address(0) || l2DAValidator == address(0)) {
            revert ZeroAddress();
        }
        _;
    }

    /// @dev Adds or updates a DAPair in the `allowedDAPairs` mapping. Only callable by the contract owner.
    ///
    /// Emits a {DAPairUpdated} event.
    ///
    /// @param _l1DAValidator Address of the L1 data availability validator.
    /// @param _l2DAValidator Address of the L2 data availability validator.
    /// @param _status Boolean representing whether the DAPair is active or not.
    ///
    /// Requirements:
    ///
    /// - The `l1DAValidator` and `l2DAValidator` must be valid addresses (non-zero).
    /// - Only the owner of the contract can call this function.
    function updateDAPair(
        address _l1DAValidator,
        address _l2DAValidator,
        bool _status
    ) external onlyOwner validAddresses(_l1DAValidator, _l2DAValidator) {
        allowedDAPairs[_l1DAValidator][_l2DAValidator] = _status;

        emit DAPairUpdated(_l1DAValidator, _l2DAValidator, _status);
    }

    /// @notice Returns whether the DA pair is allowed.
    ///
    /// @param _l1DAValidator Address of the L1 data availability validator.
    /// @param _l2DAValidator Address of the L2 data availability validator.
    /// @return bool indicating if the DA pair is allowed.
    function isPairAllowed(address _l1DAValidator, address _l2DAValidator) external view returns (bool) {
        return allowedDAPairs[_l1DAValidator][_l2DAValidator];
    }
}