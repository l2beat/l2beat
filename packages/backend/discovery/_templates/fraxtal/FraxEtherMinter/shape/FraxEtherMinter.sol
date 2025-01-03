// SPDX-License-Identifier: Unknown
pragma solidity 0.8.28;

struct FraxEtherMinterParams {
    address frxEthErc20Address;
    address sfrxEthErc20Address;
    address payable timelockAddress;
    address payable etherRouterAddress;
    address operatorRoleAddress;
}

abstract contract PublicReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 internal _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be _NOT_ENTERED
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        // Any calls to nonReentrant after this point will fail
        _status = _ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _status == _ENTERED;
    }
}

abstract contract Timelock2Step {
    /// @notice The pending timelock address
    address public pendingTimelockAddress;

    /// @notice The current timelock address
    address public timelockAddress;

    constructor(address _timelockAddress) {
        timelockAddress = _timelockAddress;
    }

    // ============================================================================================
    // Functions: External Functions
    // ============================================================================================

    /// @notice The ```transferTimelock``` function initiates the timelock transfer
    /// @dev Must be called by the current timelock
    /// @param _newTimelock The address of the nominated (pending) timelock
    function transferTimelock(address _newTimelock) external virtual {
        _requireSenderIsTimelock();
        _transferTimelock(_newTimelock);
    }

    /// @notice The ```acceptTransferTimelock``` function completes the timelock transfer
    /// @dev Must be called by the pending timelock
    function acceptTransferTimelock() external virtual {
        _requireSenderIsPendingTimelock();
        _acceptTransferTimelock();
    }

    /// @notice The ```renounceTimelock``` function renounces the timelock after setting pending timelock to current timelock
    /// @dev Pending timelock must be set to current timelock before renouncing, creating a 2-step renounce process
    function renounceTimelock() external virtual {
        _requireSenderIsTimelock();
        _requireSenderIsPendingTimelock();
        _transferTimelock(address(0));
        _setTimelock(address(0));
    }

    // ============================================================================================
    // Functions: Internal Actions
    // ============================================================================================

    /// @notice The ```_transferTimelock``` function initiates the timelock transfer
    /// @dev This function is to be implemented by a public function
    /// @param _newTimelock The address of the nominated (pending) timelock
    function _transferTimelock(address _newTimelock) internal {
        pendingTimelockAddress = _newTimelock;
        emit TimelockTransferStarted(timelockAddress, _newTimelock);
    }

    /// @notice The ```_acceptTransferTimelock``` function completes the timelock transfer
    /// @dev This function is to be implemented by a public function
    function _acceptTransferTimelock() internal {
        pendingTimelockAddress = address(0);
        _setTimelock(msg.sender);
    }

    /// @notice The ```_setTimelock``` function sets the timelock address
    /// @dev This function is to be implemented by a public function
    /// @param _newTimelock The address of the new timelock
    function _setTimelock(address _newTimelock) internal {
        emit TimelockTransferred(timelockAddress, _newTimelock);
        timelockAddress = _newTimelock;
    }

    // ============================================================================================
    // Functions: Internal Checks
    // ============================================================================================

    /// @notice The ```_isTimelock``` function checks if _address is current timelock address
    /// @param _address The address to check against the timelock
    /// @return Whether or not msg.sender is current timelock address
    function _isTimelock(address _address) internal view returns (bool) {
        return _address == timelockAddress;
    }

    /// @notice The ```_requireIsTimelock``` function reverts if _address is not current timelock address
    /// @param _address The address to check against the timelock
    function _requireIsTimelock(address _address) internal view {
        if (!_isTimelock(_address)) revert AddressIsNotTimelock(timelockAddress, _address);
    }

    /// @notice The ```_requireSenderIsTimelock``` function reverts if msg.sender is not current timelock address
    /// @dev This function is to be implemented by a public function
    function _requireSenderIsTimelock() internal view {
        _requireIsTimelock(msg.sender);
    }

    /// @notice The ```_isPendingTimelock``` function checks if the _address is pending timelock address
    /// @dev This function is to be implemented by a public function
    /// @param _address The address to check against the pending timelock
    /// @return Whether or not _address is pending timelock address
    function _isPendingTimelock(address _address) internal view returns (bool) {
        return _address == pendingTimelockAddress;
    }

    /// @notice The ```_requireIsPendingTimelock``` function reverts if the _address is not pending timelock address
    /// @dev This function is to be implemented by a public function
    /// @param _address The address to check against the pending timelock
    function _requireIsPendingTimelock(address _address) internal view {
        if (!_isPendingTimelock(_address)) revert AddressIsNotPendingTimelock(pendingTimelockAddress, _address);
    }

    /// @notice The ```_requirePendingTimelock``` function reverts if msg.sender is not pending timelock address
    /// @dev This function is to be implemented by a public function
    function _requireSenderIsPendingTimelock() internal view {
        _requireIsPendingTimelock(msg.sender);
    }

    // ============================================================================================
    // Functions: Events
    // ============================================================================================

    /// @notice The ```TimelockTransferStarted``` event is emitted when the timelock transfer is initiated
    /// @param previousTimelock The address of the previous timelock
    /// @param newTimelock The address of the new timelock
    event TimelockTransferStarted(address indexed previousTimelock, address indexed newTimelock);

    /// @notice The ```TimelockTransferred``` event is emitted when the timelock transfer is completed
    /// @param previousTimelock The address of the previous timelock
    /// @param newTimelock The address of the new timelock
    event TimelockTransferred(address indexed previousTimelock, address indexed newTimelock);

    // ============================================================================================
    // Functions: Errors
    // ============================================================================================

    /// @notice Emitted when timelock is transferred
    error AddressIsNotTimelock(address timelockAddress, address actualAddress);

    /// @notice Emitted when pending timelock is transferred
    error AddressIsNotPendingTimelock(address pendingTimelockAddress, address actualAddress);
}

abstract contract OperatorRole {
    // ============================================================================================
    // Storage & Constructor
    // ============================================================================================

    /// @notice The current operator address
    address public operatorAddress;

    constructor(address _operatorAddress) {
        operatorAddress = _operatorAddress;
    }

    // ============================================================================================
    // Functions: Internal Actions
    // ============================================================================================

    /// @notice The ```OperatorTransferred``` event is emitted when the operator transfer is completed
    /// @param previousOperator The address of the previous operator
    /// @param newOperator The address of the new operator
    event OperatorTransferred(address indexed previousOperator, address indexed newOperator);

    /// @notice The ```_setOperator``` function sets the operator address
    /// @dev This function is to be implemented by a public function
    /// @param _newOperator The address of the new operator
    function _setOperator(address _newOperator) internal {
        emit OperatorTransferred(operatorAddress, _newOperator);
        operatorAddress = _newOperator;
    }

    // ============================================================================================
    // Functions: Internal Checks
    // ============================================================================================

    /// @notice The ```_isOperator``` function checks if _address is current operator address
    /// @param _address The address to check against the operator
    /// @return Whether or not msg.sender is current operator address
    function _isOperator(address _address) internal view returns (bool) {
        return _address == operatorAddress;
    }

    /// @notice The ```AddressIsNotOperator``` error is used for validation of the operatorAddress
    /// @param operatorAddress The expected operatorAddress
    /// @param actualAddress The actual operatorAddress
    error AddressIsNotOperator(address operatorAddress, address actualAddress);

    /// @notice The ```_requireIsOperator``` function reverts if _address is not current operator address
    /// @param _address The address to check against the operator
    function _requireIsOperator(address _address) internal view {
        if (!_isOperator(_address)) revert AddressIsNotOperator(operatorAddress, _address);
    }

    /// @notice The ```_requireSenderIsOperator``` function reverts if msg.sender is not current operator address
    /// @dev This function is to be implemented by a public function
    function _requireSenderIsOperator() internal view {
        _requireIsOperator(msg.sender);
    }
}

abstract contract EtherRouterRole {
    // ==============================================================================
    // Storage & Constructor
    // ==============================================================================

    EtherRouter public etherRouter;

    /// @notice constructor
    /// @param _etherRouter Address of Ether Router
    constructor(address payable _etherRouter) {
        etherRouter = EtherRouter(_etherRouter);
    }

    // ==============================================================================
    // Configuration Setters
    // ==============================================================================

    /// @notice Sets a new Ether Router
    /// @param _etherRouter Address for the new Ether Router.
    function _setEtherRouter(address payable _etherRouter) internal {
        emit SetEtherRouter(address(etherRouter), _etherRouter);
        etherRouter = EtherRouter(_etherRouter);
    }

    // ==============================================================================
    // Internal Checks
    // ==============================================================================

    /// @notice Checks if an address is the Ether Router
    /// @param _address Address to test
    function _isEtherRouter(address _address) internal view returns (bool) {
        return (_address == address(etherRouter));
    }

    /// @notice Reverts if the address is not the Ether Router
    /// @param _address Address to test
    function _requireIsEtherRouter(address _address) internal view {
        if (!_isEtherRouter(_address)) {
            revert AddressIsNotEtherRouter(address(etherRouter), _address);
        }
    }

    /// @notice Reverts if msg.sender is not the Ether Router
    function _requireSenderIsEtherRouter() internal view {
        _requireIsEtherRouter(msg.sender);
    }

    // ==============================================================================
    // Events
    // ==============================================================================

    /// @notice The ```SetEtherRouter``` event fires when the Ether Router address changes
    /// @param oldEtherRouter The old address
    /// @param newEtherRouter The new address
    event SetEtherRouter(address indexed oldEtherRouter, address indexed newEtherRouter);

    // ==============================================================================
    // Errors
    // ==============================================================================

    /// @notice Emitted when the test address is not the Ether Router
    error AddressIsNotEtherRouter(address etherRouterAddress, address actualAddress);
}

contract FraxEtherMinter is EtherRouterRole, OperatorRole, Timelock2Step, PublicReentrancyGuard {
    // ==============================================================================
    // Storage & Constructor
    // ==============================================================================

    /// @notice frxETH
    IFrxEth public immutable frxEthToken;
    ISfrxEth public immutable sfrxEthToken;

    /// @notice If minting frxETH is paused
    bool public mintFrxEthPaused;

    /// @notice Constructor
    /// @param _params The FraxEtherMinterParams
    constructor(
        FraxEtherMinterParams memory _params
    )
        Timelock2Step(_params.timelockAddress)
        EtherRouterRole(_params.etherRouterAddress)
        OperatorRole(_params.operatorRoleAddress)
    {
        frxEthToken = IFrxEth(_params.frxEthErc20Address);
        sfrxEthToken = ISfrxEth(_params.sfrxEthErc20Address);
    }

    /// @notice Fallback to minting frxETH to the sender
    receive() external payable {
        _submit(msg.sender);
    }

    // ==============================================================================
    // Acccess Control Functions
    // ==============================================================================

    /// @notice Make sure the sender is either the operator or the timelock
    function _requireSenderIsOperatorOrTimelock() internal view {
        if (!(_isTimelock(msg.sender) || _isOperator(msg.sender))) {
            revert NotOperatorOrTimelock();
        }
    }

    // ==============================================================================
    // Main Functions
    // ==============================================================================

    /// @notice Mints frxETH to the sender based on the ETH value sent
    function mintFrxEth() external payable {
        // Give the frxETH to the sender after it is generated
        _submit(msg.sender);
    }

    /// @notice Mints frxETH to the designated recipient based on the ETH value sent
    /// @param _recipient Destination for the minted frxETH
    function mintFrxEthAndGive(address _recipient) external payable {
        // Give the frxETH to this contract after it is generated
        _submit(_recipient);
    }

    /// @notice Mint frxETH to the recipient using sender's funds. Internal portion
    /// @param _recipient Destination for the minted frxETH
    function _submit(address _recipient) internal nonReentrant {
        // Initial pause and value checks
        if (mintFrxEthPaused) revert MintFrxEthIsPaused();
        if (msg.value == 0) revert CannotMintZero();

        // Deposit Ether to the Ether Router
        etherRouter.depositEther{ value: msg.value }();

        // Give the sender frxETH
        frxEthToken.minter_mint(_recipient, msg.value);

        // Accrue interest (will also update the utilization rate)
        ILendingPool(address(etherRouter.lendingPool())).addInterest(false);

        emit EthSubmitted(msg.sender, _recipient, msg.value);
    }

    /// @notice Mint frxETH and deposit it to receive sfrxETH in one transaction
    /// @param _recipient Destination for the minted frxETH
    /// @return _shares Output amount of sfrxETH
    function submitAndDeposit(address _recipient) external payable returns (uint256 _shares) {
        // Give the frxETH to this contract after it is generated
        _submit(address(this));

        // Approve frxETH to sfrxETH for staking
        frxEthToken.approve(address(sfrxEthToken), msg.value);

        // Deposit the frxETH and give the generated sfrxETH to the final recipient
        _shares = sfrxEthToken.deposit(msg.value, _recipient);
        if (_shares == 0) revert NoSfrxEthReturned();
    }

    /// @notice Toggle allowing submits
    function togglePauseSubmits() external {
        _requireSenderIsOperatorOrTimelock();
        mintFrxEthPaused = !mintFrxEthPaused;

        emit MintFrxEthPaused(mintFrxEthPaused);
    }

    // ==============================================================================
    // Restricted Functions
    // ==============================================================================

    /// @notice Change the Ether Router address
    /// @param _newEtherRouterAddress Ether Router address
    function setEtherRouterAddress(address payable _newEtherRouterAddress) external {
        _requireSenderIsTimelock();
        _setEtherRouter(_newEtherRouterAddress);
    }

    /// @notice Change the Operator address
    /// @param _newOperatorAddress Operator address
    function setOperatorAddress(address _newOperatorAddress) external {
        _requireSenderIsTimelock();
        _setOperator(_newOperatorAddress);
    }

    // ==============================================================================
    // Recovery Functions
    // ==============================================================================

    /// @notice For emergencies if something gets stuck
    /// @param _amount Amount of ETH to recover
    function recoverEther(uint256 _amount) external {
        _requireSenderIsOperatorOrTimelock();

        (bool _success, ) = address(msg.sender).call{ value: _amount }("");
        if (!_success) revert InvalidEthTransfer();

        emit EmergencyEtherRecovered(_amount);
    }

    /// @notice For emergencies if someone accidentally sent some ERC20 tokens here
    /// @param _tokenAddress Address of the ERC20 to recover
    /// @param _tokenAmount Amount of the ERC20 to recover
    function recoverErc20(address _tokenAddress, uint256 _tokenAmount) external {
        _requireSenderIsOperatorOrTimelock();
        require(IERC20(_tokenAddress).transfer(msg.sender, _tokenAmount), "recoverErc20: Transfer failed");

        emit EmergencyErc20Recovered(_tokenAddress, _tokenAmount);
    }

    // ==============================================================================
    // Errors
    // ==============================================================================

    /// @notice Cannot mint 0
    error CannotMintZero();

    /// @notice Invalid ETH transfer during recoverEther
    error InvalidEthTransfer();

    /// @notice mintFrxEth is paused
    error MintFrxEthIsPaused();

    /// @notice When no sfrxETH is generated from submitAndDeposit
    error NoSfrxEthReturned();

    /// @notice Not Operator or timelock
    error NotOperatorOrTimelock();

    // ==============================================================================
    // Events
    // ==============================================================================

    /// @notice When recoverEther is called
    /// @param amount The amount of Ether recovered
    event EmergencyEtherRecovered(uint256 amount);

    /// @notice When recoverErc20 is called
    /// @param tokenAddress The address of the ERC20 token being recovered
    /// @param tokenAmount The quantity of the token
    event EmergencyErc20Recovered(address tokenAddress, uint256 tokenAmount);

    /// @notice When frxETH is generated from submitted ETH
    /// @param sender The person who sent the ETH
    /// @param recipient The recipient of the frxETH
    /// @param sentEthAmount The amount of Eth sent
    event EthSubmitted(address indexed sender, address indexed recipient, uint256 sentEthAmount);

    /// @notice When togglePauseSubmits is called
    /// @param newStatus The new status of the pause
    event MintFrxEthPaused(bool newStatus);
}